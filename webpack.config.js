const { resolve } = require('path');

const env = process.env.NODE_ENV;

const isDev = env === 'development';

const mode = isDev ? 'development' : 'production';
const entry = isDev ? resolve(__dirname, 'dev/index.js') : resolve(__dirname, 'src/index.js');
const path = isDev ? resolve(__dirname, 'build') : resolve(__dirname, 'release');
const libraryTarget = isDev ? undefined : 'umd';
const externals = isDev ? undefined : ['react', 'rxjs', 'react-dom', 'prop-types'];

module.exports = {
  mode,
  entry,
  externals,
  output: {
    path,
    filename: 'index.js',
    libraryTarget,
  },
  stats: 'verbose',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  target: 'web',
};
