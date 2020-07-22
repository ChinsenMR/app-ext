import { getInitDraw, requestBalance, getDrawRecords } from "../../utils/requestApi";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    yinhang: [ // 银行卡表单数据
      {
        title: '开户银行',
        hint: '填写你的开户银行',
        nameval: 'bankName',
        value: '',
        type: 'text',
        show: true
      },
      {
        title: '开户姓名',
        hint: '填写你的银行开户名',
        nameval: 'inofName',
        value: '',
        type: 'text',
        show: true
      },
      {
        title: '提现账号',
        hint: '填写你的提现账号',
        nameval: 'accountVal',
        value: '',
        type: 'number',
        show: true
      },
      {
        title: '备注',
        hint: '填写备注信息',
        nameval: 'remarkVal',
        value: '',
        type: 'text',
        show: true
      },
      {
        title: '交易密码',
        hint: '填写你的交易密码',
        nameval: 'passwrodVal',
        value: '',
        type: 'text',
        show: true
      },
    ],
    tabData: [
      {
        title: '申请提现',
        id: 1
      },
      {
        title: '提现记录',
        id: 2
      }
    ], //tab栏数据
    isShow: false,// 遮罩层和弹窗的显示
    depositData: null, // 提现初始化数据
    typeData: '银行卡', // 提现类型
    cardid: 1, //提现类型
    activeIndex: 0, // 默认tab栏
    photoList: [], //上传的图片
    drawData: [],// 提现记录数组
  },
  page:{
    index:1,
    size:10
  },
  total:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getIntitData();
    // this.getRecordData();
  },

  // 初始化页面数据
  getIntitData() {

    app.$api.getInitSplittinDraw({}).then(res=>{
      if (res.Status == "Success"){
        let obj = res.Data.Data;
        //判断是否设置了交易密码
        if (obj.IsOpenBalance == false) {
          wx.showLoading({
            title: '未设置交易密码',
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/packageA/pages/setPassword/setPassword',
                });
                wx.hideLoading();
              }, 1500);
            },
            fail: () => { },
            complete: () => { }
          });

        } else {
          this.setData({
            depositData: obj
          })
          this.getRecordData();
        }
      }
      
    })
  },

  // 申请提交
  formSubmit: function (e) {
    app.alert.loading();
    let arr = this.data.photoList;
    let newArr = []
    arr.forEach(v => {
      newArr += v + ','
    })
    let obj = e.detail.value;
    let data = {
      drawtype: obj.cardVal || '',        //是	int	提现类型，1为银行卡，2为微信，3为支付宝
      Amount: obj.cashAmount || '',	        //是	decimal	提现金额
      MaxAmount: this.data.depositData.MaxAmount || '',	      //是	decimal	可提现金额
      MinAmount: this.data.depositData.MinAmount || '',	      //是	decimal	最少提现金额
      BankName: obj.bankName || '',	      //否	string	银行名称
      AccountName: obj.inofName || '',	    //否	string	开户姓名
      MerchantCode: obj.accountVal || '',	  //否	string	提现账号
      Remark: obj.remarkVal || '',	        //否	string	备注
      TradePassword: obj.passwrodVal || '',	  //是	string	交易密码
      ImageUrl1: newArr || '',	      //否	string	身份正反面图片地址，用, 分割
    }
    app.$api.setSplittinDraws(data).then(res=>{
      if (res.Status == "Success") {
        app.alert.closeLoading();
        app.alert.toast(res.Message)
        setTimeout(() => {
          this.setData({
            activeIndex: 1
          })
        }, 1000);
      }else{
        app.alert.closeLoading();
        console.log("输出报错",res);
        app.alert.toast(res.Message)
      }
    })
  },
  // 获取个人提现记录
  getRecordData() {
    app.$api.getSplittinDrawRecords({
      pageIndex: this.page.index,
      pageSize: 10
    }).then(res=>{
      console.log("res",res);
      if(res.Status=="Success"){
        let arr = res.DrawRecords.Data
        let all = res.DrawRecords.TotalRecords
        arr.forEach((item, index) => {
          item.nyr = item.RequestDate.split(' ')[0];
          item.hfm = item.RequestDate.split(' ')[1];
        })
        if (all / this.page.size < this.page.index) {
          this.total = 1
        } else {
          this.total = Math.ceil(all / this.page.size);
        }

        let newArr = [...this.data.drawData, ...arr];
        this.setData({
          drawData: newArr
        })
      }
    })
  },
  //切换tab栏
  handleTab(e) {
    let { index } = e.currentTarget.dataset;
    this.setData({
      activeIndex: index,
    })
  },

  // 选择提现方式
  handleBankCard(e) {
    let { id,name } = e.currentTarget.dataset;
    this.setData({
      typeData: name,
      cardid:id,
      isShow: false
    })
  },
  // 选择提现方式打开弹窗
  handleTrigger(e) {
    this.setData({
      isShow: true
    })
  },
  //隐藏
  handleHide() {
    this.setData({
      isShow: false
    })
  },
  //取消
  handleCancel() {
    this.setData({
      isShow: false
    })
  },
  // 拍照、选图
  postImg(e) {
    var that = this
    if (this.data.photoList.length == 2) {
      wx.showModal({
        title: '最多2张图',
      })
      return
    }
    wx.chooseImage({
      count: 2,
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('选中图片', res)
        that.upLoadImg(that, res.tempFilePaths)
      },
      fail: function (error) { }
    })
  },

  // 上传图片
  upLoadImg: function (page, path) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    let _this = this
    const fs = wx.getFileSystemManager()
    path.forEach(img => {
      fs.readFile({
        filePath: img,
        encoding: 'base64',
        success(data) {
          console.log("base64", data)
          wx.request({
            url: app.data.url + '/api/PublicHandler.ashx?action=uploadimgbybase64',
            data: {
              baseStr: data.data
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success(res) {
              wx.hideLoading()
              if (res.data.Status == "Success") {
                _this.data.photoList.push(res.data.Message)
                console.log("上传的图片", _this.data.photoList);
                _this.setData({
                  photoList: _this.data.photoList
                })
              } else {
                wx.showToast({
                  title: '图片上传失败',
                })
              }
            }
          })
        }
      })
    })
  },
  // 删除图片
  Deleted(e) {
    let {
      index
    } = e.currentTarget.dataset.index
    this.data.photoList.splice(index, 1)
    this.setData({
      photoList: this.data.photoList
    })
  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.page.index = 1;
    this.setData({
      list: []
    });
    this.getRecordData();
    //  结束下拉刷新组件的显示
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.page.index >= this.total) {
      app.alert.toast('没有更多数据了!')
    } else {
      this.page.index++
      this.getRecordData();
    }
  },

  // 阻止遮罩层滚动问题
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },
})