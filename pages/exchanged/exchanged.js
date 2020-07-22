// pages/exchanged/exchanged.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    info: '',
    show: false // 显示蒙层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.setData({
      order: JSON.parse(wx.getStorageSync('refundOrder'))
    })
    console.log(this.data.order)
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorage({
      key: 'refundOrder',
      success: function(res) {
        console.log(res)
      }
    })
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

  },

  

  /**
   * 获取输入信息
   * */
  onGetInfo: function(e) {
    this.data.info = e.detail.value
    console.log(this.data.info)
  },

  /**
   * 点击提交处理函数
   */
  onSubmit: function(event) {
    if (!this.data.info || (/^\s+$/).test(this.data.info)) {
      wx.showToast({
        title: '请提供正确定的账户信息',
        icon: 'none'
      })
      return
    }
    this.RequestOrderReturn()
  },

  /**
   * 退换款申请--http请求
   * */
  RequestOrderReturn: function() {
    wx.showLoading({
      title: ''
    })
    this.setData({
      show: true
    })
    let _this = this
    wx.request({
      url: getApp().data.url + '/Api/VshopProcess.ashx?action=RequestOrderReturn',
      data: {
        Money: this.data.order.OrderItems[0].ItemTotal,
        OrderId: this.data.order.OrderId,
        Reason: this.data.info,
        SkuId: this.data.order.OrderItems[0].SkuId,
        ProductId: this.data.order.OrderItems[0].ProductId,
        OrderItemId: this.data.order.OrderItems[0].OrderItemId,
        OrderStatus: this.data.order.OrderStatusNum,
        sessionId: wx.getStorageSync('sessionId')
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading()
        console.log(res)
        _this.setData({
          show: false
        })
        if (res.data.Status === 'success') {
          wx.redirectTo({
            url: '/pages/exchangedList/exchangedList'
          })
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none'
          })
        }
      },
      fail: function(e) {
        wx.hideLoading()
        console.log(e)
        _this.setData({
          show: false
        })
      }
    })
  }
})