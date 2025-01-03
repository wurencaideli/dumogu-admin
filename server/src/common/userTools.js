/**
 * 用户加密密码的方案和工具
 */
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * hash密码，需要盐
 * @param {string} password
 * @param {number} [saltRounds=8]
 * @returns {string}
 */
function hashPassword(password, saltRounds = 8) {
    let hash = bcrypt.hashSync(password, saltRounds);
    return hash;
}
/**
 * 验证密码
 * @param {string} password
 * @param {string} hashPassword_
 * @returns {boolean}
 */
function comparePassword(password, hashPassword_) {
    return bcrypt.compareSync(password, hashPassword_);
}
/**
 * 创建token
 * @returns {string}
 */
function createToken() {
    const token = uuidv4();
    return token;
}

module.exports = {
    hashPassword,
    comparePassword,
    createToken,
};
