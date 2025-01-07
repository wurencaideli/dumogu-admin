import * as dotenv from 'dotenv';
import path from 'path';
import { serverDir } from './common/dirManage';
import { statSync } from 'fs';

/**
 * 获取环境类型
 * @returns {'production'|'development'}
 */
export function getEnvType() {
    let i = process.argv.findIndex(_ => _ == '--environment');
    if (i != -1) {
        let env = process.argv[i + 1];
        switch (true) {
            case /^(production|pro)$/i.test(env):
                return 'production';
            case /^(development|dev)$/i.test(env):
                return 'development';
        }
    }
    return 'development';
}

/** @type {{PORT:number;SERVER_DATA_DIR:string;WEBS:{path:string;distDir:string;}[]}} */
let processEnv;

/**
 * 获取环境变量
 */
export function getEnv() {
    if (!processEnv) {
        processEnv = {
            PORT: 8000,
            SERVER_DATA_DIR: '',
            WEBS: [],
        };
        // 读取可能的环境变量配置文件
        [
            path.join(serverDir(), '.env'),
            path.join(serverDir(), `.env.local`),
            path.join(serverDir(), `.env.${getEnvType()}`),
            path.join(serverDir(), `.env.${getEnvType()}.local`),
        ].forEach(_ => {
            if (statSync(_, { throwIfNoEntry: false })?.isFile()) {
                /** @type {Record<string,string>} */
                let processEnv_ = {};
                dotenv.config({
                    path: _,
                    processEnv: processEnv_,
                });
                for (let i in processEnv_) {
                    if (/dir$/i.test(i) && !path.isAbsolute(processEnv_[i])) {
                        processEnv_[i] = path.join(path.dirname(_), processEnv_[i]);
                    }
                }
                /** @type {{name:string;path:string;distDir:string}[]} */
                let webs = [];
                for (let i in processEnv_) {
                    if (/^web_/i.test(i)) {
                        let name = processEnv_[i].match(/^web(.*)?(_path|_dist_dir)$/i)[1] || '';
                        if (webs.every(_ => _.name != name)) {
                            webs.push({
                                name,
                                path: '',
                                distDir: '',
                            });
                        }
                        console.log('名字', name);
                        let on = webs.find(_ => _.name == name);
                        if (/path$/i.test(i)) {
                            on.path = processEnv_[i]
                        }
                        if (/dist_dir$/i.test(i)) {
                            on.distDir = processEnv_[i]
                        }
                    }
                }
                Object.assign(processEnv, processEnv_);
                if (webs.length > 0) {
                    processEnv.WEBS = webs;
                }
            }
        });
    }
    return processEnv;
}

/**
 * 是否是生产环境
 */
export function isPro() {
    return getEnvType() === 'production';
}