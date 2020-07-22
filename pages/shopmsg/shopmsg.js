// pages/shopmsg/shopmsg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: {},
    imgURL: '',
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(11)
    this.getShopInfo(2)
  },

  // 获取店铺信息
  getShopInfo: function (infoType) {
    var that = this;
    wx.request({
      url: getApp().data.url + '/api/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetDistributorCommission',
        infoType: infoType,
        sessionId: wx.getStorageSync('sessionId')
      },
      success: function (res) {
        console.log(res)
        if (res.data.Status == "success") {
          // console.log(res.data.data[0])
          that.setData({
            shopInfo: res.data.data[0],
            imgURL: res.data.data[0].logo
          })
        }
      }
    })
  },

  // 重新上传头像
  loadHeadImg: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        that.setData({  //修改
          imgURL: res.tempFilePaths[0]   
        })
        console.log('更改头像', res.tempFilePaths[0])

        that.upLoadImg(that, res.tempFilePaths)
      },
      fail: function (data) {
        console.log('错误信息', data)
      }
    })
  },

  /**
 * 上传图片
 * */
  upLoadImg: function (page, path) {
    wx.showLoading({
      title: '正在上传',
      mask: true
    })
    wx.uploadFile({
      url: getApp().data.url + '/Api/VshopProcess.ashx?action=UpLoadHead',
      filePath: path[0],
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        'Type': 2,  // 1个人资料,2店铺
        'sessionId': wx.getStorageSync('sessionId')
      },
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        console.log('1111', JSON.parse(res.data))
        let resData = JSON.parse(res.data)
        if (resData.Status === 'success') {
          page.setData({
            imgURL: resData.data
          })
        } else {
          wx.showModal({
            title: '提示',
            content: resData.errorMsg,
            showCancel: false
          })
        }
      },
      fail: function (e) {
        wx.hideLoading()
        console.log(e)
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      }
    })
  },

  //保存信息 
  formSubmit: function (e) {
    var that = this
    var storeName = e.detail.value.storeName
    if (storeName == "") {
      wx.showToast({
        title: '请输入正确的店铺名称',
        icon:'none'
      })
      return
    } 
    var phoneRex = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    if (e.detail.value.Phone == "" || e.detail.value.Phone == null || !phoneRex.test(e.detail.value.Phone)) {
      wx.showToast({
        title: '请输入正确手机号码',
        icon: 'none'
      })
      return
    }
    var AlipayRex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (e.detail.value.requestAccount == "" || e.detail.value.requestAccount == null ) {
      wx.showToast({
        title: '请填写正确的提现账号',
        icon: 'none'
      })
      return
    }
    this.SaveMsg(storeName, e.detail.value.storeDescription, e.detail.value.requestAccount, this.data.imgURL, e.detail.value.Phone)
  },

  textArea: function (e) {
    var val = e.detail.value
    if (val.length >= 30) {
      wx.showToast({
        title: '只能填写30个字哦',
        icon: 'none'
      })
    }
  },

  //保存信息接口 
  SaveMsg: function (stroename, descriptions, accountname, logo, CellPhone) {
    var that = this;
    wx.request({
      url: getApp().data.url + '/api/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'SetMyDistributor',
        stroename: stroename,
        descriptions: descriptions,
        accountname: accountname,
        logo: logo,
        CellPhone: CellPhone,
        sessionId: wx.getStorageSync('sessionId')
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.Status === "success") {
          wx.showToast({
            title: '保存信息成功',
            duration:3000
          })
          setTimeout(function () {
            wx.navigateBack(-1)
          }, 3000);
        }
      }
    })
  }
})