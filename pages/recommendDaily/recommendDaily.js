const app = getApp();
import { getProductsList, getUserCoupons } from '../../utils/requestApi.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    coupon:[],
    firstGoods: {}, //第一个商品
    goodsList:[],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCoupon()
    this.initData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  initData(){
    let { goodsList, firstGoods, page } = this.data;
    wx.showLoading({ title: '加载中...' })
    getProductsList({
      action:'GetProducts',
      id: 11,
      pageSize: 10,
      pageIndex: page
    }).then(res =>{
      wx.hideLoading()
      if (res.data.Result.Status == 'Success') {
        firstGoods = res.data.Result.Data[0]
        goodsList = res.data.Result.Data
      }
      this.setData({ goodsList, firstGoods })
    })
  },

  initCoupon(){
    let { coupon } = this.data;
    getUserCoupons({ usedType: 1 }).then(res =>{
      if (res.data.Status == 'Success') coupon = res.data.Data
      this.setData({ coupon })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})