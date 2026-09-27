#pragma once
////////////////////////////////////////////////////////////////////////////
//  ЭФФЕКТЫ ЛАМПЫ
//
//  Как добавить новый эффект:
//    1. Напишите функцию вида  void myEffect(FxCtx &c) { ... }
//       Она рисует один кадр в c.leds[0 .. c.n-1] с учётом яркости c.bright (0..1).
//    2. Добавьте строку в таблицу EFFECTS внизу файла, дав эффекту
//       НОВЫЙ уникальный id (старые id не меняйте — они сохранены в лампах).
//    3. (по желанию) Добавьте название в docs/i18n.js и превью в docs/app.js → EFFECTS_INFO.
//       Даже без этого сайт покажет эффект: он получает список прямо из лампы.
//
//  Эффект может принимать цвет, выбранный на сайте (c.hue, 0..255 как в FastLED).
//  Для этого поставьте true в последнем столбце таблицы — сайт покажет выбор цвета.
////////////////////////////////////////////////////////////////////////////

#include <FastLED.h>

struct FxCtx {
  CRGB   *leds;     // лента
  uint8_t n;        // сколько светодиодов реально подключено
  float   bright;   // текущая яркость 0..1 (плавно меняется при вкл/выкл)
  uint8_t hue;      // цвет, выбранный на сайте для этой плитки (для эффектов с цветом)
};

static inline CRGB fxScale(const CRGB &c, float b) {
  return CRGB((uint8_t)(c.r * b), (uint8_t)(c.g * b), (uint8_t)(c.b * b));
}

namespace fx {

  // Разноцветные мерцающие искры
  static void colorfulTwinkle(FxCtx &c) {
    uint8_t fadeAmount = map((uint8_t)(c.bright * 255), 0, 255, 8, 1);
    fadeToBlackBy(c.leds, c.n, fadeAmount);
    for (int i = 0; i < c.n; i++) {
      if (random8() < 3 && c.leds[i].getLuma() < (uint8_t)(100 * c.bright + 1)) {
        uint8_t minB = (uint8_t)(80 * c.bright);
        uint8_t maxB = (uint8_t)(255 * c.bright);
        c.leds[i] += CHSV(random8(), 180, random8(minB, maxB + 1));
      }
    }
  }

  // Сияние: волны вокруг выбранного цвета (±25 по оттенку). 115 — классическое зелёно-бирюзовое.
  static void aurora(FxCtx &c) {
    static uint16_t p1 = 0, p2 = 0;
    for (int i = 0; i < c.n; i++) {
      uint8_t b1 = sin8(p1 + i * 20);
      uint8_t b2 = sin8(p2 + i * 35);
      uint8_t bright = (b1 + b2) / 2;
      uint8_t hue = c.hue - 25 + scale8(sin8(p1 / 4 + i * 10), 50);
      c.leds[i] = fxScale(CHSV(hue, 200, bright), c.bright);
    }
    p1 += 3;
    p2 += 5;
  }

  // Тёплое мерцание (как огоньки гирлянды)
  static void twinkle(FxCtx &c) {
    uint8_t fadeAmount = map((uint8_t)(c.bright * 255), 0, 255, 8, 1);
    fadeToBlackBy(c.leds, c.n, fadeAmount);
    for (int i = 0; i < c.n; i++) {
      if (random8() < 3 && c.leds[i].getLuma() < (uint8_t)(100 * c.bright + 1)) {
        uint8_t minB = (uint8_t)(80 * c.bright);
        uint8_t maxB = (uint8_t)(255 * c.bright);
        c.leds[i] += CHSV(random8(20, 40), 180, random8(minB, maxB + 1));
      }
    }
  }

  // Бегущая радуга (сияние во всех цветах)
  static void runningRainbow(FxCtx &c) {
    static uint16_t p1 = 0, p2 = 0;
    for (int i = 0; i < c.n; i++) {
      uint8_t b1 = sin8(p1 + i * 20);
      uint8_t b2 = sin8(p2 + i * 35);
      uint8_t bright = (b1 + b2) / 2;
      uint8_t hue = sin8(p1 / 4 + i * 30);
      c.leds[i] = fxScale(CHSV(hue, 220, bright), c.bright);
    }
    p1 += 3;
    p2 += 5;
  }

  // Спокойная радуга: вся лента одного цвета, цвет плавно меняется
  static void staticRainbow(FxCtx &c) {
    static uint8_t hue = 0;
    fill_solid(c.leds, c.n, fxScale(CHSV(hue, 240, 255), c.bright));
    hue += 1;
  }

} // namespace fx

struct EffectDef {
  uint8_t     id;               // постоянный номер эффекта (1..255), 0 = «без эффекта»
  const char *name;             // название (сайт покажет его, если не знает эффект)
  void      (*render)(FxCtx &); // функция отрисовки кадра
  uint16_t    intervalMs;       // пауза между кадрами
  float       fixedBrightness;  // >0 — эффект всегда на этой яркости; 0 — яркость из «Дома»
  bool        usesColor;        // true — на сайте можно выбрать цвет (передаётся в c.hue)
};

// ─── ТАБЛИЦА ЭФФЕКТОВ ─────────────────────────────────────────────────────
static const EffectDef EFFECTS[] = {
  // id  название              функция              мс   яркость  цвет
  {  1, "Colorful Twinkle",   fx::colorfulTwinkle,  30,  0.6f,   false },
  {  2, "Aurora",             fx::aurora,           35,  0.0f,   true  },
  {  3, "Twinkle",            fx::twinkle,          50,  0.6f,   false },
  {  4, "Running Rainbow",    fx::runningRainbow,   30,  0.0f,   false },
  {  5, "Static Rainbow",     fx::staticRainbow,    30,  0.0f,   false },
  // { 6, "My Effect",        fx::myEffect,         30,  0.0f,   false },
};
static const uint8_t EFFECT_COUNT = sizeof(EFFECTS) / sizeof(EFFECTS[0]);

static inline const EffectDef *findEffect(uint8_t id) {
  if (id == 0) return nullptr;
  for (uint8_t i = 0; i < EFFECT_COUNT; i++)
    if (EFFECTS[i].id == id) return &EFFECTS[i];
  return nullptr;
}
