const app = getApp()
import {
  gettodaydata,
  indexCountDown,
  getImage,
  getindexcoupon,
  getindexsharedata,
  subBindTemReferral
} from '../../utils/requestApi.js'
import {
  throttle
} from "../../utils/myutil.js"
import {
  countdown
} from '../../utils/util.js'
let timer = null; // 定时器
let timer2 = null; // 定时器

Page({
  data: {
    swiperH: 150, //swiper高度
    statusBarHeight: null, //页面状态栏高度
    navHeight: null, // 页面导航栏高度
    showtarbar: false, //nav弹窗
    navitemactive: -1, //nav选中分类的状态
    sharestutes: false, //分享
    coupons: {},
    colse: true, //优惠券
    // 小图标
    imgurl: app.data.imgurl,
    //  顶部商品分类导航栏
    Categorydata: [],
    groupdata: [], //拼团
    countDownList: [], //限时抢购数据 
    bannerArr: [], // 轮播图
    bannerArr2: [], //占位广告
    newpeopledata: [],
    newpeoplepage: 1, // 新人优惠
    newpeopleTotalRecords: 0, //新人特惠的数据总数
    zhekoudata: [],
    zhekoupage: 1,
    zhekouTotal: 0, // 折扣专区,
    hasedtimedata: [],
    Freeshippingdata: [],
    Freeshippingtotal: 0,
    Nightpage: 1, // 9.9包邮
    status: 0, //选中状态
    active: -1, //顶部选中的状态
    // 分享
    cardCur: 1,
    swiperList: [],
    sepciledata: [], //今日特卖
    windowWidth: 0,
    windowHeight: 0,

    // 我的数据end
    imgUrls: [],
    noteList: [
      // '换肤清洁大作战 满199减100，你知道吗？',
      // '五一端午攻略来袭（最赞旅行面膜总结）',
      // ''
    ],
    userInfo:'',
    isHeight:false,
    tabStatus:true,
    tabHeight: 0,
    scrollTopss:0,
    homeTitle: '',//商城导航栏
    shareTitle:'',//分享图标
  },

  //返回自定义首页
  getBack(){
    wx.reLaunch({
      url: '/pages/moduleHome/moduleHome',
    })
  },

  Tovip() {
    wx.navigateTo({
      url: '/pages/applyAgent/applyAgent',
    })
  },
  // navbar
  showtarbar() {
    this.setData({
      showtarbar: !this.data.showtarbar
    })
  },
  // 选中nav
  Selectnav(e) {
    if (e.target.dataset.navitemactive == this.data.navitemactive) {
      return
    }
    this.setData({
      navitemactive: e.target.dataset.navitemactive
    })
  },
  // 今日特卖的选中
  select: function(e) {
    if (e.target.dataset.status == this.data.status) {
      return
    }
    this.setData({
      status: e.target.dataset.status
    })
    if (this.data.status == 1) {
      // this.GetCommngsale(true);////今日特卖因为定时器暂时注销2
    } else {
      this.Todayspecielsalse()
    }
  },
  // 顶部导航栏的选中
  selecttarbar(e) {
    if (e.target.dataset.active == this.data.active) {
      return
    }
    this.setData({
      active: e.target.dataset.active
    })
  },
  // 优惠券弹窗
  closemasker() {
    this.setData({
      colse: !this.data.coupons.Result
    })
  },
  // 分享
  share() {
    this.getShare()
    this.setData({
      sharestutes: !this.data.sharestutes
    })
  },
  // 保存图片
  savePiture() {
    let _this = this
    // 选中弹窗的分享图片
    // var downloadUrl = this.data.cardCur == 0 ? this.data.swiperList[this.data.cardCur + 1].url : this.data.swiperList[this.data.cardCur].url
    var downloadUrl = this.data.swiperList[this.data.cardCur].url
    if (!wx.saveImageToPhotosAlbum) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return;
    }
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
    wx.getSetting({
      success: function(res) {
        console.log("获取授权状态", res)
        var statu = res.authSetting;
        if (!statu) {
          wx.showModal({
            title: '是否授权当前保存图片',
            content: '需要保存图片，请确认授权，否则保存功能将无法使用',
            success: function(tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success: function(data) {
                    if (data.authSetting["scope.writePhotosAlbum"] === true) {
                      console.log("打开授权", data)
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      _this.downLoadImage(downloadUrl)
                    } else {
                      wx.showToast({
                        title: '授权失败，请重新授权',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          _this.downLoadImage(downloadUrl)
          // wx.showToast({
          //   title: '图片保存成功',
          // })
        }
      },
      fail(res) {
        console.log(res);
      }

    })
  },
  // 下载图片
  downLoadImage(imageUrl) {
    // 下载文件  
    wx.downloadFile({
      url: imageUrl,
      success: function(res) {
        // 保存图片到系统相册  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
            });
          },
          fail(res) {
            console.log(res);
          }
        })
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },
  DotStyle(e) {
    console.log("DotStyle", e)
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    console.log("弹窗swiper", e)
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 2 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;

      // 获取选中图片
      this.setData({
        swiperList: list,
        cardCur: parseInt(e.target.dataset.index) //获取图片下标
      })

    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      // 获取选中的图片
      console.log(" towerSwiper计算滚动", e.target.dataset.index)
      this.setData({
        swiperList: list,
        cardCur: parseInt(e.target.dataset.index) //获取图片下标
      })

    }
  },
  // 跳转搜索  
  Tosearch() {
    wx.navigateTo({
      url: '/pages/searchGoods/searchGoods',
    })
  },
  // 跳转折扣区
  Tonewpeople(e) {
    // console.log('跳转折扣区', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/Specialoffer/Specialoffer?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 跳转限时特惠
  tospcilelimit(e) {
    //   console.log("eeee",e)
    wx.navigateTo({
      url: '/pages/Specialtimelimit/Specialtimelimit',
    })
  },
  // 跳转9块9
  tonight() {
    wx.navigateTo({
      url: '/pages/nighpackge/nighpackge',
    })
  },
  // 跳转拼团
  toGroupindex() {
    wx.navigateTo({
      url: '/pages/Groupindex/Groupindex',
    })
  },
  // 跳转即将开售/今日特卖
  toCommingsale(e) {
    //   console.log("即将开售",e)
    if (this.data.status == 1) {
      wx.navigateTo({
        url: `/pages/Commingsale/Commingsale?CatetoryId=${e.currentTarget.dataset.topcategoryid}`,
      })
    } else if (this.data.status == 0) {
      wx.navigateTo({
        url: `/pages/Todaysalse/Todaysalse?CatetoryId=${e.currentTarget.dataset.topcategoryid}`,
      })
    }

  },

  TobrandDiscount() {
    wx.navigateTo({
      url: '/pages/brandDiscount/brandDiscount',
    })
  },

  //跳转商品详情
  Toprodetai(e) {
    // console.log("跳转商品详情",e)
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?p=${e.currentTarget.dataset.productid}&pagetype=${e.currentTarget.dataset.pagetype || ''}`,
    })
    wx.setStorageSync("buyType", "fightgroup")
    
  },
  onLoad: function(options) {
    var _this = this
    let user =wx.getStorageSync("userInfo");
    this.setData({
      userInfo:user,
      homeTitle: wx.getStorageSync("homeTitle"),
      shareTitle: wx.getStorageSync("shareTitle")
    })
    
    this.setData({
      statusBarHeight: app.data.statusBarHeight,
      navHeight: app.data.navHeight,
    })
    wx.stopPullDownRefresh()
    // 开启转发功能
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.showLoading({
      title: '加载中~~~',
    })
    if (this.data.status == 0) {
      this.Todayspecielsalse()
    }
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 底部自定义导航栏
    app.globalData.template.tabbar("tabBar", 0, this, app.data.cartNum) //0表示第一个tabba/最后一个表示购物车的长度
    // 限时抢购倒计时
    timer = setInterval(() => {
      this.initCountDown(false)
    }, 1000)
    //  即将开售倒计时
    timer2 = setInterval(() => {
      // this.GetCommngsale(false);////暂时注销1------------
    }, 1000)
    // 用于获取id为tab-commingsale的高度,用于tab栏置顶
    setTimeout(() => {
      wx.createSelectorQuery().select('#tab-commingsale').boundingClientRect(rect => {
        // console.log(rect);
        this.data.tabHeight = rect.top
        // console.log(rect.top);
      }).exec()
    }, 1000);


  },

  onHide() {
    clearInterval(timer); //删除定时器
    clearInterval(timer2); //删除定时器
  },


  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      newpeopledata:[],
    })
    this.getnewpeopelspecile()
  },

  // 上拉加载更多
  onReachBottom: function() {},
  // 监听滚动事件(保留),回到顶部的按钮
  onPageScroll: function(data) {
    // console.log("滚动参数",data);
    const { scrollTop } = data
    throttle(() => {
      if (data.scrollTop > 400) {
        if (this.data.showToTop) return
        this.setData({
          showToTop: true
        })
      } else {
        if (!this.data.showToTop) return
        this.setData({
          showToTop: false
        })
      }
    }, 300, 100)()
    let flag = scrollTop >= this.data.tabHeight+80
    if(flag){
      this.setData({
        isHeight:true,
        
      })
    }else{
      this.setData({
        isHeight: false
      })
    }
  },


  // 分享(保留)
  // onShareAppMessage: function(res) {
  //   let user = wx.getStorageSync("userInfo");
  //   console.log("首页", user.UserId);
  //   return {
  //     title: this.data.shareTitle,
  //     desc: '分享页面的内容',
  //     path: '/pages/member/member?user=' + user.UserId // 路径，传递参数到指定页面。
  //   }
  // },

  /**  
   * 图片加载完成事件,动态设置swiper高度
   * */
  onLoadImg: function(e) {
    if (this.data.swiperH !== 150) {
      return
    }
    // console.log('设置swiper高度', e)
    var winWid = wx.getSystemInfoSync().windowWidth
    this.data.swiperH = winWid * e.detail.height / e.detail.width
    this.setData({
      swiperH: this.data.swiperH
    })
  },

  // 首页分享接口
  getShare() {
    wx.showLoading({
      title: '加载中~~',
    })
    let _this = this
    getindexsharedata({
      Type: 1,
      Path: "/pages/index/index"
    }).then(res => {
      console.log("分享", res)
      if (res.data.Status == "Success") {
        wx.hideLoading()
        // console.log("222")
        _this.setData({
          swiperList: res.data.Result.Data
        })
        this.towerSwiper('swiperList'); // 分享的 初始化towerSwiper 传已有的数组名即可
      } else {
        wx.hideLoading()
        this.setData({
          sharestutes: !this.data.sharestutes
        })
        wx.showModal({
          title: res.data.Message
        })
      }
    })
  },

  //首页弹窗优惠券
  getcouponsdata() {
    let _this = this
    getindexcoupon({}).then(res => {
      // console.log("首页优惠券", res)
      if (res.data.status == 200) {
        _this.setData({
          coupons: res.data
        })
      }
    })
  },
  // 获取商品的分类
  getCategory() {
    let _this = this
    wx.request({
      url: app.data.url + '/AppShop/AppShopHandler.ashx?action=GetProductCategories',
      success(res) {
        // console.log("商品分类", res)
        if (res.errMsg == "request:ok") {
          _this.setData({
            Categorydata: res.data.Result.Data
          })
        }
      }
    })
  },

  // 获取根据图片分类id获取图片
  initBanner() {
    getImage({
      CatetoryId: 17,
      action: 'GetBanner'
    }).then((res) => {
      if (res.statusCode == 200) this.setData({
        bannerArr: res.data.Result.Data
      })
      else console.log(res)
    })
  },

  //   第二张banner
  initBanner2() {
    getImage({
      CatetoryId: 18,
      action: 'GetBanner'
    }).then((res) => {
      if (res.statusCode == 200) this.setData({
        bannerArr2: res.data.Result.Data
      })
      else console.log(res)
    })
  },

  //初始化限时抢购数据
  initCountDown(param) {
    let {
      countDownList
    } = this.data;
    if (param) {
      indexCountDown({
        action: 'GetCountDownList',
        pageIndex: 1,
        pageSize: 3
      }).then((res) => {
        console.log('限时抢购',res);
        if (res.statusCode == 200) this.setData({
          countDownList: res.data.Result.Data
        })
        else console.log(res)
      })
    }
    //倒计时
    countDownList.forEach((item) => {
      if (!countdown(item.StartDate).overTime) {
        item.countDownState = {
          limitHours: countdown(item.StartDate).limitHours,
          limitMin: countdown(item.StartDate).limitMin,
          limitSecond: countdown(item.StartDate).limitSecond,
          startState: true
        }
      } else {
        item.countDownState = {
          limitHours: countdown(item.EndDate).limitHours,
          limitMin: countdown(item.EndDate).limitMin,
          limitSecond: countdown(item.EndDate).limitSecond,
          startState: false,
          overTime: countdown(item.EndDate).overTime
        }
      }
    })
    this.setData({
      countDownList
    })
  },

  // 获取9.9包邮
  getnightnight() {
    let _this = this
    wx.request({
      url: getApp().data.url + '/API/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: _this.data.Nightpage,
        tagId: 16
      },
      success: function(res) {
        // console.log('9.9包邮', res)
        if (res.errMsg === 'request:ok') {
          _this.setData({
            Freeshippingdata: _this.data.Freeshippingdata.concat(res.data.Result.Data),
            Freeshippingtotal: res.data.Result.TotalRecords
          })
        }
      },
      fail: function(res) {
        // console.log(res)
      },
      complete: function() {
        wx.stopPullDownRefresh()
      }
    })
  },
  // 9.9包邮向右拖到底刷新数据
  NighttoR() {
    if (this.data.Freeshippingdata.length < this.data.Freeshippingtotal) {
      this.data.Nightpage++
        this.getnightnight()
    } else {
      // wx.showToast({
      //   title: '已经到最右边啦~~',
      // })
    }
  },
  // 获取新人特惠数据 
  getnewpeopelspecile() {
    let _this = this
    wx.request({
      url: getApp().data.url + '/API/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: _this.data.newpeoplepage,
        tagId: 15
      },
      success: function(res) {
        // console.log('新人特惠', res)
        if (res.errMsg === 'request:ok') {
          _this.setData({
            newpeopledata: _this.data.newpeopledata.concat(res.data.Result.Data),
            newpeopleTotalRecords: res.data.Result.TotalRecords
          })
        }
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function() {
        wx.stopPullDownRefresh()
      }
    })
  },
  // 新人特惠拉到右边刷新
  TOR() {
    if (this.data.newpeopledata.length < this.data.newpeopleTotalRecords) {
      this.data.newpeoplepage++
        this.getnewpeopelspecile()
    } else {
      // wx.showToast({
      //   title: '已经到最右边啦~~',
      // })
    }
  },
  // 获取折扣专区
  getzhekoudata() {
    let _this = this
    wx.request({
      url: getApp().data.url + '/API/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: _this.data.zhekoupage,
        ActiveId: 4
      },
      success: function(res) {
        // console.log('折扣专区', res)
        if (res.errMsg === 'request:ok') {
          _this.setData({
            zhekoudata: _this.data.zhekoudata.concat(res.data.Result.Data),
            zhekouTotal: res.data.Result.TotalRecords
          })
        }
      },
      fail: function(res) {
        // console.log(res)
      },
      complete: function() {
        wx.stopPullDownRefresh()
      }
    })
  },
  ZhekouToR() {
    if (this.data.zhekoudata.length < this.data.zhekouTotal) {
      this.zhekoupage++
        this.getzhekoudata()
    } else {
      // wx.showToast({
      //   title: '到最右边啦~~',
      // })
    }
  },
  // 拼团接口
  getgrouddata() {
    let _this = this
    wx.request({
      url: getApp().data.url + '/API/ProductHandler.ashx?action=GetFightGroupActivityInfos&pageSize=5&pageIndex=1&sortBy=SalePrice',
      success(res) {
        // console.log("拼团数据", res)
        if (res.errMsg ==
          "request:ok") {
          _this.setData({
            groupdata: _this.data.groupdata.concat(res.data.Result.Data)
          })
        }
      }
    })
  },
  // 今日特卖
  Todayspecielsalse() {
    let _this = this
    gettodaydata({}).then(res => {
      console.log("今日特卖",res.data.Result.Data);
      let arr =[]
      arr.push(res.data.Result.Data[0])
      if (res.statusCode == 200) {
        _this.setData({
          // sepciledata: res.data.Result.Data
          sepciledata: arr
        })
      }
    })
  },
  // 即将销售
  GetCommngsale(param) {
    let {
      sepciledata
    } = this.data;
    if (param) {
      gettodaydata({
        utype: 1
      }).then(res => {
        if (res.statusCode == 200) this.setData({
          sepciledata: res.data.Result.Data
        })
        else console.log(res)
      })
    }
    // 实现倒计时
    sepciledata.forEach((item) => {
      item.ProductInfos.forEach((item2) => {
        item2.countDownState = {
          limitHours: countdown(item2.SaleStartDate).limitHours,
          limitMin: countdown(item2.SaleStartDate).limitMin,
          limitSecond: countdown(item2.SaleStartDate).limitSecond,
          overTime: countdown(item2.SaleStartDate).overTime
        }
      })
    })
    this.setData({
      sepciledata
    })
  },

  handleOff(){
    // console.log("===============")
    this.setData({
      showtarbar:false
    })
  }
})