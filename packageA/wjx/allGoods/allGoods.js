const app = getApp();
import { getProductsList } from '../../../utils/requestApi.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    imgurl: app.data.imgurl,
    cid: null, //分类id
    list: [],
    page: 1,
    isEmpty: false,
    activeIndex: 0,
    optIndex: 0,
    Categorydata: [],

    newHeight:230,


    swiperH: 150, //swiper高度
    statusBarHeight: null, //页面状态栏高度
    navHeight: null, // 页面导航栏高度
    showtarbar: false, //nav弹窗

    windowWidth: 0,
    windowHeight: 0,
    isHeight: false,
    tabStatus: true,
    tabHeight: 0,
    scrollTopss: 0,
    homeTitle: '',//商城导航栏
    shareTitle: '',//分享图标
    newShow:false,//控制导航的显示隐藏
    backShow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    console.log("分类页面", opt);
    console.log("分类页面2",opt.linktype);
    this.setData({
      cid: opt.id,
      activeIndex: opt.index,
      // linktype: opt.linktype,
      statusBarHeight: app.data.statusBarHeight,
      navHeight: app.data.navHeight,
      homeTitle: wx.getStorageSync("homeTitle"),
      shareTitle: wx.getStorageSync("shareTitle"),
    })
    if (opt.linktype==2){
      this.setData({
        newShow: !this.data.newShow,
        activeIndex:0,
      })
    }else{
      this.setData({
        newHeight:180
      })
    }
    var kt = wx.getStorageSync('tab').WapTheme
    console.log("99999999999999999kt", kt);
    // if (kt != "katong") {
    //   this.setData({
    //     backShow: false
    //   })
    // }

    this.getCategory();//获取分类导航
    this.initData();
  },
  onShow:function(){
    this.setData({
      activeIndex: 0,
    })
  },
  //返回自定义首页
  getBack() {
    wx.reLaunch({
      url: '/pages/moduleHome/moduleHome',
    })
  },
  showtarbar() {
    this.setData({
      showtarbar: !this.data.showtarbar
    })
  },
  // 跳转搜索  
  Tosearch() {
    wx.navigateTo({
      url: '/pages/searchGoods/searchGoods',
    })
  },
  //获取点击索引值
  getClickIndex(e) {
    console.log(e);
    var { id, name} = e.currentTarget.dataset;
    let index = e.currentTarget.dataset.nums - 1;
    this.setData({
      page: 1,
      activeIndex: e.currentTarget.dataset.nums,
      cid: id,
    })

    if(name=="全部"){
      this.setData({
        page: 1,
        activeIndex: e.currentTarget.dataset.nums,
        cid: '',
      })
    }else{
      console.log("执行了吗");
      wx.navigateTo({
        url: `/packageA/pages/sortDetail/sortDetail?id=${id}&index=${index}`,
      });
    }
    
      
    // this.getCategory();  
    // this.initData(cid);
  },

  // 初始化数据
  initData(id) {
    wx.showLoading({ title: '加载中...' })
    let { list, page, cid, isEmpty } = this.data;
    if (cid) {
      cid
    } else {
      cid = id
    }
    getProductsList({
      action: 'GetProducts',
      pageSize: 10,
      pageIndex: page,
      NoFightProduct:true
      // CatetoryId: cid
    }).then(res => {
      wx.hideLoading()
      if (res.data.Result.Status == 'Success' && res.data.Result.Data.length != 0) {
        list = [...list, ...res.data.Result.Data]
        // console.log("输出list", list);
        page++;
      } else if (res.data.Result.Data.length == 0 && page == 1) isEmpty = true
      this.setData({ list, page, isEmpty })
    })
  },

  // 获取商品的分类
  getCategory() {
    let _this = this
    wx.request({
      url: app.data.url + '/AppShop/AppShopHandler.ashx?action=GetProductCategories',
      success(res) {
        console.log("商品分类页", res)
        if (res.errMsg == "request:ok") {
          let arr = res.data.Result.Data;
          let obj = {
            BigImageUrl: "",
            CategoryId:"",
            Icon: "",
            Name: "全部",
            Path: "0",
          }
          arr.unshift(obj)
          console.log("分类数组",arr);
          _this.setData({
            Categorydata: arr
          })
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.initData(this.data.cid)
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.initData(this.data.cid)

    console.log("上拉输出了");
    // this.pageIndex = 1;
    this.setData({
      list: [],
    })

    //  结束下拉刷新组件的显示
    wx.stopPullDownRefresh();
  },
})