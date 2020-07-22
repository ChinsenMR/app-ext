const app = getApp();
const {
  getProductsList
} = require('../../utils/requestApi.js');
const {
  goodsSearch
} = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    inputVal: '', // 输入框输入的值
    list: [],
    page: 1, // 页码

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 底部自定义导航栏
    app.globalData.template.tabbar("tabBar", 0, this) //0表示第一个tabba
    this.initData();
  },

  Toproductdetai(e) {
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?p=${e.currentTarget.dataset.productid}&pagetype=${e.currentTarget.dataset.pagetype || ''}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  // 初始化数据
  initData: function() {
    let {
      list,
      page
    } = this.data;
    getProductsList({
      action: 'GetProducts',
      pageSize: 10,
      pageIndex: page,
      ActiveId: 4
    }).then(res => {
      if (res.statusCode == 200) {
        if (res.data.Result.Data.length == 0) return
        res.data.Result.Data.forEach(item => {
          list.push(item)
        })
        this.setData({
          list,
          page: page + 1
        })
        wx.setStorage({
          key: 'initData',
          data: res.data.Result.Data
        })
      } else console.log(res)
    })
  },

  // 搜索商品
  onSearch: function(e) {
    this.setData({
      list: wx.getStorageSync('initData')
    })
    let searchKey = e.detail.value,
      data = this.data.list,
      keyName = 'ProductName';
    this.setData({
      list: goodsSearch({
        searchKey,
        data,
        keyName
      })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.initData();
  },

 
})