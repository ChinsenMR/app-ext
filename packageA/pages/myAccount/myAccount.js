import { getBalanceData, signAgreement, getAgreement} from '../../../utils/requestApi.js';
var WxParse = require('../../../wxParse/wxParse');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    listData: null, 
    page: 1,
    isEmpty: false,
    isShow:false,
    status:'',//是否同意协议
    isWin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.agreementData();
    this.initData();
  },

  //获取协议弹窗
  agreementData(){
    getAgreement({
      TypeId:2,//	是	int	协议类型，1为推广员协议，2为提现协议
    }).then(res=>{
      console.log("输出提现协议",res);
      if(res.data.Status=="Success"){
        let fwb = res.data.AContent;
        let sign = res.data.IsSign;
        if (sign==false){
          this.setData({
            isWin:true
          })
        }
        const regex = new RegExp('<p', 'gi');//修改富文本样式1
        fwb = fwb.replace(regex, `<p style="color: #fff;font-size:28rpx"`);//修改富文本样式2
        WxParse.wxParse('article', 'html', fwb, this, 0);
      }
      
    })
  },

  // 初始化数据
  initData(){
    wx.showLoading({ title: '加载中...' })
    let { page, list, listData, isEmpty } = this.data;
    getBalanceData({
      pageSize: 10,
      pageIndex: page
    }).then(res =>{
      wx.hideLoading()
      if (res.data.Status == 'Success') {
        listData = res.data
        if (res.data.Data.length != 0) {
          list = [...list, ...res.data.Data]
          page++
        } else if (page == 1 && res.data.Data.length == 0) isEmpty = true
      }
      this.setData({ page, list, listData, isEmpty })
    })
  },


  //跳转提现页面
  handleWithdraw(){
    if (this.data.listData.Balance==0){
      wx.showLoading({
        title: '余额不足!!!',
        mask: true,
        success: (result) => {
          setTimeout(() => {
            wx.hideLoading();
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
        },
      });
    }else{
      wx.navigateTo({
        url: '/packageA/pages/getInitDraw/getInitDraw',
        success: (result) => {
        },
      });
    }
  },
  
  //点击同意协议
  handleTY(e){
    console.log("输出",e);
    const { status } = e.currentTarget.dataset;
    this.setData({
      isShow:true,
      status,
    })
  },
  //点击同意弹窗
  handleAgree(){
    let sta = this.data.status;
    if(sta==1){
      //签订协议
      signAgreement({
        TypeId:2, //	是	int	协议类型id，1为推广员协议，2为提现协议
      }).then(res=>{
        console.log('签署协议状态',res);
        if(res.data.Status=="Success"){
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                this.setData({
                  isWin:false
                })
              }, 1500);
            },
            fail: () => {},
            complete: () => {}
          });
            
        }else {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        }
      })
    }else{
      wx.showToast({
        title: '请点击同意',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
        
    }
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
    this.initData()
  },

})