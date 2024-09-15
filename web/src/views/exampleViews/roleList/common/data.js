/**
 * 模拟数据
 */

export let responseData = {
    total: 314,
    rows: [],
    code: 200,
    msg: '查询成功',
};

const data = [];
for (let i = 0; i < 20; i++) {
    data.push({
        name: i === 0 ? '超级管理员' : '普通用户',
        sign: i === 0 ? 'admin' : 'common',
        content: `测试角色${i + 1}`,
        sort: i,
        status: true,
        createTime: new Date().toLocaleString(),
    });
}
responseData.rows = data;
responseData.total = responseData.rows.length;
