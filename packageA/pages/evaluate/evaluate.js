// packageA/pages/evaluate/evaluate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl,
    desvalue: 0,
    logisticsvalue: 0,
    atituvalue: 0,
    message: "",
    orderid: null,
    Produtinfo: {},
    photoList: [],
    comment1: '',
    comment2: '',
    comment3: '',
  },

  onChange1(event) {
    const levels = {
      1: '非常慢',
      2: '差',
      3: '一般',
      4: '好',
      5: '非常好'
    }

    this.setData({
      comment1: levels[event.detail],
      desvalue: event.detail
    });
  },
  onChange2(event) {
    const levels = {
      1: '非常慢',
      2: '慢',
      3: '一般',
      4: '快',
      5: '非常快'
    }


    this.setData({
      comment2: levels[event.detail],
      logisticsvalue: event.detail
    });


  },
  onChange3(event) {

    const levels = {
      1: '非常差',
      2: '差',
      3: '一般',
      4: '好',
      5: '非常好'
    }


    this.setData({
      comment3: levels[event.detail],
      atituvalue: event.detail
    });
  },
  onChange(event) {
    this.setData({
      message: event.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.id
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
    this.InintData()
  },

  InintData() {
    app.fg({
      url: '/API/OrdersHandler.ashx?action=GetOrderDetail',
      data: {
        orderId: this.data.orderid
      }
    }).then(res => {
      console.log("====", res)
      if (res.data.Status == "Success") {
        this.setData({
          Produtinfo: res.data.Data.Suppliers[0].LineItems
        })
      }

    })
  },
  // 拍照、选图
  postImg(e) {
    var that = this
    if (this.data.photoList.length == 9) {
      wx.showModal({
        title: '最多5张图',
      })
      return
    }
    wx.chooseImage({
      count: 5,
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('选中图片', res)
        that.upLoadImg(that, res.tempFilePaths)
      },
      fail: function (error) {}
    })
  },
  // 拍照、选图
  postVideo(e) {
    app.tools.upload({
      count: 9,
      url: '/AppShop/AppShopHandler.ashx?action=AppUploadImage',
      type: 'all'
    }).then(res => {
      console.log(res, 221)
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
              console.log("输出上传的图片", res);
              wx.hideLoading()
              if (res.data.Status == "Success") {
                _this.data.photoList.push(res.data.Message)
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
  // 提交
  Submit() {
    let {
      desvalue,
      logisticsvalue,
      atituvalue,
      message,
      photoList
    } = this.data

    if ([desvalue, logisticsvalue, atituvalue].includes(0)) {
      return app.alert.message('星评不能为空')
    }

    if (!message) {
      return app.alert.message('评论不能为空')
    }
    let sumRate = Number((desvalue + logisticsvalue + atituvalue) / 15)
    let imgliststring = photoList.toString()
    console.log("quaqujau", sumRate)
    app.fg({
      url: '/API/OrdersHandler.ashx?action=SubmitReview',
      data: {
        OrderId: this.data.orderid,
        SkuID: this.data.Produtinfo[0].Id,
        ReviewText: message,
        Score: Math.round(sumRate * 10),
        ImageUrls: imgliststring
      }
    }).then(res => {
      if (res.data.Status != "Success") {
        app.alert.message(res.data.Message)
        app.tools.goBackTomeOut();
        return
      }

      app.alert.message(res.data.Message)

    })
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