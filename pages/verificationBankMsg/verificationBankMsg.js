// pages/verificationBankMsg/verificationBankMsg.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree:false,
    showLine:false,
    optionsData:{},
    userMsgData:[
     {
        img: '/images/user.png',
        name: 'userName',
        placeholder: '请填写持卡人姓名',
        val: '',
        type: 'text'
     },
      {
        img: '/images/idcard1e.png',
        name: 'userName',
        placeholder: '请填写身份证',
        val: '',
        type: 'idcard'
      },
      {
        img: '/images/phone.png',
        name: 'userName',
        placeholder: '请输入手机号码',
        val: '',
        type: 'number'
      }
    ]
  },
  aggreyou:function(){
    let that = this.data
    if (that.showLine){
      this.data.userMsgData[0].val
      this.data.userMsgData[1].val
      this.data.userMsgData[2].val
      console.log('持卡人', that.userMsgData[0].val, '身份证', that.userMsgData[1].val, "手机号码", that.userMsgData[2].val, "卡号", that.optionsData.cardNumber, '卡类型', that.optionsData.checCardkType)
    }else{
      app.showToast('请完善信息')
    }

  },
  agree:function(){
    this.checklingth()
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  whatchInput:function(e){
    console.log(e.detail.value, e.target.dataset.index)
    this.data.userMsgData[e.target.dataset.index].val = e.detail.value
    this.checklingth()
  },
  checklingth:function(){
    console.log(this.data.userMsgData[1].val.length)
    if (this.data.userMsgData[0].val != "" && this.data.userMsgData[1].val.length == 18 && this.data.userMsgData[2].val.length == 11 && this.data.isAgree == true){
      this.setData({
        showLine:true
      })
    }else{
      this.setData({
        showLine: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      optionsData: options
    })

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