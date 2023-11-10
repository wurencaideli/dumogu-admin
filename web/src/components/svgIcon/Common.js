/**
 * 读取所有imgs下的svg文件
 * 根据文件名区分
 */

/** 读取所有svg文件为字符串 */
const svgIconObj = import.meta.glob('./svgs/**/*.svg',{
    eager:true,
    as: 'raw',
});
const svgIconList = Object.keys(svgIconObj).map(item => {
    let name = item.match(/([^/]*?)\.[^/.]+$/)[1];
    return {
        type:'svg',
        name:name,
        svg:svgIconObj[item],
    };
});
/** 读取所有以资源引入的文件 */
const imgIconObj = import.meta.glob('./imgs/**/*.*',{
    eager:true,
});
const imgIconList = Object.keys(imgIconObj).map(item=>{
    item = imgIconObj[item];
    if(!item) return {};
    let src = item.default;
    let name = src.match(/([^/]*?)\.[^/.]+$/)[1];
    return {
        type:'img',
        name:name,
        src:src,
    };
});

/**
 * 导出所有的icon
 */
export const iconList = [
    ...svgIconList,
    ...imgIconList,
];
/**
 * 导出所有的icon name map 方便使用
 * icon 不是很多，使用obj当map方便许多
 */
export const iconNameMap = iconList.reduce((c,i)=>{
    c[i.name] = i;
    return c;
},{});