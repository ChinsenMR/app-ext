const app = getApp()
import {
     getProductsList
} from '../../utils/requestApi.js'
Page({

     /**
      * 页面的初始数据
      */
     data: {
          goodslist: [], //商品列表
          page: 1, //页数
          newpeopleTotalRecords: 0,//总长度
          notime:false

     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function(options) {
          this.initData(this.data.page);
          console.log("ddd",options)
          // this.setData({
          //      pagetype: options.options
          // })
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

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function() {

     },

     // 初始化页面数据
     initData(page) {
          let {
               goodslist
          } = this.data;
          getProductsList({
                    action: 'GetProducts',
                    tagId: 15,
                    pageSize: 10,
                    pageIndex: page
               })
               .then((res) => {
                    if (res.statusCode == 200) {
                         if (res.data.Result.Data.length > 0) {
                              this.setData({
                                   page: this.data.page + 1
                              })
                              res.data.Result.Data.forEach((item) => {
                                   goodslist.push(item)
                              })
                              this.setData({
                                   goodslist
                              })
                         } else {
                              wx.showToast({
                                   title: '到底啦~~',
                              })
                         }
                    } else {

                    }
               })
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
          // console.log('当前页数：',this.data.page)
          this.initData(this.data.page);
     },

    
})