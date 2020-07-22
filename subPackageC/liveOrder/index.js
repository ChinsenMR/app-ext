import { getOrdersByLive } from '../../utils/requestApi';
import { checkMore, isJSONStr } from '../../utils/util';
import { 
  ORDER_STATUS_UNSHIPPED, 
  ORDER_STATUS_SHIPPED, 
  ORDER_STATUS_FINISHED, 
  ORDER_STATUS_REFUND, 
  ORDER_STATUS, 
} from '../../utils/constant';

const PAGE_SIZE = 10;
const app=getApp()
function normalizeOrderList(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  const ret = [];
  data.forEach(item => {
    const { products = [], ...rest } = item;
    const atom = {
      statusTxt: ORDER_STATUS[item.OrderStatus],
      ...rest, 
    };

    if (Array.isArray(products)) {
      atom.products = products.map(product => ({
        name: product.ProductName,
        pic: product.ImageUrl,
        quantity: product.Quantity,
        pri:product.Price
        // tags: ['1', '2'],
      }));
    }
    ret.push(atom);
  });

  return ret;
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: PAGE_SIZE,
    keyword: '',
    keywordVal: '',
    status: 0,         // 0 全部
    orderList: [],
    loading: true,
    finished: true,
    tabs: [
      {
        title: '全部',
        status: 0,
      },
      {
        title: '待发货',
        status: ORDER_STATUS_UNSHIPPED,
      },
      {
        title: '已发货',
        status: ORDER_STATUS_SHIPPED,
      },
      {
        title: '已完成',
        status: ORDER_STATUS_FINISHED,
      },
      {
        title: '售后订单',
        status: ORDER_STATUS_REFUND,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrdersByLive()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size } = this.data;
          this.setData({
            orderList: normalizeOrderList(res.Data.liveOrders),
            finished: !checkMore(page, size, res.Data.liveOrders.length, res.Data.Total),
          });
        }

        this.setData({ loading: false });
      }).catch(err => {
        this.setData({ loading: false });
      });
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      page: 1,
      orderList: [],
      loading: true,
      finished: true,
    });

    this.getOrdersByLive()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size } = this.data;
          this.setData({
            orderList: normalizeOrderList(res.Data.liveOrders),
            finished: !checkMore(page, size, res.Data.liveOrders.length, res.Data.Total),
          });
        }

        this.setData({ loading: false });
        wx.stopPullDownRefresh();
      }).catch(err => {
        this.setData({ loading: false });
        wx.stopPullDownRefresh();
      });
  },

  onReachBottom () {
    if (
      this.data.loading || 
      this.data.finished
    ) {
      return;
    }

    this.setData({
      page: this.data.page + 1,
      loading: true,
    });

    this.getOrdersByLive()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size, orderList } = this.data;
          this.setData({
            orderList: orderList.concat(normalizeOrderList(res.Data.liveOrders)),
            finished: !checkMore(page, size, res.Data.liveOrders.length, res.Data.Total),
          });
        } else {
          this.setData({ page: this.data.page - 1 });
        }

        this.setData({ 
          loading: false, 
        });
      }).catch(err => {
        this.setData({ 
          page: this.data.page - 1,
          loading: false, 
        });
      });
  },

  getOrdersByLive() {
    const { page, size, keywordVal, status } = this.data;
    const payload = {
      index: page,
      size,
      key: keywordVal,
      orderstatus: status,
      anchorId:app.globalData.GetMembersInfo.UserId
    };

    return getOrdersByLive(payload);
  },

  handleKeywordChange(e) {
    this.setData({
      keyword: e.detail,
    });
  },

  handleJumpDetail(e) {
    const { orderid } = e.target.dataset;
    wx.navigateTo({
      url: `/subPackageC/liveOrder/detail?orderId=${orderid}`
    });
  },

  handleStatusChange(e) {
    const { tabs } = this.data;
    const curTab = tabs[e.detail.index];

    this.setData({
      status: curTab.status, 
      page: 1,
      orderList: [], 
      loading: true,
      finished: true,
    });

    this.getOrdersByLive()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size } = this.data;
          this.setData({
            orderList: normalizeOrderList(res.Data.liveOrders),
            finished: !checkMore(page, size, res.Data.liveOrders.length, res.Data.Total),
          });
        }

        this.setData({ loading: false });
      }).catch(err => {
        this.setData({ loading: false });
      });
  },

  handleSearch() {
    this.setData({ 
      keywordVal: this.data.keyword, 
      page: 1,
      orderList: [],
      loading: true,
      finished: true,
    });

    this.getOrdersByLive()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size } = this.data;
          this.setData({
            orderList: normalizeOrderList(res.Data.liveOrders),
            finished: !checkMore(page, size, res.Data.liveOrders.length, res.Data.Total),
          });
        }

        this.setData({ loading: false });
      }).catch(err => {
        this.setData({ loading: false });
      });
  },
})