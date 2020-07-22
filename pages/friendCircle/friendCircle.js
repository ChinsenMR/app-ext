// pages/friendCircle/friendCircle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabNum: 2, // tabs标签 1为列表，2为大图
    firendList: [], // 朋友圈素材数据
    isEmpty: false, // 数据是否为空
    page: 1, // 网络请求当前页
    dataLength: 0, // 每次获取数据的长度,
    isShowFrom:false,
  },

  // 滚动监听
  onPageScroll: function (e) {
    if (!this.data.isShowFrom) return
    this.setData({
      isShowFrom: false
    })
  },

  // 折叠面板
  showFrom:function(){
    this.setData({
      isShowFrom: !this.data.isShowFrom
    })
  },

  /**
   * 预览图片
   * */
  previewImage: function(e) {
    console.log(e)
    if (!e.target.dataset.index && e.target.dataset.index != 0){
      return
    }
    var select = e.currentTarget.dataset.select,index = e.target.dataset.index;
    wx.previewImage({
      urls: this.data.firendList[select].images,
      current: this.data.firendList[select].images[index]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中'
    })
    this.getDataList()
  },

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
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
  onReachBottom: function(e) {
    if (this.data.dataLength != 0 && this.data.dataLength == 10) {
      console.log('触底', e)
      this.getDataList()
    }
  },


  /**
   * 点击tab显示列表或大图
   * */
  onTabSelect: function(e) {
    if (e.target.dataset.num == this.data.tabNum) {
      return
    }
    this.setData({
      isEmpty: false,
      firendList: []
    })
    this.setData({
      tabNum: e.target.dataset.num
    })
    wx.showLoading({
      title: '加载中...',
    })
    this.getDataList()
  },

  // 获取朋友圈列表
  getDataList: function() {
    var _this = this
    wx.$ajax({
      api: '/Api/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetFriendsCircle',
        materialType: this.data.tabNum,
        page: this.data.page,
        size: 10,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      if (res.Status === 'success') {
        _this.data.dataLength = res.data.length
        if (_this.data.tabNum == 1){
          res.data.forEach(v => v.PubTime = v.PubTime.split('T').join(' '))
        }
        _this.setData({
          firendList: _this.data.firendList.concat(res.data),
          isEmpty: !_this.data.firendList.concat(res.data).length ? true : false
        })
      } else {
        _this.setData({
          isEmpty: true
        })
      }
    }).catch(e => {
      _this.setData({
        isEmpty: !_this.data.firendList.length ? true : false
      })
    })
  }
})