/**
 * 公用的打印 html 模板
 * https://doc.weixin.qq.com/sheet/e3_ADcA3AaFABEHqe6xH6hRS2PAJxUA5?scode=AE8AoAcPAAkXqWbExyAEwARAZtAP8&force_open_in_wx=1&tab=njh55v
 */

import { baseCss } from './base.js';

/**
 * 模板单据
 */
export const table_0 = {
    css: baseCss + `@page { size: portrait;}`,
    render(data) {
        data = data || {};
        data.list = data.list || [];
        return `
            <div style="font-size: 0.3cm;font-weight: bold;padding: 0 0.4cm;box-sizing:border-box;align-items: center;">
                单号 ：123123123
            </div>
            <table
                class="print-table-container"
                cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <th
                            class="no-border is-empty-2"
                            align='center'
                            colspan="24">
                            
                        </th>
                    </tr>
                </thead>
                <tr>
                    <th
                        class="table-title no-border"
                        align='center'
                        colspan="24">
                        打印单据-1
                    </th>
                </tr>
                <tr>
                    ${Array.apply(null, Array(24))
                        .map(() => {
                            return `
                            <th
                                class="th-24-v"
                                colspan="1">
                            </th>
                            `;
                        })
                        .join('')}
                </tr>
                <tr>
                    <td colspan="16" class="no-border">
                        哈哈哈
                    </td>
                    <td colspan="8" class="no-border">
                        123123
                    </td>
                </tr>
                <tr>
                    <td colspan="16" class="no-border">
                        客户名称:123
                    </td>
                    <td colspan="8" class="no-border">
                        客户代码:2343
                    </td>
                </tr>
                <tr>
                    <td colspan="16" class="no-border">
                        项目编号:234
                        <img
                            style="width:30px;height:30px;" 
                            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">
                        </img>
                    </td>
                    <td colspan="8" class="no-border">
                        执行编号:
                        ${data.executeCode || ''}
                    </td>
                </tr>
                <tr class="text-align-right">
                    <td colspan="24" class="no-border">单位：元</td>
                </tr>
                <tr class="is-weight tr-padding-1">
                    <td colspan="3">自定义字段</td>
                    <td colspan="3">自定义字段</td>
                    <td colspan="3">自定义字段</td>
                    <td colspan="3">自定义字段</td>
                    <td colspan="3">自定义字段</td>
                    <td colspan="3">自定义字段</td>
                    <td colspan="3">自定义字段</td>
                    <td colspan="3">自定义字段</td>
                </tr>
                ${data.list
                    .map((item) => {
                        return `
                    <tr class="tr-padding-1">
                        <td colspan="3">${item.discountPrice}</td>
                        <td colspan="3">${item.discountPrice}</td>
                        <td colspan="3">${item.freeTotal}</td>
                        <td colspan="3">${item.refundAmount}</td>
                        <td colspan="3">${item.totalPrice}</td>
                        <td colspan="3">${item.taxRateLabel_ || ''}</td>
                        <td colspan="3">${item.taxes || 0}</td>
                        <td colspan="3">${item.taxes || 0}</td>
                    </tr>
                    `;
                    })
                    .join('')}
                <tr>
                    <td colspan="24" class="is-empty no-border"></td>
                </tr>
                <tr>
                    <td colspan="6" class="no-border"></td>
                    <td colspan="9" class="no-border text-align-right">打印人：${
                        data.name || ''
                    }</td>
                    <td colspan="9" class="no-border text-align-right">打印日期：2023012312</td>
                </tr>
            </table>
        `;
    },
};
