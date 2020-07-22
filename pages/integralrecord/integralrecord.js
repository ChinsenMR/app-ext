// pages/integralrecord/integralrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gamgeData: [],
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {
  
  // },

  getData() {
    let _this = this
    wx.$ajax({
      api: '/Api/VshopProcess.ashx?action=GetGameList',
      data: {
        PageIndex: 1,
        PageSize: 100,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res=>{
      if (res.Status === 'success') {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].BeginTime = res.data[i].BeginTime.replace('T', ' ')
          res.data[i].EndTime = res.data[i].EndTime.replace('T', ' ')
        }
        _this.setData({
          gamgeData: res.data
        })
      }
      console.log(res)
      _this.setData({
        isEmpty: _this.data.gamgeData.length ? false : true,
      })
    })
  }
})