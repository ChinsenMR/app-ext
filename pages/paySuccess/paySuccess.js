const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    total: null, //订单总额
    sta:null,
    dikou:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    let dk = opt.dikou;//抵扣价格
    let sta =opt.status;//用于判断是不是抵扣商品
    if(sta==1){
      this.setData({
        sta,
        dikou:dk,
        total: opt.total
      })
    }
    this.setData({ total: opt.total})
  },

  

  checkOrder:function(){
    wx.navigateTo({
      url: '../myOrder/myOrder?type=2',
    })
  },

  toIndex:function(){
    wx.navigateTo({
      url: '/pages/moduleHome/moduleHome', 
    })
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