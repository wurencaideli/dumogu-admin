/**
 * 公用的打印 html 模板
 * https://doc.weixin.qq.com/sheet/e3_ADcA3AaFABEHqe6xH6hRS2PAJxUA5?scode=AE8AoAcPAAkXqWbExyAEwARAZtAP8&force_open_in_wx=1&tab=njh55v
 */

import printJs from 'print-js';

// 基础css
export const baseCss = `
    body{
        height:auto;
        padding:0.3cm 0.1cm 0.9cm 0.1cm;
        box-sizing:border-box;
    }
    /* 页眉样式 */
    .print-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 0.9cm;
        font-size: 0.3cm;
        font-weight: bold;
        padding: 0 0.4cm;
        box-sizing:border-box;
        display: flex;
        align-items: center;
    }
    /* 页脚样式 */
    .print-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 0.9cm;
        font-size: 0.3cm;
        font-weight: bold;
        padding: 0 0.4cm;
        box-sizing:border-box;
        display: flex;
        align-items: center;
    }
    .print-table-container{
        width: 100%;
        page-break-after:always; 
        font-family: fangsong;
    }
    .print-table-container .table-title{
        font-size:0.6cm;
        font-weight: bold;
        padding: 0px 0.3cm 0.4cm 0.3cm;
    }
    table.print-table-container {
        font-family: verdana,arial,sans-serif;
        font-size:0.3cm;
        color:#000000;
        border-width: 0px;
        border-color: #000000;
        border-collapse: collapse;
    }
    table.print-table-container th {
        border-width: 0.03cm;
        padding: 0.09cm;
        border-style: solid;
        border-color: #000000;
        background-color: #dedede;
        word-break: break-all;
        vertical-align: top;
    }
    table.print-table-container td {
        border-width: 0.03cm;
        padding: 0.09cm 0.1cm;
        border-style: solid;
        border-color: #000000;
        background-color: #ffffff;
        font-size:0.3cm;
        word-break: break-all;
        vertical-align: top;
    }
    tr {
        page-break-inside: avoid;
    }
    .tr-padding-1 td{
        padding: 0.1cm 0.1cm !important;
    }
    .tr-padding-1 th{
        padding: 0.3cm 0.1cm !important;
    }
    .text-align-right{
        text-align: right;
    }
    .text-align-left{
        text-align: left;
    }
    .text-align-center{
        text-align: center;
    }
    .text-v-align-center{
        vertical-align: middle !important;
    }
    .no-border{
        border-width:0px !important;
    }
    .is-empty{
        height:0.473cm;
    }
    .is-empty-1{
        height:0.157cm;
    }
    .is-empty-2{
        height:1.578cm;
    }
    .is-warning{
        color:red;
    }
    .is-weight{
        font-weight: bold;
    }
    .th-24-v{
        width: calc(100% / 24);
        border-width:0px !important;
        height:0;
        overflow: hidden;
    }
    .th-48-v{
        width: calc(100% / 48);
        border-width:0px !important;
        height:0;
        overflow: hidden;
    }
`;

/**
 * 打印操作
 */
export function handlePrint(data) {
    data = data || {};
    printJs({
        type: 'raw-html',
        printable: data.html,
        style: data.css,
        header: '',
        targetStyles: ['*'],
        ignoreElements: ['no-print', 'bc', 'gb'],
    });
}
