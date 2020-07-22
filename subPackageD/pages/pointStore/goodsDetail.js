const app = getApp();
// import {
//   getPointGoodsDetail,
//   getShopUser,
//   getCartList,
//   login,
//   PointChangeAddCart
// } from "../../../utils/requestApi.js";
// import { bindingShare } from "../../../utils/util.js";
Page(app.$page({
  /**
   * 页面的初始数据
   */
  data: {
    num: "", //购物车数量
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
    welfareList: ["", "", "", "", "", ""],
    isShow: false,
    shareInfo: {},
    scene: "", //二维码
    userid: null, // 本地用户信息id
    newHeight: 0,
    pid: "",
    goodsId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(opt) {

    this.setData({
      goodsId: opt.goodsId,
    });

  },

  onShow() {
    this.getGoodsDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  methods: {
    // 自定义返回上一级
    navigateBack() {
      wx.navigateBack();
    },
    /* 加入购物车 */
    addCart(e) {
      const giftId = e.currentTarget.dataset.id;

      app.$api.PointChangeAddCart({
        giftId,
        needPoints: 1,
        isExemptionPostage: true,
      }).then((res) => {

        const {
          errorMsg
        } = res;

        app.alert.message(errorMsg)
      });
    },
    /* 初始化页面数据 */
    getGoodsDetail(id) {

      app.$api.getPointGoodsDetail({
        giftId: this.data.goodsId,
      }).then((res) => {

        if (res.success) {
          const result = res.Data;
          this.setData({
            bannerArr: result.ImageUrl.split() || [],
            animationImg: result.ImageUrl,
            description: result.LongDescription,
            skuItem: result.SkuItem,
            skus: result.Skus,
            coupons: result.Coupons,
            promotionStr: result.PromotionStr,
            freight: result.Freight,
            goodsInfo: result,
          });
        }
      });
    },


    //打开规格选择modal
    openSpecs(param) {
      this.setData({
        paramData: param.detail,
      });
      console.log("输出价格", param.detail);
      this.selectComponent("#goodsSpecsCom").showModal();
    },
    buyGoods() {

      app.$api.PointChangeAddCart({
        giftId: this.data.goodsId,
        needPoints: 1,
        isExemptionPostage: true,
      }).then((res) => {

        const {
          success
        } = res;

        if (success) {
          app.alert.success('兑换成功')
          app.tools.goPageTimeOut({
            url: '/subPackageD/pointShop/cart'
          })
        }

      });
    },
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
}));