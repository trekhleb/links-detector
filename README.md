# 📖 👆🏻 Links Detector

> Links Detector makes printed links clickable via your smartphone camera. No need to type a link in, just scan and click on it.

🚀 [**Launch Link Detector**](https://trekhleb.github.io/links-detector)

[![Links Detector](./public/images/links-detector-banner-bg-black-2.png)](https://trekhleb.github.io/links-detector)

## Problem

So you read a book or a magazine and see the link like `https://some-url.com/which/may/be/long?and_with_params=true`, but you can't click on it since it is printed. To visit this link you need to start typing it in the browser's address bar character by character, which may be pretty annoying and error prone.

## Solution

Links Detector tries to detect and recognize such links for you and makes it clickable using you smartphone camera. So in result you should do just one click on the link instead of typing the whole link manually character by character.

![Links Detector Demo](./public/videos/demo-white.gif)

## Limitations

⚠️ Currently the application is in _experimental_ _Alpha_ stage and has [many issues and limitations](https://github.com/trekhleb/links-detector/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement). So don't raise your expectations bar to high until these issues are resolved 🤷🏻‍.

## Technologies

Links Detector is a pure frontend [React](https://create-react-app.dev/) application. Links detection is happening right in your browser and not on the server.

Links Detector is [PWA](https://web.dev/progressive-web-apps/) (Progressive Web App) friendly application made on top of a [Workbox](https://developers.google.com/web/tools/workbox) library. While you navigate through the app it tries to cache all resources to make them available offline and to make consequent visits much faster for you.

Links detection and recognition happens by means of [TensorFlow](https://www.tensorflow.org) and [Tesseract.js](https://github.com/naptha/tesseract.js) libraries which in turn rely on [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) and [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) browser support.
