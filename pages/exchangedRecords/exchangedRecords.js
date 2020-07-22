// pages/exchangedRecords/exchangedRecords.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1,
    dataLength: 0,
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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
      this.getData()
    } else {
      console.log('没了')
    }
  },


  /**
 * 获取数据列表--http请求
 * */
  getData: function () {
    let _this = this
    wx.$ajax({
      api: '/Api/VshopProcess.ashx',
      data: {
        action: 'GetOrderReturnList',
        type: 1,
        pageIndex: this.data.page,
        pageSize: 10,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      if (res.Status === 'success') {
        _this.setData({
          dataLength: res.data.length,
          dataList: _this.data.dataList.concat(res.data),
          isEmpty: _this.data.dataList.concat(res.data).length ? false : true
        })
      } else {
        _this.setData({
          isEmpty: _this.data.dataList.length ? false : true
        })
      }
    }).catch(e => {
      _this.setData({
        isEmpty: _this.data.dataList.length ? false : true
      })
    })
  }
})