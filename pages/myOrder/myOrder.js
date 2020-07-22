import {
  getOrderList,
  cancelOrder,
} from '../../utils/requestApi.js';
import {
  toPay
} from '../../utils/util.js';

const app = getApp();
console.log(app.data, '2321')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    IS_ALLOW_USER_APPLY_AFTER_SALE: false, // 是否允许用户退款退货
    OPEN_POINT_SHOP: false,
    imgUrl: app.data.imgurl,
    tabbar: ['全部订单', '待付款', '待发货', '待收货', '待评价', '售后'],
    activeItem: 0, // tabbar激活项
    list: [], //数据列表
    page: 1, //页码
    isEmpty: false,
    searchVal: '', //搜索值
    displayDialog: false,
    wechat: {
      id: '',
      qrcode: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.setData({
      activeItem: opt.type,
      IS_ALLOW_USER_APPLY_AFTER_SALE: app.data.IS_ALLOW_USER_APPLY_AFTER_SALE,
      OPEN_POINT_SHOP: app.data.OPEN_POINT_SHOP
    });
    
  },

  onShow() {
    this.initData();



  },


  // 选择tab
  selectTabbar(e) {
    console.log('输出点tab索引值', e);
    this.setData({
      activeItem: e.detail.index,
      isEmpty: false,
    });
    this.initData();
  },
  /* 申请售后 */
  applyAfterSale(e) {
    const {
      currentTarget: {
        dataset: {
          params: {
            goods = {},
            type,
            orderId
          }

        }
      }
    } = e;

    /* 自动解析对象为参数并且跳转，支持直接传入事件获取到的event对象 */
    app.goPage({
      url: '/subPackageC/applyAfterSale/applyAfterSale',
      options: {
        orderId,
        type,
        skuId: goods.SkuId || ''
      }
    })


  },
  /* 展示联系卖家的弹窗 */
  showContactCode(e) {
    const {
      items,
      type
    } = e.currentTarget.dataset;
    console.log(e)
    this.setData({
      displayDialog: !this.data.displayDialog,
    });

    if (!type) {
      this.setData({
        wechat: {
          id: items.WeChat,
          qrcode: items.WxQrCode,
        },
      });
    }
  },
  closeDialog() {
    this.setData({
      displayDialog: false
    });
  },
  /* 查看售后详情 */
  seeAfterSaleDetail(e) {
    const {
      currentTarget: {
        dataset: {
          params: {
            type,
            returnId = '',
            refundId = '',
            orderId,
            skuId = ''
          },
        },
      },
    } = e;


    app.goPage({
      url: '/subPackageC/afterSale/afterSale',
      options: {
        type,
        returnId,
        refundId,
        orderId,
        skuId
      }
    })

  },

  /* 查看物流 */
  seeExpressStep(e) {
    console.log(e)
    const {
      currentTarget: {
        dataset: {
          orderid
        }
      }
    } = e;

    app.$api.checkExpressDetail({
      orderid
    }).then(res => {
      const {
        Data: {
          url = ''
        },
        Code
      } = res;


      if (Code !== 1) {
        return wx.showToast({
          title: '获取物流信息失败'
        })
      }

      wx.navigateTo({
        url: `/subPackageC/expressDetail/expressDetail?orderId=${orderid}`
      })

      // wx.setStorage({
      //   key: 'webViewUrl',
      //   data: url,
      //   success: (result) => {
      //     wx.navigateTo({
      //       url: `/packageB/pages/expressDetail/expressDetail?orderId=${orderid}`
      //     })
      //   },
      // });


    })

  },
  //初始化页面数据
  initData(param, val) {
    let {
      page,
      list,
      isEmpty,
      activeItem,
      searchVal
    } = this.data;
    if (param != 'onReachBottom') {
      page = 1;
      list = [];
    }
    if (activeItem == 4) {
      activeItem = 21;
    } else if (activeItem == 5) {
      activeItem = 98;
    }
    wx.showLoading({
      title: '加载中...'
    });
    getOrderList({
      // 获取订单信息
      pageIndex: page,
      pageSize: 10,
      // status: activeItem == 4 ? 21 : activeItem,
      status: activeItem,
      SearchText: searchVal || '',
    }).then((res) => {
      console.log('订单信息', res);
      wx.hideLoading();
      if (res.data.Status == 'Success') {
        if (res.data.Data.length != 0) {
          list = [...list, ...res.data.Data];
          page++;
        } else isEmpty = true;
      }
      this.setData({
        list,
        page,
        isEmpty
      });
    });
  },

  //打开订单详情页面
  toOrderDetail: function (e) {
    let {
      id
    } = e.currentTarget.dataset;
    let {
      list
    } = this.data;
    let curOrder = null;
    list.forEach((item) => {
      if (item.OrderId == id) curOrder = JSON.stringify(item);
    });
    wx.navigateTo({
      url: `../orderDetail/orderDetail?id=${id}`
    });
  },

  //取消订单
  cancelOrd: function (e) {
    let {
      list
    } = this.data;
    let {
      id
    } = e.currentTarget.dataset;
    wx.showModal({
      content: '确定取消订单',
      success: (res) => {
        if (res.confirm) {
          cancelOrder({
            orderId: id
          }).then((res) => {
            wx.showToast({
              icon: 'none',
              title: res.data.Message
            });
            if (res.data.Status == 'Success') {
              setTimeout(() => {
                this.initData();
              }, 1000);
            }
          });
        }
      },
    });
  },

  //去支付
  pay: function (e) {
    let {
      id
    } = e.currentTarget.dataset;
    toPay(id, function (res) {
      this.initData();
      wx.showToast({
        icon: 'none',
        title: '支付成功'
      });
    });
  },

  //  确认收货
  handleFinishOrder(e) {
    let {
      id
    } = e.currentTarget.dataset;

    app.alert.confirm({
      content: '是否确认收货'
    }, conf => {
      if (conf) {
        app.$api.handleFinishOrder({
          orderId: id
        }).then(res => {
          app.alert.message(res.Message, () => {
            this.initData();
          })
        })
      }
    })


  },

  // 点击搜索
  handleSearch() {

    if (!this.data.searchVal) return
    this.initData(this.data.activeItem);
  },

  //搜索值
  handleVal(e) {
    const {
      value
    } = e.detail;
    
    this.setData({
      searchVal: value,
    }, () => {
      if(!this.data.searchVal){
        this.initData()
      }
    });
  },

  //  查看物流
  handleLogistics(e) {
    wx -
      wx.showLoading({
        title: '加载中~',
        mask: true,
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      });
    console.log('点击查看物流', e);
    const {
      id,
      items
    } = e.currentTarget.dataset;
    let obj = JSON.stringify(items);
    wx.navigateTo({
      url: `/packageA/pages/Logistics/Logistics?id=${id}&item=${obj}`,
      success: (result) => {
        wx.hideLoading();
      },
      fail: () => {},
      complete: () => {},
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.initData('onReachBottom');
  },

});