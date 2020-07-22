// pages/groupInformation/groupInformation.js
import {
  countDown
} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '', //订单号
    allData: {}, //页面数据
    headimg: [], //所有用户头像
    NowDate: '', //服务器时间
    EndTime: '', //结束时间
    timer: null, //定时器标识
    countDownList: [], //倒计时
    ProductId: '', //商品ID
    groupTeamId: '', //拼团ID
  },

  // 转发
  onShareAppMessage: function(res) {
    if (res.from === 'button') {}
    return {
      title: '邀请好友参团',
      path: '/pages/groupBooking/groupBooking?id=' + this.data.ProductId + '&groupTeamId=' + this.data.groupTeamId,
      success: function(res) {
        console.log('成功', res)
      }
    }
  },

  // 获取页面数据
  getCollageDetail: function() {
    var _this = this
    wx.request({
      url: getApp().data.url + '/Api/VshopCollageProcess.ashx',
      data: {
        action: 'GetCollageDetailsByTeam',
        orderId: _this.data.orderId, //订单编号
        sessionId: wx.getStorageSync('sessionId')
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // 登陆
        if (res.data.Status === 'login') {
          turnToLoginPage()
        }
        if (res.data.Status === 'success') {
          if (res.data.data.length == 0) {
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none'
            })
            setTimeout(function() {
              wx.navigateBack({})
            }, 2000)
            return
          }
          console.log(res.data)
          var allData = res.data.data[0], //全部数据
            ProductId = res.data.data[0].CollageProductId, //商品id
            groupTeamId = res.data.data[0].CollageTeamId, //拼团ID
            residue = parseInt(res.data.data[0].SurplusCount), //剩余拼团人数
            headimg = res.data.data[0].UserHead.split(','), //所有成员头像
            NowDate = new Date(res.data.NowDate).getTime(), //服务器时间
            EndTime = new Date(res.data.data[0].EndTime).getTime(); //结束时间
          if (residue > 0) {
            if (res.data.data[0].UserHead === '') {
              var residue = parseInt(residue - 1)
            }
            for (var i = 0; i < residue; i++) {
              headimg.push('')
            }
          }
          _this.setData({
            allData: allData,
            headimg: headimg,
            NowDate: NowDate,
            EndTime: EndTime,
            ProductId: ProductId,
            groupTeamId: groupTeamId
          })
          console.log(_this.data.headimg)
          _this.countDown();
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none'
          })
          console.log('数据出错')
        }
      },
      fail: function(e) {
        wx.hideLoading()
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
    let endTime = this.data.EndTime; //活动结束时间数组
    let countDownArr = []; // 对结束时间进行处理渲染到页面 
    let obj = null; // 如果活动未结束，对时间进行处理 
    if (endTime - newTime > 0) {
      let time = (endTime - newTime) / 1000; // 获取天、时、分、秒 
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      let ms = parseInt(((time * 1000) % 1000) / 100)
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec),
        ms: ms
      }
    } else { //活动已结束，全部设置为'00' 
      clearTimeout(this.data.timer)
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00',
        ms: '0'
      }
    }
    countDownArr.push(obj);
    this.setData({
      countDownList: countDownArr,
      NowDate: parseInt(this.data.NowDate + 100)
    })
    this.data.timer = setTimeout(this.countDown, 100);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      orderId: options.id
    })
    this.getCollageDetail()
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
    wx.hideShareMenu()
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
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})