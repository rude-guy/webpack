const path = require('path');
const CompressAssetsPlugin = require('./plugins/CompressAssetsPlugin');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './src/entry1.js'),
  },
  devtool: false,
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
    clean: true,
  },
  plugins: [
    new CompressAssetsPlugin({
      output: 'result.zip',
    }),
  ],
};
