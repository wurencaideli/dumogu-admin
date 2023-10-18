/** 
 * 消息提示的部分方法，目前使用的是elment plus的消息提示，可使用其他替换
 */
import { ElMessage, ElMessageBox } from 'element-plus';

/** 成功的消息 */
export function messageSuccess(...params){
    return ElMessage.success(...params);
};
/** 失败的消息 */
export function messageError(...params){
    return ElMessage.error(...params);
};
/** alert */
export function alert(...params){
    return ElMessageBox.alert(...params);
};
export function confirm(...params){
    return ElMessageBox.confirm(...params);
};