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
  "fx.2.desc": ["Плавные зелёно-бирюзовые волны", "Gentle green and teal waves"],
  "fx.3.name": ["Тёплые огоньки", "Warm twinkle"],
  "fx.3.desc": ["Мерцание, как у гирлянды", "Twinkling like fairy lights"],
  "fx.4.name": ["Бегущая радуга", "Running rainbow"],
  "fx.4.desc": ["Переливы всех цветов по ленте", "All colors flowing along the strip"],
  "fx.5.name": ["Спокойная радуга", "Calm rainbow"],
  "fx.5.desc": ["Вся лампа медленно меняет цвет", "The whole lamp slowly shifts color"],
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
    "Нажмите большую кнопку ниже. Браузер покажет окно со списком: выберите в&nbsp;нём <b>USB JTAG/serial debug unit</b> (или похожее) и&nbsp;нажмите <b>«Подключиться»</b>.",
    "Press the big button below. The browser will show a list: choose <b>USB JTAG/serial debug unit</b> (or similar) and click <b>Connect</b>.",
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
    "Проверьте, что сеть работает на&nbsp;2,4&nbsp;ГГц, а&nbsp;название и&nbsp;пароль введены точно, с&nbsp;учётом больших и&nbsp;маленьких букв. Исправить легко: выберите «Только обновить настройки» и&nbsp;введите данные ещё раз.",
    "Make sure the network is 2.4&nbsp;GHz and the name and password are exactly right, including upper and lower case. It’s easy to fix: choose “Only update settings” and enter them again.",
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
