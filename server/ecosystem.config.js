const path = require('path');
// pm2 start ecosystem.config.js
// pm2 restart 20
// pm2 reload 20
// pm2 delete 20
module.exports = {
    apps: [
        {
            name: 'dumogu-admin-server',
            script: path.join(__dirname, 'script-run.js'),
            cwd: __dirname,
            args: '--environment production --model start',
        },
    ],
};
