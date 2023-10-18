/*jshint esversion: 9 */
import {
    service,
} from "./Request";
import qs from 'qs';

/** 公共网址接口 */
const allApi = {
    list(params){
        return service({
            url:"/website/list",
            method:'get',
            params,
        });
    },
    search(params){
        return service({
            url:"/website/search",
            method:'get',
            params,
        });
    },
    getEngines(params){
        return service({
            url:"/website/engines",
            method:'get',
            params,
        });
    },
    add(params){
        return service({
            url:"/website/add",
            method:'post',
            data:qs.parse(params),
        });
    },
    update(params){
        return service({
            url:"/website/update",
            method:'put',
            data:qs.parse(params),
        });
    },
    delete(id){
        return service({
            url:"/website/"+id,
            method:'delete',
        });
    },
};

export default allApi;