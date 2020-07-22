const app = getApp()
import {
  countdown
} from '../../utils/util.js'
import {
  indexCountDown
} from '../../utils/requestApi.js'
let timer = null; // 定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl, //小图标
    goodslist: [], //商品列表
    pageType: null, //页面类型
    page: 1,
    notime: false, //此页面不需要商品列表里面倒计时,
    limeTime: {},
    StartDate: {},
    EndDate: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageType: options.id
    })
    this.initData(true)
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
    // 限时抢购倒计时
    let _this = this
    timer = setInterval(() => {
      this.initData(false)
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  // 初始化页面数据
  initData(param) {
    let {
      goodslist,
      page,
      pageType,
      StartDate,
      EndDate
    } = this.data;
    if (param) {
      indexCountDown({
        action: 'GetCountDownDetail',
        pageIndex: page,
        pageSize: 10,
        CountDownId: pageType
      }).then((res) => {
        if (res.statusCode == 200) {
          if (res.data.Result.Data.length == 0) return;
          res.data.Result.Data.forEach((item) => {
            goodslist.push(item)
          })
          this.setData({
            goodslist,
            StartDate: res.data.StartDate,
            EndDate: res.data.EndDate,
            page: page + 1
          })

        } else console.log(res)
      })
    }

    if (!countdown(StartDate).overTime) {
      this.setData({
        limeTime: {
          limitHours: countdown(StartDate).limitHours || '00',
          limitMin: countdown(StartDate).limitMin || '00',
          limitSecond: countdown(StartDate).limitSecond || '00',
          startState: true
        }
      })

    } else {
      this.setData({
        limeTime: {
          limitHours: countdown(EndDate).limitHours || '00',
          limitMin: countdown(EndDate).limitMin || '00',
          limitSecond: countdown(EndDate).limitSecond || '00',
          startState: false,
          overTime: countdown(EndDate).overTime
        }

      })
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
    this.initData(this.data.page);
  },


})