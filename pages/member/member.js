// pages/member/member.js
import {
  getMemberData,
  getindexsharedata,
  getUnionId,
  handleOnSign
} from "../../utils/requestApi";
const app = getApp();
const imgurl2 = "http://hmqy.oss-cn-hangzhou.aliyuncs.com/hmeshop_jxy/images/"
Page({

  data: {
    imgUrl: imgurl2,
    tabIndex: null, //底部导航栏的索引值
    show: false, //是否显示code组件
    code: 'http://img.hmeshop.cn/hmeshop_jxy/images/icon_share@2x (1).png', //二维码路径
    path: "/pages/member/member", //
    vipcardInfo: null, //vip
    Sharestaue: false, //二维码
    SignInpoints: null, //签到分
    SignInmask: false, //签到梦成
    newsData: {},
    imgurl: app.data.imgurl,
    userInfo: {}, //用户信息
    showAccount: true,
    signIn: '点击签到',
    memberpoint: 0,
    showcard: false,
    showmask2: false,
    showmask3start: false,
    showmask2start: false,
    nowcreat: false,
    animationData: {}, //空动画对象属性
    tabHide: true,
    userid: '', //用户id
    ceshiList: [],
    userRepository: [{
        text: '预计收益',
        url: "profitDetail"
      },
      {
        text: '累计佣金',
        url: "commission"
      },
      {
        text: '可用余额',
        url: "myAccount"
      },
      {
        text: '已提现',
        url: "cashDetail"
      }
    ],
    // 会员中心
    // 1
    myorderBox: [{
        imgurl: imgurl2 + 'icon_df@2x.png',
        text: '待付款',
        color: '#333333'
      },
      {
        imgurl: imgurl2 + 'icon_dfh@2x.png',
        text: '待发货',
        color: '#333333'
      },
      {
        imgurl: imgurl2 + 'icon_dsh@2x.png',
        text: '待收货',
        color: '#333333'
      },
      {
        imgurl: imgurl2 + 'icon_dpj@2x.png',
        text: '待评价',
        color: '#333333'
      },
      {
        imgurl: imgurl2 + 'icon_qbdd@2x.png',
        text: "全部订单",
        color: '#FF3333'
      }
    ],
    // 2
    memberCenter: [{
        imgurl: imgurl2 + "icon_youhuiquan2.png",
        text: '积分',
        url: "/packageA/pages/Myintegral/Myintegral",
        status: true
      },
      {
        imgurl: 'https://img.hmeshop.cn/hmeshopV3/Storage/master/202007161727583955150.png',
        text: '积分商城',
        url: "/subPackageD/pages/myPoint/index",
        status: false
      },
      {
        imgurl: imgurl2 + 'icon_youhuiquan.png',
        text: '优惠券',
        url: "/packageA/pages/MyCoupon/MyCoupon",
        status: true
      },
      {
        imgurl: imgurl2 + 'icon_zb@2x.png',
        text: '直播专区',
        url: "/packageA/wjx/broadcast/broadcast",
        status: true
      },
      {
        imgurl: imgurl2 + 'icon_zb@2x(1).png',
        text: '直播体验',
        url: "/subPackageC/entranceMenu/index",
        status: true
      },
      {
        imgurl: imgurl2 + 'icon_pt@2x.png',
        text: '我的拼团',
        url: "/pages/groupDetailsList/groupDetailsList",
        status: true
      },
      {
        imgurl: imgurl2 + "icon_sc@2x.png",
        text: "收藏",
        url: "/packageA/pages/MyCollection/MyCollection",
        status: true
      }, {
        imgurl: imgurl2 + 'icon_address@2x.png',
        text: '收货地址',
        url: "/pages/receivingAddress/receivingAddress",
        status: true
      },
      {
        imgurl: imgurl2 + 'icon_dy@2x.png',
        text: '订阅消息',
        url: "/packageA/wjx/subscribe/subscribe",
        status: true
      },
      {
        imgurl: imgurl2 + 'xiaoweishangh1.png',
        text: '小微商户',
        url: "/packageA/wjx/enterprises/enterprises",
        status: true
      },
      {
        imgurl: imgurl2 + 'zhibo2.png',
        text: '程序',
        url: "/packageA/wjx/goToH5/goToH5",
        status: false
      },
      // 合并1 推广模块
      {
        imgurl: imgurl2 + "icon_dd@2x.png",
        text: '分销订单',
        url: "/pages/distributeOrder/distributeOrder?pageType=2",
        status: true
      },
      {
        imgurl: imgurl2 + 'icon_xs@2x.png',
        text: '分销下属',
        url: "/pages/distributeSub/distributeSub?type=1",
        status: true
      },
      {
        imgurl: imgurl2 + "icon_sj@2x.png",
        text: '直属上级',
        url: "/packageA/pages/Directsuperiors/Directsuperiors",
        status: true
      },
      {
        imgurl: imgurl2 + "icon_pd@2x22.png",
        text: '拼团订单',
        url: "/packageA/wjx/distribution/distribution",
        status: true
      },
      //合并2 代理模块
      {
        imgurl: imgurl2 + 'icon_cangku_05.png',
        text: '我的云仓',
        url: "/pages/cloudWarehouse/cloudWarehouse",
        status: true
      },
      {
        imgurl: imgurl2 + 'icon_cangku_05.png',
        text: '店铺资质',
        url: "/subPackageD/pages/shopQualification/index",
        status: true
      },
      {
        imgurl: imgurl2 + 'xinxi_icon.png',
        text: '代理信息',
        url: "/packageA/wjx/userInfo/userInfo",
        status: true
      },
      {
        imgurl: imgurl2 + 'product_icon.png',
        text: '拼团商品',
        url: "/pages/Groupindex/Groupindex",
        status: true
      },
      {
        imgurl: imgurl2 + 'kefu_icon.png',
        text: '客服',
        url: "/",
        status: false
      },
    ],
    menmbercneterThree: [{
        imgurl: imgurl2 + "icon_dingdan.png",
        text: '分销订单',
        url: "/pages/distributeOrder/distributeOrder?pageType=2"
      },
      {
        imgurl: imgurl2 + 'icon_fenxiaoxiashu.png',
        text: '分销下属',
        url: "/pages/distributeSub/distributeSub?type=1"
      },
      {
        imgurl: imgurl2 + "icon_08zhishu.png",
        text: '直属上级',
        url: "/packageA/pages/Directsuperiors/Directsuperiors"
      },
      {
        imgurl: imgurl2 + "icon_tt.png",
        text: '拼团订单',
        url: "/packageA/wjx/distribution/distribution"
      },
      {
        imgurl: imgurl2 + 'icon_shengji_01.png',
        text: '升级申请',
        url: "/pages/applyAgent/applyAgent",
        status: true
      },
      {
        imgurl: imgurl2 + "icon_sjsj.png",
        text: '我要升级',
        url: "/packageA/wjx/myUpgrade/myUpgrade"
      },
      {
        imgurl: imgurl2 + "icon_dl.png",
        text: '上级代理',
        url: "/packageA/wjx/higherAgent/higherAgent"
      },
    ],



    agencyCenter: [{
        imgurl: imgurl2 + 'icon_cangku_05.png',
        text: '我的云仓',
        url: "/pages/cloudWarehouse/cloudWarehouse",
        status: false
      },
      {
        imgurl: imgurl2 + 'icon_guanl.png',
        text: '关联代理',
        url: "/packageA/pages/associated/associated",
        status: true
      },
      // {
      //   imgurl: imgurl2 + 'icon_xitong_02.png',
      //   text: '代理系统',
      //   url: ""
      // },
      // {
      //   imgurl: imgurl2 + 'icon_dpzz@2x.png',
      //   text: '店铺资质',
      //   url: "/packageA/wjx/qualification/qualification"
      // },
      // {
      //   imgurl: imgurl2 + 'icon_xiashui_03.png',
      //   text: '代理下属',
      //   url: '/pages/distributeSub/distributeSub?Type=2'
      // },
      // {
      //   imgurl: imgurl2 + 'icon_dianpu_04.png',
      //   text: '店铺信息',
      //   url: "/pages/shopmsg/shopmsg"
      // },
      // {
      //   imgurl: imgurl2 + 'icon_06@2x.png',
      //   text: '代理订单',
      //   url: "/pages/distributeOrder/distributeOrder"
      // },



      {
        imgurl: imgurl2 + 'xinxi_icon.png',
        text: '代理信息',
        url: "/packageA/wjx/userInfo/userInfo",
        status: false
      },
      {
        imgurl: imgurl2 + 'product_icon.png',
        text: '拼团商品',
        url: "/pages/Groupindex/Groupindex",
        status: false
      },
    ],
    directlyImg: '', //上级代理图片
    KjCustomId: '', //用来判断是不是代理
    IsBindUser: '', //判断是否登录
  },
  gomyorder() {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  showCode() {
    wx.showLoading({
      title: '加载中...',
    })
    getindexsharedata({
      Type: 1,
      Path: 'pages/home/home?agentId=' + app.cache.loadUserInfo().UserId
    }).then(res => {
      wx.hideLoading()
      if (res.data.Result) {
        this.setData({
          show: true,
          tabHide: false
        })
        this.setData({
          swiper: res.data.Result.Data
        })

      } else {
        wx.showToast({
          title: res.data.Message,
          icon: 'none'
        })
      }
      // console.log(res)
    })
  },
  // 显示tab栏
  tabShow(e) {
    console.log('执行了吗');
    this.setData({
      tabHide: true
    })
  },

  //   订单栏
  Tomyorder(e) {
    var index = e.currentTarget.dataset.index
    index = index == 4 ? 0 : index + 1
    wx.navigateTo({
      url: `/pages/myOrder/myOrder?type=${index}`,
    })
  },
  // 分享二维码
  share() {
    this.setData({
      Sharestaue: !this.data.Sharestaue
    })
  },

  //获取UnionId用于关联
  getUnionId() {
    wx.getSetting({
      success: (re) => {
        if (re.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              const ajaxParams = {
                encryptedData: res.encryptedData, //解密参数
                iv: res.iv, //解密参数
                session_key: app.data.sessioKey, //解密参数
              }
              getUnionId(ajaxParams).then(result => {

                if (result.Status == "Success") {
                  this.getMenberInfo(result.Message); //将UnionId传给会员信息接口
                }
              })
            }
          })
        }
      }
    })
  },

  /**
   * 获取会员信息 
   *  */
  getMenberInfo(uid = '') {
    app.alert.loading('加载中...');
    getMemberData({
      OpenId: app.data.openid,
      UnionId: uid,
      KjCustomId: wx.getStorageSync('KjCustomId') || '',
      /* 绑定代理 */
    }).then(res => {
      app.alert.closeLoading();

      const {
        memberCenter,
        myorderBox,
        userRepository,
        agencyCenter
      } = this.data;

      const {
        Data: {
          CreateDate,
          GradeName,
          UserName,
          UserId,
          picture,
          gradeId,
          WithDraw,
          Balance,
          Commission,
          AnticipatedIncome,
          KjCustomId,
          IsBindUser,
          fenxiaoPayOrderCount,
          fenxiaoAllOrderCount,
          StoreStatus,
          NickName
        },
        Data = {},
        Status,
      } = res.data;

      if (Status == "Success") {
        wx.setStorageSync("userInfo", Data);

        const data = Data;

        agencyCenter.forEach(v => {

          /**
           * v.KjCustomId = data.KjCustomId//用于判断是否为代理,KjCustomId=0为非代理,将我的云仓隐藏
           * 为代理的时候隐藏关联代理按钮
           * 为代理的时候显示代理信息
           * 为代理的时候显示拼团信息
           */
          const isBool = v.text === "我的云仓" || v.text === '代理信息' || v.text == '拼团商品'

          v.status = isBool ? true : false

        })

        if (StoreStatus == 0) {
          memberCenter.forEach(v => { //全部不显示
            if (v.text == "小微商户" || v.text == "直播体验") {
              v.status = false
            } else if (v.text == "直播专区") {
              v.status = true
            }
          })
        } else if (StoreStatus == 1) { //显示小微商户
          memberCenter.forEach(v => { //全部不显示
            if (v.text == "小微商户" || v.text == "直播专区") {
              v.status = true
            } else if (v.text == "直播体验") {
              v.status = false
            }
          })
        } else if (StoreStatus == 2) { //显示直播相关的
          memberCenter.forEach(v => { //全部不显示
            if (v.text == "小微商户") {
              v.status = false
            } else if (v.text == "直播专区" || v.text == "直播体验") {
              v.status = true
            }
          })

          //控制小微商户和直播按钮的显示隐藏  是代理,就显示代理相关的和拼团相关按钮
          if (KjCustomId > 0) {

            memberCenter.forEach(v => {
              (v.text == "我的拼团" || v.text == "拼团商品" || v.text == "代理信息") && (v.status = true);
            })

            /* 收益模块数值 */
            userRepository[0].num = app.tools.tranNumber(data.AnticipatedIncome);
            userRepository[1].num = app.tools.tranNumber(data.Commission);
            userRepository[2].num = app.tools.tranNumber(data.Balance);
            userRepository[3].num = app.tools.tranNumber(data.WithDraw);

            /* 订单模块数值 */
            myorderBox[0].num = data.waitPayCount;
            myorderBox[1].num = data.waitSendCount;
            myorderBox[2].num = data.waitFinishCount;
            myorderBox[3].num = data.waitReviewCount;



          }

        }

        const userInfo = {
          CreateDate,
          GradeName,
          UserName,
          UserId,
          picture,
          gradeId,
          WithDraw,
          Balance,
          Commission,
          AnticipatedIncome,
          fenxiaoPayOrderCount,
          fenxiaoAllOrderCount,
          StoreStatus,
          NickName,
          picture
        };

        this.setData({
          userInfo: Data,
          userRepository, //金额
          myorderBox, //订单的指示器
          KjCustomId,
          agencyCenter,
          IsBindUser,
          memberCenter,

          vipcardInfo: wx.getStorageSync("tab")
        })

      }
    })
  },
  goAgentCenter(){
    app.goPage({
      url: '/pages/proxy/proxy'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  cardshow() {
    this.setData({
      showcard: true
    })
    // 动画
  },
  /* 查看会员卡 */
  canclecard() {
    this.setData({
      showcard: false
    })
  },
  // 弹窗立即升级
  gotoupNow() {
    wx.navigateTo({
      url: '/pages/applyAgent/applyAgent',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      tabIndex: options.tabIndex
    })
    /* 获取用户信息  */
    app.cache.get('userInfo', res => {
      this.setData({
        userInfo: res.data
      })
    })

    this.setting()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    /* 设置默认底部栏选中值  */
    app.globalData.template.tabbar("tabBar", 2, this, app.data.cartNum)

    /* 已有cookie 获取unionId */
    wx.getStorageSync('cookie') && this.getUnionId();

  },
  /* 控制开关 */
  setting() {
    this.data.memberCenter.forEach(v => {
      v.text === '积分商城' && (v.status = app.data.IS_OPEN_POINT_SHOP)
    })

  },

  /**
   * 签到
   * */
  handleOnSign() {
    handleOnSign().then(res => {
      const {
        Status,
        Msg,
        points
      } = res.data;

      if (Status == "Success") {
        this.setData({
          SignInpoints: points,
          SignInmask: true
        })
      } else {
        app.alert.toast(Msg)
      }
    })
  },
  //关闭弹窗
  colseSignin() {
    this.setData({
      SignInmask: false
    })
  },

  //分销订单跳转
  handleWJXfx() {
    wx.navigateTo({
      url: '/pages/distributeOrder/distributeOrder?pageType=2',
    });
  },


  /* 查看信息 */
  goMyMessage(e) {
    wx.navigateTo({
      url: '/pages/myMessage/myMessage?flag=false&noticeid=' + e.currentTarget.dataset.id,
    })
  },

  //跳转login页面
  handleLogin() {
    console.log("跳转登录userid", this.data.userid || this.data.userInfo.UserId);
    wx.navigateTo({
      url: '/pages/authorizationLogin/authorizationLogin?userid=' + this.data.userid || this.data.userInfo.UserId,
    });
  },
  //跳转升级会员和代理
  handleGo(e) {
    const {
      type
    } = e.currentTarget.dataset;
    if (type == 1) {
      app.goTo('/pages/upgradeMember/upgradeMember')
    } else {
      app.goTo('/packageA/wjx/equities/equities')
    }
  },
  //微信小程序客服回调
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
})