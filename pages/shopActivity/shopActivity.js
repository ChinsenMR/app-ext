const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    nav: ['所有活动', '积分兑换', '满减活动', '优惠券','其他活动'],
    activeItem: 0,
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

  selectNav(e){
    this.setData({
      activeItem: e.target.dataset.index
    })
  },

  //选择优惠券
  selectCou: function (e) {
    let l = this.data.list;
    l[e.currentTarget.dataset.index].couponState = !l[e.currentTarget.dataset.index].couponState;
    this.setData({ list: l })
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

 
  selected: function (e) {
    this.setData({
      selected: true,
      selected1: false,
      selected2: false,
      selected3: false,
      selected4: false
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      selected2: false,
      selected3: false,
      selected4: false
    })
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true,
      selected3: false,
      selected4: false
    })
  },
  selected3: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: false,
      selected3: true,
      selected4: false
    })
  },
  selected4: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: false,
      selected3: false,
      selected4: true
    })
  }

})