Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    status: 4,      // 4待评价 5已评价
    orderList: [],  // 订单列表
    page: 1,       // 当前页数
    dataLength: 0  // 每次获取数据长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {

  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDataList()
  },

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
    if (this.data.dataLength == 10) {
      this.data.page++
      this.getDataList()
    } else {
      console.log('没了')
    }
  },



  /**
   * 申请售后
   * */
  onExchange: function (e) {
    console.log(e)
    let orderIndex = e.currentTarget.dataset.id.split('_')[0]
    let proIndex = e.currentTarget.dataset.id.split('_')[1]
    let order = {
      OrderId: this.data.orderList[orderIndex].OrderId,
      OrderTotal: this.data.orderList[orderIndex].OrderTotal,
      OrderStatusNum: this.data.orderList[orderIndex].OrderStatusNum,
      OrderItems: [this.data.orderList[orderIndex].OrderItems[proIndex]]
    }
    wx.setStorageSync("refundOrder", JSON.stringify(order))
    wx.navigateTo({
      url: '/pages/exchanged/exchanged?id=' + e.target.dataset.id,
    })
  },

  /**
   * 进入商品评价页
   * */
  onToEvaluatePage: function (e) {
    console.log(e)
    let orderIndex = e.currentTarget.dataset.id.split('_')[0]
    let proIndex = e.currentTarget.dataset.id.split('_')[1]
    let order = {
      OrderId: this.data.orderList[orderIndex].OrderId,
      OrderTotal: this.data.orderList[orderIndex].OrderTotal,
      OrderStatusNum: this.data.orderList[orderIndex].OrderStatusNum,
      OrderItems: [this.data.orderList[orderIndex].OrderItems[proIndex]]
    }
    wx.setStorageSync("refundOrder", JSON.stringify(order))
    wx.navigateTo({
      url: '/pages/productEvaluate/productEvaluate?id=' + e.target.dataset.id,
    })
  },

  /**
   * 进入商品详情页
   * */
  onShopDetailPage: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * tabs选择事件，选择待评价或已评价订单
   * */
  onSelectTabs: function (e) {
    console.log(e.detail.code)
    if (e.detail.code == 0) {
      this.data.status = 4
    } else {
      this.data.status = 5
    }
    this.setData({
      orderList: []
    })
    this.data.page = 1
    this.getDataList(false)
  },
  /**
   * 获取订单列表
   * */
  getDataList: function () { // isConcat是否上拉载的数据 true为上拉加载
    var _this = this
    wx.$ajax({
      api: '/Api/VshopProcess.ashx',
      data: {
        action: 'GetOrderListByUserId',
        pageIndex: this.data.page,
        pageSize: 10,
        status: this.data.status,
        sessionId: wx.getStorageSync('sessionId')
      }
    }).then(res => {
      console.log(res.data)
      if (res.Status === 'success') {
        _this.data.dataLength = res.data.length
        _this.setData({
          orderList: _this.data.orderList.concat(res.data),
          isEmpty: _this.data.orderList.concat(res.data).length ? false : true
        })
      } else {
        console.log('数据出错')
        _this.data.dataLength = 0
        _this.setData({
          isEmpty: _this.data.orderList.length ? false : true
        })
      }
    }).catch(e => {
      _this.setData({
        isEmpty: _this.data.orderList.length ? false : true
      })
    })
  }

})