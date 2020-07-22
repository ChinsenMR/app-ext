export default {

  loginUrl: '/pages/authorizationLogin/authorizationLogin',
  settingApi: '/api/PublicHandler.ashx?action=GetWebSet',
  bindingUrl: '',
  test: false,
  url: 'https://dlyl.hmeshop.cn',
  // url: 'http://192.168.3.86:8091',
  // test_domain: 'http://192.168.3.86:8091',
  openid: null,

  appId: 'wx6f27923f569192a7',

  /* 前端控制的开关 */
  IS_OPEN_LIVE: false, // 是否开启直播

  /* 以下变量都是后端给的 */
  IS_ALLOW_USER_APPLY_AFTER_SALE: false, // 判断是否允许用户申请退款 / 售后
  IS_NEED_BIND_MOBILE: false, // 是否需要绑定手机
  IS_NEED_DISTRIBUTOR_AUDIT: false,
  IS_OPEN_POINT_SHOP: false, // 是否打开积分商城

  PROJECT_LOGO: null, // logo
  PROJECT_DOMAIN: null, // 项目域名
  PROJECT_TITLE: null, // 项目名
  PROJECT_THEME: null, // 主题样式
  PROJECT_TOP_MENU: null, // 菜单
  PROJECT_KJ_LOGIN_URL: null, // 控价地址

};