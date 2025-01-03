/**
 * 公共 api
 */
const express = require('express');
const captchaTools = require('../common/captcha');
const { packageRequestHandler } = require('../common/packageRequestHandler');
const router = express.Router();
const { publicReturn } = require('../common/publicReturn');
const { getReqlanguage } = require('../i18/index');

/** 获取验证码 */
router.get(
    '/captcha',
    packageRequestHandler(function (req, res) {
        const captcha = captchaTools.create();
        res.json(new publicReturn(200, {
            msg:'成功',
            lang:getReqlanguage(req),
        }, captcha));
    }),
);

module.exports = router;
