const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsInfoList: [],
    params: {},
    active: 0,
    imageURL: '',
    steps: [

    ],

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      params: options
    });
    this.getExpressInfo()
    this.getOrderDetail();

    // this.getExpressInfo()


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  seeOrderDetail() {
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${this.data.params.orderId}`,

    });
  },
  getOrderDetail() {
    const {
      params: {
        orderId
      }
    } = this.data;
    app.$api.getOrderDetail({
      orderId
    }).then(res => {

      const {
        Data = {},
          Data: {
            Suppliers = []
          }
      } = res;



      if (Suppliers.length > 0) {
        const LineItems = Suppliers[0].LineItems || [];

        this.data.goodsInfoList = LineItems
      }

      this.setData({
        goodsInfoList: this.data.goodsInfoList
      })
      console.log(this.data.goodsInfoList, '1111')
    })
  },
  getExpressInfo() {
    const {
      params: {
        orderId
      }
    } = this.data;
    app.$api.getExpressInfo({
      orderId
    }).then(res => {

      const {
        returnCode,
        message,
        Traces = [],

      } = res;

      const {
        steps
      } = this.data;

      if (returnCode == 500) {

        wx.showModal({
          content: message,
          showCancel: false,
        })
      }

      Traces.reverse().forEach(item => {
        steps.push({
          text: item.AcceptStation,
          desc: item.AcceptTime
        })
      })

      this.setData({
        steps,
        active: 0
        // steps.length - 1
      })
    })
  }

});