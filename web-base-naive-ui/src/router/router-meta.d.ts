// router-meta.d.ts
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** 路由的标题 */
    title?: string;
    /** 可以生成标签 */
    hasTag?: boolean;
    /** 该标签页面是否缓存 */
    isCache?: boolean;
    /** 该标签页面是否在左边目录上显示 */
    hidden?: boolean;
    /** 表示直接跳转新页面 */
    isLink?: boolean;
    /** 菜单icon图标 */
    iconName?: string;
    /** 标签是否固定 */
    fixed?: boolean;
    /** layout的名称，用作分组 */
    layoutName?: 'main' | 'big-screen';
    /** 重定向的目标 */
    redirectName?: string;
    /** 路由地址，唯一键 */
    path?: string;
    /** 路由全路径 */
    fullPath?: string;
    /** 标签显示的时候是否显示图标 */
    showTagIcon?: boolean;
    /** 菜单显示的详情 */
    content?: string;
    /** 菜单显示的数字 */
    number?: number;
  }
}