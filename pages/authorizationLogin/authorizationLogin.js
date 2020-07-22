const app = getApp();
import {
  getUnionId,
  authorizationLogin,
  getMemberData
} from '../../utils/requestApi';
import {
  bindReferralUserId
} from '../../utils/util'

Page({
  data: {
    projectLogo: null,
    userid: null, //用户id
    unionId: null, // 公众号与小程序关联的ID
    userInfo: {}, // 用户信息
    params: {
      fromType: '', // 特殊操作专用
      callback: '' // 回调路径
    },
  },

  onLoad(options) {

    /* 登录直播id */
    if (app.data.share_userid) {
      this.setData({
        userid: app.data.share_userid
      })
    }

    this.setData({
      params: options,
      projectLogo: app.data.PROJECT_LOGO
    }),
    console.log()
  },
  bindReferralUserId,
  /**
   *授权 
   **/
  bindGetUserInfo(e) {
    
    const {
      userInfo: {
        nickName,
        avatarUrl
      },
      errMsg
    } = e.detail;

    this.setData({
      userInfo: {
        nickName,
        avatarUrl
      }
    })

    this.getUserInfo()
  },
  /* 获取后端解密后的 */
  getUnionId(params) {
    getUnionId(params).then(res => {
      if (res.Status == "Success") {
        this.setData({
          unionId: res.UnionId
        })
        this.authorizationLogin()
      } else {
        app.alert.toast(res.Message)
      }
    })
  },

  /* 获取UnionId及用户信息 */
  getUserInfo() {
    const that = this;
    wx.getSetting({
      success: (response) => {
        if (response.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              const params = {
                action: 'GetUnionId', //	是	string	GetUnionId
                encryptedData: res.encryptedData, //	是	string	解密参数
                iv: res.iv, //	是	string	解密参数
                session_key: app.data.sessioKey, //	是	string	解密参数
              }

              that.getUnionId(params)

            }
          })
        }
      }
    })
  },
  /* 登录成功后根据状态判断要何去何从 */
  handleAfterLoginCallback() {
    const {
      params: {
        fromType,
        callback
      }
    } = this.data;

    if (fromType) {
      switch (fromType) {
        /* 从绑定代理页面过来 */
        case 'bindAgent':
          app.tools.goBackTimeOut(3);
          break;
        default:
          app.tools.goBackTimeOut(2);
      }

    } else if (callback) {
      wx.redirectTo({
        url: `/${callback}`,
      })
    } else {
      app.tools.goBackTimeOut();
    }
  },
  /* 最终登录接口 */
  authorizationLogin() {

    const {
      userInfo,
      userid = '',
      scene = '',
      unionId
    } = this.data;

    const ajaxData = {
      ...userInfo,
      openId: app.data.openid || '', //this.data.openid
      openType: 'hmeshop.plugins.openid.wxapplet',
      UnionId: unionId || '',
      referralUserId: scene || userid || '',
      KjCustomId: wx.getStorageSync('KjCustomId') || '', //绑定代理
    };

    app.alert.loading('登录中...')

    authorizationLogin(ajaxData).then(res => {

      app.alert.closeLoading();

      const {
        Status,
        Cookie,
        Data,
        Message
      } = res;

      /* 失败的处理 */
      if (Status !== 'Success') {
        return app.alert.message(Message)
      }

      /* 如果系统需要绑定手机号 */
      if (app.data.IS_NEED_BIND_MOBILE) {
        app.cache.set('_cookie_temp', Cookie, () => {
          app.goPage({
            url: app.data.binding_url
          })
        })
      } 
      /* 默认已经登录成功 */
      else {
        
        app.alert.success('登录成功');

        /* 存储cookie并获取用户信息 */
        app.cache.set('cookie', Cookie, () => {
          /* 获取用户信息 */
          this.getMemberData();

          /* 绑定上下级关系 */
          this.bindReferralUserId()
        })

        /* 登陆之后处理路由 */
        this.handleAfterLoginCallback()
      }

      /* 获取系统配置 */
      app.getDefaultModel();     
    })

  },

  /* 获取会员信息 */
  getMemberData() {
    getMemberData().then(res => {
      const {
        Status,
        Data
      } = res.data;

      if (Status === "Success") {
        wx.setStorageSync("userInfo", Data);
      }
    })
  },


  /* 回到首页 */
  goBackHome() {
    wx.navigateTo({
      url: '/pages/moduleHome/moduleHome',
    });
  }


})