# 毒蘑菇 - 管理

使用 vue3 + vite + element-plus，使用 storages-js 管理缓存，使用axios发起请求，pinia全局数据管理。NODE版本14.21.3。

```
npm install
```

目前只做一个模板架子，尽量不涉及业务页面的开发。尽量不使用自动化的插件，能手动调用的就手动调用。

文件命名格式：
    文件夹以首字母小写的驼峰命名。
    js文件以首字母大写的驼峰命名，除了index.js部分文件除外。
    vue组件文件以首字母大写的驼峰命名，除了index.vue部分文件除外文件。

其中的模块代码整体设计思想：
    手动调用为原则，需要使用的才引用，尽量不设置全局引用。
    能手动调用的就手动调用。
    css整体样式和使用的ui库样式分开，用户可自己去修改。
    做到灵活可控，架构合理，减少耦合，代码可读性高。
    一个页面尽量一个文件夹，该页面所需要拆分的组件放在该文件夹里的components文件夹中。
    不仅仅是用的地方多就要拆分，平衡解耦拆分，修改方便性，可读性之间的度。

灵活可控，保证稳定性，什么华丽花哨的不考虑。做到稳如泰山的代码，一眼就能看明白。

[官网DEMO](https://admin.dumogu.top/)
[开源地址](https://github.com/wurencaideli/dumogu-admin)

### 文档如下

#### 路由页面的添加（待完善）
``` javascript
// 文件位置 /src/router/index.js
// 在相应layout路由节点下添加子节点
// path和name为唯一属性
{
    path: 'new-tag-page/:sign',
    component: () => import('@/views/system/newTagPage/index.vue'),
    name: 'new-tag-page',
    meta: { 
        isMenu:true,  //代表该页面属于目录的标签页
    },
}
```

#### 菜单的添加（待完善）
``` javascript
// 文件位置 /src/action/FormatUserData.js
// 在相应目录列表中添加目录节点
// path和name为唯一属性，两者都可选填，标签页的配置会使用此配置（path优先）
/** 
 * name表示对应的系统目录，有name才有此系统目录的权限
 * 有path的可直接跳转
 * 没path的，根据name获取映射的系统菜单属性进行跳转
 * isCache 表示该页面是否缓存
 * hidden 表示该页面是否在左边目录上显示
 * isLink 表示直接跳转新页面
 * fixed  标签页是否固定（固定后不可删除）
 *  */
{
    name:"main-index",
    title:'首页',
    content:'(有缓存，并且标签页固定)',
    isCache:true,
    fixed:true,
    iconName:"all-fill",
}
```

#### 标签页的操作（待完善）
``` javascript
// 文件位置 /src/layout/main/index.vue
// 工具函数位置 /src/layout/main/common/TagListTools.js
// 在相应layout的文件夹内，只负责操作相应layout中出现的标签，每个layout有自己的专属标签数据
import {
    deleteCurrentTag,
    refreshCurrentTag,
    deleteOtherTags,
    deleteLeftTags,
    deleteRightTags,
    getLatelyHisTag,
    updateTag,
    refreshTag,
    deleteTags,
    formatTagsByMenu,
} from "./Common/TagListTools";
// 相应注释在工具函数里
```

