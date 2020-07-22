import { getOrderDetail, getOrderExpress } from '../../utils/requestApi';
import Moment from '../../utils/moment';
import { ORDER_STATUS } from '../../utils/constant';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    trail: [],
    trailLoading: true,
    orderId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { orderId } = options;
    this.data.orderId=options.orderId
    this.getOrderDetail(orderId);
    this.getOrderExpress(orderId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  getOrderDetail(id) {
    getOrderDetail({
      orderId: id,
    }).then(res => {
      if (res.Status === 'true') {
        const { 
          Products, 
          CellPhone, 
          ShipTo, 
          ShippingRegion, 
          Address, 
          OrderDate, 
          FinishDate, 
          PayDate,
          ...rest
        } = res.Data;

        this.setData({ 
          orderInfo: {
            products: Products.map(item => ({
              name: item.ProductName,
              pic: item.ImageUrl,
              quantity: item.Quantity,
              Price:item.Price
            })),
            addressee: {
              name: ShipTo,
              phone: CellPhone,
              address: ShippingRegion + ' ' + Address,
            },
            statusTxt: ORDER_STATUS[rest.OrderStatus],
            OrderDate: new Moment(OrderDate).format('YYYY-MM-DD HH:mm:ss'),
            FinishDate: new Moment(FinishDate).format('YYYY-MM-DD HH:mm:ss'),
            PayDate: new Moment(PayDate).format('YYYY-MM-DD HH:mm:ss'),
            
            ...rest,
          },
        });
      }
    })
  },

  getOrderExpress(id) {
    getOrderExpress({
      OrderId: id,
    }).then(res => {
      if (res.Success) {
        if (Array.isArray(res.Traces)) {
          this.setData({
            trail: res.Traces.map(item => ({
              hour: new Moment(item.AcceptTime).format('HH:mm'),
              month: new Moment(item.AcceptTime).format('MM 月 DD 日'),
              subTitle: item.AcceptStation,
            })),
          });
        }
      }

      this.setData({ trailLoading: false });
    }).catch(err => {
      this.setData({ trailLoading: false });
    })
  },

  handleTimeConfirm(){
    wx.navigateTo({
      url:'/fuPackageA/fuWuLiu/fuWuLiu?oid='+this.data.orderId
    })
  }
})