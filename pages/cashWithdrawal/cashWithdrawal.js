// pages/cashWithdrawal/cashWithdrawal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:{
      canPresentationMoney:750.00,//用户可提现金额
      inpVal:'',
      bankCardList:[
        {
          tip:'中国建设银行',
          type:'储蓄卡',
          number:'45164548454515546',
          isDefault:''
        }
      ],
    }
  },
  whatchIpt:function(e){//监听客户输入的金额
    // console.log(e.detail.value)
    this.data.inpVal = e.detail.value
    // console.log(typeof (this.data.inpVal))
    console.log(this.data.inpVal)
  },
  sendmoney:function(){
    this.data.inpVal
    let rgx = /^([1-9][0-9]*(\.\d{1,2})?)|(0\.\d{1,2})$/
    if (!rgx.test(this.data.inpVal)) {
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none',
        duration: 2000
      })
      return
    }else{
      console.log('能提交')
    }

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