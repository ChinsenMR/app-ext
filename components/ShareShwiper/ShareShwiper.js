// components/ShareShwiper/ShareShwiper.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   path:String
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    saveImgBtnHidden: true,
    openSettingBtnHidden: false,
    SelectPit: "", //当前选中的图片
    imgurl: app.data.imgurl,
    imgUrls: [], //图片列表
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  ready() {
    this.InitData()
    // 获取用户授权初始化时的状态
    let _this = this
    wx.getSetting({
      success(res) {
        console.log("获取授权状态", res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          _this.setData({
            saveImgBtnHidden: true,
            openSettingBtnHidden: false
          })
        } else { //用户已经授权过了
          _this.setData({
            saveImgBtnHidden: false,
            openSettingBtnHidden: true
          })
        }
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化
      // 
    InitData() {
      console.log("===", this.data.path)  
      wx.showLoading({
        title: '加载中~~',
      })
      app.fg({
        url: '/API/QrcodeHandler.ashx?action=GetQrcodeList',
        data: {
          Type: 1,
          Path: this.data.path
        } //页面路径写死的先
      }).then(res => {
        console.log("=====", res)
        if (res.data.Status == 'Faile') {
          wx.hideLoading()
          this.triggerEvent("share")
          wx.showModal({
            title: res.data.Message,
          })
        } else {
          wx.hideLoading()
          this.setData({
            imgUrls: res.data.Result.Data
          })
        }
      })
    },
    Close() {
      this.triggerEvent("share")
    },
    // 选中
    bindchange(e) {
      this.setData({
        SelectPit: this.data.SelectPit ? this.data.imgUrls[e.detail.current].url : this.data.imgUrls[0].url
      })

    },
    // 用户手动授权
    handleSetting: function(e) {
      console.log("手动授权", e)
      let that = this;
      // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
      if (!e.detail.authSetting['scope.writePhotosAlbum']) {
        wx.showModal({
          title: '警告',
          content: '若不打开授权，则无法将图片保存在相册中！',
          showCancel: false
        })
        that.setData({
          saveImgBtnHidden: true,
          openSettingBtnHidden: false
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您已授权，赶紧将图片保存在相册中吧！',
          showCancel: false
        })
        that.setData({
          saveImgBtnHidden: false,
          openSettingBtnHidden: true
        })
      }
    },
    // 保存
    /*
     * 保存到相册
     */
    save: function() {
      console.log()
      var that = this;
      //获取相册授权
      let SelectPit = !this.data.SelectPit ? this.data.imgUrls[0].url : this.data.SelectPit
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            console.log("111111111")
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() { //这里是用户同意授权后的回调
                that.downLoadImage(SelectPit);
              },
              fail() { //这里是用户拒绝授权后的回调
                that.setData({
                  saveImgBtnHidden: true,
                  openSettingBtnHidden: false
                })
              }
            })
          } else { //用户已经授权过了
            that.downLoadImage(SelectPit);
          }
        }
      })
    },
    // 下载图片
    downLoadImage(imageUrl) {
      let that = this
      console.log("333333", imageUrl)
      // 下载文件  
      wx.downloadFile({
        url: imageUrl,
        success: function(res) {
          // 保存图片到系统相册  
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册了',
                showCancel: false,
                confirmText: '我知道啦',
                confirmColor: '#72B9C3',
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    that.setData({
                      hidden: true
                    })
                  }
                }
              })
            }
          })
        },
        fail: function(res) {
          console.log(res);
        }
      })
    },
  }
})