const path = require('path');

const createWebpack = require('../webpack/create-webpack');

const ROOT_DIR = path.resolve(__dirname, '..');
const ENTRY_DIR = path.resolve(__dirname);
const BUILD_DIR = path.resolve(ROOT_DIR, 'dist');
const WEB_ROOT = path.resolve(BUILD_DIR, 'public');
const ASSET_DIR = path.resolve(WEB_ROOT, 'assets');

module.exports = (env) => {
  const config = createWebpack({
    buildDir: BUILD_DIR,
    rootDir: ROOT_DIR,
    webRoot: WEB_ROOT,
    outputDir: ASSET_DIR,
    htmlTemplate: path.join(ENTRY_DIR, 'index.html'),
    production: env.NODE_ENV !== 'development',
    tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
  })({
    entry: path.resolve(ENTRY_DIR, 'entry.tsx'),
    output: {
      path: WEB_ROOT,
      filename: 'assets/bundle.js',
    },
  });

  // console.dir(config, { depth: null });

  return config;
};

