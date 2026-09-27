////////////////////////////////////////////////////////////////////////////
//  Smart Desktop Lamp — единая прошивка
//
//  Все пользовательские настройки (режим, Wi-Fi, эффекты, код сопряжения,
//  число светодиодов) задаются со страницы установки через USB и хранятся
//  в памяти лампы (NVS). Пересобирать прошивку под каждого не нужно.
//
//  Плата: ESP32-C3 (LOLIN C3 MINI), схема разделов: Huge APP
//  Библиотеки: HomeSpan 2.x, FastLED 3.x
////////////////////////////////////////////////////////////////////////////

#include "HomeSpan.h"
#include <FastLED.h>
#include <Preferences.h>
#include "effects.h"

#define FW_VERSION   "4.1.0"

// Железо — одинаковое у всех
#define LED_PIN      9
#define BUTTON_PIN   4
#define MIN_LEDS     3
#define MAX_LEDS     64
#define DEFAULT_LEDS 8

// Цвета-«плитки» из палитры приложения «Дом», которые запускают эффекты.
// Сайт показывает эти же значения (docs/app.js → TRIGGER_SLOTS).
#define NUM_SLOTS 3
struct TriggerColor { float hue; int sat; };
static const TriggerColor TRIGGERS[NUM_SLOTS] = {
  { 352.0f, 3 },   // плитка 1
  {   9.0f, 5 },   // плитка 2
  {  17.0f, 7 },   // плитка 3
};
static const uint8_t DEFAULT_SLOT_FX[NUM_SLOTS] = { 1, 2, 3 };
static const uint8_t DEFAULT_SLOT_HUE = 115;   // зелёно-бирюзовый — классическое сияние

////////////////////////////////////////////
// Настройки
////////////////////////////////////////////
struct LampConfig {
  bool    effectsEnabled = true;
  uint8_t numLeds = DEFAULT_LEDS;
  uint8_t slotFx[NUM_SLOTS] = { DEFAULT_SLOT_FX[0], DEFAULT_SLOT_FX[1], DEFAULT_SLOT_FX[2] };
  uint8_t slotHue[NUM_SLOTS] = { DEFAULT_SLOT_HUE, DEFAULT_SLOT_HUE, DEFAULT_SLOT_HUE };
  char    code[9] = "";      // код сопряжения, заданный с сайта
  char    ssid[33] = "";     // только для показа на сайте; сам пароль хранит HomeSpan
};

LampConfig cfg;
Preferences prefs;
CRGB leds[MAX_LEDS];

void loadConfig() {
  prefs.begin("lamp", true);
  cfg.effectsEnabled = prefs.getBool("fx_on", true);
  cfg.numLeds = constrain(prefs.getUChar("leds", DEFAULT_LEDS), MIN_LEDS, MAX_LEDS);
  for (int i = 0; i < NUM_SLOTS; i++) {
    char key[8]; snprintf(key, sizeof(key), "slot%d", i);
    cfg.slotFx[i] = prefs.getUChar(key, DEFAULT_SLOT_FX[i]);
    snprintf(key, sizeof(key), "hue%d", i);
    cfg.slotHue[i] = prefs.getUChar(key, DEFAULT_SLOT_HUE);
  }
  prefs.getString("code", cfg.code, sizeof(cfg.code));
  prefs.getString("ssid", cfg.ssid, sizeof(cfg.ssid));
  prefs.end();
}

void saveConfig(const LampConfig &c) {
  prefs.begin("lamp", false);
  prefs.putBool("fx_on", c.effectsEnabled);
  prefs.putUChar("leds", c.numLeds);
  for (int i = 0; i < NUM_SLOTS; i++) {
    char key[8]; snprintf(key, sizeof(key), "slot%d", i);
    prefs.putUChar(key, c.slotFx[i]);
    snprintf(key, sizeof(key), "hue%d", i);
    prefs.putUChar(key, c.slotHue[i]);
  }
  prefs.putString("code", c.code);
  prefs.putString("ssid", c.ssid);
  prefs.end();
}

// Коды, которые Apple не принимает
bool pairingCodeAllowed(const char *s) {
  if (strlen(s) != 8) return false;
  for (int i = 0; i < 8; i++) if (!isdigit((unsigned char)s[i])) return false;
  bool allSame = true;
  for (int i = 1; i < 8; i++) if (s[i] != s[0]) allSame = false;
  if (allSame) return false;
  if (!strcmp(s, "12345678") || !strcmp(s, "87654321")) return false;
  return true;
}

////////////////////////////////////////////
// Лампа (HomeKit Lightbulb)
////////////////////////////////////////////
struct RGBLightbulb : Service::LightBulb {
  SpanCharacteristic *power;
  SpanCharacteristic *brightness;
  SpanCharacteristic *hue;
  SpanCharacteristic *saturation;

  bool lastButtonState = LOW;
  unsigned long lastButtonTime = 0;
  const unsigned long debounceDelay = 50;

  float currentBrightness = 0.0f;
  float targetBrightness = 0.0f;
  CRGB currentBaseColor = CRGB::Black;
  CRGB targetBaseColor = CRGB::White;
  const EffectDef *currentEffect = nullptr;
  uint8_t currentHue = DEFAULT_SLOT_HUE;   // цвет плитки, запустившей эффект

  unsigned long lastUpdateTime = 0;
  unsigned long lastRenderTime = 0;
  const unsigned long updateInterval = 20;
  const float fadeSpeed = 0.07f;

  RGBLightbulb() : Service::LightBulb() {
    power = new Characteristic::On(0);
    brightness = new Characteristic::Brightness(100);
    hue = new Characteristic::Hue(0);
    saturation = new Characteristic::Saturation(100);

    FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, cfg.numLeds);
    FastLED.setBrightness(255);
    FastLED.setCorrection(TypicalLEDStrip);
    FastLED.setDither(BINARY_DITHER);
    pinMode(BUTTON_PIN, INPUT_PULLDOWN);

    FastLED.clear();
    FastLED.show();
  }

  static uint8_t gammaCorrect(uint8_t v) { return scale8_video(v, v); }   // = dim8_video

  static CRGB hueToRGB(float h, int s) {
    float hNorm = h / 360.0f;
    float c = s / 100.0f;
    float x = c * (1.0f - fabs(fmod(hNorm * 6.0f, 2.0f) - 1.0f));
    float m = 1.0f - c;
    float r, g, b;
    float h6 = hNorm * 6.0f;
    if (h6 < 1.0f)      { r = c; g = x; b = 0; }
    else if (h6 < 2.0f) { r = x; g = c; b = 0; }
    else if (h6 < 3.0f) { r = 0; g = c; b = x; }
    else if (h6 < 4.0f) { r = 0; g = x; b = c; }
    else if (h6 < 5.0f) { r = x; g = 0; b = c; }
    else                { r = c; g = 0; b = x; }
    return CRGB(gammaCorrect((r + m) * 255.0f), gammaCorrect((g + m) * 255.0f), gammaCorrect((b + m) * 255.0f));
  }

  // Какой эффект запускает выбранный в «Доме» цвет (nullptr — просто цвет).
  // В slotOut возвращает номер плитки, чтобы взять её цвет.
  const EffectDef *detectEffect(float h, int s, int v, int *slotOut) {
    if (!cfg.effectsEnabled || v < 1) return nullptr;
    for (int i = 0; i < NUM_SLOTS; i++) {
      if (fabs(h - TRIGGERS[i].hue) <= 1.0f && abs(s - TRIGGERS[i].sat) <= 1) {
        *slotOut = i;
        return findEffect(cfg.slotFx[i]);
      }
    }
    return nullptr;
  }

  void applyState(bool on, float h, int s, int v) {
    if (!on) {
      targetBrightness = 0.0f;
      return;
    }
    targetBrightness = (v <= 1) ? 0.02f : v / 100.0f;
    int slot = 0;
    const EffectDef *fx = detectEffect(h, s, v, &slot);
    if (fx) {
      currentEffect = fx;
      currentHue = cfg.slotHue[slot];
      if (fx->fixedBrightness > 0) targetBrightness = fx->fixedBrightness;
      Serial.printf("Effect: %s\n", fx->name);
    } else {
      if (currentEffect) currentBaseColor = CRGB::Black;   // плавный переход от эффекта к цвету
      currentEffect = nullptr;
      targetBaseColor = hueToRGB(h, s);
    }
  }

  boolean update() override {
    applyState(power->getNewVal(), hue->getNewVal<float>(), saturation->getNewVal(), brightness->getNewVal());
    return true;
  }

  void updateTransitions() {
    if (millis() - lastUpdateTime < updateInterval) return;
    lastUpdateTime = millis();

    if (fabs(currentBrightness - targetBrightness) > 0.001f) {
      float diff = targetBrightness - currentBrightness;
      currentBrightness += diff * fadeSpeed;
      if (fabs(diff) < 0.01f) currentBrightness = targetBrightness;
      currentBrightness = constrain(currentBrightness, 0.0f, 1.0f);
    }
    if (!currentEffect && currentBaseColor != targetBaseColor)
      currentBaseColor = blend(currentBaseColor, targetBaseColor, (uint8_t)(fadeSpeed * 255.0f));
  }

  void loop() override {
    updateTransitions();

    if (currentBrightness <= 0.001f && currentEffect && targetBrightness == 0.0f)
      currentEffect = nullptr;

    unsigned long now = millis();
    if (currentBrightness > 0.001f) {
      bool fading = fabs(currentBrightness - targetBrightness) > 0.001f ||
                    (!currentEffect && currentBaseColor != targetBaseColor);
      unsigned long interval = currentEffect ? currentEffect->intervalMs : 100;
      if (fading) interval = min(20UL, interval);

      if (now - lastRenderTime >= interval) {
        lastRenderTime = now;
        if (currentEffect) {
          FxCtx c{ leds, cfg.numLeds, currentBrightness, currentHue };
          currentEffect->render(c);
        } else {
          fill_solid(leds, cfg.numLeds, CRGB(currentBaseColor.r * currentBrightness,
                                             currentBaseColor.g * currentBrightness,
                                             currentBaseColor.b * currentBrightness));
        }
        FastLED.show();
      }
    } else if (now - lastRenderTime >= 100) {
      lastRenderTime = now;
      FastLED.clear();
      FastLED.show();
    }

    // Кнопка
    bool btn = digitalRead(BUTTON_PIN);
    if (btn != lastButtonState && millis() - lastButtonTime > debounceDelay) {
      if (btn == HIGH) {
        bool turnOn = !power->getVal();
        power->setVal(turnOn);
        applyState(turnOn, hue->getVal<float>(), saturation->getVal(), brightness->getVal());
        Serial.printf("Button: Light %s\n", turnOn ? "ON" : "OFF");
      }
      lastButtonTime = millis();
    }
    lastButtonState = btn;
  }
};

////////////////////////////////////////////
// Настройка через USB (протокол для сайта)
//
//  Все строки заканчиваются '\n'. Значения кодируются как в URL (%20 и т.п.).
//    $HELLO                → $LAMP ...,  $FX <id> <name> ...,  $END
//    $SET <ключ> <значение> → $OK <ключ>  |  $ERR <ключ> <причина>
//        ключи: effects(0/1) leds(3..64) s1 s2 s3(id эффекта, 0=нет)
//               c1 c2 c3(цвет плитки 0..255, для эффектов с цветом) code ssid pass
//    $SAVE                 → $SAVED, затем перезагрузка
//    $REBOOT, $FACTORY
//  Любая строка без '$' передаётся в обычную консоль HomeSpan.
////////////////////////////////////////////
LampConfig pending;
bool pendingActive = false;
bool wifiConnected = false;
bool wifiChanged = false;
bool codeChanged = false;
char pendingPass[65] = "";

void pctDecode(const char *in, char *out, size_t outSize) {
  size_t o = 0;
  for (size_t i = 0; in[i] && o + 1 < outSize; i++) {
    if (in[i] == '%' && isxdigit((unsigned char)in[i + 1]) && isxdigit((unsigned char)in[i + 2])) {
      char hex[3] = { in[i + 1], in[i + 2], 0 };
      out[o++] = (char)strtol(hex, nullptr, 16);
      i += 2;
    } else {
      out[o++] = in[i];
    }
  }
  out[o] = 0;
}

void printPct(const char *s) {
  for (; *s; s++) {
    unsigned char ch = *s;
    if (isalnum(ch) || ch == '-' || ch == '_' || ch == '.' || ch == '~') Serial.write(ch);
    else Serial.printf("%%%02X", ch);
  }
}

void sendHello() {
  Serial.printf("\n$LAMP fw=%s effects=%d leds=%d", FW_VERSION, cfg.effectsEnabled, cfg.numLeds);
  for (int i = 0; i < NUM_SLOTS; i++) Serial.printf(" s%d=%d", i + 1, cfg.slotFx[i]);
  for (int i = 0; i < NUM_SLOTS; i++) Serial.printf(" c%d=%d", i + 1, cfg.slotHue[i]);
  Serial.print(" colorfx=");                     // какие эффекты принимают цвет
  bool first = true;
  for (uint8_t i = 0; i < EFFECT_COUNT; i++)
    if (EFFECTS[i].usesColor) { Serial.printf(first ? "%d" : ",%d", EFFECTS[i].id); first = false; }
  Serial.printf(" slots=%d minleds=%d maxleds=%d wifi=%d code=%s ssid=", NUM_SLOTS, MIN_LEDS, MAX_LEDS, wifiConnected, cfg.code);
  printPct(cfg.ssid);
  Serial.println();
  for (uint8_t i = 0; i < EFFECT_COUNT; i++) {
    Serial.printf("$FX %d ", EFFECTS[i].id);
    printPct(EFFECTS[i].name);
    Serial.println();
  }
  Serial.println("$END");
}

void handleSet(char *args) {
  char *key = strtok(args, " ");
  char *raw = strtok(nullptr, "");
  if (!key) { Serial.println("$ERR ? no-key"); return; }
  char val[100];
  pctDecode(raw ? raw : "", val, sizeof(val));

  if (!pendingActive) {
    pending = cfg;
    pendingActive = true;
    wifiChanged = codeChanged = false;
  }

  if (!strcmp(key, "effects")) {
    pending.effectsEnabled = atoi(val) != 0;
  } else if (!strcmp(key, "leds")) {
    int n = atoi(val);
    if (n < MIN_LEDS || n > MAX_LEDS) { Serial.printf("$ERR %s range\n", key); return; }
    pending.numLeds = n;
  } else if (key[0] == 's' && isdigit((unsigned char)key[1]) && key[2] == 0) {
    int slot = key[1] - '1';
    int id = atoi(val);
    if (slot < 0 || slot >= NUM_SLOTS) { Serial.printf("$ERR %s slot\n", key); return; }
    if (id != 0 && !findEffect(id)) { Serial.printf("$ERR %s unknown-effect\n", key); return; }
    pending.slotFx[slot] = id;
  } else if (key[0] == 'c' && isdigit((unsigned char)key[1]) && key[2] == 0) {
    int slot = key[1] - '1';
    int hue = atoi(val);
    if (slot < 0 || slot >= NUM_SLOTS) { Serial.printf("$ERR %s slot\n", key); return; }
    if (hue < 0 || hue > 255) { Serial.printf("$ERR %s range\n", key); return; }
    pending.slotHue[slot] = hue;
  } else if (!strcmp(key, "code")) {
    if (!pairingCodeAllowed(val)) { Serial.printf("$ERR %s not-allowed\n", key); return; }
    strlcpy(pending.code, val, sizeof(pending.code));
    codeChanged = true;
  } else if (!strcmp(key, "ssid")) {
    if (strlen(val) == 0 || strlen(val) > 32) { Serial.printf("$ERR %s length\n", key); return; }
    strlcpy(pending.ssid, val, sizeof(pending.ssid));
    wifiChanged = true;
  } else if (!strcmp(key, "pass")) {
    if (strlen(val) > 64) { Serial.printf("$ERR %s length\n", key); return; }
    strlcpy(pendingPass, val, sizeof(pendingPass));
    wifiChanged = true;
  } else {
    Serial.printf("$ERR %s unknown-key\n", key);
    return;
  }
  Serial.printf("$OK %s\n", key);
}

void handleSave() {
  if (!pendingActive) { Serial.println("$SAVED nothing"); return; }
  saveConfig(pending);
  if (wifiChanged) {
    homeSpan.setWifiCredentials(pending.ssid, pendingPass);
    Serial.println("$INFO wifi-saved");
  }
  if (codeChanged) {
    Serial.println("$INFO code-generating");
    homeSpan.setPairingCode(pending.code, false);   // занимает пару секунд
  }
  memset(pendingPass, 0, sizeof(pendingPass));
  Serial.println("$SAVED");
  Serial.flush();
  delay(500);
  ESP.restart();
}

void handleLine(char *line) {
  if (line[0] != '$') {                       // обычная консоль HomeSpan
    homeSpan.processSerialCommand(line);
    return;
  }
  char *cmd = strtok(line, " ");
  char *args = strtok(nullptr, "");
  if (!strcmp(cmd, "$HELLO"))        sendHello();
  else if (!strcmp(cmd, "$SET"))     handleSet(args ? args : (char *)"");
  else if (!strcmp(cmd, "$SAVE"))    handleSave();
  else if (!strcmp(cmd, "$REBOOT"))  { Serial.println("$OK reboot"); Serial.flush(); delay(300); ESP.restart(); }
  else if (!strcmp(cmd, "$FACTORY")) {
    prefs.begin("lamp", false); prefs.clear(); prefs.end();
    Serial.println("$OK factory");
    homeSpan.processSerialCommand("F");       // стирает Wi-Fi и привязку HomeKit, перезагружает
  }
  else Serial.printf("$ERR %s unknown-command\n", cmd);
}

void pollSerialConfig() {
  static char buf[300];
  static size_t len = 0;
  while (Serial.available()) {
    int ch = Serial.read();
    if (ch == '\r') continue;
    if (ch == '\n') {
      buf[len] = 0;
      if (len) handleLine(buf);
      len = 0;
    } else if (len < sizeof(buf) - 1) {
      buf[len++] = (char)ch;
    }
  }
}

void onConnected(int count) {
  wifiConnected = true;
  Serial.printf("$WIFI ok ip=%s\n", WiFi.localIP().toString().c_str());
}

void onPaired(boolean paired) {
  Serial.printf("$PAIRED %d\n", paired ? 1 : 0);
}

////////////////////////////////////////////
// Setup / loop
////////////////////////////////////////////
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n=== Smart Desktop Lamp v" FW_VERSION " ===");

  loadConfig();
  Serial.printf("LEDs: %d, effects: %s\n", cfg.numLeds, cfg.effectsEnabled ? "on" : "off");

  homeSpan.setSerialInputDisable(true);       // ввод с USB читаем сами (см. pollSerialConfig)
  homeSpan.begin(Category::Lighting, "Smart RGB Lamp");
  homeSpan.setQRID("LAMP");
  homeSpan.setConnectionCallback(onConnected);
  homeSpan.setPairCallback(onPaired);

  if (cfg.code[0]) {
    Serial.printf("Pairing Code: %.3s-%.2s-%.3s\n", cfg.code, cfg.code + 3, cfg.code + 5);
  } else {
    Serial.println("Pairing code not set yet — open the setup page to configure the lamp.");
  }

  new SpanAccessory();
    new Service::AccessoryInformation();
      new Characteristic::Identify();
      new Characteristic::Manufacturer("SmartDesktopLamp");
      new Characteristic::SerialNumber("SDL-001");
      new Characteristic::Model(cfg.effectsEnabled ? "SmartLamp RGB Effects" : "SmartLamp RGB");
      new Characteristic::FirmwareRevision(FW_VERSION);

  new RGBLightbulb();

  Serial.println("$READY fw=" FW_VERSION);
}

void loop() {
  pollSerialConfig();
  homeSpan.poll();
}
