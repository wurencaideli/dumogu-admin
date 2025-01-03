/**
 * 公共方法
 *  */
const otherTools = require('../common/otherTools');
const captchaTools = require('../common/captcha');
const { publicReturn } = require('../common/publicReturn');
const { getReqlanguage } = require('../i18/index');

/** 验证码验证 */
function vCaptcha(req, res, next) {
    if (!otherTools.isPro()) {
        next();
        return;
    }
    let params = req.body || {};
    const captchaId = params.captchaId;
    const captchaText = params.captchaText;
    if (!captchaId || !captchaText) {
        res.json(new publicReturn(203, {
            msg:'请携带验证码信息',
            lang:getReqlanguage(req),
        }));
        return;
    }
    let status = captchaTools.verify(captchaId, captchaText);
    if (status) {
        next();
    } else {
        res.json(new publicReturn(203, {
            msg:'验证码验证失败',
            lang:getReqlanguage(req),
        }));
    }
}

module.exports = {
    vToken,
    vCaptcha,
};
