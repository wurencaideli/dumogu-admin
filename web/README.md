# 毒蘑菇 - 管理

使用 vue3 + vite + element-plus，使用 storages-js 管理缓存，使用axios发起请求，pinia全局数据管理。NODE版本14.21.3。

```
npm install
```

目前只做一个模板架子，尽量不涉及业务页面的开发。尽量不使用自动化的插件，能手动调用的就手动调用。

文件命名格式：首字母小写的驼峰命名。

其中的模块代码整体设计思想：
    手动调用为原则，需要使用的才引用，尽量不设置全局引用。
    能手动调用的就手动调用。
    css整体样式和使用的ui库样式分开，用户可自己去修改。
    做到灵活可控，架构合理，减少耦合，代码可读性高。
    一个页面尽量一个文件夹，该页面所需要拆分的组件放在该文件夹里的components文件夹中。
    不仅仅是用的地方多就要拆分，平衡解耦拆分，修改方便性，可读性之间的度。

灵活可控，保证稳定性，什么华丽花哨的不考虑。做到稳如泰山的代码，一眼就能看明白。

[官网DEMO](https://admin.dumogu.top/)

[开源地址](https://github.com/wurencaideli/dumogu-admin/web)

### 文档如下

#### 路由的添加（待完善）
``` javascript
/**
 * 为路由配置meta相当于为该路由配置了基本信息，配置的属性如下
 * title 用作标签显示字样的字段
 * hasTag 可以生成标签
 * isCache 该标签页面是否缓存
 * hidden 该标签页面是否在左边目录上显示
 * isLink 表示直接跳转新页面
 * iconName 菜单icon图标
 * fixed 标签是否固定
 * layoutName layout的名称，用作分组
 * redirectName 重定向的目标
 * path 路由地址，唯一键
 * fullPath
 * showTagIcon 标签显示的时候是否显示图标
 * content 菜单显示的详情
 * number 菜单显示的数字
 */
{
    path: 'new-tag-page/:sign',
    component: () => import('@/views/system/newTagPage/index.vue'),
    name: 'new-tag-page',
    meta: { 
        layoutName: 'main',
        redirectName: 'main-redirect',
        title: '新标签',
        hasTag: true,
    },
}
```

#### 菜单的添加（待完善）
``` javascript
/** 
 * path和name为唯一属性，两者都可选填，标签页的配置会使用此配置（path优先）
 * 用作权限验证以及独立配置路由信息，优先级高于路由的meta配置
 * 需要配置的属性与路由的meta的属性一致
 *  */
{
    name:"main-index",
    title:'首页',
    content:'(有缓存，并且标签页固定)',
    isCache:true,
    fixed:true,
    iconName:"all-fill",
    hasTag: true,
}
```
