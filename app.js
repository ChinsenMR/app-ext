import config from './config'
import tools from './utils/tools/index'
import {
  mapToData
} from './utils/store/index';
import mixins from './utils/mixins/index'

import fjhApi from './utils/fjh-api'

import {
  getUserInfo,
  getOpenId,
  getMemberByOpenId,
  getSetting
} from './utils/requestApi'

const template = require('template/template.js');
// const livePlayer = requirePlugin('live-player-plugin');
const $store = require('./stores/index');
const wxParse = require('./wxParse/wxParse')

App({
  mapToData,
  $store,
  wxParse,
  onLaunch() {
    {
      /* 
        ！！！注意，这里注入了一些拓展的库，开关只有这一行代码
        app下注入了以下方法
          alert,tools,cache,verify,$api,$page,$request
        实例
          app.alert.toast(); app.verify.email('www.xxx@qq.com')
        tools/request是一个业务范围比较广的请求体封装
          1 解决了重复跳转登录页的问题
          2 如果未登录，且当前页面有N个接口调用，那么只要有一个需要登录，执行顺序次之的接口将被拦截
          3 兼容了后端多个版本的返回结果处理，如果发现新的，欢迎到tools/request.js加入
          4 正常的请求调用，结果处理
          5 console定位，没调用一个接口在打印台可以看到常用的信息，以便后端，测试人员也能定位bug
          6 集中处理了后端返回的状态值，{ errorMsg: "请求成功" success: true }
          7 使用：app.$api.getList().then(res => {})
        mixins, store, tools, wxs这几个文件夹有问题找Chinsen
     */
      tools.init(this)
    }

    /* 检查版本更新 */
    this.checkNewVerison()
    /* 获取默认主题模板 */
    this.getDefaultModel();
    /* 获取系统信息 */
    this.getAppSystemInfo();
    /* 获取openid及 */
    this.getOpenId();



  },

  onShow(options) {

    const {
      query,
      scene
    } = options;
    this.storeReferralUserId(query);

    if (this.data.IS_OPEN_LIVE) {
      this.getShareParams({
        room_id: query.room_id,
        scene: scene,
      });
    }

  },

  /* 获取用户openId */
  getOpenId() {
    const that = this;
    wx.login({ // 获取code换取openid
      success(res) {
        if (res.code) {
          //发起网络请求
          getOpenId({
            appid: that.data.appId,
            js_code: res.code
          }).then(res => {
            that.data.sessioKey = res.session_key;
            that.data.openid = res.openid;
            wx.setStorageSync('openid', res.openid);
          })

        } else {
          console.log('登录失败' + res.errMsg);
        }
      }
    })
  },
  /* 获取直播分享分享者的信息 */
  getShareParams(params) {
    const that = this;
    livePlayer.getShareParams(params).then(res => {
      that.globalData.roomId = res.room_id || ''

      that.globalData.share_openid = res.share_openid;

      if (!res.share_openid) return
      console.log("获取分享者openid", res.share_openid);

      getMemberByOpenId({
        OpenId: res.share_openid
      }).then(res => {
        if (res.data.Status == "Success") {
          const {
            UserId
          } = res.data.Data;
          that.data.share_userid = UserId
        }
      })

    }).catch(err => {
      // console.log('获取直播信息失败', err)
    })
  },

  // 获取用户信息
  getUserInfo() {
    getUserInfo().then(res => {
      wx.setStorageSync("userInfo", res.data.Data)
    })
  },

  /* 切换不用的样式 */
  getDefaultModel() {
    const that = this;
    that.alert.loading()
    wx.request({
      url: that.data.url + that.data.settingApi,
      success(res) {
        that.alert.closeLoading();

        const {
          Result: {
            SiteLogo,
            SiteName,
            SiteUrl,
            TopMenus,
            WapTheme,
            SiteSettings: {
              AfterSale,
              IsBindPhone,
              IsDistributorAudit
            }
          }
        } = res.data;

        // 详细注释请移步config.js查看
        that.data.IS_ALLOW_USER_APPLY_AFTER_SALE = !AfterSale;
        that.data.IS_NEED_BIND_MOBILE = IsBindPhone;
        that.data.IS_NEED_DISTRIBUTOR_AUDIT = IsDistributorAudit;
        that.data.PROJECT_LOGO = SiteLogo;
        that.data.PROJECT_DOMAIN = SiteUrl;
        that.data.PROJECT_TOP_MENU = TopMenus;
        that.data.PROJECT_TITLE = SiteName;
        that.data.PROJECT_THEME = WapTheme;

        const tabIndexOfCart = TopMenus.findIndex(v => v.Name === '购物车');
        //获取购物车的索引值,为了加入购物车的动画需要索引值
        wx.setStorageSync('cartTabIndex', tabIndexOfCart);

      }
    })
  },

  /* 检查新版本 */
  checkNewVerison() {
    //判断时候需要更新新版小程序
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本',
              content: '新版本已经上线啦~，请删除当前小程序，重新搜索打开'
            })
          })
        }
      })
    }
  },

  /* 获取手机信息 */
  getAppSystemInfo() {

    wx.getSystemInfo({
      success: res => {
        // console.log("获取手机信息",res);
        let titleBarHeight
        let system = res.system;
        //胶囊高度32px
        if (system.indexOf("iOS") > -1) {
          //ios手机标题栏高度
          titleBarHeight = 44
        }
        if (system.indexOf("Android") > -1) {
          //安卓手机标题栏高度
          titleBarHeight = 48
        }
        this.data.navHeight = titleBarHeight + res.statusBarHeight;
        this.data.statusBarHeight = res.statusBarHeight;
      }
    })
  },

  /* 存储绑定上下级id */
  storeReferralUserId(query) {
    const scene = decodeURIComponent(query.scene)

    const optList = this.getQueryVariable(scene, 'opt') || query.opt;
    const agentId = this.getQueryVariable(scene, 'agentId');

    query.agentId = agentId || (optList && optList.split(',')[0])

    /* 存储 agentId */
    if (query.agentId) {
      this.globalData.agentId = query.agentId;
      console.log(this.globalData.agentId, 'app--agentId')
    }
  },


  globalData: {
    template: template,
    GetMembersInfo: wx.getStorageSync('userInfo'),
    share_openid: "",
    roomId: '', //直播房间id
    agentId: null
  },

  data: {
    ...config,
    cookie: null, // cookie
    navHeight: null, // 导航栏高度
    statusBarHeight: null, // 状态栏高度
    userInfo: null, // 用户信息
    imgurl: 'https://img.hmeshop.cn/hmeshop_jxy/images/',
    share_userid: null, //直播间分享者的userid,用于绑定当前使用的上级
    sessioKey: null,
    roomid: '', //从商品详情将该值存入全局,用于是直播间数据时带上
    cartNum: 0, //购物车总条数
    sku: null, // 商品规格
  },
  ...mixins,
  ...fjhApi,
})