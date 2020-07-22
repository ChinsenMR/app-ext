// pages/myCollect/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display: "none",
    collectData: {}
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDataList(1, 100)
  },

  // 获取收藏列表接口
  getDataList: function (pageIndex, pageSize) {
    var _this = this
    wx.$ajax({
      api: '/Api/VshopProcess.ashx',
      data: {
        action: 'GetFavoriteList',
        pageIndex: pageIndex,
        pageSize: pageSize,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      if (res.Status === 'success') {
        _this.collectData = res.data
        // console.log(_this.collectData)
        _this.setData({
          collectData: res.data
        })
      } else if (res.Status === 'fail') {
        var block = "block"
        _this.setData({
          display: block
        })
      }
    })
  },

  // 取消收藏接口
  getDelData: function (favoriteId) {
    var _this = this
    wx.$ajax({
      api: '/api/VshopProcess.ashx',
      data: {
        action: 'DelFavorite',
        favoriteId: favoriteId
      }
    }).then(res => {
      console.log(res.success)
      if (res.success) {
        console.log("取消收藏成功")
      } else {
        console.log("取消收藏失败")
      }
    })
  },


  // 取消收藏
  cancelCollect: function (e) {
    // console.log(e)
    var _this = this
    // console.log(_this.collectData)
    wx.showModal({
      title: '提示',
      content: '您确定要取消收藏该商品吗？',
      success: function (res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.id
          var favId = e.currentTarget.dataset.favid
          console.log(favId)
          _this.collectData.splice(index, 1)
          _this.getDelData(favId)
          _this.setData({
            collectData: _this.collectData,
            display: _this.collectData.length ? 'none' : 'block'
          })
        } else if (res.cancel) {
          console.log('用户点击取消收藏')
        }
      }
    })
  }
})