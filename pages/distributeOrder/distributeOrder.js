const app = getApp();
Page({
  data: {
    IS_ALLOW_USER_APPLY_AFTER_SALE: false, // 是否允许用户退款退货
    imgUrl: app.data.imgurl,
    activeItem: 0,
    active: 0, //选,
    page: 1, //页码
    pageType: 1, // 页面类型 --->   1为代理订单  2为分销订单
    orderList: [],
    allOrderNum: 0, // 全部订单
    completeOrderNum: 0, //  已完成订单
    BuyerAlreadyPaid: 0, //待发货订单数
    WaitReceivedCount: 0, //待收货订单数
    showFH: false, //选择配送方式
    showEdit: false, //填写物流
    Delivery: [{
        name: "代理发货 (快递)",
        id: 0,
        status: true,
        type: 1
      },
      {
        name: "代理发货 (自提)",
        id: 0,
        status: true,
        type: 2
      },
      {
        name: "云仓发货",
        id: 1,
        status: true,
        type: 3
      },
      // {
      //   name: "转总部",
      //   id: 2,
      //   status: true,
      //   type: 4
      // }
    ], //选择配送方式项
    showEditList: [
      // {
      //   name: "收货时间:",
      //   val: "任意时间",
      //   data: "ShipToDate"
      // },
      {
        name: "省市区:",
        val: "无",
        data: "ShippingRegion"
      },
      {
        name: "收货地址:",
        val: "无",
        data: "Address"
      },
      {
        name: "收货人:",
        val: "无",
        data: "ShipTo"
      },
      {
        name: "手机号:",
        val: "无",
        data: "CellPhone"
      },
      {
        name: "买家留言:",
        val: "无",
        data: "Remark"
      },
      // {
      //   name: "发货方式:",
      //   val: "普通物流",
      //   data: ""
      // }
    ],
    columns: [],
    sendData: {
      name: "",
      orderId: "",
      sendId: ""
    },
    id: 0, //发货需要的SendType
    nums: 0,
    type: 1, //1代表正常情况,2代表直播订单


    /* 新版本的请求数据 */
    pageIndex: 0,
    list: [],
    loadMore: true,
    limit: 8,
  },
  pages: {
    index: 1,
    size: 10
  },
  total: 1, //总页码
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    app.setTitle(opt.pageType === 2 ? '分销订单' : '代理订单')

    this.setData({
      pageType: opt,
      type: opt.type,
      IS_ALLOW_USER_APPLY_AFTER_SALE: app.data.IS_ALLOW_USER_APPLY_AFTER_SALE
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getList(1);
  },
  /* 获取订单列表数据 */
  getList(init) {
    let {
      pageIndex = 0,
        list = [],
        loadMore = true,
        limit = 8,
        activeItem,
        type
    } = this.data;

    if (init) {
      list = [];
      loadMore = true;
      pageIndex = 0;

      this.setData({
        list,
        loadMore,
        pageIndex
      });
    }

    if (!loadMore) return;

    pageIndex++;

    this.setData({
      loadMore: true
    });

    const formData = {

      pageSize: limit,
      pageIndex: pageIndex,
      IsReferralUserId: true,

      status: activeItem,
      IsLive: type == 2 ? true : ''
    };

    app.$api.getDistributorOrderList(formData).then((res) => {
      console.log(res)
      const {
        AllOrderCount,
        FinishedOrderCount,
        BuyerAlreadyPaid,
        WaitReceivedCount,
        Total = 1,
        Data = [],
      } = res;

      const maxPageLength = Math.ceil(Total / limit);

      loadMore = pageIndex >= maxPageLength

      list = list.concat(Data);

      wx.stopPullDownRefresh();

      this.setData({
        list,
        loadMore,
        pageIndex,
        allOrderNum: AllOrderCount, // 全部订单
        completeOrderNum: FinishedOrderCount, //  已完成订单
        BuyerAlreadyPaid: BuyerAlreadyPaid, //待发货
        WaitReceivedCount: WaitReceivedCount, //待收货
      });

    });
  },

  /* 切换导航栏 */
  selectNav: function (e) {
    const {
      target: {
        dataset: {
          id
        }
      }
    } = e;

    this.setData({
      activeItem: id,
    })

    this.getList(1)
  },

  // 获取配送公司
  onChange(e) {
    console.log(e);
    this.setData({
      'sendData.name': e.detail.value
    })
    // this.sendData.name = value;
  },

  //发货
  openSendFN(e) {
    // console.log("e",e);
    let obj = e.currentTarget.dataset.item



    console.log("item", obj);
    let arr = this.data.showEditList

    arr.forEach(c => {
      console.log("收货地址", c);
      c.val = obj[c.data];
    });
    // if(obj.IsKjProducts==false){
    let deliveryArr = this.data.Delivery
    deliveryArr.forEach(v => {
      //  1 = 代理发货 (快递) 2 = 代理发货 (自提) 3 = 云仓发货 4 = 转总部
      // {{ReferralTempId === 1 ? '云仓发货' : ReferralTempId == 2 ? '代理发货' :  ReferralTempId == 4 ? '待代理补货' : '' }}

      if (obj.ShippingModeId == -2) {
        if (v.type === 2 || v.type === 4) {
          v.status = true
        } else {
          v.status = false
        }
      } else {
        if (obj.ReferralTempId == 1) {
          if (v.type == 3 || v.type == 1) {
            v.status = true
          } else {
            v.status = false
          }
        } else if (obj.ReferralTempId == 4) {
          if (v.type == 4 || v.type == 3 || v.type == 1) {
            v.status = true
          } else {
            v.status = false
          }
        } else {
          if (v.type == 2) {
            v.status = false
          } else {
            v.status = true
          }
        }
      }
    })
    this.setData({
      Delivery: deliveryArr
    })
    // }
    this.setData({
      columns: obj.AllExpressName,
      'sendData.orderId': obj.OrderId,
      showEditList: arr,
      showFH: true
    })
  },
  //选择发货
  chooseFN(e) {
    // console.log(e);
    let {
      index,
      id
    } = e.currentTarget.dataset
    console.log("dasdasdada", id);
    this.setData({
      id,
      showFH: false
    })
    if (!index) return (this.setData({
      showEdit: true
    }));
    index--
    this.submitSendType();
  },
  // 提交配送方式
  submitSendType(num) {
    app.fg({
      url: "/API/OrdersHandler.ashx?action=KjSendGoods",
      data: {
        SendType: this.data.id,
        OrderId: this.data.sendData.orderId,
        Company: this.data.sendData.name || this.data.columns[0],
        LogisticCode: this.data.sendData.sendId
      }
    }).then(r => {
      console.log("r", r);
      if (r.data.Status != "Faile") {
        wx.showToast({
          title: r.data.Message,
          icon: 'success',
          duration: 1500,
          mask: true,
        });
        setTimeout(() => {
          this.setData({
            showEdit: false,
            page: 1
          })
          if (this.data.activeItem == 0) {
            this.setData({
              page: 1,
              orderList: []
            })
            this.initData(0, this.data.type);
          } else if (this.data.activeItem == 2) {
            this.setData({
              page: 1,
              orderList: []
            })
            this.initData(2, this.data.type);
          } else if (this.data.activeItem == 3) {
            this.setData({
              page: 1,
              orderList: []
            })
            this.initData(3, this.data.type);
          } else if (this.data.activeItem == 5) {
            this.setData({
              page: 1,
              orderList: []
            })
            this.initData(5, this.data.type);
          }
        }, 1450);
      } else {
        wx.showToast({
          title: r.data.Message,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
        });
      }
    });
  },

  //输入框的值
  handleInput(e) {
    let value = e.detail.value;
    this.setData({
      'sendData.sendId': value
    })
  },

  //点击遮罩层关闭
  closeFilter(e) {
    let index = e.currentTarget.dataset.index
    if (index == 1) {
      this.setData({
        showFH: false
      })
    } else {
      this.setData({
        showEdit: false
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  },
  /* 去售后或申请退款 */
  applyAfterSale(e) {
    const {
      currentTarget: {
        dataset: {
          item,
          goods = {},
          type
        }
      }
    } = e;

    /* 自动解析对象为参数并且跳转，支持直接传入事件获取到的event对象 */
    app.goPage({
      url: '/subPackageC/applyAfterSale/applyAfterSale',
      options: {
        orderId: item.OrderId,
        type,
        skuId: goods.SkuId || ''
      }
    })


  },
  /* 查看售后当前的状态 */
  reviewAftarSaleStatus(e) {
    const {
      currentTarget: {
        dataset: {
          item = {},
          goods = {},
          type
        }
      }
    } = e;

    const refundId = item.RefundInfo ? item.RefundInfo.RefundId : '';
    const returnId = goods.ReturnInfo ? goods.ReturnInfo.ReturnId : '';

    app.goPage({
      url: '/subPackageC/afterSale/afterSale',
      options: {
        refundId, // 退款id
        returnId, // 退货id
        type,
        skuId: goods.SkuId || '', // 商品规格id
        orderId: item.OrderId,
        fromType: 'distributeOrder' // 用于区分是从分销订单 || 用户订单
      }

    })
  },
})