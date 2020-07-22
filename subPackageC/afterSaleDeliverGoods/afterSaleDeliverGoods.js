const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    form: {
      order_sn: "",
      express_sn: "",
      goods_name: "",
      address: "",
      express_company: "",
      express_company_key: "",
    },
    info: {},
    returnId: "",
    orderId: "",
    expressCompanyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(options);
    this.getOrderReturn();
    this.getKD100()
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},
  /* 获取快递列表 */
  getKD100() {
    app.$api.getKD100().then((res) => {
      if (res.success) {
        const {
          KdList = []
        } = res.Result;
      
        this.setData({
          expressCompanyList: KdList,
        });
      }

    });
  },
  /* 获取退款信息 */
  getOrderReturn() {
    const {
      returnId,
      orderId
    } = this.data;

    app.$api.getOrderReturn({
      returnId,
      orderId
    }).then((res) => {
      
      if (res.success) {
        const {
          Data
        } = res;
        
        this.setData({
          info: Data,
          'form.express_sn': Data.ShipOrderNumber,
          'form.express_company': Data.ExpressCompanyName

        });
      }

    });
  },
  /* 输入快递单号 */
  inputContext(e) {
    const {
      value
    } = e.detail;

    this.setData({
      "form.express_sn": value,
    });
  },
  /* 选择快递 */
  pickerItem(e) {
    const {
      value
    } = e.detail;

    this.setData({
      "form.express_company_key": this.data.expressCompanyList[value].key,
      "form.express_company": this.data.expressCompanyList[value].value,
    });
  },
  /* 提交信息 */
  submit() {
    const {
      orderId,
      returnId,
      info,
      form
    } = this.data;

    if (!form.express_company) {
      return app.alert.message('请选择物流公司')
    }

    if (!form.express_sn) {
      return app.alert.message('请输入快递单号')
    }

    const params = {
      returnId,
      orderId,
      SkuId: info.LineItem[0].SkuId,
      express: form.express_company,
      shipOrderNumber: form.express_sn,
      UserCellPhone: info.AdminCellPhone,
    };

    app.$api.returnSendGoods(params).then((res) => {
      app.alert.toast(res.Message);

      if (res.success) {
        app.tools.goBackTimeOut()
      }
    });
  },
  handleArrow() {
    this.setData({
      isShowExpress: !this.data.isShowExpress,
    });
  },
});