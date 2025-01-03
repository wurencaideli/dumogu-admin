/**
 * 包装请求处理方法
 * @param {import('express').RequestHandler} f
 * @returns
 */
function packageRequestHandler(f) {
    return (req, res, next) => {
        try {
            let resolve = f(req, res, next);
            /** 把错误传给下一个中间件 */
            if (resolve instanceof Promise) {
                resolve.catch(next);
            }
        } catch (e) {
            next(e);
        }
    };
}

module.exports = {
    packageRequestHandler,
};
