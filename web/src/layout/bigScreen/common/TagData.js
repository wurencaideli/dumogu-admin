/** 
 * 储存tag的数据
 * 管理小型数据
 */
import { 
    reactive,
} from 'vue';

/** 数据源 */
const TagData = {
    tagList:[],  //标签列表
    activeSign:'',  //当前活动的标签唯一标识
    /** 写入tagData */
    setTagList(value){
        this.tagList = value || [];
    },
    /** 写入当前活动的 */
    setActiveSign(value){
        this.activeSign = value || '';
    },
};

export default reactive(TagData);