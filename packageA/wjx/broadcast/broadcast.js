// fuPackageA/fuLive/fuLive.js
const app = getApp()
// "subscribe": "plugin-private://wx2b03c6e691cd7370/components/subscribe/subscribe"
let times = require('../../utils/time')
import {debounce} from '../../../utils/myutil'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    dataList: [], //直播列表数据
    page: 1,
    finsh: false,
    show: false,
    videoList: [],
    huiPage: 1,
    huiFinsh: false,
    liveId: 0,
    keyVal: '', //搜索值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  //获取直播列表
  getData(key) {
    console.log("key1111111", key);
    let data = this.data,
      that = this
    console.log("asdsad", data.finsh);

    if (data.finsh) return
    app.fl()
    app.fg({
      // url: "/api/LiveInfo.ashx?action=GetTopLiveRoomList",
      url: "/api/LiveInfo.ashx?action=GetTopLiveRoomListNew",
      data: {
        // size: 10,
        // index: data.page,
        SearchText: key || '', //搜索值
      }
    }, true).then(r => {
      console.log('直播列表', r);
      app.fh()
      if (r.data.Status == 'true') {
        r.data.Data.room_info.forEach(s => {
          s.start = times.formatTime(s.start_time, 'M月D日');
          s.section = `${times.formatTime(s.start_time, 'h:m:s')}~${times.formatTime(s.end_time, 'h:m:s')}`
          data.dataList.push(s)
        })
        that.setData({
          dataList: data.dataList,
          finsh: r.data.Data.room_info.length < 10,
        })
      } else app.fa(r.data.Message)
    })
  },


  //跳转直播间,将rid带给直播间
  toFN(e) {
    console.log("点击直播间的数据", e.currentTarget.dataset);
    let {
      rid,
      stu,
      url
    } = e.currentTarget.dataset
    // if(e.currentTarget.dataset.stu==2) return app.fa('未开播，不能观看哦！')
    if (rid == 0) {
      app.fa('房间id未同步或未开播!');
      return
    } else if (rid) {
      app.globalData.roomId = rid; //将直播房间id存入全局
      wx.navigateTo({
        url: url
      })
    }
  },

  onCloseP() {
    this.setData({
      show: false,
    })
  },

  // 
  openAlert(e) {
    const {
      id
    } = e.currentTarget.dataset
    app.goTo(`plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${id}`)


    this.setData({
      // show: true,
      liveId: e.currentTarget.dataset.id,
      videoList: [],
      huiPage: 1,
      huiFinsh: false,
    })
    // this.huifan()
  },

  //回放视频
  huifan() {
    let data = this.data,
      that = this
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
      if (r.data.Status == 'true' && r.data.Data) {
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
  //获取输入框的值
  handleInput: debounce(function (e) { //防抖
    this.setData({
      keyVal: e.detail.value
    });
  }, 500),
  // 确定搜索
  handleQD() {
    const {
      keyVal
    } = this.data;
    console.log("keyVal", keyVal);
    this.setData({
      dataList: [],
      finsh: false,
      page: 1
    })
    this.getData(keyVal)
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
    // this.getData();
  },

 
})