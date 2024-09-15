/**
 * 生成doc文件
 */
import { saveAs } from 'file-saver';
import { generateDocxFile } from './common';
import templateFile from './template.docx?url';

/**
 *
 * 创建一个文档文件
 */
export async function createDoc(option) {
    let imgUrl = option.imgUrl;
    let form = option.form;
    /** 获取二进制字符串 */
    let templateFile_ = await fetch(templateFile).then((_) => _.blob());
    let out = await generateDocxFile(templateFile_, {
        ...form,
        image: imgUrl,
    }).catch((e) => {
        return '';
    });
    if (!out) {
        return;
    }
    saveAs(out, `${new Date().getTime()}.docx`);
}
