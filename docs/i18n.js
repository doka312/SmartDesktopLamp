/* ═══════════════════════════════════════════════════════════════════
   ТЕКСТЫ САЙТА / SITE TEXTS
   Каждая строка: [русский, английский]. Можно использовать простой HTML.
   Each entry: [Russian, English]. Simple HTML is allowed.
   {name} — подставляется из кода / filled in by the code.
   ═══════════════════════════════════════════════════════════════════ */

export const LANGS = ["ru", "en"];

export const T = {
  /* ─── Шапка / Header ─── */
  "meta.title": ["Установка лампы", "Lamp setup"],
  "meta.desc": [
    "Установка и настройка умной настольной лампы прямо из браузера: прошивка, Wi‑Fi, эффекты и код для приложения «Дом».",
    "Set up the smart desk lamp right from your browser: firmware, Wi‑Fi, effects and the Apple Home pairing code.",
  ],
  "lang.aria": ["Язык сайта", "Site language"],
  "hero.eyebrow": ["Умная настольная лампа", "Smart desk lamp"],
  "hero.title": ["Установка за&nbsp;пять минут, прямо в&nbsp;браузере", "Set up in&nbsp;five minutes, right in&nbsp;your browser"],
  "hero.lead": [
    "Выберите, какой будет ваша лампа, укажите Wi‑Fi и&nbsp;нажмите одну кнопку. Программы устанавливать не нужно, достаточно USB‑кабеля.",
    "Choose how your lamp should work, enter your Wi‑Fi and press one button. Nothing to install: all you need is a&nbsp;USB cable.",
  ],
  "hero.chip1": ["около 5 минут", "about 5 minutes"],
  "hero.chip2": ["USB‑кабель", "USB cable"],
  "hero.chip3": ["приложение «Дом»", "Apple Home app"],
  "hero.photoAlt": [
    "Лампа на тумбочке у кровати мягко освещает комнату",
    "The lamp on a bedside table softly lighting the room",
  ],
  "hero.photoPh": ["Место для фото лампы, 4:3", "Place for a lamp photo, 4:3"],

  "warn.browser": [
    "<strong>Этот браузер не умеет работать с USB.</strong> Откройте страницу на компьютере в&nbsp;<b>Google Chrome</b> или <b>Microsoft Edge</b>. Safari, Firefox и&nbsp;телефоны пока не подходят.",
    "<strong>This browser can’t talk to USB devices.</strong> Please open the page on a computer in&nbsp;<b>Google Chrome</b> or <b>Microsoft Edge</b>. Safari, Firefox and phones aren’t supported yet.",
  ],

  "already.title": ["Лампа уже настроена раньше?", "Lamp already set up?"],
  "already.text": [
    "Подключите её по USB, и мы подставим текущие настройки, чтобы вы поменяли только нужное.",
    "Connect it via USB and we’ll load its current settings, so you only change what you need.",
  ],
  "already.btn": ["Загрузить настройки с лампы", "Load settings from the lamp"],

  /* ─── Переключатель разделов / View switch ─── */
  "nav.aria": ["Раздел сайта", "Site section"],
  "nav.build": ["Сборка", "Build"],
  "nav.install": ["Прошивка", "Install"],
  "meta.titleBuild": ["Сборка лампы", "Building the lamp"],
  "toBuild.title": ["Ещё не собрали лампу?", "Haven’t built the lamp yet?"],
  "toBuild.text": [
    "Пошаговая инструкция по сборке с фотографиями — от проводов кнопки до первого включения.",
    "A step-by-step build guide with photos, from wiring the button to the first switch-on.",
  ],
  "toBuild.btn": ["Инструкция по сборке", "Build guide"],

  /* ─── Сборка / Build ─── */
  "b.eyebrow": ["Пошаговая инструкция", "Step-by-step guide"],
  "b.title": ["Сборка лампы", "Building the lamp"],
  "b.lead": [
    "Соберите лампу по фотографиям: от подключения сенсорной кнопки до первого включения в&nbsp;«Доме». Любое фото можно открыть крупно.",
    "Build the lamp by following the photos: from wiring the touch button to switching it on in the Home app. Tap any photo to see it larger.",
  ],
  "b.chip1": ["7 этапов", "7 stages"],
  "b.chip2": ["термоклей", "hot glue"],
  "b.chip3": ["без пайки", "no soldering"],
  "b.photoAlt": ["Собранная лампа светится красным", "The assembled lamp glowing red"],
  "b.stagesAria": ["Этапы сборки", "Build stages"],

  "b.warn.title": ["Сначала прошивка, потом сборка", "Install the firmware first, then assemble"],
  "b.warn.text": [
    "На некоторых платах с завода стоит прошивка, из-за которой плата начинает перезапускаться, когда её подключают к компьютеру. Поэтому лучше <b>сначала установить прошивку, а потом собирать лампу</b>. Зажмите на плате кнопку <b>BOOT</b>, подключите плату к компьютеру, подержите кнопку секунду и отпустите — дальше всё как обычно.",
    "Some boards ship with firmware that makes them restart over and over when connected to a computer. That’s why it’s best to <b>install the firmware first and assemble the lamp afterwards</b>. Hold the <b>BOOT</b> button on the board, plug it into the computer, keep holding for a second and release, then carry on as usual.",
  ],
  "b.warn.text2": [
    "Если лампа уже собрана и плата перезапускается, отключайте и снова подключайте её и пробуйте установить прошивку, пока не получится. Решения других известных проблем — на странице «Прошивка».",
    "If the lamp is already assembled and the board keeps restarting, unplug and replug it and keep trying to install the firmware until it works. Fixes for other known problems are on the “Install” page.",
  ],
  "b.warn.btn": ["Открыть страницу прошивки", "Open the install page"],

  "b.s1.title": ["Что понадобится", "What you need"],
  "b.s1.text": [
    "Проверьте, что всё под рукой, прежде чем начинать. Где купить электронику — в разделе «Компоненты» выше.",
    "Make sure you have everything at hand before you start. Where to buy the electronics is in “Components” above.",
  ],
  "b.parts.title": ["Список", "Checklist"],
  "b.part.1": ["Плата <b>ESP32‑C3</b> (SuperMini или похожая)", "<b>ESP32‑C3</b> board (SuperMini or similar)"],
  "b.part.2": ["Модуль адресных светодиодов <b>WS2812B</b>", "<b>WS2812B</b> addressable LED module"],
  "b.part.3": ["<b>Сенсорная кнопка</b>", "<b>Touch button</b>"],
  "b.part.4": [
    "Корпус: рассеиватель, крышка и основание (файлы для печати — в разделе «3D‑модель корпуса» выше)",
    "Lamp body: diffuser, lid and base (print files are in “3D model of the body” above)",
  ],
  "b.part.5": ["Провода с наконечниками", "Wires with connectors"],
  "b.part.6": ["Термоклей и клеевой пистолет", "Hot glue and a glue gun"],
  "b.IMG_5996": ["Все электронные компоненты.", "All the electronic components."],

  "b.s2.title": ["Сенсорная кнопка", "Touch button"],
  "b.IMG_5998": [
    "Подключите провода к кнопке. Запомните цвета проводов и названия выводов, а лучше сфотографируйте.",
    "Connect the wires to the button. Note the wire colors and pin names, or better, take a photo.",
  ],
  "b.IMG_5999": [
    "По очереди проденьте провода от кнопки в специальный канал. Должны поместиться все провода.",
    "Thread the button wires through the special channel one at a time. All of them should fit.",
  ],
  "b.IMG_6001": ["Так должно получиться, когда все провода кнопки проведены.", "This is how it should look once all the button wires are through."],
  "b.IMG_6002": ["Нанесите клей на место установки кнопки.", "Put glue where the button goes."],
  "b.IMG_6003": ["Приклейте кнопку.", "Glue the button in place."],

  "b.s3.title": ["Светодиодный модуль", "LED module"],
  "b.IMG_6005": [
    "Нанесите клей на модуль адресных светодиодов. Когда подключаете провода, тоже запомните их цвета и названия выводов (можно сфотографировать).",
    "Put glue on the addressable LED module. When connecting its wires, again note the colors and pin names (a photo helps).",
  ],
  "b.IMG_6006": ["Приклейте модуль на его место в рассеивателе.", "Stick the module in its place inside the diffuser."],
  "b.IMG_6007": [
    "Закройте крышку. Она и без клея держится достаточно прочно, но для надёжности можно добавить немного.",
    "Close the lid. It holds firmly enough without glue, but you can add a little to be safe.",
  ],
  "b.IMG_6008": ["Вид изнутри после того, как крышка закрыта.", "The inside view after closing the lid."],

  "b.s4.title": ["Общий провод GND", "Shared GND wire"],
  "b.s4.text": [
    "У кнопки и у светодиодного модуля есть по проводу GND. Их объединяют в один провод, который потом подключается к плате.",
    "Both the button and the LED module have a GND wire. They are joined into a single wire that later goes to the board.",
  ],
  "b.IMG_6009": ["Найдите два провода с пометкой GND и отрежьте у них наконечники.", "Find the two wires marked GND and cut off their connectors."],
  "b.IMG_6010": [
    "Зачистите оба провода со стороны компонентов и один из отрезанных наконечников.",
    "Strip both wires on the component side, plus one of the cut-off connector ends.",
  ],
  "b.IMG_6011": [
    "Скрутите провода вместе. Удобнее сначала скрутить два провода, а&nbsp;потом добавить к&nbsp;ним третий — так советует наш тестовый сборщик.",
    "Twist the wires together. It’s easier to twist two wires first and then add the third one, as our test builder found.",
  ],
  "b.IMG_6012": [
    "Заизолируйте скрутку термоклеем: так она защищена от воздуха и безопасна.",
    "Insulate the joint with hot glue to protect it from air and keep it safe.",
  ],

  "b.s5.title": ["Плата ESP32", "ESP32 board"],
  "b.s5.text": [
    "Сначала посмотрите на схему: по ней на шаге 5.3 подключаются все провода.",
    "First look at the diagram: you’ll connect all the wires by it in step 5.3.",
  ],
  "b.IMG_6013": ["Примерьте плату ESP32 в основание лампы.", "Test-fit the ESP32 board in the lamp base."],
  "b.IMG_6014": [
    "Проверьте, что разъём платы хорошо сел на место и до него легко добраться.",
    "Check that the board’s USB port sits well in its opening and is easy to reach.",
  ],
  "b.IMG_6015": [
    "Закрепите плату термоклеем. Не заливайте её полностью, но клея должно быть столько, чтобы плата не оторвалась, когда вы подключаете кабель. Подключите все провода по схеме.",
    "Fix the board with hot glue. Don’t bury it completely, but use enough glue that the board won’t come loose when you plug in the cable. Connect all the wires according to the diagram.",
  ],
  "b.scheme": ["Схема подключения", "Wiring diagram"],
  "b.pins.title": ["Куда что подключать", "What goes where"],
  "b.pins.part": ["Компонент", "Component"],
  "b.pins.pin": ["Вывод компонента", "Component pin"],
  "b.pins.board": ["Контакт платы", "Board pin"],
  "b.pins.led": ["Светодиоды", "LEDs"],
  "b.pins.button": ["Кнопка", "Button"],
  "b.pins.note": [
    "Названия контактов уточните на своей плате: GPIO — это контакты, подписанные цифрами, а контакты питания на таких платах обычно подписаны <b>G</b> или <b>GND</b>, <b>5V</b> и <b>3.3</b>.",
    "Check the pin names on your own board: GPIO pins are the numbered ones, and power pins on these boards are usually labelled <b>G</b> or <b>GND</b>, <b>5V</b> and <b>3.3</b>.",
  ],
  "b.IMG_6016": ["Прикрепите рассеиватель к основанию. Лампа готова к прошивке!", "Attach the diffuser to the base. The lamp is ready for its firmware!"],

  "b.s6.title": ["Установка прошивки", "Installing the firmware"],
  "b.s6.text": [
    "Дальше следуйте инструкции на странице «Прошивка»: подключите лампу к компьютеру и нажмите одну кнопку.",
    "Next, follow the guide on the “Install” page: connect the lamp to your computer and press one button.",
  ],
  "b.s6.btn": ["Перейти к прошивке", "Go to the install page"],

  "b.s7.title": ["Добавление в «Дом»", "Adding to the Home app"],
  "b.IMG_6017": [
    "После прошивки вы получите QR‑код для подключения лампы. Откройте приложение «Дом», нажмите «+» → «Добавить аксессуар» и отсканируйте QR‑код на экране.",
    "After installing the firmware you’ll get a QR code for the lamp. Open the Home app, tap + → Add Accessory and scan the QR code on the screen.",
  ],
  "b.IMG_6018": [
    "Добавьте лампу в «Дом» и выберите, где она стоит. Если система спросит про несертифицированный аксессуар, выберите «Все равно добавить».",
    "Add the lamp to Home and choose its room. If asked about an uncertified accessory, choose Add Anyway.",
  ],
  "b.IMG_6020": ["Лампа готова к работе!", "The lamp is ready to go!"],
  "b.done": ["Поздравляем, вы справились! 🎉", "Congratulations, you did it! 🎉"],

  "c.title": ["Компоненты: где купить", "Components: where to buy"],
  "c.sub": ["Вся электроника для лампы со ссылками на AliExpress", "All the electronics for the lamp, with AliExpress links"],
  "c.buy": ["Купить на AliExpress", "Buy on AliExpress"],
  "c.photo": ["Открыть фото", "Open photo"],
  "c.price.fair": ["Адекватная цена: до&nbsp;200&nbsp;₽", "Fair price: up to&nbsp;200&nbsp;₽"],
  "c.price.cheap": ["Чем дешевле, тем лучше", "The cheaper the better"],
  "c.led.name": ["Модуль адресных светодиодов", "Addressable LED module"],
  "c.led.desc": [
    "Планка со светодиодами WS2812B и кабелем. На модуле по ссылке их 10 — посчитайте на своём и укажите это число на шаге 1 страницы «Прошивка».",
    "A WS2812B LED strip with a cable. The one at this link has 10 LEDs — count yours and enter the number in step 1 of the Install page.",
  ],
  "c.esp.name": ["Плата ESP32‑C3 SuperMini", "ESP32‑C3 SuperMini board"],
  "c.esp.desc": [
    "«Мозг» лампы: Wi‑Fi и управление светом. Через её разъём USB‑C лампа питается и прошивается.",
    "The lamp’s “brain”: Wi‑Fi and light control. Its USB‑C port powers the lamp and is used for the firmware.",
  ],
  "c.wires.name": ["Провода «мама — мама»", "Female-to-female jumper wires"],
  "c.wires.desc": [
    "Соединительные провода по 20&nbsp;см с разъёмами на обоих концах: ими кнопка и светодиоды подключаются к плате.",
    "20&nbsp;cm jumper wires with connectors on both ends, used to connect the button and the LEDs to the board.",
  ],
  "c.button.name": ["Сенсорная кнопка", "Touch button"],
  "c.button.desc": [
    "Приклеивается под крышку и включает или выключает лампу касанием.",
    "Glued under the lid; turns the lamp on and off with a touch.",
  ],
  "c.search": [
    "<b>Если товара нет по ссылке,</b> воспользуйтесь поиском по картинке на AliExpress: нажмите на фото, чтобы открыть его, сохраните и загрузите в поиск по фото.",
    "<b>If an item is no longer available,</b> use AliExpress image search: tap the photo to open it, save it and upload it to the image search.",
  ],
  "c.solder": [
    "Если умеете паять, набор можно собрать дешевле.",
    "If you can solder, you can put the kit together for less.",
  ],

  "m.title": ["3D‑модель корпуса", "3D model of the body"],
  "m.sub": ["Посмотрите детали со всех сторон и скачайте файлы для 3D‑печати", "Look at the parts from every side and download the files for 3D printing"],
  "m.canvasAria": ["3D‑модель лампы, её можно вращать", "3D model of the lamp, you can rotate it"],
  "m.loading": ["Загружаем модель…", "Loading the model…"],
  "m.error": [
    "Не получилось показать 3D‑модель в этом браузере. Файлы для печати можно скачать справа.",
    "Couldn’t show the 3D model in this browser. You can still download the print files.",
  ],
  "m.explode": ["Разобрать", "Explode"],
  "m.assemble": ["Собрать", "Assemble"],
  "m.lightOn": ["Включить свет", "Light on"],
  "m.lightOff": ["Выключить свет", "Light off"],
  "m.reset": ["Вид по умолчанию", "Reset view"],
  "m.hint": [
    "Вращайте мышью или пальцем; колесо мыши или два пальца — приблизить.",
    "Drag with the mouse or a finger to rotate; scroll or pinch to zoom.",
  ],
  "m.parts": ["Детали", "Parts"],
  "m.all": ["Лампа целиком", "Whole lamp"],
  "m.allSub": ["4 детали", "4 parts"],
  "m.part.base": ["Основание", "Base"],
  "m.part.diffuser": ["Рассеиватель", "Diffuser"],
  "m.part.cup": ["Крышка", "Lid"],
  "m.part.deco": ["Декоративное кольцо", "Decorative ring"],
  "m.dims": ["{x} × {y} × {z} мм", "{x} × {y} × {z} mm"],
  "m.downloadPart": ["Скачать «{name}» (STL)", "Download “{name}” (STL)"],
  "m.files": ["Файлы для печати", "Print files"],
  "m.3mf": ["Проект для Bambu Studio", "Bambu Studio project"],
  "m.3mfSub": [".3mf — все детали и настройки печати", ".3mf with all parts and print settings"],
  "m.mw": ["Открыть на MakerWorld", "Open on MakerWorld"],
  "m.mwSub": ["Модель, профили печати и отзывы", "Model, print profiles and reviews"],

  "lb.close": ["Закрыть", "Close"],
  "lb.prev": ["Предыдущее фото", "Previous photo"],
  "lb.next": ["Следующее фото", "Next photo"],
  "lb.counter": ["Шаг {step} · фото {n} из {total}", "Step {step} · photo {n} of {total}"],
  "lb.open": ["Открыть фото крупно", "Open photo full size"],

  /* ─── Шаг 1 / Step 1 ─── */
  "s1.title": ["Какой будет ваша лампа", "How should your lamp work"],
  "s1.hint": ["Режим можно поменять в любой момент, снова зайдя на эту страницу.", "You can change this any time by coming back to this page."],
  "mode.aria": ["Режим лампы", "Lamp mode"],
  "mode.basic.title": ["Базовая", "Basic"],
  "mode.basic.desc": ["Любой цвет и&nbsp;яркость, плавные переходы, кнопка вкл/выкл.", "Any color and brightness, smooth fades, on/off button."],
  "mode.fx.title": ["С эффектами", "With effects"],
  "mode.fx.desc": [
    "Всё то же, плюс три цвета в&nbsp;«Доме» включают анимации: сияние, огоньки, радугу.",
    "Everything above, plus three colors in the Home app start animations: aurora, twinkles, rainbow.",
  ],
  "mode.badge": ["рекомендуем", "recommended"],
  "leds.label": ["Сколько светодиодов на ленте", "Number of LEDs on the strip"],
  "leds.caption": ["Светодиод 5050: считайте такие квадратики", "A 5050 LED: count these little squares"],
  "leds.alt": ["Кусок светодиодной ленты с тремя светодиодами 5050", "A piece of LED strip with three 5050 LEDs"],

  /* ─── Шаг 2 / Step 2 ─── */
  "s2.title": ["Эффекты", "Effects"],
  "s2.hint": [
    "В приложении «Дом» у лампы есть готовые плитки с цветами. Три из них мы превратим в «кнопки» эффектов: нажали плитку, и&nbsp;заиграла анимация.",
    "In the Home app your lamp has ready-made color tiles. We’ll turn three of them into effect “buttons”: tap a tile and the animation starts.",
  ],
  "fxoff.text": [
    "Вы выбрали <b>базовую</b> лампу, эффектов в ней нет. Эти плитки будут просто включать свой цвет.",
    "You chose the <b>basic</b> lamp, so there are no effects. These tiles will simply switch on their color.",
  ],
  "fxoff.btn": ["Включить эффекты", "Turn effects on"],
  "s2.basicNote": [
    "В базовой лампе эффектов нет. Раскройте раздел, если захотите их включить.",
    "The basic lamp has no effects. Expand this section if you’d like to turn them on.",
  ],
  "fx.expand": ["Показать", "Show"],
  "fx.collapse": ["Свернуть", "Hide"],
  "palette.alt": ["Где в приложении «Дом» найти плитки с цветами", "Where to find the color tiles in the Home app"],
  "palette.ph": ["Место для скриншота: где найти плитки цветов в&nbsp;«Доме»", "Place for a screenshot: where to find the color tiles in Home"],
  "slot.title": ["Плитка {n}", "Tile {n}"],
  "slot.meta": ["оттенок {h}° · насыщенность {s}%", "hue {h}° · saturation {s}%"],
  "slot.alt": ["Плитка {n} в палитре приложения «Дом»", "Tile {n} in the Home app color palette"],
  "slot.ph": ["Место для скриншота плитки {n}", "Place for a screenshot of tile {n}"],
  "slot.aria": ["Эффект для плитки {n}", "Effect for tile {n}"],
  "fx.0.name": ["Без эффекта", "No effect"],
  "fx.0.desc": ["Плитка просто включит свой цвет", "The tile just switches on its color"],
  "fx.1.name": ["Разноцветные искры", "Colorful sparkles"],
  "fx.1.desc": ["Вспыхивают огоньки всех цветов", "Lights of every color flicker on and off"],
  "fx.2.name": ["Северное сияние", "Aurora"],
  "fx.2.desc": ["Плавные переливающиеся волны выбранного цвета", "Gentle shimmering waves in the color you pick"],
  "fx.3.name": ["Тёплые огоньки", "Warm twinkle"],
  "fx.3.desc": ["Мерцание, как у гирлянды", "Twinkling like fairy lights"],
  "fx.4.name": ["Бегущая радуга", "Running rainbow"],
  "fx.4.desc": ["Переливы всех цветов по ленте", "All colors flowing along the strip"],
  "fx.5.name": ["Спокойная радуга", "Calm rainbow"],
  "fx.5.desc": ["Вся лампа медленно меняет цвет", "The whole lamp slowly shifts color"],
  "color.label": ["Цвет", "Color"],
  "color.aria": ["Цвет эффекта для плитки {n}", "Effect color for tile {n}"],
  "color.aurora": ["Северный", "Northern"],
  "color.blue": ["Синий", "Blue"],
  "color.violet": ["Фиолетовый", "Violet"],
  "color.pink": ["Розовый", "Pink"],
  "color.red": ["Красный", "Red"],
  "color.orange": ["Оранжевый", "Orange"],
  "color.gold": ["Золотой", "Gold"],
  "color.custom": ["Свой", "Custom"],
  "color.needFw": [
    "Выбор цвета заработает после установки новой прошивки (шаг 5, «Установить прошивку и настройки»).",
    "Color choice starts working after installing the new firmware (step 5, “Install firmware and settings”).",
  ],
  "fx.unknownDesc": ["Новый эффект из прошивки", "New effect from the firmware"],
  "fx.generic": ["Эффект {id}", "Effect {id}"],

  /* ─── Шаг 3 / Step 3 ─── */
  "s3.title": ["Домашний Wi‑Fi", "Home Wi‑Fi"],
  "s3.hint": ["Лампа подключается к Wi‑Fi, чтобы iPhone мог ею управлять.", "The lamp joins your Wi‑Fi so your iPhone can control it."],
  "wifi.ssid": ["Название сети", "Network name"],
  "wifi.ssidPh": ["Например, MyHome", "For example, MyHome"],
  "wifi.pass": ["Пароль", "Password"],
  "wifi.passPh": ["Пароль от Wi‑Fi", "Wi‑Fi password"],
  "wifi.show": ["Показать", "Show"],
  "wifi.hide": ["Скрыть", "Hide"],
  "wifi.keepA": ["Лампа уже подключена к сети", "The lamp is already connected to"],
  "wifi.keepB": [". Оставьте поля пустыми, чтобы ничего не менять.", ". Leave the fields empty to keep it."],
  "wifi.note24": [
    "Лампа работает только с&nbsp;сетью <b>2,4&nbsp;ГГц</b>. Если роутер раздаёт две сети, выберите ту, в&nbsp;названии которой нет «5G».",
    "The lamp works only with <b>2.4&nbsp;GHz</b> networks. If your router has two networks, pick the one without “5G” in its name.",
  ],
  "wifi.notePrivacy": [
    "Пароль уходит прямо в&nbsp;лампу по кабелю. Эта страница его никуда не отправляет и&nbsp;не сохраняет.",
    "The password goes straight to the lamp over the cable. This page never sends or stores it anywhere.",
  ],

  "txp.summary": ["Лампа не подключается к Wi‑Fi?", "Lamp won’t connect to Wi‑Fi?"],
  "txp.warn": [
    "Меняйте эту настройку, <b>только если у платы есть проблемы с подключением к Wi‑Fi</b>. Если лампа подключается нормально, оставьте «Автоматически».",
    "Change this <b>only if your board has trouble connecting to Wi‑Fi</b>. If the lamp connects fine, leave it on “Automatic”.",
  ],
  "txp.why": [
    "У некоторых дешёвых плат ESP32‑C3 (например, SuperMini) стабилизатор питания не выдерживает пиковый ток при передаче на полной мощности. В момент подключения к роутеру питание проседает, и лампа бесконечно пытается подключиться — с любой сетью. Снижение мощности передатчика решает проблему, а лампе в комнате этой мощности хватает с запасом.",
    "Some cheap ESP32‑C3 boards (such as the SuperMini) have a voltage regulator that can’t handle the peak current of transmitting at full power. When the lamp tries to join the router, the supply dips and it keeps retrying forever, on any network. Lowering the transmit power fixes this, and it’s still plenty for a lamp in the same room.",
  ],
  "txp.label": ["Мощность передатчика Wi‑Fi", "Wi‑Fi transmit power"],
  "txp.auto": ["Автоматически (максимум платы, 19,5 дБм)", "Automatic (board maximum, 19.5 dBm)"],
  "txp.value": ["{v} дБм", "{v} dBm"],
  "txp.recommended": ["{v} дБм — помогает большинству плат", "{v} dBm — fixes most boards"],
  "txp.min": ["{v} дБм — минимум", "{v} dBm — minimum"],
  "txp.tip": [
    "Начните с 8,5&nbsp;дБм. Если лампа всё равно не подключается, попробуйте 5 или 2&nbsp;дБм. Чем ниже мощность, тем ближе к роутеру должна стоять лампа.",
    "Start with 8.5&nbsp;dBm. If the lamp still can’t connect, try 5 or 2&nbsp;dBm. The lower the power, the closer to the router the lamp should be.",
  ],
  "txp.needFw": [
    "Эта настройка заработает после установки новой прошивки (шаг 5, «Установить прошивку и настройки»).",
    "This setting starts working after installing the new firmware (step 5, “Install firmware and settings”).",
  ],

  /* ─── Шаг 4 / Step 4 ─── */
  "s4.title": ["Код для приложения «Дом»", "Apple Home pairing code"],
  "s4.hint": [
    "Восемь цифр, которые iPhone попросит при добавлении лампы. Это как пароль для первой встречи.",
    "Eight digits your iPhone asks for when adding the lamp. Think of it as a password for the first meeting.",
  ],
  "code.aria": ["Как задать код", "How to set the code"],
  "code.random": ["Придумать за меня", "Make one up for me"],
  "code.own": ["Ввести свой", "Enter my own"],
  "code.keep": ["Оставить текущий", "Keep current"],
  "code.regen": ["🎲 Другой код", "🎲 Another code"],
  "code.ownLabel": ["Ваш код (8 цифр)", "Your code (8 digits)"],
  "code.rules": [
    "Apple не принимает слишком простые коды: восемь одинаковых цифр, <code>12345678</code> и&nbsp;<code>87654321</code>. Запишите код, а&nbsp;в&nbsp;конце мы покажем его ещё раз вместе с&nbsp;QR‑кодом.",
    "Apple rejects codes that are too simple: eight identical digits, <code>12345678</code> and <code>87654321</code>. Write the code down; we’ll also show it again at the end with a QR code.",
  ],
  "code.need8": ["Нужно 8 цифр, сейчас {n}.", "8 digits needed, you have {n}."],
  "code.tooSimple": ["Такой код Apple не примет: он слишком простой.", "Apple won’t accept this code: it’s too simple."],
  "code.ok": ["Отлично, код {c} подходит ✓", "Great, {c} works ✓"],
  "qr.none": ["Код ещё не выбран", "No code chosen yet"],

  /* ─── Шаг 5 / Step 5 ─── */
  "s5.title": ["Установка", "Install"],
  "fw.checking": ["Проверяем, какая прошивка доступна…", "Checking which firmware is available…"],
  "fw.will": ["Будет установлена прошивка версии {v}{date}.", "Firmware version {v}{date} will be installed."],
  "fw.date": [" от {d}", " from {d}"],
  "fw.missing": [
    "Файлы прошивки не найдены: они появляются, когда сайт собирается через GitHub Actions. Сейчас можно только обновить настройки лампы.",
    "Firmware files not found: they appear when the site is built by GitHub Actions. For now you can only update the lamp’s settings.",
  ],
  "s5.check1": [
    "Подключите лампу к&nbsp;компьютеру USB‑кабелем. Кабель должен передавать данные: некоторые кабели от зарядок умеют только заряжать.",
    "Connect the lamp to your computer with a USB cable. It must be a data cable: some charger cables can only charge.",
  ],
  "s5.check2": [
    "Нажмите большую кнопку ниже. Браузер покажет окно со списком: выберите в&nbsp;нём <b>USB JTAG/serial debug unit</b> (или похожее) и&nbsp;нажмите <b>«Подключение»</b>.",
    "Press the big button below. The browser will show a list: choose <b>USB JTAG/serial debug unit</b> (or similar) and click <b>Connect</b>.",
  ],
  "s5.portAlt": ["Окно Chrome с выбором устройства: USB JTAG/serial debug unit", "Chrome’s device picker showing USB JTAG/serial debug unit"],
  "s5.portCaption": [
    "Так выглядит окно выбора: лампа называется <b>USB JTAG/serial debug unit</b>.",
    "This is the picker: the lamp shows up as <b>USB JTAG/serial debug unit</b>.",
  ],
  "s5.portNote": [
    "<b>Будьте внимательны, если в списке несколько устройств.</b> Выберите именно лампу — иначе прошивка не запишется или уйдёт не туда. Если не уверены, какое из них лампа: закройте окно, отключите лампу, снова нажмите кнопку и посмотрите, какое устройство пропало из списка. Потом подключите лампу обратно и выберите его.",
    "<b>Be careful if the list shows several devices.</b> Pick the lamp itself, otherwise the firmware won’t be written or will go to the wrong device. Not sure which one it is? Close the window, unplug the lamp, press the button again and see which device disappeared from the list. Then plug the lamp back in and choose that one.",
  ],
  "s5.check3": ["Не отключайте кабель, пока не появится надпись «Готово».", "Keep the cable plugged in until you see “Done”."],
  "act.aria": ["Что сделать", "What to do"],
  "act.flash.title": ["Установить прошивку и&nbsp;настройки", "Install firmware and settings"],
  "act.flash.sub": ["Для новой лампы или для обновления прошивки", "For a new lamp or a firmware update"],
  "act.settings.title": ["Только обновить настройки", "Only update settings"],
  "act.settings.sub": ["Прошивка уже стоит, меняем Wi‑Fi, эффекты или код", "Firmware is already there; change Wi‑Fi, effects or the code"],
  "adv.summary": ["Дополнительно", "Advanced"],
  "adv.erase": [
    "Полностью стереть память лампы перед установкой.<br><small>Лампу придётся заново добавить в&nbsp;«Дом». Нужно, только если что-то совсем сломалось.</small>",
    "Completely erase the lamp’s memory before installing.<br><small>You’ll have to add the lamp to Home again. Only needed if something is badly broken.</small>",
  ],
  "btn.flash": ["Подключить и установить", "Connect and install"],
  "btn.settings": ["Подключить и сохранить настройки", "Connect and save settings"],
  "btn.repick": ["Выбрать лампу ещё раз", "Choose the lamp again"],
  "log.summary": ["Технический журнал", "Technical log"],

  "val.ssidReq": ["Укажите название сети Wi‑Fi (шаг 3).", "Enter your Wi‑Fi network name (step 3)."],
  "val.passNoSsid": ["Вы ввели пароль, но не указали название сети Wi‑Fi.", "You entered a password but no Wi‑Fi network name."],
  "val.ssidLong": ["Название сети Wi‑Fi слишком длинное.", "The Wi‑Fi network name is too long."],
  "val.passShort": ["Пароль Wi‑Fi обычно не короче 8 символов. Проверьте его.", "Wi‑Fi passwords are usually at least 8 characters. Please check it."],
  "val.passLong": ["Пароль Wi‑Fi слишком длинный.", "The Wi‑Fi password is too long."],
  "val.code": [
    "Выберите код для «Дома» (шаг 4): сгенерируйте его или введите свои 8 цифр.",
    "Choose a Home pairing code (step 4): generate one or enter your own 8 digits.",
  ],
  "val.noFw": ["Файлы прошивки недоступны, выберите «Только обновить настройки».", "Firmware files aren’t available, choose “Only update settings”."],

  "stage.connect": ["Подключаемся к лампе", "Connecting to the lamp"],
  "stage.flash": ["Записываем прошивку", "Writing firmware"],
  "stage.restart": ["Перезапускаем лампу", "Restarting the lamp"],
  "stage.settings": ["Передаём настройки", "Sending settings"],
  "stage.done": ["Готово!", "Done!"],
  "p.prepare": ["Ищем лампу и готовимся к записи…", "Finding the lamp and getting ready…"],
  "p.erase": ["Стираем память и записываем прошивку…", "Erasing memory and writing firmware…"],
  "p.flashing": ["Записываем прошивку… {p}%", "Writing firmware… {p}%"],
  "p.restart": ["Перезапускаем лампу…", "Restarting the lamp…"],
  "p.repick": [
    "Лампа перезапустилась под новым именем. Нажмите кнопку ниже и выберите её ещё раз.",
    "The lamp restarted under a new name. Press the button below and choose it again.",
  ],
  "p.connect": ["Подключаемся…", "Connecting…"],
  "p.wake": ["Ждём, пока лампа проснётся…", "Waiting for the lamp to wake up…"],
  "p.sending": ["Передаём настройки…", "Sending settings…"],
  "p.savingCode": ["Сохраняем. Лампа готовит новый код, это займёт несколько секунд…", "Saving. The lamp is preparing the new code, this takes a few seconds…"],
  "p.saving": ["Сохраняем…", "Saving…"],
  "p.done": ["Готово! Лампа перезагружается с новыми настройками.", "Done! The lamp is restarting with the new settings."],

  "read.asking": ["Спрашиваем лампу…", "Asking the lamp…"],
  "read.ok": ["Настройки загружены ✓ Прошивка на лампе: {fw}", "Settings loaded ✓ Lamp firmware: {fw}"],
  "read.newer": [". Доступна новая версия {v}: её можно установить на шаге 5.", ". Version {v} is available: you can install it in step 5."],

  "err.notC3": [
    "Эта прошивка для ESP32-C3, а подключена плата {chip}. Проверьте, что в окне браузера выбрали именно лампу.",
    "This firmware is for ESP32-C3, but the connected board is {chip}. Make sure you picked the lamp in the browser window.",
  ],
  "err.codeRejected": ["Лампа не приняла код для «Дома»: он слишком простой. Выберите другой.", "The lamp rejected the pairing code: it’s too simple. Please choose another one."],
  "err.setRejected": ["Лампа не приняла настройку «{key}» ({reason}). Попробуйте ещё раз.", "The lamp rejected the “{key}” setting ({reason}). Please try again."],
  "err.noPort": ["Вы не выбрали лампу в окне браузера.", "You didn’t choose the lamp in the browser window."],
  "err.portBusy": [
    "Не удалось открыть порт. Закройте Arduino IDE, монитор порта и другие вкладки с этой страницей, затем попробуйте снова.",
    "Couldn’t open the port. Close Arduino IDE, any serial monitor and other tabs with this page, then try again.",
  ],
  "err.noHelloSettings": [
    "Лампа не ответила. Возможно, на ней стоит старая прошивка: выберите «Установить прошивку и настройки».",
    "The lamp didn’t answer. It may have old firmware: choose “Install firmware and settings”.",
  ],
  "err.noHelloFlash": [
    "Лампа не ответила после установки. Отключите и снова подключите кабель, затем выберите «Только обновить настройки».",
    "The lamp didn’t answer after installing. Unplug and replug the cable, then choose “Only update settings”.",
  ],
  "err.connect": [
    "Не получилось связаться с лампой. Попробуйте другой кабель или USB‑порт. Если не поможет, зажмите кнопку BOOT на плате при подключении (подробнее в разделе «Если что-то не получилось»).",
    "Couldn’t reach the lamp. Try another cable or USB port. If that doesn’t help, hold the BOOT button on the board while plugging it in (see “If something went wrong”).",
  ],
  "err.generic": [
    "Что-то пошло не так: {msg}. Попробуйте ещё раз; подробности в техническом журнале ниже.",
    "Something went wrong: {msg}. Please try again; details are in the technical log below.",
  ],
  "err.download": ["Не удалось скачать {file}", "Couldn’t download {file}"],

  /* ─── Шаг 6 / Step 6 ─── */
  "s6.title": ["Добавьте лампу в «Дом»", "Add the lamp to Home"],
  "s6.hint": ["Этот шаг пригодится после установки.", "You’ll need this after installing."],
  "s6.ready": ["Лампа готова! Осталось добавить её в «Дом».", "The lamp is ready! Now add it to the Home app."],
  "qr.aria": ["QR-код для добавления в «Дом»", "QR code for adding to Home"],
  "qr.hint": [
    "Наведите камеру iPhone на&nbsp;QR‑код или введите цифры вручную.",
    "Point your iPhone camera at the QR code or type the digits in by hand.",
  ],
  "home.1": [
    "Откройте приложение <b>«Дом»</b> на iPhone. Телефон должен быть в&nbsp;той же сети Wi‑Fi, что и&nbsp;лампа.",
    "Open the <b>Home</b> app on your iPhone. The phone must be on the same Wi‑Fi network as the lamp.",
  ],
  "home.2": ["Нажмите <b>«+»</b>, затем <b>«Добавить аксессуар»</b>.", "Tap <b>+</b>, then <b>Add Accessory</b>."],
  "home.3": [
    "Отсканируйте QR‑код. Если не получается, нажмите <b>«Другие параметры…»</b> и&nbsp;выберите <b>Smart RGB Lamp</b>.",
    "Scan the QR code. If that doesn’t work, tap <b>More options…</b> and choose <b>Smart RGB Lamp</b>.",
  ],
  "home.4": [
    "iPhone предупредит, что аксессуар не сертифицирован. Нажмите <b>«Все равно добавить»</b>: так и&nbsp;должно быть у&nbsp;самодельных устройств.",
    "Your iPhone will warn that the accessory isn’t certified. Tap <b>Add Anyway</b>: that’s normal for home-made devices.",
  ],
  "home.5": ["Если попросит код, введите восемь цифр слева.", "If asked for a code, enter the eight digits on the left."],
  "tiles.title": ["Как включить эффект", "How to start an effect"],
  "tiles.text": [
    "Откройте лампу в&nbsp;«Доме», нажмите на&nbsp;цвет и&nbsp;выберите одну из&nbsp;плиток:",
    "Open the lamp in Home, tap the color and pick one of the tiles:",
  ],
  "tiles.item": ["Плитка {n} → <b>{fx}</b>", "Tile {n} → <b>{fx}</b>"],
  "wifi.waiting": ["⏳ Лампа перезагружается и подключается к Wi‑Fi…", "⏳ The lamp is restarting and joining Wi‑Fi…"],
  "wifi.ok": ["✓ Лампа подключилась к Wi‑Fi (адрес {ip}). Можно добавлять в «Дом».", "✓ The lamp is on Wi‑Fi (address {ip}). You can add it to Home now."],
  "wifi.paired": ["🎉 Лампа добавлена в «Дом»! Кабель можно отключать.", "🎉 The lamp has been added to Home! You can unplug the cable."],
  "wifi.unknown": [
    "Лампа ещё не сообщила о подключении к Wi‑Fi. Подождите минуту. Если в «Доме» её не видно, проверьте название и пароль сети (нужна сеть 2,4&nbsp;ГГц) и сохраните настройки ещё раз.",
    "The lamp hasn’t reported joining Wi‑Fi yet. Give it a minute. If it doesn’t show up in Home, check the network name and password (a 2.4&nbsp;GHz network is needed) and save the settings again.",
  ],

  /* ─── FAQ ─── */
  "faq.title": ["Если что-то не получилось", "If something went wrong"],
  "faq.q1": ["Лампы нет в списке, когда браузер просит выбрать устройство", "The lamp isn’t in the list when the browser asks to choose a device"],
  "faq.a1": [
    "Чаще всего виноват кабель, который только заряжает. Попробуйте другой кабель или другой USB‑порт компьютера. Если не помогло: отключите лампу, зажмите на плате маленькую кнопку <b>BOOT</b> (бывает подписана «9»), подключите кабель и&nbsp;отпустите кнопку. После этого снова нажмите «Подключить и&nbsp;установить».",
    "Most often it’s a charge-only cable. Try another cable or another USB port. If that doesn’t help: unplug the lamp, hold the small <b>BOOT</b> button on the board (sometimes labelled “9”), plug the cable in and release the button. Then press “Connect and install” again.",
  ],
  "faq.q2": ["Лампа не подключается к Wi‑Fi", "The lamp won’t join Wi‑Fi"],
  "faq.a2": [
    "Проверьте, что сеть работает на&nbsp;2,4&nbsp;ГГц, а&nbsp;название и&nbsp;пароль введены точно, с&nbsp;учётом больших и&nbsp;маленьких букв. Исправить легко: выберите «Только обновить настройки» и&nbsp;введите данные ещё раз. Если всё введено верно, а&nbsp;лампа всё равно не подключается, откройте в&nbsp;шаге&nbsp;3 блок «Лампа не подключается к&nbsp;Wi‑Fi?» и&nbsp;снизьте мощность передатчика.",
    "Make sure the network is 2.4&nbsp;GHz and the name and password are exactly right, including upper and lower case. It’s easy to fix: choose “Only update settings” and enter them again. If everything is correct and the lamp still won’t connect, open “Lamp won’t connect to Wi‑Fi?” in step&nbsp;3 and lower the transmit power.",
  ],
  "faq.q7": ["Плата постоянно перезагружается, когда её подключают к компьютеру", "The board keeps restarting when connected to the computer"],
  "faq.a7": [
    "На некоторых платах с завода стоит прошивка, из-за которой плата перезапускается по кругу. Поэтому лучше сначала установить прошивку, а потом собирать лампу. Зажмите на плате кнопку <b>BOOT</b>, подключите кабель к компьютеру, подержите кнопку секунду и отпустите, дальше всё как обычно. Если лампа уже собрана, отключайте и снова подключайте её и пробуйте установить прошивку, пока не получится.",
    "Some boards ship with firmware that makes them restart in a loop. That’s why it’s best to install the firmware before assembling the lamp. Hold the <b>BOOT</b> button on the board, plug the cable into the computer, keep holding for a second and release; then continue as usual. If the lamp is already assembled, unplug and replug it and keep trying to install until it works.",
  ],
  "faq.q3": ["Хочу поменять эффекты или Wi‑Fi потом", "I want to change effects or Wi‑Fi later"],
  "faq.a3": [
    "Вернитесь на эту страницу, нажмите «Загрузить настройки с&nbsp;лампы», измените что нужно и&nbsp;выберите «Только обновить настройки». Заново добавлять лампу в&nbsp;«Дом» не придётся.",
    "Come back to this page, press “Load settings from the lamp”, change what you need and choose “Only update settings”. You won’t need to add the lamp to Home again.",
  ],
  "faq.q4": ["Лампа была в «Доме», а я установил прошивку заново", "The lamp was in Home and I reinstalled the firmware"],
  "faq.a4": [
    "Если вы не ставили галочку «Полностью стереть память», лампа останется в&nbsp;«Доме» со&nbsp;всеми сценами и&nbsp;автоматизациями.",
    "If you didn’t tick “Completely erase the lamp’s memory”, the lamp stays in Home with all its scenes and automations.",
  ],
  "faq.q5": ["«Дом» пишет, что аксессуар уже добавлен или не отвечает", "Home says the accessory is already added or not responding"],
  "faq.a5": [
    "Удалите лампу из «Дома», затем здесь, в&nbsp;разделе «Дополнительно», отметьте «Полностью стереть память» и&nbsp;установите прошивку заново. После этого добавьте лампу как новую.",
    "Remove the lamp from Home, then here under “Advanced” tick “Completely erase the lamp’s memory” and install the firmware again. After that, add the lamp as a new accessory.",
  ],
  "faq.q6": ["Какой браузер нужен", "Which browser do I need"],
  "faq.a6": [
    "Google Chrome или Microsoft Edge на&nbsp;компьютере (Windows, macOS или Linux). Safari, Firefox и&nbsp;браузеры на&nbsp;телефонах работать с&nbsp;USB пока не умеют.",
    "Google Chrome or Microsoft Edge on a computer (Windows, macOS or Linux). Safari, Firefox and phone browsers can’t work with USB yet.",
  ],

  "footer.src": ["исходный код на GitHub", "source code on GitHub"],
  "footer.fw": ["Прошивка {v}", "Firmware {v}"],
  "footer.build": [" · сборка {b}", " · build {b}"],
};
