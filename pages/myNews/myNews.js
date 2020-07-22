const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,  // 服务器 配置地址
    activeItem: 1, // 当前选择的tabBar项
    showModal: false, // 显示隐藏modal
    animationData: {}, // modal 显示动画
    list:['','']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getGoodsDetail().then(res =>{
    //   console.log(res)
    // })
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
  

  //选择tabbar
  selectTabbar:function(e){
    this.setData({
      activeItem: e.currentTarget.dataset.id
    })
  },

  // 升级会员modal
  updateAgent:function(e){
    if (this.data.activeItem == 1) return;
    this.setData({
      showModal: !this.data.showModal
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