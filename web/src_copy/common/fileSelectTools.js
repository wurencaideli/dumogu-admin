/**
 * 简单的处理文件选择的工具函数
 */
import mime from 'mime';
/**
 * 文件选择
 *  */
export function chooseFile(params) {
    params = params || {};
    // 是否多选
    let multiple = !!params.multiple;
    // 所选文件类型
    let accept = params.accept;
    return new Promise((r, j) => {
        // 创建隐藏的 input 元素来触发文件选择对话框
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'file';
        hiddenInput.accept = accept;
        if (multiple) {
            hiddenInput.multiple = 'true';
        }
        hiddenInput.style.display = 'none';
        document.body.appendChild(hiddenInput);
        // 当文件选择完成后，获取文件信息并显示在页面上
        hiddenInput.onchange = function (event) {
            let files = event.target.files || [];
            if (multiple) {
                r(files);
            } else {
                r(files[0]);
            }
            // 清除隐藏的 input 元素
            hiddenInput.remove();
        };
        hiddenInput.onabort = function (event) {
            j(event);
        };
        // 触发文件选择对话框
        hiddenInput.click();
    });
}
/**
 * 根据文件名获取文件mime类型
 */
export function getMime(name) {
    return mime.getType(name || '');
}
/**
 * 根据文件名获取文件Extension
 */
export function getMimeExtension(type) {
    return mime.getExtension(type || '');
}
/**
 * 获取文件后缀
 * @param {*} filePath
 */
export function getSuffix(filePath) {
    filePath = filePath || '';
    var startIndex = filePath.lastIndexOf('.');
    if (startIndex != -1) {
        return `.${filePath.substring(startIndex + 1, filePath.length).toLowerCase()}`;
    } else {
        return '';
    }
}
/** 格式化文件大小显示 */
export function formatFileSize(fileSize) {
    //格式化文件大小
    if (!fileSize) return fileSize;
    if (typeof fileSize !== 'number') return fileSize;
    var temp;
    if (fileSize < 1024) {
        return fileSize + 'B';
    } else if (fileSize < 1024 * 1024) {
        temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + 'KB';
    } else if (fileSize < 1024 * 1024 * 1024) {
        temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return temp + 'MB';
    } else {
        temp = fileSize / (1024 * 1024 * 1024);
        temp = temp.toFixed(2);
        return temp + 'GB';
    }
}
/**
 * 格式转换方法
 *  */
export function base64ToFile(base64Data, fileName) {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    return new File([blob], fileName, { type: 'image/jpeg' });
}
