const app = getApp();
// import {
//   getPointExchangeInfo,
//   PointChangeAddCart,
// } from "../../../utils/requestApi.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    list: [],
    page: 0, // 分页
    limit: 4, // 每页条数
    loadMore: true, // 是否为最后一页
  },

  addCart(e) {
    const { id } = e.currentTarget.dataset;
    PointChangeAddCart({
      giftId: id,
      needPoints: 1,
      isExemptionPostage: true,
    }).then((res) => {
      console.log(res);
      const ErrorResponse = res.data.ErrorResponse;
      const Result = res.data.Result;
      if (ErrorResponse && ErrorResponse.ErrorCode == 101) {
        wx.showToast({ title: res.data.ErrorResponse.ErrorMsg, icon: "none" });
      } else if (Result) {
        wx.showToast({ title: "已成功加入积分购物车，快去看看吧^_^" });
        // wx.navigateTo({
        //   url: "../cart/cart",
        // });
      }
    });
  },
  seeDetail(e) {
    console.log(e);
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../goodsDetail/goodsDetail?goodsId=" + id,
    });
  },
  getList(currentPage) {
    let { page, list, loadMore, limit } = this.data;

    if (currentPage) {
      page = 0;
      list = [];
      loadMore = true;
      this.setData({ page, list, loadMore });
    }

    if (!loadMore) {
      return;
    }

    page++;
    this.setData({ isLoading: true });

    getPointExchangeInfo({ pageIndex: page, pageSize: limit, type: 0 }).then(
      (res) => {
        const { TotalCount } = res.data.Result.TotalRecords;
        const maxPage = Math.ceil(Number(TotalCount) / limit) || 1;
        const result = res.data.Result.PointProductList;
        list = list.concat(result);
        loadMore = page >= maxPage ? false : true;

        this.setData({ page, list, loadMore });
        wx.stopPullDownRefresh();
      }
    );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();

    app.globalData.template.tabbar("tabBar", 1, this); //0表示第一个tabba
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  onPullDownRefresh() {
    this.getList(1);
    console.log("下拉刷新");
  },
  onReachBottom() {
    this.getList();
    console.log("上拉触底");
  },
});
