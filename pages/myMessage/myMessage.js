// pages/myMussage/myMessage.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList:{},
    str:'',
    flag:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      flag: options.flag
    })
    this.getNewsList(options.id)
  },

  navigatorTo:function(){
    var _this = this
    var flag = _this.data.flag
    if(flag=="true"){
      wx.navigateBack({})
    }else{
      wx.navigateTo({
        url: '/pages/myNews/myNews',
      })
    }
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

  // 获取公告详情
  getNewsList: function (noticeid) {
    var _this = this
    wx: wx.request({
      url: getApp().data.url + '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetNoticeById',
        noticeid: noticeid
      },
      success: function (res) {
        if (res.data.Status === "login") {
          getApp().turnToLoginPage()
          return
        }
        if (res.data.Status === "success"){
          console.log(res.data.data)
          var str = res.data.data.PubTime          
          var richtext = res.data.data.Memo.replace(/\“thzfc\”/g, '\"')
          WxParse.wxParse('richtext', 'html', richtext, _this, 5);
          _this.setData({
            newsList:res.data.data,
            time: str.replace(/T/, " ")
          })
        }
       },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})