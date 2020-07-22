const app = getApp();
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
    // console.log("home页面跳转数据",options);
    let tab = wx.getStorageSync('tab')
    wx.getSystemInfo({
      success: function (res) {
        app.data.statusBarHeight = res.statusBarHeight;
        app.data.navHeight = res.screenHeight - res.windowHeight;
      }
    })
    wx.showLoading({
      title: '加载中...'
    })
    // if (options.pageType) wx.reLaunch({ url: `/pages/goodsDetail/goodsDetail?prDid=${options.prDid}&pagetype=${options.pageType}&dlr=${options.dlr}&f=${options.f}` })
    if (options.pageType) {
      wx.reLaunch({
        url: `/pages/goodsDetail/goodsDetail?p=${options.p}&pagetype=${options.pageType || ''}&d=${options.d}&f=${options.f}`
      })
    } else {
      if (app.data.PROJECT_THEME != 'fruit') {
        wx.reLaunch({
          url: '/pages/moduleHome/moduleHome'
        })
      } else wx.reLaunch({
        url: '/pages/index/index'
      })
      wx.hideLoading();

    }
    if (options.rid) {
      app.data.referralUserId = options.rid
    } else {
      var scene = decodeURIComponent(options.scene).split('=')[1]
      wx.setStorageSync("scene", scene);
      wx.setStorageSync("KjCustomId", scene);
      app.data.referralUserId = scene
    }


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

 
})