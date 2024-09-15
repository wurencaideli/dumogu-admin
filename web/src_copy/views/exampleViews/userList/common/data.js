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
let nameList = ['毒蘑菇', '云南见手青', '躺板板'];
for (let i = 0; i < 20; i++) {
    data.push({
        name: nameList[i] || '张三',
        sign: i === 0 ? '超级管理员' : '普通用户',
        content: `测试角色${i + 1}`,
        sort: i,
        status: true,
        createTime: new Date().toLocaleString(),
        number: new Date().getTime(),
    });
}
responseData.rows = data;
responseData.total = responseData.rows.length;
