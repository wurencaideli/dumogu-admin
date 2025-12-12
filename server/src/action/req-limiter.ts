import { publicReturn } from '../common/public-return.js';
import { getMd5 } from '../common/crypto-tools.js';

/** 生成客户端的唯一标识符 */
function generateClientId(req: any) {
    const headers = req.headers;
    const userAgent = headers['user-agent'] || '';
    const acceptEncoding = headers['accept-encoding'] || '';
    const acceptLanguage = headers['accept-language'] || '';
    const ip = req.ip;
    return getMd5(`${ip}-${userAgent}-${acceptEncoding}-${acceptLanguage}`);
}
/** 请求限制器 */
const requestMapList: any = [];
export function getReqLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map(); // 用于存储每个客户端的请求时间戳
    requestMapList.push(requests);
    return function (req: any, res: any, next: any) {
        const clientKey = generateClientId(req);
        const currentTime = new Date().getTime();
        let clientRequests = requests.get(clientKey);
        if (!clientRequests) {
            clientRequests = {
                windowMs: windowMs,
                maxRequests: maxRequests,
                startTime: currentTime,
                number: 0,
            };
            requests.set(clientKey, clientRequests);
        }
        if (currentTime - clientRequests.startTime <= windowMs) {
            clientRequests.number++;
        } else {
            clientRequests.startTime = currentTime;
            clientRequests.number = 1;
        }
        if (clientRequests.number > maxRequests) {
            let retryAfter: number | string = clientRequests.startTime + windowMs - currentTime;
            retryAfter = (retryAfter / 1000).toFixed(3);
            res.json(new publicReturn(203, `请 ${retryAfter} s后再试`));
            return;
        }
        next();
    };
}
/**
 * 清除已过期的
 */
export function verifyOverTime() {
    const nowDate = new Date().getTime();
    requestMapList.forEach((requests: any) => {
        requests.forEach((item: any, key: string) => {
            if (item.startTime + item.windowMs <= nowDate) return;
            requests.delete(key);
        });
    });
}
