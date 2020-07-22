// pages/shopOrders/shopORders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    orderCount: {},
    orders: [],         // 订单列表
    page: 1,           // 当前页
    dataLength: 0,
    orderIndex: 0       //tab切换index值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.dataLength === 10) {
      this.data.page++
      this.getOrderList()
    } else {
      console.log('没了')
    }
  },

 
  tabOrder: function (e) {
    var that = this;
    this.setData({
      orders: [],
      page: 1,
      isEmpty: false
    })
    console.log('orderIndex', e.currentTarget.dataset.index)
    if (that.data.orderIndex == e.currentTarget.dataset.index) {
      return false
    } else {
      that.setData({
        orderIndex: e.currentTarget.dataset.index
      })
    }
    this.getOrderList()
  },

  /**
   * 获取店铺订单-http请求
   * */
  getOrderList: function () {
    let _this = this
    wx.$ajax({
      api: '/API/VshopProcess.ashx',
      data: {
        action: 'GetHishopOrder',
        orderStatus: this.data.orderIndex,
        pageIndex: this.data.page,
        pageSize: 10,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      console.log(res)
      if (res.Status === 'success') {
        _this.data.dataLength = res.data.length
        _this.setData({
          orderCount: res.orderCount,
          dataLength: res.data.length,
          orders: _this.data.orders.concat(res.data),
          isEmpty: _this.data.orders.concat(res.data).length ? false : true
        })
      } else {
        _this.setData({
          orderCount: res.orderCount,
          dataLength: 0,
          isEmpty: _this.data.orders.length ? false : true
        })
      }
    }).catch(e => {
      _this.setData({
        isEmpty: _this.data.orders.length ? false : true
      })
    })
  }
})