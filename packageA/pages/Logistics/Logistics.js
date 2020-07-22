/*
 * @Descripttion: 
 * @version: 
 * @Author: WuJixuan
 * @Date: 2020-06-03 14:53:51
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-06-23 10:48:55
 */
const app = getApp();
import { lookExpressData } from '../../../utils/requestApi.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    active: 0,
    logisticsInfo: null, // 物流公司信息
    steps: [],
    imgs: null, //产品信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    console.log("订单id", opt);
    let obj = JSON.parse(opt.item)
    this.setData({
      imgs: obj
    })
    console.log("产品数据", obj);
    this.initData(opt.id)
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



  initData(orderId) {
    wx.showLoading({ title: '加载中...' })
    lookExpressData({ OrderId: orderId }).then(res => {
      if(res.data.Success==true){
        wx.hideLoading();
        // console.log("物流信息", res);
        let arr = res.data.Traces;
        // console.log("物流详情信息1", arr);
        let newArr = []
        arr.forEach(item => {
          let obj = {}
          obj.text = item.AcceptStation
          obj.desc = item.AcceptTime
          newArr.push(obj)
        })
        // console.log("物流详情信息2", newArr);

        this.setData({
          steps: newArr,
          logisticsInfo: res.data
        })
      }
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