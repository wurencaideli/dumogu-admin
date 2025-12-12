import { isPro } from '../common/other-tools.js';
import { verify } from '../common/captcha.js';
import { publicReturn } from '../common/public-return.js';

/** 验证码验证 */
export function vCaptcha(req: any, res: any, next: any) {
    if (!isPro()) {
        next();
        return;
    }
    const params = req.body || {};
    const captchaId = params.captchaId;
    const captchaText = params.captchaText;
    if (!captchaId || !captchaText) {
        res.json(new publicReturn(203, '请携带验证码信息'));
        return;
    }
    const status = verify(captchaId, captchaText);
    if (status) {
        next();
    } else {
        res.json(new publicReturn(203, '验证码验证失败 || 验证码过期'));
    }
}
/**
 * 错误处理中间件
 */
export function errorMiddle(err: any, req: any, res: any, next: any) {
    if (!isPro()) {
        console.error(err);
    }
    let errString;
    if (typeof err === 'string') {
        errString = err;
    } else {
        try {
            errString = err.toString();
        } catch {
            errString = '未知错误';
        }
    }
    res.json(new publicReturn(500, errString));
}
/**
 * 包装请求处理方法
 */
export function packageRequestHandler(f: any) {
    return (req: any, res: any, next: any) => {
        try {
            const resolve = f(req, res, next);
            /** 把错误传给下一个中间件 */
            if (resolve instanceof Promise) {
                resolve.catch(next);
            }
        } catch (e) {
            next(e);
        }
    };
}
