import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [


  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        name: 'home',
        path: '/home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },



  // 轨迹平台页面路由   start

  {
    name: 'baseMaterial',
    path: '/baseMaterial',
    meta: {
      icon: 'logo-buffer',
      title: '基础资料',
      showAlways: true,
      notCache: true
    },
    component: Main,
    children: [
      {
        name: 'traceCycleQueryPage',
        path: '/traceCycleQueryPage',
        meta: {
          icon: 'md-apps',
          title: '轨迹环节维护',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      },
      {
        name: 'traceNodeQueryPage',
        path: '/traceNodeQueryPage',
        meta: {
          icon: 'md-apps',
          title: '轨迹节点维护',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceNode/traceNodeQueryPage.vue')
      },
      {
        name: 'standardTraceQueryPage',
        path: '/standardTraceQueryPage',
        meta: {
          icon: 'md-apps',
          title: '标准轨迹维护',
          notCache: true
        },
        component: () => import('_p/baseMaterial/standardTrace/standardTraceQueryPage.vue')
      }
    ]
  },


  {
    name: 'ruleConfig',
    path: '/ruleConfig',
    meta: {
      icon: 'logo-buffer',
      title: '规则配置',
      showAlways: true,
      notCache: true
    },
    component: Main,
    children: [
      {
        name: 'logisticsProductRuleQueryPage',
        path: '/logisticsProductRuleQueryPage',
        meta: {
          icon: 'md-apps',
          title: '物流产品规则配置',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      },
      {
        name: 'logisticsChannelRuleQueryPage',
        path: '/logisticsChannelRuleQueryPage',
        meta: {
          icon: 'md-apps',
          title: '物流渠道规则配置',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      },
      {
        name: 'agent2standardTraceMappingQueryPage',
        path: '/agent2standardTraceMappingQueryPage',
        meta: {
          icon: 'md-apps',
          title: '服务商->标准轨迹映射',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      },
      {
        name: 'standard2customerTraceMappingQueryPage',
        path: '/standard2customerTraceMappingQueryPage',
        meta: {
          icon: 'md-apps',
          title: '标准轨迹->客户轨迹映射',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      }
    ]
  },


  {
    name: 'traceQuery',
    path: '/traceQuery',
    meta: {
      icon: 'logo-buffer',
      title: '轨迹查询',
      showAlways: true,
      notCache: true
    },
    component: Main,
    children: [
      {
        name: 'innerTraceQueryPage',
        path: '/innerTraceQueryPage',
        meta: {
          icon: 'md-apps',
          title: '轨迹查询（内部）',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      },
      {
        name: 'codeTraceQueryPage',
        path: '/codeTraceQueryPage',
        meta: {
          icon: 'md-apps',
          title: '单号轨迹列表',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      }
    ]
  },


  {
    name: 'operateMonitor',
    path: '/operateMonitor',
    meta: {
      icon: 'logo-buffer',
      title: '运营与监控',
      showAlways: true,
      notCache: true
    },
    component: Main,
    children: [
      {
        name: 'manualAddTraceQueryPage',
        path: '/manualAddTraceQueryPage',
        meta: {
          icon: 'md-apps',
          title: '手工补录轨迹',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      },
      {
        name: 'exceptionTraceQueryPage',
        path: '/exceptionTraceQueryPage',
        meta: {
          icon: 'md-apps',
          title: '异常轨迹列表',
          notCache: true
        },
        component: () => import('_p/baseMaterial/traceCycle/traceCycleQueryPage.vue')
      },
      {
        name: 'waitStandardTraceQueryPage',
        path: '/waitStandardTraceQueryPage',
        meta: {
          icon: 'md-apps',
          title: '待标准化轨迹列表',
          notCache: true
        },
        component: () => import('_p/operateMonitor/waitStandardTrace/waitStandardTraceQueryPage.vue')
      }
    ]
  },



  // 轨迹平台页面路由   start












  {
    name: 'i18n',
    path: '/i18n',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        name: 'i18n_page',
        path: 'i18n_page',
        meta: {
          icon: 'md-planet',
          title: 'i18n - {{ i18n_page }}'
        },
        component: () => import('@/view/i18n/i18n-page.vue')
      }
    ]
  },
  {
    name: 'argu',
    path: '/argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        name: 'params',
        path: 'params/:id',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        name: 'query',
        path: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    name: 'error_401',
    path: '/401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    name: 'error_500',
    path: '/500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    name: 'error_404',
    path: '*',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
