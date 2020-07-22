// pages/groupPage/groupPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [], //商品列表
    page: 1, //当前页数
    row: 10,
    keyWord: '', //搜索框内容
    actEndTimeList: [], //倒计时结束时间
    NowDate: '', //当前服务器时间
    timer: null //定时器
  },

  // 获取搜索框内容
  onFocus: function(e) {
    this.data.keyWord = e.detail.value
  },

  //搜索
  toSearch: function() {
    var _this = this
    _this.setData({
      goodslist: []
    })
    _this.getGroupData(_this.data.keyWord)
  },

  // 拼团首页数据
  getGroupData: function(data) {
    let _this = this
    wx.request({
      url: getApp().data.url+'/apI/VshopCollageProcess.ashx/ProcessRequest',
      // url: 'https://192.168.3.29:9888/apI/VshopCollageProcess.ashx/ProcessRequest',

      // url: getApp().data.url + '192.168.3.29:9888',

      data: {
        action: 'GetProductsByCollageActivity',
        page: _this.data.page,
        size: 10,
        productName: data,
        sessionId: wx.getStorageSync('sessionId') || ''
      },
      success: function(res) {
            console.log("拼团首页",res)

        if (res.data.Status === 'login') {
          wx.navigateTo({
            url: '/pages/authorizationLogin/authorizationLogin'
          })
          return
        }
        if (res.data.Status === 'success') {
          let endTimeList = _this.data.actEndTimeList;
          res.data.NowDate.replace(/T/, " ")
          res.data.data.forEach(v => {
            v.BeginTime = v.BeginTime.replace(/T/, " ")
            v.EndTime = v.EndTime.replace(/T/, " ")
            if (new Date(res.data.NowDate).getTime() > new Date(v.BeginTime).getTime()) {
              if (new Date(res.data.NowDate).getTime() > new Date(v.EndTime).getTime()) {
                v.enabled = 'close';
              } else {
                v.enabled = true;
              }
            } else {
              v.enabled = false
            }
            endTimeList.push(v.EndTime)
            if (v.TreamCommissionConfig) {
              v.TreamCommissionConfig = JSON.parse(v.TreamCommissionConfig)
            }
          })
          _this.data.row = res.data.data.length
          _this.data.goodslist = _this.data.goodslist.concat(res.data.data)
          var NowDate = new Date(res.data.NowDate).getTime()
          console.log('商品详情', res.data.data)
          _this.setData({
            goodslist: _this.data.goodslist,
            actEndTimeList: endTimeList,
            NowDate: NowDate
          })
          _this.countDown();
        }
      },
      fail: function(e) {
        console.log(e)
      }
    })
  },

  //小于10的格式化函数 
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },

  //倒计时函
  countDown() {
    let newTime = this.data.NowDate; // 当前服务器时间
    let endTimeList = this.data.actEndTimeList; //活动结束时间数组
    let countDownArr = []; // 对结束时间进行处理渲染到页面 
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      // console.log(new Date(o).getTime())
      let obj = null; // 如果活动未结束，对时间进行处理 
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000; // 获取天、时、分、秒 
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        let ms = parseInt(((time*1000) % 1000)/100)
        obj = {
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec),
          ms:ms
        }
      } else { //活动已结束，全部设置为'00' 
        clearTimeout(this.data.timer)
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          ms:'0'
        }
      }
      countDownArr.push(obj);
    }) // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({
      countDownList: countDownArr,
      NowDate: parseInt(this.data.NowDate + 100)
    })
    this.data.timer = setTimeout(this.countDown, 100);
  },

  // 前往拼团详情
  toGroupdetail: function(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/groupBooking/groupBooking?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGroupData('')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.page = 1
    this.data.goodslist = {}
    this.getGroupData(this.data.keyWord)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.row == 10) {
      this.data.page++
      this.getGroupData(this.data.keyWord)
    }
  },
})