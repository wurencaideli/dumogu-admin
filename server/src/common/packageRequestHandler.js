/**
 * 包装请求处理方法
 * @param {import('express').RequestHandler} f
 * @returns
 */
export function packageRequestHandler(f) {
    return (req, res, next) => {
        try {
            f(req, res, next);
        } catch (e) {
            next(e);
        }
    };
}
