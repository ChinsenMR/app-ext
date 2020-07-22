import { getBalanceDraws } from '../../../utils/requestApi.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    wx.showLoading({ title: '加载中...' })
    let { list, page, isEmpty } = this.data;
    getBalanceDraws({
      pageSize: 10,
      pageIndex: page
    }).then(res =>{
      wx.hideLoading()
      if (res.data.Status == 'Success') {
        if (res.data.Data.length != 0) {
          list = [...list, ...res.data.Data]
          page++
        } else isEmpty = true
      }
      this.setData({ list, page, isEmpty })
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