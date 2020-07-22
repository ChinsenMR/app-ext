import { getSplittinDetails, orderDetail } from '../../../utils/requestApi.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    isEmpty: false,
    img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1693705592,2304443847&fm=26&gp=0.jpg',
    infos:[],
    nums:'',
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.initData();
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

  initData() {
    wx.showLoading({ title: '加载中...' })
    let { list, page, isEmpty } = this.data;
    getSplittinDetails({
      pageSize: 10,
      pageIndex: page,
      IsUse: false
    }).then(res => {
      console.log("输出预计收益明细",res);
      wx.hideLoading()
      if (res.data.Status == 'Success') {
        if (res.data.Data.length != 0){
          list = [...list, ...res.data.Data]
          page++
        } else isEmpty = true
      }
      this.setData({ list, page, isEmpty })
    })
  },
  //点击获取商品id
  handleClick(e){
    console.log("输出点击值",e);
    let { order,index } = e.currentTarget.dataset;
    this.setData({
      nums:index,
      isShow:!this.data.isShow
    })
    this.getOrder(order);//201911138938609
  },

  //获取订单详情
  getOrder(id){
    orderDetail({
      orderId: id,
      // orderId:'201911138938609'
    }).then(res=>{
      console.log("输出订单详情",res);
      if(res.data.Status=="Success"){
        let data = res.data.Data.Suppliers[0].LineItems;
        this.setData({
          infos:data
        })
      }
    })
  },

  //关闭详情
  handleGb(e){
    console.log("输出了e",e);
    let { index } = e.currentTarget.dataset;
    this.setData({
      infos:[],
      
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.page = 1;
    this.setData({
      list: []
    });
    this.initData();
    //  结束下拉刷新组件的显示
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.initData();
  },

})