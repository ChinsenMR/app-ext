
/**
 * 获取奖品列表
 * @params: 
 * gameid 游戏id
 * */ 
function getPrizeList(options) {
  return new Promise((resolve,reject)=>{
    wx.request({
      url: getApp().data.url +'/Api/VshopProcess.ashx?action=GetGamePriceInfo',
      data: options,
      success: function (res) {
        resolve(res.data)
      },
      fail: function(e) {
        reject(e)
      }
    })
  })
}

/**
 * 获得游戏列表
 * @params: 
 * GameType 游戏类型（幸运大转盘=0,疯狂砸金蛋=1,好运翻翻看=2,大富翁=3, 刮刮乐=4, 一元夺宝=5）可不填
 * Status  1为过期，0为活动中，可不填
 * PageIndex　页码 可不填
 * PageSize　每页多少条 可不填
 * beginTime　活动开始时间 可不填
 * endTime　活动结束时间 可不填
 * */
function getGameList(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().data.url + '/Api/VshopProcess.ashx?action=GetGameList',
      data: options,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (e) {
        reject(e)
      }
    })
  })
}

/**
 *获得游戏抽奖结果
 * @params: 
 * gameid 游戏id
 * sessionId　用户id
 * */
function getDrawPriceResult(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().data.url + '/Api/VshopProcess.ashx?action=GetDrawPriceResult',
      data: options,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (e) {
        reject(e)
      }
    })
  })
}

/**
 *游戏获奖名单
 * @params: 
 * Gameid 游戏id
 * PageIndex　页码
 * PageSize　每页多少条数据
 * */
function getWinPriceUserList(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().data.url + '/Api/VshopProcess.ashx?action=GetWinPriceUserList',
      data: options,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (e) {
        reject(e)
      }
    })
  })
}

/**
 *游戏基础信息
 * @params: 
 * gameId 游戏id
 * */
function getGameInfo(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().data.url + '/Api/VshopProcess.ashx?action=GetGameInfo',
      data: options,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (e) {
        reject(e)
      }
    })
  })
}

module.exports = {
  getPrizeList: getPrizeList,
  getGameList: getGameList,
  getDrawPriceResult: getDrawPriceResult,
  getWinPriceUserList: getWinPriceUserList,
  getGameInfo: getGameInfo
}