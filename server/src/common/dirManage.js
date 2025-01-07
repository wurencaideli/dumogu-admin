import path from "path";

/**
 * 服务端根目录
 * @returns 
 */
export function serverDir() {
    return path.join(__dirname, '../../')
}