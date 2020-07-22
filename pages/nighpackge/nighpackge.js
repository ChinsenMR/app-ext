// pages/nighpackge/nighpackge.js
const app = getApp()
const {
  goodsSearch
} = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl,
    goodslist: [], //商品列表
    TotalRecords: 0, //商品列表的总长度
    page: 1,
    notime: false //不需要倒计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getdatalist()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //  商品列表
  getdatalist() {
    wx.showLoading({ title: '加载中...' })
    let _this = this
    wx.request({
      url: getApp().data.url + '/APIFH/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: _this.data.page,
        tagId: 16
      },
      success: function(res) {
        wx.hideLoading()
        if (res.errMsg === 'request:ok') {
          _this.setData({
            goodslist: _this.data.goodslist.concat(res.data.Result.Data),
            TotalRecords: res.data.Result.TotalRecords
          })
          wx.setStorage({
            key: 'initData',
            data: res.data.Result.Data
          })
        }
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function() {
        wx.stopPullDownRefresh()
      }
    })
  },

  // 搜索商品
  onSearch: function(e) {
    this.setData({
      goodslist: wx.getStorageSync('initData')
    })
    let searchKey = e.detail.value,
      data = this.data.goodslist,
      keyName = 'ProductName';
    this.setData({
      goodslist: goodsSearch({
        searchKey,
        data,
        keyName
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.goodslist.length < this.data.TotalRecords) {
      console.log("111")
      this.data.page++
        this.getdatalist()
    } else {
      wx.showToast({
        title: '到底啦~~',
      })
    }
  },

})