const app = getApp();
import {
  bindReferralUserId,
  createProductSharePath,
  getProductShareParams
} from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartCount: 0, //购物车数量

    imgUrl: app.data.imgurl,
    currentTab: 1, // 当前选择的tab,
    navHeight: null, //系统状态栏高度
    statusBarHeight: null, //导航栏栏高度
    bannerArr: [], //bannerArr
    skuItem: [], // 规格选择列表
    skus: [], // 规格选中项
    freight: null, //运费
    goodsInfo: null, //商品信息
    paramData: {},
    //页面类型   新人限时抢购：1，  限时折扣：2，  9.9包邮：3， 品牌秒杀： 4， 即将销售：5， 拼团：6
    pageType: null,
    prDid: null, //商品id
    description: null, // 图文详情
    shopUser: [], //购买下单用户
    coupons: [], //  优惠卷
    promotionStr: [], // 优惠卷 ---> 促销 
    //福利列表
    isShow: false, // 分享弹窗展示
    shareInfo: {},
    newHeight: 0,
    //---------------------------
    roomid: '', //从直播间到商品详情,这是直播间的房号id
    openid: '', //直接用户的openid
    //---------------------------
    upAgentId: '', //分享进来的分享代理id
    groupId: '', //分享进来的分享团id
    agencyInfo: {}, //代理信息
    productid: [], //用来存储所有的进来的商品id
    liveShow: true, //控制直播提示的显示隐藏
    Defaultaddres: {}, //默认地址对象
    isLogin: true, // 是否已登录
  },
  bindReferralUserId,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.setData({
      pageType: parseInt(options.pagetype) || 6,
      userid: app.cache.loadUserId(),
      prDid: options.p,
      roomid: options.room_id, //直播间的房号id
      openid: options.openid, //直接用户的openid
    })


    if (options.scene || options.opt) {
      const paramsObj = getProductShareParams(options.scene || options.opt);
      console.log(paramsObj, '获取到的参数')
      this.setData({
        prDid: paramsObj.productId,
        groupId: paramsObj.groupId,
        agentId: paramsObj.agentId, //代理id
      })
    }
    if (options.room_id) { //直播间id
      app.data.roomid = options.room_id
    }


    this.storeGoodsHistory(options)
  },
  /* 设置导航栏高度 */
  setNavHeight() {
    this.getSystemInfo().then((res) => {
      const newHeight = (res.statusBarHeight + 44) - res.statusBarHeight
      this.setData({
        statusBarHeight: res.statusBarHeight,
        navHeight: res.statusBarHeight + 44,
        newHeight
      })
    })
  },
  storeGoodsHistory(options) {



    let oldArr = wx.getStorageSync('pIdArr');
    let newArr = this.data.productid;
    newArr.push(options.p)
    if (oldArr) {
      oldArr.push(options.p)
      if (oldArr.length > 20) { //超过20个商品删除前一个
        oldArr.splice(0, 1);
      }
      wx.setStorageSync('pIdArr', [...new Set(oldArr)]); //去重
    } else {
      wx.setStorageSync('pIdArr', newArr);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (!app.cache.loadCookie()) {
      debugger
      this.setData({
        isLogin: false
      })
    }

    this.setNavHeight();
    this.getGoodsDetail();
    this.getBuyUserList()
    this.getCartList()
    this.getDefaultAddress();
    this.bindReferralUserId();

  },
  /* 获取购物车列表 */
  getCartList() {
    if (!this.data.isLogin) return
    app.$api.getCartList().then(res => {
      if (res.success) {
        this.setData({
          cartCount: res.Data.RecordCount
        })
      }

    })
  },
  /* 获取商品详情 */
  getGoodsDetail() {
    const {
      prDid,
      upAgentId,
      groupId
    } = this.data;


    app.$api.getGoodsDetail({

      ProductID: prDid,
      FightDistributorUserId: upAgentId || '', //代理id
      FightGroupId: groupId || '', //团id
    }).then(res => {
      if (res.success) {
        const {
          Result
        } = res;

        Result.prDid = this.data.prDid;

        this.setData({
          bannerArr: Result.ImgList,
          animationImg: Result.ImgList[0],
          description: Result.Description,
          skuItem: Result.SkuItem,
          skus: Result.Skus,
          coupons: Result.Coupons,
          promotionStr: Result.PromotionStr,
          freight: Result.Freight,
          goodsInfo: Result, //商品详情数据
          agencyInfo: Result.FightDistributorInfo, //代理信息
        })
      }
    })
  },

  succ(e) {
    this.setData({
      cartCount: e.detail
    })
  },


  //跳转直播房间
  handleGo(e) {
    const {
      roomid,
      pid
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomid}`,
    });
  },
  //关闭直播提示弹窗
  handleOff() {
    this.setData({
      liveShow: false
    })
  },
  /* 获取分享参数 */
  getShareOptions(type) {
    const {
      goodsInfo: info,
      prDid: productId,
    } = this.data;

    let upAgentId = '',
      groupId = '';

    if (info.FightGroupInfo && Object.keys(info.FightGroupInfo).length > 0) {
      groupId = info.FightGroupInfo.FightGroupId || ''
    }
    if (info.FightDistributorInfo && Object.keys(info.FightDistributorInfo).length > 0) {
      upAgentId = info.FightDistributorInfo.UserId || ''
    }

    const path = createProductSharePath({
      url: 'pages/goodsDetail/goodsDetail',
      /* 注意：！！！分享参数的顺序依次是商品ID，团Id，分享的代理ID，如果还有那就继续往后面加 */
      options: [productId, groupId, upAgentId]
      /* type决定了分享的类型 */
    }, type);

    return {
      path,
      groupId,
      upAgentId
    }
  },
  /* 二维码分享 */
  onShareQrCode() {
    const {
      goodsInfo = {},
      prDid = '',
      isLogin
    } = this.data;

    const ajaxData = {
      type: 1,
      path: this.getShareOptions('code').path,
      salePrice: goodsInfo.SalePrice,
      productId: prDid
    }

    if (!isLogin) {
      return app.alert.message('用户未登录')
    }

    app.$api.getProductQrcode(ajaxData).then(res => {

      if (res.success) {
        this.setData({
          shareInfo: res.Result,
          isShow: true
        })
      }

    })

  },
  /* 关闭分享弹窗 */
  closeShareDialog(e) {
    const mode = e.detail.mode;

    mode === 'mask' && this.setData({
      isShow: false
    })
  },
  /* 分享好友 */
  onShareAppMessage(res) {

    const {
      goodsInfo = {},
    } = this.data;

    console.log({
      title: goodsInfo.ProductName,
      path: this.getShareOptions().path,
      imageUrl: goodsInfo.ImageUrl1
    })

    return {
      title: goodsInfo.ProductName,
      path: this.getShareOptions().path,
      imageUrl: goodsInfo.ImageUrl1
    }

  },

  /* 获取手机信息 */
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success(res) {
          resolve(res)
        }
      })
    })
  },

  /* 获取默认地址 */
  getDefaultAddress() {
    if (!this.data.isLogin) return;

    app.$api.getAddressList().then(res => {
      if (res.success) {
        this.setData({
          Defaultaddres: res.Data[0]
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.removeStorageSync('buyType')
  },

  /* 切换头部Nav */
  selectNav(e) {
    this.setData({
      currentTab: e.target.dataset.id || e.detail.id
    })
  },

  /* 自定义返回上一级 */
  navigateBack() {
    wx.navigateBack();
  },

  /* 初始化下单的用户列表 */
  getBuyUserList() {
    app.$api.getBuyUserData()
      .then(res => {
        if (res.success) {
          this.setData({
            shopUser: !res ? [] : res.Result.Data
          })
        }
      })
  },

  /* 打开规格选择modal */
  openSpecs(param) {
    this.setData({
      paramData: param.detail
    })
    this.selectComponent('#goodsSpecsCom').showModal();
  },

})