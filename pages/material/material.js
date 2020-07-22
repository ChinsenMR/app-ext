const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    scrollItem: ['全部', '早安签'],
    activeItem: 0, // 当前tab
    modalShow: false, //分享modal
    imgList:[],  // 分享modal的图片数组
    list:['','','','']
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

  selectTab: function (event) {
    console.log(event.currentTarget.dataset.id)
    this.setData({
      activeItem: event.currentTarget.dataset.id
    })
  },

  // 分享
  share:function(event){
    if (event.detail.closeM){
      this.setData({
        modalShow: false
      })
    }else{
      let index = event.currentTarget.dataset.index;
      this.setData({
        modalShow: true,
        imgList: this.data.list[index].img
      })
    }
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