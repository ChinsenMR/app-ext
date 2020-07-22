import {
  bindReferralUserId
} from '../../../utils/util.js'
import {
  getAppletTitle,
  getGoodsDetail
} from "../../../utils/requestApi"
import {
  getMainColor
} from "../../../utils/image-main-color"
// pages/moduleHome/moduleHome.js
var baseImg = "http://hmqy.oss-cn-hangzhou.aliyuncs.com/hmeshopV3/20190708/bg_pinzhi.png";
var WxParse = require('../../../wxParse/wxParse.js');
let app = getApp();
Page({
  data: {
    imgUrl: app.data.imgurl,
    TopicData: null, //自定义模板数据
    timer: null,
    isShow: false,
    height: 20,
    shareInfo: {
      "NickName": "HME_0007377",
      "Picture": "http://dlyl.hmeshop.cn/templates/common/images/headerimg.png",
      "ProductName": "好吃的旺旺雪饼好吃的旺旺雪饼好吃的旺旺雪饼",
      "ImageUrl1": "http://demoadmin.hyxmt.cn/Upload/Product/20180903/201809031835593420991394605.jpg",
      "SalePrice": 10.0,
      "MarketPrice": "120.00",
      "MiniProgramCard": "http://192.168.3.108:99/Storage/master/QRCode/ReferralQrcode_7377_20190902141123.png",
      "IsGetCode": false,
      "CreatedQRcode": "",
      "qcode": "7377_359_DB259EFDA592EFC20954BC650DF38F78_120.00_10_旺旺雪饼"
    },

    groupdata: [{
      "SalePrice": 10.0000,
      "ImageUrl1": "http://img.hmeshop.cn/hmeshopV3/Storage/master/201907221215575480890.jpg",
      "ProductName": "爱情塗法师无患子洗护系列",
      "SoldCount": 15,
      "CanFightCount": 1,
      "IsfreeShipping": false,
      "IsFightNow": 1,
      "StartDate": "2019-08-13 20:20:00",
      "JoinNumber": 5,
      "ProductId": 537,
      "SingleSalePrice": 324.0000,
      "RowNumber": 1
    }, {
      "SalePrice": 0.0100,
      "ImageUrl1": "http://img.hmeshop.cn/hmeshopV3/Storage/master/201907271702159470570.jpg",
      "ProductName": "无患子柔润滋养修护洗发乳",
      "SoldCount": 21,
      "CanFightCount": 4,
      "IsfreeShipping": true,
      "IsFightNow": 1,
      "StartDate": "2019-08-19 09:53:00",
      "JoinNumber": 2,
      "ProductId": 530,
      "SingleSalePrice": 198.0000,
      "RowNumber": 2
    }], //拼团
    countDownList: [{
      "CountDownId": 54,
      "StartDate": "2019-08-28 18:00:00",
      "EndDate": "2019-10-31 23:55:00",
      "Content": "测试",
      "DisplaySequence": 14,
      "ShareTitle": "",
      "ShareDetails": "",
      "ShareIcon": "",
      "BannerImg": "https://img.hmeshop.cn/hmeshopV3/Storage/master/201908281834020781930.png"
    }], //限时抢购数据 
    shareTitle: '', //首页分享标题
    shareImg: '', //分享图片
    skuItem: [], // 规格选择列表
    skus: [], // 规格选中项
    freight: null, //运费
    goodsInfo: null, //商品信息
    paramData: {},
    prDid: '', //列表商品id
    nav: ['人气爆品', '内衣', '护肤', '人气爆品', '内衣', '护肤', ],
    nums: 0,
    title: '', //新标签的导航栏
    tagid: '', //标签的切换按钮
    obj: {},
    anchorArray: 0,
    toView: '',
    type102: [], //用来存储102商品的请求id
    menuTop: '', //距离顶部的高度
    menuFixed: '', //监听的高度
    scrollTop: 0,
    xiDing: 0, //导航栏距离顶部的距离
    headerTop: 0, //自定义头部距离顶部的距离
    navHeight: 0, //顶部到胶囊的高度
    cObj: {}, //颜色对象
    imageSrc: "https://hyosstest.oss-cn-shenzhen.aliyuncs.com/agentphotoes/bg3.jpg",
    colorArr: [], //颜色的数组
    colorIndex: 0, //颜色数组对应的颜色
    newArr: [], //轮播图图片构成的新数组
    swiperSite: 0,
    PROJECT_TITLE: null,
  },
  bindReferralUserId,
  onShow: function () {
    let _this = this;

    this.setData({
      PROJECT_TITLE: app.data.PROJECT_TITLE
    })

    app.getSystemInfo().then((res) => {
      _this.setData({
        navHeight: res.statusBarHeight + 44,
      })
    })
    this.bindReferralUserId();

    /**------------------------------------ */
    const scroll = wx.createSelectorQuery().select('.scroll_nav')
    scroll && scroll.boundingClientRect(res => {
      // console.log("距离顶端的距离xiDing", res.top-100);//686

      _this.setData({
        xiDing: res && res.top - 100
      })
      _this.getData()
    }).exec();
    const home = wx.createSelectorQuery().select('.home_title');
    home && home.boundingClientRect((res) => {

      // console.log("顶部头部的距离headerTop", res.top);//686
      _this.setData({
        headerTop: res && res.top
      })
    }).exec();

    /**------------------------------------ */
  },
  onLoad: function (a) {


    this.data.timer = setInterval(() => {
      this.limitFn()
    }, 1000)
    this.getNavTitle(); //首页标题
    this.getShareTitle(); //分享标题

  },
  // 获取首页模板数据
  getData() {

    let _this = this
    let url = app.data.url;
    url = url.split("https://")[1] || url.split("http://")[1];

    app.$api.getCustomTemplate().then(res => {
      console.log(res, '???')
      if (res.success) {
        const {
          Data: {
            LModules: models
          }
        } = res;



        // let arr = models;
        // console.log('自定义首页', arr)
        models.unshift({
          type: 'home_title'
        })
        models.forEach((item, index) => {

          //处理顶部和轮播图变色
          if (item.type === 9) {
            _this.setData({ //将每一张轮播图,重新组成新数组
              newArr: item.content.dataset.map(v => v.pic)
            })
            _this.getBackgroundColor(item.content.dataset[0].pic).then(data => { //初始化使用第一张轮播图
              _this.setData({
                colorArr: [data]
              })
            })

          } else if (item.type == 100 && item.content.isDynamic) { //是直播模块且draggable为true

            app.$request({
              url: item.content.interfaceUrl
            }).then(rps => {

              if (rps.success) {
                const {
                  Data: liveRoomData
                } = rps;

                liveRoomData && (item.content.newList = liveRoomData.room_info);
              }


            })

          } else if (item.type == 102 && item.content.isDynamic) { //处理新的标签导航,添加动态数据
            let str = ''
            item.content.dataset.forEach(ty => {
              _this.data.type102 += ty.tagId + ','
            })
            str = _this.data.type102
            str = str.substring(0, str.lastIndexOf(','));
            app.fg({
              url: item.content.interfaceUrl,
              data: {
                pageIndex: 1,
                pageSize: 10,
                tagIds: str
              }
            }).then(res => {
              if (res.data.Result.Data.length != 0) {
                let newArr = res.data.Result.Data
                item.content.newList = newArr
                let arr2 = item.content.dataset
                arr2.forEach((s, i) => {
                  let sArr = []
                  s.items = 'items' + i,
                    newArr.forEach((v, index) => {
                      if (s.tagId == v.TagId) {
                        sArr.push(v)
                        s.newList = sArr
                      }
                    })
                })
                item.content.dataset = arr2
                _this.setData({
                  TopicData: models
                })
              }
            })
          } else if (item.type == 5) { //这个模块需要添加直播提现功能
            app.fg({
              url: '/api/ProductHandler.ashx?action=GetGradeProducts',
              data: {
                categoryId: item.content.categoryId,
                firstPriority: item.content.firstPriority,
                secondPriority: item.content.secondPriority,
                thirdPriority: item.content.thirdPriority,
                pageIndex: 1,
                pageSize: 10,
              }
            }).then(res => {
              console.log("新数据列表", res);
              let arr = res.data.Result.Data
              item.content.goodslist = arr
            })
          } else {
            _this.setData({
              TopicData: models
            })
          }
        })
        let num = models.findIndex(v => v.type == 9);
        _this.setData({
          swiperSite: num, //type==9轮播图索引值
        })
        // console.log("轮播图的索引值",num);
        console.log("新首页模板", models);
        _this.checkDataRichtext()
      }

    })

    // wx.request({
    //   url: app.data.url + '/Templates/common/home/' + url + '/' + app.data.PROJECT_THEME + '/Data/default.json',
    //   data: {},
    //   success: function (res) {
    //     let arr = res.data.LModules;
    //     console.log('自定义首页', arr)
    //     let obj = {
    //       type: 'home_title'
    //     }
    //     arr.unshift(obj)
    //     arr.forEach((item, index) => {
    //       //处理顶部和轮播图变色
    //       if (item.type == 9) {
    //         _this.setData({ //将每一张轮播图,重新组成新数组
    //           newArr: item.content.dataset.map(v => v.pic)
    //         })
    //         _this.getBackgroundColor(item.content.dataset[0].pic).then(data => { //初始化使用第一张轮播图
    //           _this.setData({
    //             colorArr: [data]
    //           })
    //         })

    //       } else if (item.type == 100 && item.content.isDynamic) { //是直播模块且draggable为true
    //         app.fg({
    //           url: item.content.interfaceUrl
    //         }).then(res => {
    //           // console.log("100直播动态数据", res);
    //           if (res.data.Status == "true") {
    //             let newArr = res.data.Data.room_info
    //             item.content.newList = newArr
    //             _this.setData({
    //               TopicData: arr
    //             })
    //           } else {
    //             console.log('无直播数据');
    //           }
    //         })
    //       } else if (item.type == 102 && item.content.isDynamic) { //处理新的标签导航,添加动态数据
    //         let str = ''
    //         item.content.dataset.forEach(ty => {
    //           _this.data.type102 += ty.tagId + ','
    //         })
    //         str = _this.data.type102
    //         str = str.substring(0, str.lastIndexOf(','));
    //         app.fg({
    //           url: item.content.interfaceUrl,
    //           data: {
    //             pageIndex: 1,
    //             pageSize: 10,
    //             tagIds: str
    //           }
    //         }).then(res => {
    //           if (res.data.Result.Data.length != 0) {
    //             let newArr = res.data.Result.Data
    //             item.content.newList = newArr
    //             let arr2 = item.content.dataset
    //             arr2.forEach((s, i) => {
    //               let sArr = []
    //               s.items = 'items' + i,
    //                 newArr.forEach((v, index) => {
    //                   if (s.tagId == v.TagId) {
    //                     sArr.push(v)
    //                     s.newList = sArr
    //                   }
    //                 })
    //             })
    //             item.content.dataset = arr2
    //             _this.setData({
    //               TopicData: arr
    //             })
    //           }
    //         })
    //       } else if (item.type == 5) { //这个模块需要添加直播提现功能
    //         app.fg({
    //           url: '/api/ProductHandler.ashx?action=GetGradeProducts',
    //           data: {
    //             categoryId: item.content.categoryId,
    //             firstPriority: item.content.firstPriority,
    //             secondPriority: item.content.secondPriority,
    //             thirdPriority: item.content.thirdPriority,
    //             pageIndex: 1,
    //             pageSize: 10,
    //           }
    //         }).then(res => {
    //           console.log("新数据列表", res);
    //           let arr = res.data.Result.Data
    //           item.content.goodslist = arr
    //         })
    //       } else {
    //         _this.setData({
    //           TopicData: arr
    //         })
    //       }
    //     })
    //     let num = arr.findIndex(v => v.type == 9);
    //     _this.setData({
    //       swiperSite: num, //type==9轮播图索引值
    //     })
    //     // console.log("轮播图的索引值",num);
    //     console.log("新首页模板", arr);
    //     _this.checkDataRichtext()
    //   }
    // })
  },


  //轮播变化
  handleChange(e) {
    const {
      current
    } = e.detail;
    const {
      colorArr,
      newArr
    } = this.data
    this.setData({
      colorIndex: current
    })
    if (colorArr.length === newArr.length) return //新生成的数组与轮播图数组长度相等,说明轮播图的数组已经添加完成,不在执行获取颜色的方法
    this.getBackgroundColor(this.data.newArr[current]).then((resArr) => {
      colorArr[current] = resArr
      this.setData({
        colorArr: colorArr
      });
    })
  },
  //特殊情况的跳转,用type==2的时候,用于直接跳进创建直播间
  handleTile(e) {
    let user = wx.getStorageSync('userInfo');
    let cookie = wx.getStorageSync('cookie');
    const {
      url
    } = e.currentTarget.dataset;
    if (url.includes('newLive')) { //必须路径 为subPackageC/newLive/index,才有跳转的资格
      if (!cookie) { //未登录
        app.goTo('/pages/authorizationLogin/authorizationLogin')
      } else if (user.StoreStatus == 2) { //跳转的条件
        app.goTo(`/${url}`)
      } else if (user.StoreStatus != 2) { //说明等级不够,要去升级,成为代理
        app.goTo('/packageA/wjx/equities/equities')
      }
    }
  },

  //获取canvas图片上的色块
  getBackgroundColor(url) {
    const ctx = wx.createCanvasContext('myCanvas')
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: `${url}`,
        success: r => {
          const poster = r.path
          ctx.drawImage(poster, 0, 0, 150, 100)
          // console.log('poster: ', poster)
          ctx.draw(false, () => {
            // 这种方式获取canvas区域隐含的像素数据
            wx.canvasGetImageData({
              canvasId: 'myCanvas',
              x: 0,
              y: 0,
              width: 150,
              height: 100,
              success: res => {
                // console.log("隐含的像素数据", res);
                const imageData = res.data
                // 分区块，可以拓展性的求主要色板，用来做palette
                let colorObj = getMainColor(imageData)
                // console.log('resImageObj', colorObj)
                const {
                  defaultRGB
                } = colorObj
                const {
                  r,
                  g,
                  b,
                  a
                } = defaultRGB;
                const percent = +(a / 255).toFixed(2);
                const endVal = Math.max(50, a - 50); // 这里减去一个固定的数值，取出渐变的另一个数值，模拟渐变
                const endPercent = +(endVal / 255).toFixed(2);
                resolve({
                  startColor: `rgba(${r}, ${g}, ${b}, ${percent})`,
                  endColor: `rgba(${r}, ${g}, ${b}, ${endPercent})`,
                });
              },
            })
          })
        },
        fail: err => {
          // console.log(err);
          // reject(err)
        }
      });
    });
  },

  //直播提示跳转对应的直播间
  handleTipLive(e) {
    const {
      roomid,
      pid
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomid}`,
    });
  },

  onclick() {
    this.setData({
      isShow: true
    })
  },
  // 关闭分享
  closeEvent(e) {
    var mode = e.detail.mode;
    if (mode == 'mask') {
      this.setData({
        isShow: false
      })
    }
  },
  // 分享好友
  onShareAppMessage(res) {
    return {
      // title: this.data.shareInfo.ProductName,
      title: this.data.shareTitle,
      path: '/pages/moduleHome/moduleHome',
      imageUrl: this.data.shareImg
    }
  },
  //检测富文本
  checkDataRichtext() {
    var richtextlist = []
    for (var i = 0; i < this.data.TopicData.length; i++) {
      switch (this.data.TopicData[i].type) {
        case 1:
          richtextlist.push(this.data.TopicData[i])
          var richtext = richtextlist[0].content.fulltext
          WxParse.wxParse('richtext', 'html', richtext, this, 5);
          break;
      }
    }
  },
  //链接导航专门处理带linktype的跳转  
  jumpWhere(e) { //跳转类型跟下标
    console.log("跳转数据", e);
    let linktype = e.currentTarget.dataset.linktype,
      index = e.currentTarget.dataset.index
    let topicslistjson = e.currentTarget.dataset.topicslistjson ? e.currentTarget.dataset.topicslistjson : null;
    // let link = e.currentTarget.dataset.link;
    // console.log("自定义首页跳转数据",linktype, index, topicslistjson, e)
    switch (linktype) { //测试顺序按照后台配置顺序
      case 1:
        console.log('选择商品')
        // wx.navigateTo({
        //   url: `/pages/goodsDetail/goodsDetail?prDid=${e.currentTarget.dataset.productid}`,
        // })
        let link = e.currentTarget.dataset.link;
        // console.log(link);
        link = link.split('id=')[1];
        wx.navigateTo({
          url: `/pages/goodsDetail/goodsDetail?p=${link}`,
        })

        break;
      case 2:
        console.log('分类导航,页面缺少')
        wx.navigateTo({
          // url: '/packageA/pages/sortDetail/sortDetail',
          url: "/packageA/wjx/allGoods/allGoods?linktype=" + linktype
        });

        break;
      case 3:
        console.log('商品分类,页面缺少,网页版本是回到首页')
        let str = e.currentTarget.dataset.link
        str = str.split('catetoryId=')[1];
        wx.navigateTo({
          // url: '/packageA/wjx/allGoods/allGoods',
          url: "/packageA/pages/sortDetail/sortDetail?id=" + str
        });

        break;
      case 4:
        console.log('品牌专题,跳转品牌详情')
        break;
      case 24:
        console.log('品牌列表')
        break;
      case 9:
        console.log('全部商品')
        wx.navigateTo({
          url: '/packageA/wjx/allGoods/allGoods',
        })
        break;
      case 14:
        console.log('自定义页面 , 自定义页面需要在新打开的page再次请求接口重新获取一份json')
        if (topicslistjson) {
          wx.navigateTo({
            url: '/pages/moduleHome2/moduleHome2?urlOpction=' + topicslistjson,
          })
        }
        break;
      case 12:
        console.log('团购活动')
        wx.navigateTo({
          url: '/pages/Groupindex/Groupindex',
        });

        break;
      case 13:
        console.log('限时抢购')
        console.log("限时抢购", e.currentTarget.dataset.link);
        // wx.navigateTo({
        //   url: '/pages/Specialoffer/Specialoffer',
        // });

        break;
      case 6:
        console.log('店铺主页')
        wx.navigateTo({
          url: '/pages/shopkeeperList/shopkeeperList',
        });
        break;
      case 7:
        console.log('会员主页')
        wx.navigateTo({
          url: '/pages/member/member',
        });
        break;
      case 8:
        console.log('购物车')
        wx.navigateTo({
          url: "/pages/cart/cart"
        });

        break;
      case 10:
        console.log('自定义链接')
        break;
      case 15:
        console.log('积分商城')
        // let link = e.currentTarget.dataset.link;
        // console.log(link);
        // link = link.split('id=')[1];
        break;
      case 16:
        console.log('优惠券列表')
        wx.navigateTo({
          url: "../../packageA/pages/MyCoupon/MyCoupon"
        });

        break;
      case 18:
        console.log('选择优惠券')
        break;
      case 19:
        console.log('火拼团')
        break;
      case 20:
        console.log('周边门店')
        break;
      case 21:
        console.log('选择文章')
        break;
      case 25:
        console.log('文章列表')
        break;
      case 26:
        console.log('升级会员')
        wx.navigateTo({
          url: "/pages/upgradeMember/upgradeMember"
        });
        break;
      case 27:
        console.log('组合套餐')
        wx.navigateTo({
          url: "../../packageA/pages/fuCombina/fuCombina"
        });
        break;
    }
  },
  //跳转到商品详情的
  goToGoodsDetail(e) {
    let item_id = e.currentTarget.dataset.item_id ? e.currentTarget.dataset.item_id : null
    if (!!item_id) {
      wx.navigateTo({
        url: `/pages/goodsDetail/goodsDetail?p=${item_id}`,
      })
    } else {
      app.alert.toast('没有这个商品无法跳转')

    }
  },
  //新标签导航栏切换的方法
  handNav(e) {
    let _this = this;
    const {
      index,
      title,
      tagid,
      opt
    } = e.currentTarget.dataset;
    _this.setData({
      nums: index,
      title,
      tagid,
      toView: 'items' + index
    })
    var query = wx.createSelectorQuery();
    query.selectViewport().scrollOffset();
    query.select("#items" + e.currentTarget.dataset.index).boundingClientRect();
    query.exec(function (res) {
      console.log('点击时获取的高度', res);
      var miss = res[0].scrollTop + res[1].top - 100;
      // console.log("计算出高度scrollTop1",miss);
      wx.pageScrollTo({
        scrollTop: miss,
        duration: 0,
      });
    });

  },
  onPageScroll(e) {
    let that = this
    // console.log("计算出高度scrollTop2", e.scrollTop);
    this.setData({
      scrollTop: e.scrollTop
    })

  },


  // 获取商城主题信息
  getshowType() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    // let _this = this
    // wx.request({
    //   url: getApp().data.url + '/api/PublicHandler.ashx?action=GetWebSet',
    //   data: {},
    //   success: function (res) {
    //     wx.hideLoading()
    //     // console.log(res)
    //     if (res.data.Result.Status == "Success") {
    //       _this.getData(res.data.Result.WapTheme)
    //     } else {
    //       wx.showToast({
    //         title: '获取展示类型错误',
    //         icon: 'none',
    //         duration: 3000,
    //       })
    //     }
    //   }
    // })
    this.getData(res.data.Result.WapTheme)
  },

  limitFn() {
    this.data.countDownList.forEach(v => {
      if (!this.countdown(v.StartDate).overTime) {
        v.countDownState = {
          limitHours: this.countdown(v.StartDate).limitHours,
          limitMin: this.countdown(v.StartDate).limitMin,
          limitSecond: this.countdown(v.StartDate).limitSecond,
          startState: true
        }
      } else {
        v.countDownState = {
          limitHours: this.countdown(v.EndDate).limitHours,
          limitMin: this.countdown(v.EndDate).limitMin,
          limitSecond: this.countdown(v.EndDate).limitSecond,
          startState: false,
          overTime: this.countdown(v.EndDate).overTime
        }
      }

    })
    this.setData({
      countDownList: this.data.countDownList
    })
  },
  //直播模块跳转
  handleLive(e) {
    const {
      roomid,
      status
    } = e.currentTarget.dataset;
    if (status == 102) {
      app.fa('未开始')
    } else if (status == 103) {
      app.fa('已结束')
    } else if (status == 104) {
      app.fa('禁播')
    } else if (status == 106) {
      app.fa('异常')
    } else if (status == 107) {
      app.fa('已过期')
    }
    app.goTo(`plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomid}`)
  },


  // 倒计时处理
  countdown(date) {
    var dateArr = date.split(' ');
    if (date.indexOf('T') != -1) dateArr = date.split('T');
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
    let obj = null;
    //超时
    if (deltaTime <= 0) {
      return {
        limitHours: '00',
        limitMin: '00',
        limitSecond: '00',
        overTime: true // 倒计时已过
      }
    }
    var time = deltaTime / 1000
    if (time > 0) {
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      let ms = parseInt(((time * 1000) % 1000) / 100)
      obj = {
        day: day,
        hou: hou,
        min: min,
        sec: sec,
        ms: ms
      }
    }
    return {
      limitHours: obj.hou < 10 ? '0' + obj.hou : obj.hou,
      limitMin: obj.min < 10 ? '0' + obj.min : obj.min,
      limitSecond: obj.sec < 10 ? '0' + obj.sec : obj.sec,
      overTime: false
    }
  },
  onHide() {
    clearInterval(this.data.timer)
  },
  imageLoad(e) {
    this.setData({
      height: e.detail.height
    })
    // console.log(e,333333333333333333333333333333);
  },
  //获取导航栏标题
  getNavTitle() {
    getAppletTitle({
      type: 0
    }).then(res => {
      if (res.data.Status == "success") {
        let title = res.data.Data.Title;
        // console.log("首页标题", title);
        //动态改变导航栏
        wx.setNavigationBarTitle({
          title
        })
        wx.setStorageSync("homeTitle", title);

      }
    })
  },
  //获取分享导航栏
  getShareTitle() {
    getAppletTitle({
      type: 1
    }).then(res => {
      // console.log("分享导航栏",res);
      if (res.data.Status == "success") {
        let title = res.data.Data.Title;
        // console.log("分享标题", title);
        this.setData({
          shareTitle: title,
          shareImg: res.data.Data.ImageUrl
        })
        wx.setStorageSync("shareTitle", title);
      }
    })
  },


  //加入购物车
  addCart(e) {
    let id = e.currentTarget.dataset.id;
    this.initData(id);
    this.setData({
      prDid: id
    })
  },
  //获取商品数据
  initData: function (id) {
    wx.showLoading({
      title: '加载中...',
    })
    getGoodsDetail({
      action: 'getProductDetail',
      ProductID: id
    }).then(res => {
      // console.log("商品详情数据", res)
      if (res.statusCode == 200) {
        wx.hideLoading();
        let {
          Result
        } = res.data;
        Result.prDid = this.data.prDid
        this.setData({
          skuItem: Result.SkuItem,
          skus: Result.Skus,
          coupons: Result.Coupons,
          promotionStr: Result.PromotionStr,
          freight: Result.Freight,
          goodsInfo: Result
        })
        this.selectComponent('#goodsSpecsCom').showModal();
      }
    })
  },
  //跳转直播列表
  handleGo(e) {
    app.goTo('/packageA/wjx/broadcast/broadcast')
  }
});