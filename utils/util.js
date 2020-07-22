const app = getApp();
import {
  payOrder,
  login
} from '../utils/requestApi.js';

module.exports = {

  debounce(fn, interval) { //防抖
    var timer;
    var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
    return function () {
      clearTimeout(timer);
      var context = this;
      let args = arguments[0]; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
      timer = setTimeout(function () {
        fn.call(context, args);
      }, gapTime);
    };
  },
  /**
   *  [ 倒计时函数 调用须知 ]: 
   *  @param {[array]} date [设定超时时间]  
   *  列如：  '2019-5-30 14:30:00' 
   * **/
  countdown: (date) => {
    let dateArr = '';
    date = date.toString()
    if (date.indexOf('T') != -1) dateArr = date.split('T');
    else dateArr = date.split(' ');
    let dateArr2 = dateArr[0].split('-').map((item) => {
      return parseInt(item)
    });
    dateArr2[1] -= 1;
    let dateArr3 = dateArr[1].split(':').map((item) => {
      return parseInt(item)
    });

    let now = new Date(); // 当前系统时间
    let to = new Date(...dateArr2, ...dateArr3); // 用户设定的时间
    let deltaTime = to - now; // 时间差 (单位/毫秒ms)
    let limitHours, limitMin, limitSecond;

    //超时
    if (deltaTime <= 0) {
      return {
        limitHours: '00',
        limitMin: '00',
        limitSecond: '00',
        overTime: true // 倒计时已过
      }
    }
    //计算天数后剩余的毫秒数
    let leave1 = deltaTime % (24 * 3600 * 1000);
    //计算出小时数
    let hours = Math.floor(leave1 / (3600 * 1000));

    //计算小时数后剩余的毫秒数
    let leave2 = leave1 % (3600 * 1000);
    //计算相差分钟数
    let minutes = Math.floor(leave2 / (60 * 1000));

    //计算分钟数后剩余的毫秒数
    let leave3 = leave2 % (60 * 1000);
    //计算相差秒数
    let seconds = Math.round(leave3 / 1000);

    return {
      limitHours: hours < 10 ? '0' + hours : hours,
      limitMin: minutes < 10 ? '0' + minutes : minutes,
      limitSecond: seconds < 10 ? '0' + seconds : seconds,
      overTime: false
    }
  },

  /**
   * [ 实现商品搜索功能 调用须知 ]: 
   * @param {{object}} opt
   * opt键： searchKey --> 搜索关键词[string]   data --> 搜索的商品数据列表[array]  keyName --> 要搜索过滤的键名[string]
   * opt: {searchKey:'123',data:[]，keyName：'ProductName'}
   * return结果: searchResult[ 搜索结果数组 ]
   * 
   *  调用案例： bindinput='onSearch'
        onSearch:function(e){
          this.setData({ list: wx.getStorageSync('initData')}) 每次搜索前复位list商品列表  说明如下：

          //  页面初始化 --> 把页面初始化的数据的缓存到本地  列如：
          //  wx.setStorage({
          //   key: 'initData',
          //   data: res.data
          //  })

          let searchKey = e.detail.value;
          let data = this.data.list;
          let keyName = 'ProductName';
          this.setData({
            list: goodsSearch({ searchKey, data, keyName })
          })
        }
   *  
   */
  // 关键字搜索功能
  goodsSearch: function (opt) {
    let searchResult = [];
    opt.data.forEach((item, index) => {
      if (item[opt.keyName].indexOf(opt.searchKey) != -1) searchResult.push(item);
      console.log("[[[[[", item[opt.keyName])
    })
    if (opt.searchKey != '') return searchResult;
  },

  //跳转登录页面
  toLoginPage: function () {
    wx.reLaunch({
      url: 'pages/authorizationLogin/authorizationLogin',
    })
  },

  // 支付订单
  // toPay: function (id, callback, failback) {
  toPay: function (id, callback) {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // console.log("支付id值",id);
    payOrder({
      orderId: id
    }).then(res => {
      // console.log("zhifu",res)
      if (res.data.Status == "Success") {
        // wx.hideLoading();
        let {
          prepayId,
          nonceStr,
          timeStamp,
          sign
        } = res.data.Data;
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: 'prepay_id=' + prepayId,
          paySign: sign,
          signType: 'MD5',
          success(res) {
            callback(res)
          },
          fail(res) {
            // failback(res)
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000,
              mask: true,
              success: (result) => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                  // wx.redirectTo({
                  //   url: '/pages/orderDetail/orderDetail?orderId='+ id,
                  // });

                }, 1000);
              },
            });
          }
        })
      } else {
        // wx.hideLoading();
        wx.showModal({
          title: res.data.Message,
          success: (result) => {
            if (result.confirm) {
              console.log("参团了");
              // wx.redirectTo({
              //   url: '/pages/orderDetail/orderDetail?orderId='+ id,
              // });
              wx.navigateBack({
                delta: 1
              });

            }
          },
        })

      }
    })
  },

  //绑定分享的方法
  bindingShare() {
    login({
      openId: app.data.openid, //		openId
      openType: 'hmeshop.plugins.openid.wxapplet', //小程序（hmeshop.plugins.openid.wxapplet）
      referralUserId: app.data.referralUserId //否	int	推荐人ID(注册时)
    }).then(res => {
      if (res.data.Status == 'Success') app.data.referralUserId = null
    })
  },



  /**
   *  检查是否还有更多
   * @param {number} curPage 当前页码
   * @param {number} curSize 当前页数
   * @param {number} dataLen 当前数据长度
   * @param {number} dataTotal 当前数据总长度
   */
  checkMore(curPage, curSize, dataLen, dataTotal) {
    let hasMore = true;

    if (!dataLen || dataLen + (curPage - 1) * curSize >= +dataTotal) {
      hasMore = false;
    }
    return hasMore;
  },
  /**
   *
   * @param {number} min 分钟格式化成小时 例如：60 -> 01:00
   */
  formatMinute(min) {
    const minute = min % 60;
    const hour = parseInt(min / 60);

    return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
  },


  /* 绑定上下级 */
  bindReferralUserId(options = {}, calllback) {
    console.log(222)
    const app = getApp();

    let referralUserId = app.globalData.agentId;

    /* 如果有携带代理ID referralUserId */
    const cookie = app.cache.loadCookie();

    console.log(cookie, referralUserId, 22333333)
    /* 判断是否已经登录 */
    if (referralUserId && cookie) {

      app.$api.bindReferralUserId({
        referralUserId
      }).then(res => {

        app.globalData.referralUserId = null;
        console.log(res, 213123)
        if (calllback && typeof calllback === 'function') {
          return calllback(res)
        } else {
          if (![0, -99, -1].includes(res.Code)) {
            app.alert.message(res.Msg)
          }
        }

      })
    }
  },
  /* 商品分享拼接 */
  createProductSharePath(includes, type) {
    const app = getApp();
    const {
      url,
      options
    } = includes;
    const userId = app.cache.loadUserInfo().UserId || '';

    let params;

    if (type === 'code') {
      params = `?opt=${[userId, ...options].join(',')}`
    } else {
      params = app.concatOptions({
        // agentId: app.cache.loadUserId(),
        opt: [userId, ...options].join(',')
      })
    }

    return url + params;
  },
  /* 获取分享的二维码 */
  getProductShareParams(opt) {

    let paramsData = decodeURIComponent(opt).split('opt=')[1] || opt;
    if (paramsData) {
      paramsData = paramsData.split(',');
      return {
        agentId: paramsData[0], // 代理id
        productId: paramsData[1], // 商品id
        groupId: paramsData[2], // 团id
        upAgentId: paramsData[3], // 分享团
      }
    }



  }
}