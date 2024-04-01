const webpack = require('./webpack');
const config = require('../example/webpack.config');
// 2. 调用webpack(options)初始化compiler对象
const compiler = webpack(config);

// 调用run方法进行打包
compiler.run((err, stats) => {
  if (err) {
    console.error(err);
  }
});
