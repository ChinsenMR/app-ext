// pages/lottery/lottery.js
import {
  getGameInfo,
  getPrizeList,
  getDrawPriceResult
} from '../../utils/game.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameCount: 2,   // 游戏次数
    flag: true, // 显示中奖信息
    isEmpty: true, // 显示未中奖信息
    deg: 0,
    time: 0,
    finalPrize: {}, // 中奖结果
    gameId: -1, // 游戏id
    baseData: {}, // 基本信息
    prizeData: [], // 奖品列表
    isClicked: false // 抽奖开关
  },

  turntable() {
    if (this.data.isClicked) {
      return
    }
    let _this = this
    if (this.data.baseData.TodayCanPlayTime == 0) {
      wx.showModal({
        title: '提示',
        content: `您今天游戏的次数已用玩`,
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    this.data.isClicked = true
    getDrawPriceResult({
      gameid: this.data.gameId,
      sessionId: wx.getStorageSync('sessionId')
    })
      .then(res => {
        console.log('结果', res)
        if (res.Status === 0) {
          this.setTurntableDeg(this.setLotteryDrawData(res.Data.PrizeName))
          if (this.data.baseData.TodayCanPlayTime != -1) {
            --this.data.baseData.TodayCanPlayTime
            this.setData({
              baseData: this.data.baseData
            })
          }
          if (res.Data.PrizeName == '未中奖') {

          } else {
            this.data.prizeData.map(el => {
              if (el.PrizeName === res.Data.PrizeName) {
                this.setData({
                  finalPrize: {
                    Prize: el.Prize,
                    PrizeImage: el.PrizeImage
                  }
                })
              }
            })
          }
        }else if(res.Status === -2){
          wx.showToast({
            title: res.ErrorMsg,
            icon:'none',
            mask:true
          })
        }
      })
  },

  /**
   * 配置转盘角度数据
   * */
  setTurntableDeg: function (data) {
    var lottery = Math.floor(360 / 16) * data
    if (data > 10) {
      lottery += 5
    }
    this.setData({
      deg: 360 * 3 + lottery,
      time: 2
    })
    setTimeout(() => {
      this.setData({
        deg: lottery,
        time: 0,
      })
    }, 2000)
    setTimeout(() => {
      this.data.isClicked = false
      this.setData({
        flag: data === 5 || data === 9 ? true : false,
        isEmpty: data === 5 || data === 9 ? false : true
      })
    }, 2300)
  },

  /**
   * 配置抽奖结果数据
   * @param data： 中奖等级（未中奖即幸运奖）
   * */
  setLotteryDrawData: function (data) {
    let num = parseInt(Math.random() * (10 + 1))
    switch (data) {
      case '二等奖':
        return 15
      case '三等奖':
        return num > 5 ? 13 : 2
      case '四等奖':
        return num > 5 ? 11 : 3
      case '未中奖':
        return num > 5 ? 5 : 9
      case '一等奖':
        return 7
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('id', options)
    this.data.gameId = options.id
    let self = this
    this.getBaseData()
    getPrizeList({
      gameId: this.data.gameId
    }).then(res => {
      console.log('奖品列表 ', res)
      this.setData({
        prizeData: res.Data
      })
    }).catch(e => {
      console.log(e)
    })
  },

  onReady() {
    console.log("onReady")
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


  show: function () {
    this.setData({
      flag: false
    })
  },
  conceal: function () {
    this.setData({
      flag: true,
      isEmpty: true
    })
  },
  myCatchTouch: function () {
    return;
  },

  /**
   * 获取游戏基本信息
   * */
  getBaseData: function () {
    getGameInfo({
      gameId: this.data.gameId,
      sessionId: wx.getStorageSync('sessionId')
    }).then(res => {
      console.log('base ', res)
      if (res.Status === 0) {
        if (res.Data.BeginTime.indexOf('T') != -1) {
          res.Data.BeginTime = res.Data.BeginTime.replace('T', ' ')
        }
        if (res.Data.EndTime.indexOf('T') != -1) {
          res.Data.EndTime = res.Data.EndTime.replace('T', ' ')
        }
        this.setData({
          baseData: res.Data
        })
      }
    }).catch(e => {
      console.log(e)
    })
  }
})