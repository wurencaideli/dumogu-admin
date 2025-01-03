/**
 * 关于加解密的工具
 */
const md5 = require('js-md5');
const crypto = require('crypto-js');

/**
 * 生成一个MD5
 * @param {string} string
 * @returns {string}
 */
function getMd5(string) {
    return md5(string);
}
/**
 * 计算一个字符串的哈希值
 * 相当于md5要安全些
 * 使用sha256算法
 * @param {string} input
 * @returns {string}
 */
function calculateSHA256Hash(input) {
    input = String(input || '');
    const hash = crypto.SHA256(input);
    return hash.toString();
}

module.exports = {
    getMd5,
    calculateSHA256Hash,
};
