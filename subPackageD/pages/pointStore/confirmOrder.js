const app = getApp();

Page(app.$page({
  /**
   * 页面的初始数据
   */
  data: {
    isPaid: false
  },
  state: {
    point: ['goodsCartList', 'totalPrice', 'totalCount'],
    common: ['defaultAddress']
  },
  onLoad(opt) {

  },

  onShow() {
    if (this.data.isPaid) {
      return wx.navigateBack({
        delta: 2
      })
    }
    this.getDefaultAddress();
  },
  methods: {
    disableConfirm() {


      let timeout = setTimeout(() => {
        this.setData({
          isComfirmIng: false
        }, () => {
          clearTimeout(timeout)
        })
      }, 1000)
    },

    //选择快递
    selectExpress(e) {
      this.setData({
        expressVal: this.data.express[e.detail.value],
      });
    },

    //打开地址页面
    goSelectAddress() {

      wx.navigateTo({
        url: "/pages/newAddress/newAddress",
      });
    },

    //获取地址
    getDefaultAddress() {
      app.$api.getAddressList({}).then((res) => {
        if (res.success) {
          app.$store.common.update({
            defaultAddress: res.Data instanceof Array ? res.Data[0] : null
          })
        }
      });
    },

    //打开   关闭modal
    confirmOrder() {

      this.setData({
        isComfirmIng: true
      })

      if (!this.data.defaultAddress) {
        return app.alert.message('请填写收货地址')
      }
      app.alert.loading('订单生成中...')

      app.$api.confirmOrder({
        shippingId: this.data.defaultAddress.ShippingId,
        action: "Submmitorder",
        shippingType: 0,
        paymentType: 0,
        storeId: 0,
        chooseStoreId: 0,
        storeCount: 0,
        couponCode: "",
        couponCode2: "",
        productSku: "",
        buyAmount: "",
        from: "",
        shiptoDate: "",
        remark: this.data.remark,
        orderSource: 4,
        deductionPoints: 0,
        needInvoice: false,
        invoiceTitle: "",
        invoiceType: 2,
        invoiceId: 0,
        invoiceTaxpayerNumber: "",
        UseBalance: 0,
        AdvancePayPass: "",
        isShareBuy: 0,
        partitionRedTotal: 0.0,
      }).then((res) => {

        if (res.Status == "OK") {
          this.setData({
            isPaid: true
          })
          app.$store.point.update({
            goodsCartList: [],
            totalPrice: 0,
            totalCount: 0
          })
          app.alert.success('订单已生成')
          app.tools.goPageTimeOut({
            url: "/pages/myOrder/myOrder"
          })

        } else {
          app.alert.message(res.ErrorMsg || "订单生成失败")
        }
      });
    },

    // 获取备注的值
    handleVal(e) {
      let val = e.detail.value;
      this.setData({
        remark: val,
      });
    },
  },

}));