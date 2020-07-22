const app = getApp();
import { getProductsList } from '../../../utils/requestApi.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    cid: null, //分类id
    list: [],
    page: 1,
    isEmpty: false,
    activeIndex:0,
    optIndex:0,
    Categorydata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    // console.log("分类页面",opt);
    this.setData({ 
      cid: opt.id ,
      activeIndex:opt.index
    })
    this.getCategory();
    this.initData();
  },

 //获取点击索引值
  getClickIndex(e){
    // console.log(e.currentTarget.dataset);
    let cid = e.currentTarget.dataset.id
    this.setData({
      list: [],
      page:1,
      activeIndex: e.currentTarget.dataset.nums,
      cid: e.currentTarget.dataset.id,
    })
    // this.getCategory();  
    this.initData(cid);
  },

  // 初始化数据
  initData(id){
    wx.showLoading({ title: '加载中...' })
    let { list, page, cid, isEmpty } = this.data;
    if(cid){
      cid
    }else{
      cid=id
    }
    getProductsList({
      action: 'GetProducts',
      pageSize: 10,
      pageIndex: page,
      CatetoryId: cid
    }).then(res =>{
      wx.hideLoading()
      if (res.data.Result.Status == 'Success' && res.data.Result.Data.length != 0) {
        list = [...list, ...res.data.Result.Data]
        // console.log("输出list", list);
        page ++ ;
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
        // console.log("商品分类页", res)
        if (res.errMsg == "request:ok") {
          _this.setData({
            Categorydata: res.data.Result.Data
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