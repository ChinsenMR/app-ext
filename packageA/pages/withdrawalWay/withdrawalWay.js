const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    list:[
      {
        name:'微信',
        id:2,
        value:'单天/每人最高 单笔5000',
        icon1:'icon_wechat@2x.png',
        icon2: 'icon_success@2x (1).png',
      },
      // {
      //   name: '支付宝',
      //   id: 3,
      //   value: '单天/每人最高 单笔5000',
      //   icon1:'zfb.png',
      //   icon2:'icon_success@2x (1).png',
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击跳转 回到提现页面
  handleGetId(e){ 
    let {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../../pages/withdraw/withdraw?id='+id,
      success: (result) => {
        
      },
      
    });
      
  },

  
})