let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    isConfigAgentUrl: false,
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
    this.getApplectWebSet();
  },
  /* 获取代理路径配置 */
  getApplectWebSet() {
    app.$api.getApplectWebSet().then(res => {
      this.setData({
        isConfigAgentUrl: res.success
      })
    })
  },
  // 跳转
  handleAction(e) {
    const {

      currentTarget: {
        dataset: {
          type
        }
      }
    } = e;

    const urlList = ['/pages/applyAgent/applyAgent', '/pages/proxy/proxy', '/subPackageC/bindAgent/bindAgent', ];


    wx.navigateTo({
      url: urlList[type],
    })
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

  
})