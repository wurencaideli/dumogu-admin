/**
 * 简单的json数据库
 * 数据必须以数组存在
 */
const jsonDBServer = require('./jsonDB.js');

if (require.main == module) {
    /** 例子 */
    const entityInstance = new jsonDB('', {
        name: {
            default: '',
        },
        link: {
            default: '',
        },
        icon: {
            default: '',
        },
    });
}
