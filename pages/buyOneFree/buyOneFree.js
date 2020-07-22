const app = getApp();
import { getProductsList } from '../../utils/requestApi.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    list: [],
    page: 1,
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.setData({ cid: opt.id })
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

  // 初始化数据
  initData() {
    wx.showLoading({ title: '加载中...' })
    let { list, page, cid, isEmpty } = this.data;
    getProductsList({
      action: 'GetProducts',
      pageSize: 10,
      pageIndex: page,
      ActiveId: 6
    }).then(res => {
      wx.hideLoading()
      if (res.data.Result.Status == 'Success' && res.data.Result.Data.length != 0) {
        list = [...list, ...res.data.Result.Data]
        page++;
      } else if (res.data.Result.Data.length == 0 && page == 1) isEmpty = true
      this.setData({ list, page, isEmpty })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    this.initData()
  },

 
})