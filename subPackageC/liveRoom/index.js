import { getLiveRoomList } from '../../utils/requestApi';
import { checkMore, isJSONStr, formatMinute } from '../../utils/util';
import Moment from '../../utils/moment';

const PAGE_SIZE = 10;

const LIVE_STATUS_UNAUDITED = 0;      // 未审核
const LIVE_STATUS_REJECTED = 1;       // 驳回的
const LIVE_STATUS_NOTBEGUN = 2;       // 待开播
const LIVE_STATUS_ING = 3;            // 直播中
const LIVE_STATUS_COMPLETE = 4;       // 已结束
const LIVE_STATUS_OVERDUE = 5;        // 过期的
const LIVE_STATUS = {
  [LIVE_STATUS_UNAUDITED]: '待审核',
  [LIVE_STATUS_NOTBEGUN]: '待开播',
  [LIVE_STATUS_ING]: '直播中',
  [LIVE_STATUS_COMPLETE]: '已结束',
  [LIVE_STATUS_OVERDUE]: '过期',
};

const app = getApp()
const clsMap = {
  [LIVE_STATUS_UNAUDITED]: 'unaudited',
  [LIVE_STATUS_NOTBEGUN]: 'notbegun',
  [LIVE_STATUS_ING]: 'ing',
  [LIVE_STATUS_COMPLETE]: 'end',
  [LIVE_STATUS_OVERDUE]: 'overdue',
};

function normalizeRoomList(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  const ret = [];
  data.forEach(item => {
    const { ShowImg, ...rest } = item;
    const atom = {
      ShowImg: ShowImg || [],
      statusTxt: LIVE_STATUS[rest.Status],
      // startTime: new Moment(rest.BeginTime).format('MM-DD HH:mm:ss'),
      // endTime: new Moment(rest.EndTime).format('MM-DD HH:mm:ss'),
      startTime: rest.BeginTime,
      endTime: rest.EndTime,
      cls: clsMap[rest.Status],
      interval: formatMinute(item.LiveTime),
      ...rest,
    };

    ret.push(atom);
  });

  return ret;
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    alertInfo: {},
    alertT: false,
    alert: false,
    size: PAGE_SIZE,
    status: -1,
    statusVisible: false,
    titleNav: '全部播放状态',
    statusList: [
      {
        type: -1,
        title: '全部播放状态',
      },
      {
        type: LIVE_STATUS_UNAUDITED,
        title: '待审核',
      },
      {
        type: LIVE_STATUS_NOTBEGUN,
        title: '待开播',
      },
      {
        type: LIVE_STATUS_ING,
        title: '直播中',
      },
      {
        type: LIVE_STATUS_COMPLETE,
        title: '已结束',
      },
      {
        type: LIVE_STATUS_OVERDUE,
        title: '过期',
      },
    ],
    roomList: [],
    loading: true,
    finished: true,
    userInfo: wx.getStorageSync('userInfo'),
    huiShow: false,
    videoList: [],
    huiPage: 1,
    huiFinsh: false,
    liveId: 0,
  },

  
  onCloseP(){
    this.setData({
      huiShow:false,
    })
  },

  // 
  openAlert(e) {
    this.setData({
      huiShow: true,
      liveId: e.currentTarget.dataset.id,
      videoList: [],
      huiPage: 1,
      huiFinsh: false,
    })
    this.huifan()
  },

  huifan() {
    let data = this.data, that = this
    if (data.huiFinsh) return
    app.fl()
    app.fg({
      url: "/api/LiveInfo.ashx?action=GetLiveReplay",
      data: {
        liveId: data.liveId,
        size: 10,
        index: data.huiPage,
      },
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'true'&&r.data.Data) {
        data.videoList = [...data.videoList, ...r.data.Data.Data]
        that.setData({
          videoList: data.videoList,
          huiPage: ++data.huiPage,
          huiFinsh: r.data.Data.Data.length < 10,
        })
      } else app.fa(r.data.Message)
      console.log(r)
    })
  },


  toFNN(e){
    wx.navigateTo({
      url:e.currentTarget.dataset.url
    })
  },


  alertInfoFN(e) {
    let a = e.currentTarget.dataset.name == 'alertInfo' ? 'alert' : 'alertT'
    this.setData({
      alertInfo: e.currentTarget.dataset.data,
      [a]: true,
    })
    console.log('222222')
    if (e.currentTarget.dataset.name == 'alertInfo') {
      let that = this
      const query = wx.createSelectorQuery()
      query.select('#myCanvas').boundingClientRect()
      query.exec(function (res) {
        that.createCan(res[0].width, res[0].height)
      })
    } else {
      let that = this
      const query = wx.createSelectorQuery()
      query.select('#myCanvasT').boundingClientRect()
      query.exec(function (res) {
        that.createCanT(res[0].width, res[0].height)
      })

    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLiveRoomList()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size } = this.data;
          res.Data.liveRoom.forEach(s => {
            s.BeginTime = s.BeginTime.replace('T', ' ')
            s.endTime = s.endTime.replace('T', ' ')

          })
          this.setData({
            roomList: normalizeRoomList(res.Data.liveRoom),
            finished: !checkMore(page, size, res.Data.liveRoom.length, res.Data.Total),
          });
        }

        this.setData({ loading: false });
      }).catch(err => {
        this.setData({ loading: false });
      });





  },


  toFN(e) {
    app.globalData.roomId = e.currentTarget.dataset.id
    // if (e.currentTarget.dataset.stu != '直播中') return app.fa(e.currentTarget.dataset.stu)
    wx.navigateToMiniProgram({
      appId: 'wxcbbd86b156ae4441',
    })


    // wx.navigateTo({
    //   url: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id='+e.currentTarget.dataset.id
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {




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


  createCan(rpxw, rpxh) {

    let that = this, z = rpxw / 275, alertInfo = this.data.alertInfo
    const ctx = wx.createCanvasContext('myCanvas', that)
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, rpxw, rpxh)
    ctx.setFillStyle('#FB1F4F')
    ctx.fillRect(0, 0, rpxw, 25 * z)
    ctx.setFontSize(14 * z)
    ctx.setFillStyle('#ffffff')
    ctx.fillText('头道惠', rpxw * 0.28 * z, 17 * z)
    ctx.setFontSize(11 * z)
    ctx.fillText('惠选精品好货', rpxw * 0.28 * z + 50, 17 * z)
    this.getImgPath(alertInfo.LiveCode[0]).then((res) => {
      ctx.drawImage(res.path, rpxw * 0.15 * z, 160 * z, 188 * z, 188 * z);
      ctx.draw(true);
      console.log(res, 111112222)
    })
    ctx.setFontSize(13 * z)
    ctx.setFillStyle('#333333')
    ctx.fillText(alertInfo.AnchorName, 60 * z, 62 * z)
    ctx.setFontSize(20 * z)
    ctx.setFillStyle('#FB1F4F')
    ctx.fillText('创建直播成功', rpxw * 0.28 * z, 110 * z)
    ctx.fillText('扫码开播', rpxw * 0.34 * z, 135 * z)
    ctx.setFontSize(13 * z)
    ctx.setFillStyle('#666666')
    ctx.fillText('扫描二维码开播', rpxw * 0.36 * z, 380 * z)
    this.getImgPath(alertInfo.ShowImg[0]).then((res) => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(32 * z, 59 * z, 18 * z, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(res.path, 16 * z, 43 * z, 32 * z, 32 * z);
      ctx.restore()
      ctx.draw(true);
    })

    ctx.draw();
  },

  createCanT(rpxw, rpxh) {
    let that = this, z = rpxw / 275, alertInfo = this.data.alertInfo
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
    this.getImgPath(alertInfo.ShowImg[0]).then((res) => {
      ctx.drawImage(res.path, 0, 55 * z, rpxw, 326 * z);
      ctx.draw(true);

    })
    this.getImgPath(alertInfo.ShowCode[0]).then((res) => {
      ctx.drawImage(res.path, 104 * z, 388 * z, 68 * z, 68 * z);
      ctx.draw(true);

    })
    ctx.setFontSize(11 * z)
    ctx.setFillStyle('#333333')
    ctx.setTextAlign('center')
    ctx.fillText('长按二维码识别小程序', 137.5 * z, 475 * z)
    ctx.setFontSize(13 * z)
    ctx.setFillStyle('#333333')
    ctx.setTextAlign('left')
    ctx.fillText(alertInfo.AnchorName.length < 4 ? alertInfo.AnchorName : alertInfo.AnchorName.slice(0, 3) + '..', 60 * z, 34 * z)
    this.getImgPath(alertInfo.ShowImg[0]).then((res) => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(32 * z, 30 * z, 18 * z, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(res.path, 10 * z, 12 * z, 40 * z, 40 * z);
      ctx.restore()
      ctx.draw(true);
    })

    ctx.draw();
  },

  closeAlert() {
    this.setData({
      alert: false,
      alertT: false,
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

  onReachBottom() {
    if (
      this.data.loading ||
      this.data.finished
    ) {
      return;
    }

    this.setData({
      page: this.data.page + 1,
      loading: true,
    });

    this.getLiveRoomList()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size, roomList } = this.data;
          this.setData({
            roomList: roomList.concat(normalizeRoomList(res.Data.Data)),
            finished: !checkMore(page, size, res.Data.Data.length, res.Data.TotalRecords),
          });
        } else {
          this.setData({ page: this.data.page - 1 });
        }

        this.setData({
          loading: false,
        });
      }).catch(err => {
        this.setData({
          page: this.data.page - 1,
          loading: false,
        });
      });
  },

  getLiveRoomList() {
    const { page, size, status, userInfo } = this.data;
    const payload = {
      index: page,
      size,
      anchorId: userInfo.UserId,
    };

    if (status !== -1) {
      payload.liveStatus = status;
    }

    return getLiveRoomList(payload);
  },

  handleShowStatus() {
    this.setData({ statusVisible: true });
  },

  handleCloseStatus() {
    this.setData({ statusVisible: false });
  },

  handleChangeStatus(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      status: type,
      page: 1,
      roomList: [],
      loading: true,
      finished: false,
      titleNav: e.currentTarget.dataset.title,
    });
    this.handleCloseStatus();

    this.getLiveRoomList()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size } = this.data;
          res.Data.liveRoom.forEach(s => {
            s.BeginTime = s.BeginTime.replace('T', ' ')
            s.endTime = s.endTime.replace('T', ' ')

          })
          this.setData({
            roomList: normalizeRoomList(res.Data.liveRoom),
            finished: !checkMore(page, size, res.Data.liveRoom.length, res.Data.Total),
          });
        }

        this.setData({ loading: false });
      }).catch(err => {
        this.setData({ loading: false });
      });
  },

  toFNAdd() {
    wx.navigateTo({
      url: '/subPackageC/newLive/index'
    })
  }
})
