// pages/shopkeeperCard/shopkeeperCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getData()
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

 
  getData: function () {
    var _this = this
    wx.request({
      url: getApp().data.url + '/apI/VshopProcess.ashx/ProcessRequest?action=GetShopExtension',
      data: {
        sessionId: wx.getStorageSync('sessionId')
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data[0])
        if (res.data.Status === "success") {
          _this.setData({
            cardData: res.data.data[0]
          })
        }
      },
      fail: function (e) {

      }
    })
  }
})