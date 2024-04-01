/**
 * 统一分隔符路径 主要是为了后续生成模块ID
 * @param {string} path
 * @returns string
 */
function toUnixPath(path) {
  return path.replace(/\\/g, '/');
}

module.exports = {
  toUnixPath,
};
