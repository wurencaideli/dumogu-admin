/**
 *  依照模板文件生成word文件
 */

import PizZip from 'pizzip';
import DocxTemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';

function getFileBinaryString(templateFile) {
    return new Promise((resolve, reject) => {
        /** 如果传的是个字符串表示就是二进制字符串 */
        if (typeof templateFile == 'string') {
            resolve(templateFile);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = reject;
        reader.readAsBinaryString(templateFile);
    });
}
// 将图片处理为base64，给模板使用
function convertImgToBase64(url, outputFormat) {
    return new Promise((resolve, reject) => {
        let canvas = document.createElement('CANVAS');
        const ctx = canvas.getContext('2d'),
            img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            canvas = null;
            resolve(dataURL);
        };
        img.onerror = function (e) {
            reject(e);
        };
        img.src = url;
    });
}
/**
 * 将base64格式的数据转为ArrayBuffer
 * @param {Object} dataURL base64格式的数据
 */
function base64DataURLToArrayBuffer(dataURL) {
    const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
    if (!base64Regex.test(dataURL)) {
        return false;
    }
    const stringBase64 = dataURL.replace(base64Regex, '');
    let binaryString;
    if (typeof window !== 'undefined') {
        binaryString = window.atob(stringBase64);
    } else {
        binaryString = Buffer.from(stringBase64, 'base64').toString('binary');
    }
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
}

const imageOpts = {
    // 图片的配置
    centered: false,
    getImage: function (tagValue, tagName) {
        // 将图片转成base64
        // console.log(tagValue);
        return new Promise((resolve) => {
            tagValue = base64DataURLToArrayBuffer(tagValue);
            //   if (typeof tagValue === "string" && base64Regex.test(tagValue)) {
            //       console.log(1);

            return resolve(tagValue);
            //   } else {
            //     convertImgToBase64(tagValue).then(base64 => {
            //       return resolve(base64Parser(base64));
            //     });
            //   }
        });
    },
    // 设置图片宽高，可以根据tagName为每一张图片设置不同宽高
    getSize: function (img, tagValue, tagName) {
        // img是图片Buffer，tagValue是图片初始值，tagName是图片在模板中定义的标签key值
        return [600, 200]; // [宽, 高]
    },
};

export async function generateDocxFile(template, fileData) {
    return new Promise((resolve, reject) => {
        getFileBinaryString(template)
            .then((templateData) => {
                const zip = new PizZip(templateData);
                const doc = new DocxTemplater()
                    .loadZip(zip)
                    .attachModule(new ImageModule(imageOpts)) // 载入模块
                    .compile();
                // 异步填充数据
                doc.resolveData(fileData).then(() => {
                    doc.render();
                    const out = doc.getZip().generate({
                        type: 'blob',
                        mimeType:
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    });
                    //   docxLists.push({ file: out, fileName });
                    resolve(out);
                });
            })
            .catch(reject);
    });
}
