import express from "express";
import { packageRequestHandler } from "../common/packageRequestHandler";
import { create } from "../common/captcha";
import { ResBody } from "../common/ResBody";
import { getReqlanguage } from "../i18";

export function getPublicRouter() {
    const router = express.Router();
    /** 获取验证码 */
    router.get(
        '/captcha',
        packageRequestHandler(function (req, res) {
            const captcha = create();
            res.json(new ResBody(200, {
                msg: '成功',
                lang: getReqlanguage(req),
            }, captcha));
        }),
    );
    return router;
}
