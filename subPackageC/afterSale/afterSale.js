const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    status: undefined,
    arrowDown: "https://img.hmeshop.cn/hmeshopV3/Storage/master/202005151604326108790.png",
    arrowUp: "https://img.hmeshop.cn/hmeshopV3/Storage/master/202005151604327515011.png",
    isShowExpress: true,
    params: {
      refundId: null, // 退款id
      returnId: null, // 退货id
      skuId: null, // 商品规格id
      orderId: null,
      type: null, // 1 为退货 2为退款
      fromType: null // 用于区分是从分销订单 || 用户订单
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      params: options
    });


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

    if (this.data.params.type == 1) {
      this.getOrderReturnDetail();
    } else {
      this.getOrderRefundDetail();
    }

    this.getReturnFlow();
  },
  /* 折叠展示 */
  handleArrow() {
    this.setData({
      isShowExpress: !this.data.isShowExpress,
    });
  },
  /* 查看图片 */
  seeImage(e) {
    const {
      currentUrl
    } = e.currentTarget.dataset;

    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.data.UserCredentialList, // 需要预览的图片http链接列表
    });
  },
  /* 获取退货详情 */
  getOrderReturnDetail() {
    const {
      params: {
        returnId = '', // 退货id
        skuId,
        orderId,
      }
    } = this.data;

    app.$api.getOrderReturn({
      orderId,
      returnId,
      skuId
    }).then((res) => {
      console.log(res, '最新的结果')
      const {
        Status,
        Data
      } = res;

      this.setData({
        detail: Data,
      });
    });


  },
  /* 获取退款详情 */
  getOrderRefundDetail() {
    const {
      params: {
        refundId = '', // 退货id
      }
    } = this.data;

    app.$api.getOrderRefund({
      refundId
    }).then((res) => {
      console.log(res, '最新的结果')
      const {
        Data
      } = res;

      this.setData({
        detail: Data,
      });
    });


  },
  /* 获取物流步骤 */
  getReturnFlow() {
    const {
      params: {
        orderId,
        type
      }
    } = this.data;

    app.$api.getReturnFlow({
      orderId,
      type: type == 1 ? 1 : 0
    }).then((res) => {
      const {
        Data,
        StatusCode
      } = res;

      this.setData({
        status: StatusCode,
        expressSlider: Data,
      });
    });
  },
  /* 发货或者修改物流信息 */
  handleEditExpress() {
    const {
      params: {
        orderId,
        returnId,
      }
    } = this.data;
    app.goPage({
      url: '/subPackageC/afterSaleDeliverGoods/afterSaleDeliverGoods',
      options: {
        orderId,
        returnId,
      }
    })
  },
  /* 确认收货 */
  confirm() {
    const formData = {
      ReturnsId: this.data.returnId,
      Remark: "",
    };

    finishReturn(formData).then((res) => {
      const {
        Status,
        Message
      } = res.data;

      wx.showToast({
        title: Message,
        icon: "none",
      });

      if (Status != "success") {
        return;
      }

      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        });
      }, 2000);
    });
  },
  /* 拒绝申请 */
  turnDown() {
    const {
      Status,
      Message
    } = res.data;

    const formData = {
      ReturnsId: this.data.returnId,
      Remark: "",
    };

    turnDownReturn(formData).then((res) => {
      wx.showToast({
        title: Message,
        icon: "none",
      });
      if (Status != "success") {
        return;
      }
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        });
      }, 2000);
    });
  },
  /* 查看物流 */
  seeExpressStep(e) {
    const {
      orderId
    } = this.data.params;

    app.$api.checkExpressDetail({
      orderId
    }).then(res => {
      const {
        Data: {
          url
        },
        Code
      } = res

      if (Code != 1) {
        return wx.showToast({
          title: '获取物流信息失败'
        })
      }

      wx.setStorage({
        key: 'webViewUrl',
        data: url,
        success: (result) => {
          app.goPage({
            url: `/subPackageC/expressDetail/expressDetail`,
            options: {
              orderId
            }
          })
        },
      });


    })

  }
});