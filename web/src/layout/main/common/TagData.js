/** 
 * 储存tag的数据
 * 管理小型数据，刚好适用于管理当前layout的数据
 */
import { 
    reactive,
} from 'vue';
import allStorage from "@/action/StorageManage";

/**
 * 优先使用缓存中的数据
 */
const mainTagListStorage = allStorage.mainTagListStorage();
let tagList = mainTagListStorage.value;
if(!Array.isArray(tagList)) {
    tagList = [];
}
/** 数据源 */
const TagData = {
    tagList:tagList,  //标签列表
    activeSign:'',  //当前活动的标签唯一标识
    tagHisList:[],  //标签历史列表，记录标签历史添加列表
    iframeList:[],  //iframe 数组，iframe也属于标签，跟标签挂钩
    /** 写入tagData */
    setTagList(value){
        this.tagList = value || [];
        /** 存入缓存 */
        mainTagListStorage.value = value;
    },
    /** 写入当前活动的 */
    setActiveSign(value){
        this.activeSign = value || '';
    },
    /** 写入标签历史列表，用来删除切换上一个标签时更加人性化一点 */
    setTagHisList(value){
        this.tagHisList = value || [];
    },
    /**
     * 当标签为内联链接时有用
     */
    setIframeList(value){
        this.iframeList = value || [];
    },
};

/**
 * 一个标签的属性如下
 * 其中sign是唯一标识，很重要，必填 
 * menuName 必填表示对应的系统目录，有name才有此系统目录的权限
 * 有path的可直接跳转
 * 没path的，根据name获取映射的系统菜单属性进行跳转
 * isCache 表示该页面是否缓存
 * hidden 表示该页面是否在左边目录上显示
 * isLink 表示直接跳转新页面
 * */

export default reactive(TagData);