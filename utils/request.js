/**
 * 调用须知： 
 *  url: 请求的链接  必传值
 *  type： 请求类型  默认为POST 选传值
 *  data: 请求携带数据 默认值为{}  选传值  
 **/
function ajaxRequset(opt) {
  const app = getApp();

  const {
    data = {}
  } = opt;
  
  return new Promise(function (resolve, reject) {
    wx.request({
      method: opt.type || 'GET', // 默认请求类型为 GET
      url: app.data.url + opt.url,
      data,
      header: {
        'content-type': opt.type == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json', // 默认值
        Cookie: wx.getStorageSync('cookie') || app.data.cookie
      },
      success(res) {
        if (res.data.Status == 'Login') wx.navigateTo({
          url: '/pages/authorizationLogin/authorizationLogin'
        })
        else resolve(res)
        // resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

module.exports = ajaxRequset;