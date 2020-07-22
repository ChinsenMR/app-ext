// pages/logisticsInform/logisticsInform.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: '',
    num: '',
    logistics: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('订单信息', options)
    this.setData({
      company: options.company,
      num: options.shipnum,
    })
    this.loadLogisticsInfo(options.id)
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



  loadLogisticsInfo(id) {
    wx.$ajax({
      api: '/Api/VshopProcess.ashx',
      data: {
        action: 'GetLogisticsInfo',
        OrderId: id
      }
    }).then(res => {
      console.log(res)
      if (res.status == 200) {
        this.setData({
          logistics: res.data
        })
      } else {
        // wx.showModal({
        //   title: '',
        //   content: res.message,
        //   showCancel: false
        // })
        this.setData({
          msg: '暂无物流消息'
        })
      }
      // this.data.logistics = res.data
    }).catch(e => { })
  },

  copyBtn: function (e) {
    var _this = this;
    wx.setClipboardData({
      //准备复制的数据
      data: _this.data.num,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  }

})