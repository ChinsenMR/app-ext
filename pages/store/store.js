// pages/MemberStores/MemberStores.js
var util = require('../../utils/util.js')   //是不是这个页面  路径没错
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    memberList: {},
    memberDetailList: {},
    page: 1,
    arr: [],
    timeA: 'desc',
    memberA: 'desc',
    saleA: 'desc',
    sort: 'desc',
    index: 'createTime',
    gradeId: 0,
    isMore: true,
    hidden: false
  },
  // createTime，MemberTotal，OrderTotal
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopMember(0, 'createTime', 'desc', 1, 10)
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    that.pullRefresh(that.data.gradeId, that.data.index, that.data.sort)
  },
  pullRefresh: function (gradeId, index, sort) {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: getApp().data.url + '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetShopMembers',
        gradeId: gradeId,
        sortBy: index,
        sortAction: sort,
        page: 1,
        size: 10,
        sessionId: wx.getStorageSync('sessionId')
      },
      success: function (res) {
        that.setData({
          memberList: res.data,
          memberDetailList: res.data.data
        })
        // 隐藏导航栏加载框  
        wx.hideNavigationBarLoading();
        // 停止下拉动作  
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.isMore) {
      that.getMore(that.data.gradeId, that.data.index, that.data.sort)
    } else {
      that.setData({
        hidden: true
      })
    }
  },
  getMore(gradeId, index, sort) {
    var that = this
    wx.$ajax({
      api: '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetShopMembers',
        gradeId: gradeId,
        sortBy: index,
        sortAction: sort,
        page: ++that.data.page,
        size: 10,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      if (res.data.length == 0) {
        // console.log('没有数据')
        that.data.isMore = false
      } else {
        var list = that.data.memberDetailList;
        list.push.apply(list, res.data);
        // 设置数据 
        that.setData({
          memberDetailList: list
        })
      }
    })
  },


  // 点击分类
  tabBar: function (e) {
    //每次点击都应该将page初始化1以及将加载更多变为true
    var that = this;
    that.data.page = 1
    that.data.isMore = true
    // console.log(e.currentTarget.dataset.current)  // 0  1  2
    if (that.data.tabIndex === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        tabIndex: e.currentTarget.dataset.current
      })
    }
    if (e.currentTarget.dataset.current == 0) {
      this.getShopMember(0, 'createTime', 'desc', 1)
      this.data.gradeId = 0
      that.data.index = 'createTime'
      that.setData({
        index: 'createTime'
      })
    } else if (e.currentTarget.dataset.current == 1) {
      this.getShopMember(2, 'createTime', 'desc', 1)
      this.data.gradeId = 2
      that.data.index = 'createTime'
      that.setData({
        index: 'createTime'
      })
    } else if (e.currentTarget.dataset.current == 2) {
      this.getShopMember(3, 'createTime', 'desc', 1)
      this.data.gradeId = 3
      that.data.index = 'createTime'
      that.setData({
        index: 'createTime'
      })
    }
  },

  // 请求数据
  getShopMember: function (gradeId, index, sort, size) {
    var _this = this
    wx.$ajax({
      api: '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetShopMembers',
        gradeId: gradeId,
        sortBy: index,
        sortAction: sort,
        page: _this.data.page,
        size: 10,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      if (!res.data) {
        return
      }
      // res.data.forEach((e) => {
      //   if (e.CreateTime) {
      //     e.CreateTime = util.formatTime(new Date(e.CreateTime))
      //   }
      // })
      if (res.Status === "success") {
        console.log(res.data)
        res.data.forEach(v => v.CreateTime = v.CreateTime.split('T').join(' '))
        _this.setData({
          gradeId: gradeId,
          memberList: res,
          memberDetailList: res.data
        })
        console.log(_this.data.memberDetailList.length)
      }
    })
  },

  sortTit: function (e) {
    //每次点击都应该将当前的pageIndex变为1以及初始化加载更多
    var that = this
    that.data.page = 1
    that.data.isMore = true
    // console.log(that.data.isMore)
    if (that.data.index == e.currentTarget.dataset.index) {
      that.data.sort = that.indexData(that.data.index);
    } else {
      that.data.index = e.currentTarget.dataset.index
      that.setData({
        sort: 'desc',
        timeA: 'desc',
        memberA: 'desc',
        saleA: 'desc'
      })
    }
    that.setData({
      index: e.currentTarget.dataset.index
    })
    that.getShopMember(that.data.gradeId, e.currentTarget.dataset.index, that.data.sort, 1, 10)
  },
  indexData: function (index) {
    var that = this
    switch (index) {
      case 'createTime':
        that.setData({
          timeA: that.data.timeA == 'desc' ? 'asc' : 'desc'
        })
        return that.data.timeA
        break;
      case 'MemberTotal':
        that.setData({
          memberA: that.data.memberA == 'desc' ? 'asc' : 'desc'
        })
        return that.data.memberA
        break;
      case 'OrderTotal':
        that.setData({
          saleA: that.data.saleA == 'desc' ? 'asc' : 'desc'
        })
        return that.data.saleA
        break;
    }
  }

})