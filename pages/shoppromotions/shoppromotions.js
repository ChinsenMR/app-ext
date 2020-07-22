// pages/shoppromotions/shoppromotions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeType: 0, // 0 店铺二维码，1公众号二维码
    shareData: {},
    qrData: ''
  },
  /**
   * 监听自定义select-tabs组件点击事件，获取组件传给父级的数据
   */
  tapSelectCode: function (event) {
    // console.log(event)
    this.setData({ codeType: event.detail.code })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList()
    this.getQRCode()
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

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  /**
   * 预览图片
   * */
  previewImage: function (e) {
    var arr = []
    arr.push(this.data.shareData.storeFollowCode)
    wx.previewImage({
      current: this.data.shareData.storeFollowCode,
      urls: arr
    })
  },
  previewqrImage: function (e) {
    var arr1 = []
    arr1.push(this.data.qrData)
    wx.previewImage({
      current: this.data.qrData,
      urls: arr1
    })
  },


  getDataList: function () {
    var _this = this
    wx.$ajax({
      api: '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetShopExtension',
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      if (res.Status === 'fail') {
        wx.showToast({
          title: res.Error,
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
      if (res.Status === 'success') {
        _this.shareData = res.data[0]
        console.log(_this.shareData)
        _this.setData({
          shareData: res.data[0]
        })
      } else {

      }
    })
  },
 
  getQRCode() {
    var _this = this
    wx.$ajax({
      api: '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetQRPath',
        page: 'pages/index/index?ReferralId=' + wx.getStorageSync('ReferralId'),
        width: 200,
        scene: wx.getStorageSync('ReferralId'),
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      _this.qrData = res.data
      console.log(_this.qrData)
      _this.setData({
        qrData: res.data
      })
    })
  }
})