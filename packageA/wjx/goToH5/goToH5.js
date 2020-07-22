// packageA/wjx/goToH5/goToH5.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 接收 h5 页面传递过来的参数
  handlePostMessage: function (e) {
    const data = e.detail;
    console.log("接收 h5 页面传递过来的参数",data);
    wx.setStorageSync('pay', data);
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