## 毒蘑菇 - 管理

#### 毒蘑菇后台管理，最基础的后台模板

开源地址 https://github.com/wurencaideli/dumogu-admin

线上DEMO https://admin.dumogu.top/
线上DEMO-Base https://admin.dumogu.top/base

吐槽地址 https://txc.qq.com/products/613546

包含后端服务，前端。前端采用vue3，vite，element-plus，axios，pinia，storages-js，各种小工具库啥的，不采用ts。后端部分还没开始搭建。

dumogu-admin，制作最简易的管理端架子，没有什么弯弯绕绕的结构设计，没有什么奇奇怪怪的全局挂载，复制一个文件到其他项目还要考虑到全局有什么文件需要去复制，我直接该文件引用了什么就去复制什么，多直接呀。很多功能都是手动调用的形式。

代码风格都是使用4个空格换行，除了方法结尾，都用分号，不使用什么vue的复杂指令，一切尽量以手动调用为主，我调用什么就有什么效果，不要什么自动啥的啥的，反正怎么合理怎么来。

基本上一个模块对应的文件夹下都有README.md文件，表示这个文件夹的作用。

web端部分截图

![毒蘑菇-admin](https://dumogu-blog.oss-cn-chengdu.aliyuncs.com/59201be006b90d27d9a4a2593ad074fe-%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231031173940.png)

![毒蘑菇-admin](https://dumogu-blog.oss-cn-chengdu.aliyuncs.com/dde33601e6a4a849cdf62de84e58f915-%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231031174007.png)

![毒蘑菇-admin](https://dumogu-blog.oss-cn-chengdu.aliyuncs.com/ebba32b5cb504ef6da937f49da897814-%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231031174037.png)

![毒蘑菇-admin](https://dumogu-blog.oss-cn-chengdu.aliyuncs.com/632ae264a67a60056db2bb1d00628942-%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231031174104.png)

![毒蘑菇-admin](https://dumogu-blog.oss-cn-chengdu.aliyuncs.com/e3a21809fcbb35ce869c5d39b02de4de-%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231031174137.png)

![毒蘑菇-admin](https://dumogu-blog.oss-cn-chengdu.aliyuncs.com/3b8686143206431df6ffe2081602aea2-%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231031174206.png)

![毒蘑菇-admin](https://dumogu-blog.oss-cn-chengdu.aliyuncs.com/1aae8f6d5aa047e17c1eb03918c69473-%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231031174243.png)