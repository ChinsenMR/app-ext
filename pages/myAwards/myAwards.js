// pages/myAwards/myAwards.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CommissionList: [],
    selected: true,
    selected1: false,
    selected2: false,
    pageIndex: 1,
    isMore: true,
    curType: 1,
  },

  /**
   * 获取tabs参数
   * */
  onClickTabs: function (event) {
    // console.log(event)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList(1, 1)
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
    var that = this;
    console.log(that.data.curType)
    that.pullRefresh(that.data.curType)
  },
  pullRefresh: function (type) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: getApp().data.url + '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetCommissionList',
        type: type,
        pageIndex: 1,
        pageSize: 10,
        sessionId: wx.getStorageSync('sessionId')
      },
      success: function (res) {
        console.log(res)
        that.setData({
          CommissionList: res.data.data
        })
        // 隐藏导航栏加载框  
        wx.hideNavigationBarLoading();
        // 停止下拉动作  
        wx.stopPullDownRefresh();
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isMore) {
      this.getMore(this.data.type)
    }

  },

  //加载更多
  getMore(type) {
    var that = this
    wx.request({
      url: getApp().data.url + '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetCommissionList',
        type: type,
        pageIndex: ++that.data.pageIndex,
        size: 10,
        sessionId: wx.getStorageSync('sessionId')
      },
      success: function (res) {
        if (res.data.data.length == 0) {
          console.log('没有数据')
          that.data.isMore = false
        } else {
          var list = that.data.CommissionList;
          list.push.apply(list, res.data.data);
          // 设置数据 
          that.setData({
            CommissionList: list
          })
        }
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },



  getDataList: function (type, pageIndex) {
    var _this = this
    wx.$ajax({
      api: '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetCommissionList',
        type: type,
        pageIndex: pageIndex,
        pageSize: 10,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      if (res.Status === "success") {
        console.log(res.data)
        _this.setData({
          CommissionList: res.data
        })
      }
    })
  },
  selected: function (e) {
    this.data.curType = 1
    this.setData({
      selected: true,
      selected1: false,
      selected2: false
    })
    this.getDataList(1, 1)
  },
  selected1: function (e) {
    this.data.curType = 2
    this.setData({
      selected: false,
      selected1: true,
      selected2: false
    })
    this.getDataList(2, 1)

  },
  selected2: function (e) {
    this.data.curType = 3
    this.setData({
      selected: false,
      selected1: false,
      selected2: true
    })
    this.getDataList(3, 1)

  }
})