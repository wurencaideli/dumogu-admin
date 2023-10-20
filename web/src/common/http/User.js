/*jshint esversion: 9 */
import {
    service,
} from "./Request";
import qs from 'qs';

/** 公用接口 */
const allApi = {
    login(){
        // return service({
        //     url:"/public/captcha",
        //     method:'get',
        // });
        return Promise.resolve({
            "msg": "操作成功",
            "code": 200,
            "token": "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImJmMmYyMWRlLTUwNzctNDUxNy1hYmRlLTA0NGE4NzNhMzE0ZSJ9.DOnUxWppbtKyJGlvSBZqdExf5hrt0EdWalanz_op7rvyc9v-itJJZXbW0xn_yS5SZfXLYn1BRMlTdxadUmRmAg"
        });
    },
};

export default allApi;