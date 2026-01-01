import { ElMessage, ElMessageBox } from 'element-plus';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';

/** 成功的消息 */
export function messageSuccess(...params) {
    return ElMessage.success(...params);
}
/** 失败的消息 */
export function messageError(...params) {
    return ElMessage.error(...params);
}
/** alert */
export function alert(...params) {
    return ElMessageBox.alert(...params);
}
export function confirm(...params) {
    return ElMessageBox.confirm(...params);
}
export function prompt(...params) {
    return ElMessageBox.prompt(...params);
}
