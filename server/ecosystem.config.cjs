const path = require('path');

/**
 * pm2 start ecosystem.config.cjs
 * pm2 restart 20
 * pm2 reload 20
 * pm2 delete 20
 */
module.exports = {
    apps: [
        {
            name: 'dumogu-admin-server',
            script: path.join(__dirname, 'dist/index.js'),
            args: ['--model', 'pro'],
            // 可选：补充生产环境常用配置
            instances: 1, // 强制只启动 1 个实例
            exec_mode: 'fork', // 改用 fork 模式（单进程，集群模式的替代）
            // instances: 'max', // 启用集群模式，利用多核 CPU
            autorestart: true, // 进程崩溃自动重启
            watch: false, // 生产环境关闭 watch（避免代码变动触发重启）
            max_memory_restart: '300M', // 内存超过 300M 自动重启
        },
    ],
};
