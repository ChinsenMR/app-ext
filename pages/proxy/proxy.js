// pages/proxy/proxy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getData()
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


  getData() {
    const _this = this
    wx.request({
      url: getApp().data.url + '/api/publicHandler.ashx',
      header: {
        Cookie: wx.getStorageSync('cookie') || getApp().data.cookie
      },
      data: {
        action: 'GetApplectWebSet'
      },
      success(res) {

        if (res.data.Status == 'Login') {
          return wx.showModal({
            title: '提示',
            content: '当前未登录，是否去登录？',
            success (res) {
              if (res.confirm) {
                wx.navigateTo({ url: '/pages/authorizationLogin/authorizationLogin' })
              } else if (res.cancel) {
                wx.navigateTo({ url: '/pages/member/member' })
              }
            }
          })
        }

        _this.setData({
          url: res.data.Result.ApplectKjManageLoginUrl
        })
      }
    })
  }
})