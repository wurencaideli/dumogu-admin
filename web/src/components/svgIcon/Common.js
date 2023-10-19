/**
 * 读取所有imgs下的svg文件
 * 根据文件名区分
 */

/** 读取所有svg文件为字符串 */
const imgSrcList = import.meta.glob('./svgs/**/*.svg',{
    eager:true,
    as: 'raw',
});

/** 文件名对应资源地址 */
export let imgList = Object.keys(imgSrcList).map(item => {
    let name = item.match(/([^/]*?)\.[^/.]+$/)[1];
    return {
        name:name,
        svg:imgSrcList[item],
    };
});
export let imgMap = imgList.reduce((c,i)=>{
    c[i.name] = i.svg;
    return c;
},{});
