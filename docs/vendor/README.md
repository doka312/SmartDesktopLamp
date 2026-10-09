# Сторонние библиотеки

Лежат здесь, чтобы страница не зависела от внешних CDN.

- `esptool-js-0.7.0.js`: [esptool-js](https://github.com/espressif/esptool-js) от Espressif, лицензия Apache-2.0 (файл `bundle.js` из npm-пакета).
- `qrcode-generator-2.0.4.mjs`: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) Kazuhiko Arase, лицензия MIT.
- `three-viewer-0.186.1.min.js`: урезанная сборка [three.js](https://threejs.org) 0.186.1 (MIT) для просмотра 3D‑модели — только нужные части плюс STLLoader, OrbitControls и toCreasedNormals. Собрана esbuild из `three` (entry: экспорт нужных классов), загружается только при открытии раздела «3D‑модель корпуса».
