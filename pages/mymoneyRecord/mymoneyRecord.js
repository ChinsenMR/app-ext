// pages/mymoneyRecord/mymoneyRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType:1,
    titleList:[
      {
        title:'提现明细',
        type:'0'
      },
      {
        title: '余额明细',
        type: '1'
      },
      {
        title: '佣金明细',
        type: '2'
      }
    ],
    tixianData:[
      {
        tip:'提现',
        val:'-￥150',
        time:'2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      }, 
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      },
      {
        tip: '提现',
        val: '-￥150',
        time: '2019/10/10'
      }
    ]
  },
  clickType(e){
    console.log(e.target.dataset.type)
    this.setData({
      showType: e.target.dataset.type
    })
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