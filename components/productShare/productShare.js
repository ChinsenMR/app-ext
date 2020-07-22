// component/productShare.js
// var baseImg = "https://img.hmeshop.cn/hmeshopV3/20190708/bg_pinzhi.png";
const baseImg = "http://hmqy.oss-cn-hangzhou.aliyuncs.com/hmeshop_jxy/images/sixiangshangcto.png";
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shareInfo: {
      type: Object,
      value: {}
    }, //画布数据
    infoId: String || Number,
    prDid: String || Number,
    pageType: String || Number,
    dlr: String || Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    ratio: 1, //屏幕比例
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭蒙层
    closeMask(e) {
      this.triggerEvent('closeEvent', {
        mode: e.target.dataset.mode
      });
    },
    // 防止滚动穿透
    disableScroll() {},
    // 创建画布
    creatCanvas(ratio) {
      const ctx = wx.createCanvasContext('qrCanvas', this),
        info = this.data.shareInfo;


      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, 320 * ratio, 480 * ratio)
      // 顶部
      this.getImgPath(baseImg).then((res) => {
        ctx.drawImage(res.path, 0, 0, 320 * ratio, 27 * ratio);
        ctx.draw(true);
      })
      // 用户信息
      ctx.save()
      ctx.beginPath()
      ctx.arc(32 * ratio, 55 * ratio, 20 * ratio, 0, 2 * Math.PI, false)
      ctx.clip()
      this.getImgPath(info.Picture).then((res) => {
        ctx.drawImage(res.path, 12 * ratio, 35 * ratio, 40 * ratio, 40 * ratio);
        ctx.draw(true);
      })
      ctx.restore()
      ctx.font = "normal bold 13px arial,sans-serif"
      ctx.setFillStyle('#333')
      ctx.fillText(info.NickName, 62 * ratio, 50 * ratio)
      ctx.font = "normal lighter 11px arial,sans-serif"
      ctx.setFillStyle('#999')
      ctx.fillText('我有一份好东西要分享给你', 62 * ratio, 70 * ratio)
      // 商品图片
      this.getImgPath(info.ImageUrl1).then((res) => {
        ctx.drawImage(res.path, 16 * ratio, 90 * ratio, 288 * ratio, 240 * ratio);
        ctx.draw(true);
      })
      // 二维码
      this.getImgPath(info.MiniProgramCard).then((res) => {
        // ctx.drawImage(res.path, 215 * ratio, 360 * ratio, 90 * ratio, 90 * ratio);
        ctx.drawImage(res.path, 185 * ratio, 343 * ratio, 110 * ratio, 110 * ratio);
        ctx.draw(true);
      })
      // 扫码文字
      ctx.setFillStyle('#999')
      ctx.setFontSize(10)
      // ctx.fillText('长按扫码进入', 220 * ratio, 470 * ratio)
      ctx.fillText('长按扫码进入', 205 * ratio, 470 * ratio)
      // 金额
      ctx.font = "normal bold 24px arial,sans-serif"
      ctx.setFillStyle('#ff4444')
      ctx.fillText('￥' + info.SalePrice, 16 * ratio, 400 * ratio)
      ctx.font = "normal lighter 12px arial,sans-serif"
      ctx.setFillStyle('#999')
      ctx.fillText('商城价：￥' + info.MarketPrice, 16 * ratio, 420 * ratio)
      // 商品名称
      ctx.setFillStyle('#333')
      let productName = "";
      for (let i = 0; i < info.ProductName.length; i++) {
        let letter = info.ProductName[i],
          productNameWidth = ctx.measureText(productName).width;
        if (productNameWidth > 120) {
          productName += "..."
          break
        } else {
          productName += letter
        }
      }
      ctx.fillText(productName, 16 * ratio, 440 * ratio)
      ctx.draw()
      wx.hideLoading()
    },
    // 获取图片临时路径
    getImgPath(img) {
      return new Promise((resolve, reject) => {
        console.log(img)
        wx.getImageInfo({
          src: app.tools.setImage(img),
        success(res) {
            resolve(res)
          },
          fail(e) {
            reject(e)
          }
        })
      })
    },
    // 检查权限
    checkAuthority() {
      var _this = this
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                _this.saveImg();
              },
              fail() {
                _this.getAuthorityAgain();
              }
            })
          } else {
            _this.saveImg();
          }
        }
      })
    },
    // 保存图片
    saveImg() {
      wx.showLoading({
        title: '正在保存',
        icon: 'none'
      })
      this.createPngForCanvas('qrCanvas').then((res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(data) {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail(err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户拒绝时再次发起授权")
              this.getAuthorityAgain();
            } else if (err.errMsg != "saveImageToPhotosAlbum:fail cancel") {
              wx.showToast({
                title: '请截屏保存分享',
                icon: 'success',
                duration: 2000
              })
            }
          },
          complete(res) {
            var timer = setTimeout(() => {
              wx.hideLoading();
              clearTimeout(timer)
            }, 1500)
            console.log(res);
          }
        })
      })
    },
    // 再次获取权限
    getAuthorityAgain() {
      let _this = this;
      wx.showModal({
        title: '保存海报',
        content: '需要你提供保存相册权限',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success(setData) {
                if (setData.authSetting['scope.writePhotosAlbum']) {
                  _this.saveImg()
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: '获取相册权限失败',
                    icon: 'none'
                  })
                }
              }
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '保存海报需要提供相册授权',
              icon: 'none'
            })
          }
        }
      });
    },
   
    // 生成图片
    createPngForCanvas(id) {
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvasId: id,
          success(res) {
            resolve(res)
          },
          fail(e) {
            reject(e)
          }
        }, this)
      })
    },
  },
  attached() {
    var _this = this
    wx.getSystemInfo({
      success(res) {
        var width = res.windowWidth,
          height = res.windowHeight,
          ratio = 1;
        if (width <= 320) {
          ratio = 0.7
        } else if (320 < width <= 380) {
          ratio = 0.8
        }
        _this.setData({
          ratio: ratio
        })
        wx.showLoading({
          title: '正在生成海报',
        })
        _this.creatCanvas(ratio)
      }
    })

  }
})