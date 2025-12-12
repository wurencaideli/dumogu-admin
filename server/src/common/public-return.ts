/**
 * 公共的json返回体
 * 200 请求成功
 * 202 已知的错误
 * 203 访问拦截错误
 * 401 凭证失效，需要重新获取
 * 500 系统错误
 *  */
export class publicReturn {
    status: number = 200;
    msg: string | undefined = '';
    data: any = null;
    constructor(status: number, msg?: string, data?: any) {
        this.status = status;
        this.msg = msg;
        this.data = data;
    }
}
