const fs = require('fs');

/**
 * 统一分隔符路径 主要是为了后续生成模块ID
 * @param {string} path
 * @returns string
 */
function toUnixPath(path) {
  return path.replace(/\\/g, '/');
}

/**
 * 根据extensions自动添加扩展名
 * @param {string} modulePath
 * @param {string[]} extensions
 * @param {string} originModulePath
 * @param {string} moduleContext
 * @returns
 */
function tryExtensions(modulePath, extensions, originModulePath, moduleContext) {
  // 优先尝试不需要扩展名选项
  extensions.unshift('');
  for (let extension of extensions) {
    if (fs.existsSync(modulePath + extension)) {
      return modulePath + extension;
    }
  }
  // 为匹配到对应的文件
  throw new Error(`Failed to resolve module ${originModulePath} from ${moduleContext}.`);
}

module.exports = {
  toUnixPath,
  tryExtensions,
};
