/**
 * 简单的json数据库
 * 数据必须以数组存在
 */
const uuidTools = require('./uuidTools');
const fileTools = require('./fileTools');
const copyDefaultsTools = require('./copyDefaults');

/**
 * 创建一个数据源
 */
class jsonDB {
    /** 定义唯一id字段，内部使用 */
    fieldId = '__id__';
    constructor(jsonPath, config) {
        this.jsonPath = jsonPath;
        this.config = config;
        /** db操作必须有一个唯一id，内部使用 */
        this.config.__id__ = {
            default: () => {
                return uuidTools.createUuid();
            },
        };
        this.list = []; //数据源，不建议直接访问，建议调用list();
    }
    /** 初始化 */
    async init() {
        /** 读取 */
        let list = await fileTools.readFile(this.jsonPath).catch(() => {
            return [];
        });
        try {
            list = JSON.parse(list);
            if (!Array.isArray(list)) {
                list = [];
            }
        } catch {
            list = [];
        }
        /** 校验必要的属性 */
        list = list.map((item) => {
            return this.format(item);
        });
        this.list = list;
    }
    /**
     * 去除掉一些不需要的键，以及初始化一些默认的值
     *  */
    format(data) {
        return copyDefaultsTools.copyDefaults({}, data, this.config, {
            strict: true,
        });
    }
    /** 返回数据列表 */
    list() {
        return this.list;
    }
    /** 数据过滤，外部调用过滤掉一些不需要的数据 */
    filterList(fn) {
        this.list = this.list.filter((item) => {
            return fn(item);
        });
    }
    /** 将缓存写入文件中，首先需要格式化一遍 */
    async refreshLocal() {
        this.list = this.list.map((item) => {
            return this.format(item);
        });
        return fileTools.outputFile(this.jsonPath, JSON.stringify(this.list, null, 2));
    }
    /** 添加一个数据 */
    async add(data) {
        if (this.list.find((item) => item.__id__ === data.__id__)) {
            throw '添加失败: 重复实例';
        }
        data = this.format(data);
        this.list.push(data);
        await this.refreshLocal();
    }
    /** 更新一个数据 */
    async update(instance, data) {
        let target = this.list.find((item) => item.__id__ == instance.__id__);
        if (!target) {
            throw '修改失败: 未找到相应实例';
        }
        Object.assign(target, data);
        await this.refreshLocal();
    }
    /** 删除个体，参数是实例 */
    async delete(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }
        const signMap = {};
        data.forEach((item) => {
            signMap[item.__id__] = true;
        });
        this.list = this.list.filter((item) => {
            return !signMap[item.__id__];
        });
        await this.refreshLocal();
    }
}

module.exports = jsonDB;
