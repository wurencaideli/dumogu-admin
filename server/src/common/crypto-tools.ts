import md5 from 'js-md5';
import crypto from 'crypto-js';

/**
 * 生成一个MD5
 */
export function getMd5(string: string): string {
    return md5(string);
}
/**
 * 计算一个字符串的哈希值
 * 相当于md5要安全些
 * 使用sha256算法
 */
export function calculateSHA256Hash(input: string): string {
    input = String(input || '');
    const hash = crypto.SHA256(input);
    return hash.toString();
}
