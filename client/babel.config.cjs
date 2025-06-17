// babel.config.json
// babel.config.js
// eslint-disable-next-line no-undef
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { esmodules: true } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};
