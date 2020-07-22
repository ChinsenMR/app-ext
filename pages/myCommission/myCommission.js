// component/myCommission/myCommission.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsEnabelBalanceWithdrawal: false,  // 后台是否开启提现，true为开启
    IsEnabelSceondTimeBalance: false,  // 是否提现中, false不能继续提现 
    commissionList:{}
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
    this.getVshopProcess(1)
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


  // 跳转到提现页
  toWithdrawPage: function () {
    if (!this.data.IsEnabelSceondTimeBalance) {
      return
    }
    wx.navigateTo({
      url: '/pages/withdraw/withdraw?commission=1',
    })
  },

  getVshopProcess: function (infoType) {
    var that = this
    wx.request({
      url: app.data.url + '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetDistributorCommission',
        infoType: infoType,
        sessionId: wx.getStorageSync('sessionId')
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log(res)
        if (res.data.Status === "login") {
          getApp().turnToLoginPage()
          return
        }
        console.log("数据", res.data.data[0])
        if (res.data.Status === "success") {
          that.setData({
            IsEnabelBalanceWithdrawal: (res.data.IsEnabelBalanceWithdrawal =='True'?true:false),
            IsEnabelSceondTimeBalance: (res.data.IsEnabelSceondTimeBalance == 'True' ? true : false),
            commissionList: res.data.data[0]
          })
        }
      },
      fail: function (error) {
        console.log("错误信息", error)
      }
    })
  }
})