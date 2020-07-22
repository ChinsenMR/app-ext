const app = getApp();
import { getPointExchangeInfo } from '../../utils/requestApi.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    list:[],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    app.globalData.template.tabbar("tabBar", 1, this) //0表示第一个tabba
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

  initData(){
    let { list, page } = this.data;
    getPointExchangeInfo({
      SessionId: wx.getStorageSync('sessionId'),
      type: 0,
      pageIndex: 10,
      pageSize: page
    }).then(res =>{

    })
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


  
})