# 📖 👆🏻 Links Detector

> Links Detector makes printed links clickable via your smartphone camera. No need to type a link in, just scan and click on it.

🚀 [**Launch Link Detector**](https://trekhleb.github.io/links-detector)

[![Links Detector](./src/images/links-detector-banner-bg-black-2.png)](https://trekhleb.github.io/links-detector)

## The Problem

So you read a book or a magazine and see the link, but you can't click on it since it is printed. If it would be a QR code you would just scan it using your smartphone camera, but what about the links like `https://some.url.com/which/may/be/long?and_with_params=true`? Normally you would start typing the link in the browser address bar character by character, which may be pretty annoying.

Links Detector **tries** to detect and recognize such links for you and make it clickable. So in result you should do just one click instead of typing the whole link in manually.

## The Solution

## Version locks

`react-router-dom v5.X.X` isn't compatible with `history v5.X.X`.
Therefore `package.json` contains `history v4.X.X`.
See [StackOverflow question](https://stackoverflow.com/questions/62449663/react-router-with-custom-history-not-working) for more details.
