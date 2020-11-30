# 📖 👆🏻 Links Detector

> Links Detector makes printed links clickable _via your smartphone camera_. No need to type a link in, just scan and click on it.

🚀 [**Launch Links Detector**](https://trekhleb.github.io/links-detector) from your smartphone

[![Links Detector](./public/images/links-detector-banner-bg-black-2.png)](https://trekhleb.github.io/links-detector)

## 🤷🏻‍ The Problem

So you read a book or a magazine and see the link like `https://some-url.com/which/may/be/long?and_with_params=true`, but you can't click on it since it is printed. To visit this link you need to start typing it character by character in the browser's address bar, which may be pretty annoying and error-prone.

## 💡 The Solution

Similarly to QR-code detection, we may try to "teach" the smartphone to _detect_ and _recognize_ printed links for us and to make them _clickable_. This way you'll do just _one_ click instead of _multiple_ keystrokes. Your operational complexity goes from `O(N)` to `O(1)`. 

This is exactly what _Links Detector_ tries to achieve. It makes you do just one click on the link instead of typing the whole link manually character by character.

![Links Detector Demo](./public/videos/demo-white.gif)

## ⚠️ Limitations

Currently, the application is in _experimental_ _Alpha_ stage and has [many issues and limitations](https://github.com/trekhleb/links-detector/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement). So don't raise your expectations level too high until these issues are resolved 🤷🏻‍.

## 🏋🏻‍ Model Training

The detection model was trained using [TensorFlow 2 Object Detection API](https://github.com/tensorflow/models/tree/master/research/object_detection).

You may found the details of the training in [📖 👆🏻 Making the Printed Links Clickable Using TensorFlow 2 Object Detection API](https://github.com/trekhleb/links-detector/blob/master/articles/printed_links_detection/printed_links_detection.md) long read article.

## ⚙️ Technologies

_Links Detector_ is a pure frontend [React](https://create-react-app.dev/) application written on [TypeScript](https://www.typescriptlang.org/). Links detection is happening right in your browser without a need of sending images to the server.

_Links Detector_ is [PWA](https://web.dev/progressive-web-apps/) (Progressive Web App) friendly application made on top of a [Workbox](https://developers.google.com/web/tools/workbox) library. While you navigate through the app it tries to cache all resources to make them available offline and to make consequent visits much faster for you. You may also [install](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Developer_guide/Installing) Links Detector as a standalone app on your smartphone.

Links detection and recognition happens by means of [TensorFlow](https://www.tensorflow.org) and [Tesseract.js](https://github.com/naptha/tesseract.js) libraries which in turn rely on [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) and [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) browser support.
