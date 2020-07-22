// pages/coupons/coupons.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    dataLength: 0,
    isEmpty: false,
    page: 1  // 当前页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.httpGetCoupons()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.dataLength === 10) {
      this.data.page++
      this.httpGetCoupons()
    }
  },

  /**
   * 获取优惠卷列表
   * */
  httpGetCoupons: function () {
    let _this = this
    wx.$ajax({
      api: '/Api/VshopProcess.ashx',
      data: {
        action: 'GetMyCouponList',
        pageIndex: this.data.page,
        pageSize: 10,
        couponName: '',
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      console.log(res)
      if (res.Status === 'success') {
        this.data.dataLength = res.data.length
        _this.setData({
          dataList: _this.data.dataList.concat(res.data)
        })
      } else {
        this.data.dataLength = 0
      }
      _this.setData({
        isEmpty: _this.data.dataList.length ? false : true
      })
    }).catch(e => {
      _this.setData({
        isEmpty: _this.data.dataList.length ? false : true
      })
    })
  }
})