const app = getApp()
import Moment from '../../utils/moment';
const nowTime = new Date().getTime() + 3900000;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postImg: app.newImg,
    timeVisible: false,
    infoList: [
      {
        name: '直播状态',
        val: '待审核',
        pp: 'Status',
        plr: '1',
      },
      {
        name: '直播标题',
        val: '4.16日99风暴专场抢购',
        pp: 'Title',
        plr: '请输入修改的直播标题',
      },
      {
        name: '直播时间',
        val: '2020.05.23 10:30:00~2020.05.23 11:30:00',
        pp: 'BeginTimeCreateTime',
        plr: '请输入修改的直播时间',
        time: true
      },
      {
        name: '主播昵称',
        val: '李佳琦',
        pp: 'AnchorName',
        plr: '请输入修改的主播昵称',
      },
      {
        name: '主播微信号',
        val: 'LJQ2434443',
        pp: 'WechatNum',
        plr: '请输入修改的主播微信号',
      },
      {
        name: '允许评论',
        val: '是',
        pp: 'EnableEomment',
        plr: '请选择是否允许评论',
        choose: true,
      },
    ],
    filedsValues: {
      beginTime: nowTime,
      endTime: nowTime + 3600000,
    },
    fun: [
      {
        name: '去直播',
        img: app.newImg + 'rwm@3x.png',

      },
      {
        name: '分享',
        img: app.newImg + 'share@3x.png',

      }
    ],
    liveId: 0,
    dataInfo: {},
    open: false,
    moreNum: false,
  },

  subminFN() {
    let data = this.data, that = this, j = ''
    data.dataInfo.Products.forEach(s => {
      j ? j += ',' + s.ProductId : j = s.ProductId
    })
    console.log('111111111222222');
    app.fl()
    app.fg({
      url: '/api/LiveInfo.ashx?action=UpdateLiveRoom',
      data: {
        liveId: data.dataInfo.Id,
        anchorId: data.dataInfo.AnchorId,
        liveTitle: data.infoList[1].val,
        beginTime: new Moment(data.filedsValues.beginTime).format('YYYY-MM-DD HH:mm:ss'),
        endTimenew: new Moment(data.filedsValues.endTime).format('YYYY-MM-DD HH:mm:ss'),
        anchorName: data.infoList[3].val,
        wechatNum: data.infoList[4].val,
        enableEomment: data.infoList[5].val == '是' ? 2 : 1,
        showImg: data.dataInfo.ShowImg[0],
        liveImg: data.dataInfo.LiveImg[0],
        productIds: j,
      }
    }, true).then(r => {
      console.log("有输出值吗",r);
      app.fh()
      if (r.data.Status == 'true') {
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1450)
      }
      app.fa(r.data.Message)
      console.log(r)
    })

  },

  openMore() {
    let moreNum = this.data.moreNum
    this.setData({
      moreNum: !moreNum,
    })
  },
  handleStartTimeInput(e) {
    this.setData({
      'filedsValues.beginTime': e.detail,
    });
  },

  handleEndTimeInput(e) {
    console.log(e, 111112222222);
    this.setData({
      'filedsValues.endTime': e.detail,
    });
  },
  handleShowTime() {
    this.setData({ timeVisible: true });
  },

  handleCloseTime() {
    this.setData({ timeVisible: false });
  },
  hanldeSwitchTime(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ isStart: type === 'start' });
  },
  handleTimeConfirm() {


    this.setData({
      'infoList[2].val': new Moment(this.data.filedsValues.beginTime).format('MM月DD日HH:mm:ss') + '-' + new Moment(this.data.filedsValues.endTime).format('MM月DD日HH:mm:ss')
    });
    this.handleCloseTime();
  },


  onCloseP() {
    this.setData({
      open: false
    })
  },

  inputFN(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },

  openFN() {
    this.setData({
      open: true
    })
  },

  chooseFN(e) {
    this.setData({
      ['infoList[5].val']: e.currentTarget.dataset.val,
      open: false
    })
  },


  handleUploadImg(e) {
    const _this = this;
    wx.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.getUrl('UploadAppletImage'),
          filePath: tempFilePaths[0],
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: wx.getStorageSync('cookie')
          },
          appid: app.globalData.appId,
          name: 'file',
          formData: {
            appid: app.globalData.appId,
            openId: app.data.openId,
          },
          success: res2 => {
            let data = JSON.parse(res2.data);
            console.log("上传图片data", data);
            if (data.Status == "Success") {
              _this.setData({
                [e.currentTarget.dataset.name]: data.Data[0].ImageUrl,
              });
            }
          }
        })
      }
    })
    // wx.chooseImage({
    //   count: 1,
    //   success(res) {
    //     const { errMsg, tempFiles } = res;

    //     if (errMsg === 'chooseImage:ok') {
    //       const file = tempFiles.length ? tempFiles[0] : {};

    //       // 文件不能大于 1M
    //       if (file.size > 1048576) {
    //         wx.showToast({
    //           title: '图片太大，请重新上传'
    //         });
    //         return;
    //       }

    //       uploadFile([file.path]).then(res => {

    //         _this.setData({
    //           [e.currentTarget.dataset.name]: res[0],
    //         });
    //       })
    //     }
    //   },
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
    this.data.liveId = options.id
  },

  getData(id) {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: "/api/LiveInfo.ashx?action=GetLiveRoomInfo",
      data: {
        liveId: id
      },
    }, true).then(r => {
      console.log("初始化数据",r);
      app.fh()
      if (r.data.Status == 'true') {
        let datar = r.data.Data
        data.infoList.forEach(s => {
          s.val = datar[s.pp]
          s.pp == 'EnableEomment' ? (s.val = datar['EnableEomment'] == 1 ? '开启' : '关闭') : ''
        })
        data.infoList[2].val = datar.BeginTime.replace('T', ' ') + '  ' + datar.EndTime.replace('T', ' ')
        that.setData({
          infoList: data.infoList,
          dataInfo: datar
        })
      } else app.fa(r.data.message)
      console.log(r)
    })
  },

  createCanT(rpxw, rpxh) {
    let that = this, z = rpxw / 275, alertInfo = this.data.dataInfo
    const ctx = wx.createCanvasContext('myCanvasT', that)
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, rpxw, rpxh)
    let q = ''
    try {
      alertInfo.Title.match(/./g).forEach(w => {
        q += w
        if (ctx.measureText(q).width > 89) {
          throw new Error('')
        }
      })
    } catch (e) {
      q += ".."
    }


    ctx.setFontSize(14 * z)
    ctx.setFillStyle('#FB1F4F')
    ctx.setTextAlign('right')
    ctx.fillText(q, rpxw - 16, 34 * z)
    alertInfo.ShowImg ? this.getImgPath(alertInfo.ShowImg[0]).then((res) => {
      ctx.drawImage(res.path, 0, 55 * z, rpxw, 326 * z);
      ctx.draw(true);

    }) :
      alertInfo.ShowCode ? this.getImgPath(alertInfo.ShowCode[0]).then((res) => {
        ctx.drawImage(res.path, 104 * z, 388 * z, 68 * z, 68 * z);
        ctx.draw(true);

      }) : ''
    ctx.setFontSize(11 * z)
    ctx.setFillStyle('#333333')
    ctx.setTextAlign('center')
    ctx.fillText('长按二维码识别小程序', 137.5 * z, 475 * z)
    ctx.setFontSize(13 * z)
    ctx.setFillStyle('#333333')
    ctx.setTextAlign('left')
    ctx.fillText(alertInfo.AnchorName.length < 4 ? alertInfo.AnchorName : alertInfo.AnchorName.slice(0, 3) + '..', 60 * z, 34 * z)
    alertInfo.ShowImg ? this.getImgPath(alertInfo.ShowImg[0]).then((res) => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(32 * z, 30 * z, 18 * z, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(res.path, 10 * z, 12 * z, 40 * z, 40 * z);
      ctx.restore()
      ctx.draw(true);
    }) : ""

    ctx.draw();
  },

  closeAlert() {
    this.setData({
      alert: false,
      alertT: false,
    })
  },


  funFN(e) {
    if (e.currentTarget.dataset.index) {
      let that = this
      const query = wx.createSelectorQuery()
      query.select('#myCanvasT').boundingClientRect()
      query.exec(function (res) {
        that.createCanT(res[0].width, res[0].height)
      })

    } else {

    }
  },
  // 获取图片临时路径
  getImgPath(img) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: img,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },


  // 保存图片
  saveImg() {
    wx.showLoading({
      title: '正在保存',
      icon: 'none'
    })
    let _this = this

    wx.canvasToTempFilePath({
      canvasId: 'myCanvasT',
      success(res) {
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
      },
      fail(e) {
        setTimeout(() => {
          _this.saveImg()
        }, 1500)

      }
    }, _this)









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

  //点击遮罩层提醒
  handleClick(){
    app.fa('暂时无法操作,请看是否审核通过!',2000)
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