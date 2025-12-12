export function isPro(): boolean {
    return process.env.NODE_ENV === 'production';
}
export function deepCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
}
/**
 * 获取数据的类型
 */
export function getValueType(value: any): string {
    return Object.prototype.toString.call(value);
}
/** 随机获取一个元素 */
export function getRandomElement(arr: Array<any>): any {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
/** 参数转化为Boolean */
export function toBoolean(value: any): boolean {
    if (!value || value == 'false' || value == 0) {
        value = false;
    } else {
        value = true;
    }
    return value;
}
/** 分割数组 */
export function chunkArray(arr: Array<any>, chunkSize: number) {
    const result = [];
    // 循环分割数组，每次取chunkSize长度的子数组
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        result.push(chunk);
    }
    return result;
}
