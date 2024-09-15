/**
 * 模拟数据
 */

export let responseData = {
    rows: [
        {
            name: 'main-index',
            title: '首页',
            content: '(有缓存，并且标签页固定)',
            isCache: true,
            fixed: true,
            iconName: 'all-fill',
            sort: 999,
        },
        {
            title: '系统管理',
            iconName: 'alignleft-fill',
            sort: 998,
            childs: [
                {
                    name: 'menu',
                    title: '菜单管理',
                    isCache: true,
                    content: '用户目录配置',
                    iconName: 'database',
                },
            ],
        },
        {
            name: 'show-list',
            title: '展示列表',
            iconName: 'laptop-check',
            number: 4,
        },
        {
            name: 'show-list-info',
            title: '数据详情',
            hidden: true,
            iconName: 'all-fill',
        },
        {
            name: 'show-list-add',
            title: '数据添加',
            hidden: true,
            iconName: 'Navbar-full',
        },
        {
            name: 'show-list-update',
            title: '数据编辑',
            hidden: true,
            isCache: true,
            content: '(有缓存)',
            iconName: 'Navbar-full',
        },
        {
            name: 'user-list',
            title: '用户列表',
            isCache: true,
            content: '(有缓存)',
            iconName: 'database',
        },
        {
            title: '角色管理',
            iconName: 'alignleft-fill',
            childs: [
                {
                    name: 'role-list',
                    title: '角色列表',
                    isCache: true,
                    content: '(有缓存)',
                    iconName: 'database',
                },
                {
                    title: '可点击父级',
                    path: '/main/show-list/update/erterter',
                    childs: [
                        {
                            name: 'show-list-update',
                            path: '/main/show-list/update/123123',
                            title: '数据编辑 - 测试',
                            iconName: 'plus-square-fill',
                            childs: [
                                {
                                    name: 'show-list-update',
                                    path: '/main/show-list/update/1231233',
                                    title: '数据编辑 - 测试',
                                    iconName: 'plus-square-fill',
                                },
                            ],
                        },
                        {
                            title: '数据编辑 - 测试',
                            iconName: 'plus-square-fill',
                            childs: [
                                {
                                    name: 'show-list-update',
                                    path: '/main/show-list/update/1235123',
                                    title: '数据编辑 - 测试',
                                    iconName: 'plus-square-fill',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: 'icon-list',
            title: 'icon 列表展示',
            isCache: true,
            content: '(有缓存)',
            iconName: 'collection-fill',
            number: 20,
        },
        {
            name: 'mine',
            title: '个人中心',
            isCache: true,
            content: '(有缓存)',
            hidden: true,
            iconName: 'Navbar-full',
        },
        {
            name: 'setup-tag',
            title: '设置标签页',
            isCache: true,
            content: '(有缓存)',
            hidden: false,
            iconName: 'tag',
        },
        {
            name: 'setup-menu',
            title: '目录信息',
            isCache: true,
            content: '(有缓存)',
            hidden: false,
            iconName: 'Directory-tree',
        },
        {
            title: '开源地址',
            iconName: 'git-hub',
            isLink: true,
            path: 'https://github.com/wurencaideli/dumogu-admin',
        },
        {
            title: '一篇文字',
            iconName: 'friendship',
            isLink: true,
            path: 'https://www.dumogu.top/',
        },
        {
            title: '毒蘑菇 - 博客',
            iconName: 'friendship',
            isLink: true,
            path: 'https://blog.dumogu.top/',
        },
        {
            title: '毒蘑菇 - 搜索',
            iconName: 'friendship',
            isLink: true,
            path: 'https://s.dumogu.top/',
        },
        {
            title: '毒蘑菇 - 变量',
            iconName: 'friendship',
            isLink: true,
            path: 'https://var.dumogu.top/',
        },
        {
            title: '站搜搜',
            iconName: 'friendship',
            isLink: true,
            path: 'https://www.zhansousou.com/',
        },
    ],
    code: 200,
    msg: '查询成功',
};
