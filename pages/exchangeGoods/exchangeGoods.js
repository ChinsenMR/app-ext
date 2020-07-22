// pages/exchangeGoods/exchangeGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollItem:['全部', '卷发棒', '洁面仪', '美容器', '卷发棒', '洁面仪', '美容器'],
    activeItem: '0',  //当前的头部 tab
    selectAllStatus: false,
    totalPrice: 0,  // 总价
    list:[
      { 
        selectStatus: false, goodsImg: ' http://img.hmeshop.cn/hmeshop_jxy/images/big_pic@2x.png', 
        goodsTitle: '德国siku拖拉机真真真真仿', goodsPrice: '79.00'},
      {
        selectStatus: false, goodsImg: ' http://img.hmeshop.cn/hmeshop_jxy/images/big_pic@2x.png',
        goodsTitle: '德国siku拖拉机带大田喷喷雾仿', goodsPrice: '79.00'
      },
      {
        selectStatus: false, goodsImg: ' http://img.hmeshop.cn/hmeshop_jxy/images/big_pic@2x.png',
        goodsTitle: '德国siku拖拉机带大田喷车喷雾仿', goodsPrice: '79.00'
      }
    ]
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


  selectTab:function(event){
    console.log(event.currentTarget.dataset.id)
    this.setData({
      activeItem: event.currentTarget.dataset.id
    })
  },

  //全选
  selectAll:function(){
    let allS = this.data.selectAllStatus;
    let _list = this.data.list;
    _list.forEach((item) => {
      item.selectStatus = !allS
    })
    this.setData({
      selectAllStatus: !allS,
      list: _list
    })
    this.goodsSum();
  },

  // 单选
  selectSingle:function(event){
    let current = event.currentTarget.dataset.id;
    let s = this.data.list[current].selectStatus;
    let _s = `list[${current}].selectStatus`;
    this.setData({
      [_s]: !s
    })
    this.data.list.forEach((item)=>{
      if (!item.selectStatus){
        this.setData({
          selectAllStatus: false
        })
      }
    })
    this.goodsSum();
  },

  // 总价计算
  goodsSum:function(){
    let sum = 0;
    this.data.list.forEach((item) => {
      if (item.selectStatus){
        sum += parseInt(item.goodsPrice)
      }
    })
    this.setData({
      totalPrice: sum
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