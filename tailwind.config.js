// @see: https://tailwindcss.com/docs/configuration/
// @see: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js

const defaultTheme = require('tailwindcss/defaultTheme')

const fontFamily = defaultTheme.fontFamily;
fontFamily['sans'] = [
  'Roboto',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

module.exports = {
  purge: [],
  theme: {
    fontFamily: fontFamily,
    extend: {},
  },
  variants: {
    margin: ['responsive', 'last'],
  },
  plugins: [],
};
