// pages/couponDetail/couponDetail.js
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
    console.log(options)
    this.httpGetDetailData(options.id)
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
   * 获取优惠卷详情--网络请求
   * */ 
   httpGetDetailData: function(id){
     let _this = this
     wx.request({
       url: getApp().data.url + '/Api/VshopActivityProcess.ashx?action=GetAllCouponList&sessionId=ee85a999f42c4cd4ad0361697a1a3458',
       data: {
         action: 'GetCouponDetail',
         CouponId: id,
         sessionId: wx.getStorageSync('sessionId')
       },
       success: function(res) {
         console.log(res)
         if (res.data.Status === 'success') {
           _this.setData({
             detailData: res.data.data
           })
         }
       },
       fail: function(e){
         console.log(e)
       }
     })
   },
   getCoupon: function (e) {
     this.getCouponData(e.currentTarget.dataset.couponid)

   },
   getCouponData: function (couponId) {
     let _this = this
     let id = wx.getStorageSync('sessionId')
     // console.log(id)
     wx.request({
       url: getApp().data.url + '/Api/VshopActivityProcess.ashx',
       data: {
         action: 'ReceiveCoupon',
         couponId: couponId,
         sessionId: id
       },
       success: function (res) {
         console.log(res)
         wx.hideLoading()
         if (res.data.Status === 'success') {
           console.log('123')
           wx.showToast({
             title: '领取成功',
           })
         } else {
           //此处为领取不成功的所有抛错
           wx.showModal({
             title: '提示',
             content: res.data.errorMsg,
             showCancel: false,
             success: function (res) {
               if (res.confirm) {
                 console.log('用户点击确定')
               }
             }
           })
           return;
         }
       },
       fail: function (e) {
         wx.hideLoading()
         console.log(e)
         _this.setData({
           isEmpty: _this.data.dataList.length ? false : true
         })
         console.log(e)
       },
     })
   }
})