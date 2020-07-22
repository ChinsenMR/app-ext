const app = getApp()
import { getProductsList } from '../../utils/requestApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    groupList: [], // 拼团
    page: 1, //页码
    imgNo: app.data.imgurl + 'zawuicons.png',
  },
  page:{
    index:1,
    size:10,
  },
  total:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
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


  // 参数化 数据
  initData() {
    app.fl();
    getProductsList({
      action: 'GetFightGroupActivityInfos',
      pageIndex: this.page.index,
      pageSize: this.page.size,
      sortBy: 'SalePrice'
    }).then(res => {
      console.log("初始化数据",res);
      if (res.statusCode == 200) {
        app.fh();
        let arr = res.data.Result.Data
        let all = res.data.Result.TotalRecords
        if (all / this.page.size < this.page.index) {
          this.total = 1
        } else {
          this.total = Math.ceil(all / this.page.size);
        }
        arr.forEach(item => {
          let per = Math.floor(item.SoldCount / (item.CanFightCount + item.SoldCount));
          item.percent = per;
          if (per >= 0.85 && per < 1) per = '即将售罄';
          else if (per == 1) per = '已售罄';
          else per += '%';
          item.percentTxt = per;
        })

        let newArr = [...this.data.groupList, ...arr];
        this.setData({ 
          groupList: newArr, 
        });
      }
      else {
        console.log(res)
        app.fh();
      }
    })
  },

  //跳转商品详情
  Toprodetai(e) {
    let url = `/pages/goodsDetail/goodsDetail?p=${e.currentTarget.dataset.productid}&pagetype=${e.currentTarget.dataset.pagetype || ''}`
    app.goTo(url)
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
    this.page.index = 1;
    this.setData({
      groupList: []
    });
    this.initData();
    //  结束下拉刷新组件的显示
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.page.index >= this.total) {
      app.fa('没有更多数据了!')
    } else {
      this.page.index++
      this.initData()
    }
  },

 
})