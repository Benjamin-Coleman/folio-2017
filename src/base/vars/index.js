const reload = require('require-nocache')(module);
const _colors = reload('./colors.js');
const _fonts = reload('./fonts.js');

const _vars = Object.assign(_colors, _fonts);

module.exports = _vars;
