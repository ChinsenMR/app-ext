// pages/exchangedDetail/exchangedDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    wx.showLoading({
      title: '加载中...',
    })
    this.getData(options.id)
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

 

  /**
   * 获取退换货详情数据-http请求
   * */ 
   getData: function(id) {
     let _this = this
     wx.request({
       url: getApp().data.url +'/Api/VshopProcess.ashx',
       data: {
         action: 'GetOrderReturnDetail',
         ReturnsId: id,
         sessionId: wx.getStorageSync('sessionId')
       },
       success: function (res) {
         wx.hideLoading()
         console.log(res)
         _this.setData({detailData: res.data.data})
       },
       fail: function(e){
         wx.hideLoading()
         console.log(e)
       }
     })
   }
})