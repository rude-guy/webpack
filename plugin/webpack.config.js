const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExternalsWebpackPlugin = require('./plugins/externals-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  devtool: false,
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new ExternalsWebpackPlugin({
      lodash: {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
        // 替代模块变量名
        variableName: '_',
      },
      vue: {
        src: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js',
        variableName: 'Vue',
      },
    }),
  ],
};
