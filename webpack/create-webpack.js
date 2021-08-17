const compose = require('lodash/fp/compose');

const mode = require('./components/mode');
const scripts = require('./components/scripts');
const html = require('./components/html');
const webpackDevServer = require('./components/webpack-dev-server');
const forkTsChecker = require('./components/fork-ts-checker');
const styles = require('./components/styles');
const statsPlugin = require('./components/stats-plugin');
const lint = require('./components/lint');
const clean = require('./components/clean');
const fonts = require('./components/fonts');
const hot = require('./components/hot');
const images = require('./components/images');

const components = [
  clean,
  mode,
  forkTsChecker,
  webpackDevServer,
  scripts,
  html,
  styles,
  statsPlugin,
  lint,
  fonts,
  hot,
  images
];

module.exports = (opts) => (config) => {
  return compose(
    ...components.map(comp => (comp(opts)))
  )({
    target: 'web',
    stats: {
      assets: true,
      children: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      entrypoints: false,
      hash: false,
      modules: false,
      timings: false,
      version: false,
    },
    performance: {
      assetFilter: function assetFilter(assetFilename) {
        return !/^\.\.\/.*$/.test(assetFilename);
      }
    },
    ...config,
  });

};
