/**
 * Api 引入
 */
const express = require('express');
const router = express.Router();
const publicRouter = require('./public');
const webSrcRouter = require('./webSrc');

/** 公共相关接口 */
router.use('/api/public', publicRouter);
/** 前端资源文件 */
router.use(webSrcRouter);

module.exports = router;
