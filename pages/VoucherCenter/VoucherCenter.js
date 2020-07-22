// pages/VoucherCenter/VoucherCenter.js
let app = getApp()
import {
  getcouponclassifyData,
  getdataCouponsdata,
  getcoupon
} from "../../utils/requestApi.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl,
    pageIndex: 1,
    active: 0, //选择
    CategoryId: 0, //分类id
    classifydata: [], //分类数据
    Coupondata: [], //优惠券数据
    Receivecoupone: {}, //领取优惠券
    activeitem: -1 //领取的状态

  },
  //选择
  select(e) {
    console.log(e)
    if (this.data.active == e.currentTarget.dataset.active) {
      return
    }
    this.setData({
      active: e.currentTarget.dataset.active,
      CategoryId: e.currentTarget.dataset.categoryid,
      Coupondata: []
    })
    this.Getdata()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethearddata(),
      this.Getdata()
  },
  // 获取分类
  gethearddata() {
    let _this = this
    getcouponclassifyData({
      action: 'LoadCouponsCenterHead'
    }).then(res => {
      // console.log("优惠券", res)
      if (res.statusCode == 200) {
        _this.setData({
          classifydata: res.data.Result.Data
        })
      }
    })
  },
  // 获取列表
  Getdata() {
    let _this = this
    getdataCouponsdata({
      action: 'GetCouponsListByCategoryId',
      pageSize: 10,
      pageIndex: _this.data.pageIndex,
      CategoryId: _this.data.CategoryId
    }).then(res => {
      console.log("列表", res)
      if (res.statusCode == 200) {
        if (res.data.Result.Data.length > 0) {
          if (_this.data.pageIndex == 1) {
            _this.data.Coupondata = []
          }
          _this.setData({
            Coupondata: _this.data.Coupondata.concat(res.data.Result.Data),
            TotalRecords: res.data.Result.TotalRecords
          })
        } else {
          // wx.showToast({
          //      title: '到底啦~~',
          // })
        }

      }
    })
  },
  // 领取优惠券
  Getcoupon(e) {
    console.log(e)
    this.setData({
      activeitem: e.target.dataset.activeitem
    })
    getcoupon({
      couponId: e.target.dataset.couponid,

    }).then((res) => {
      console.log("领取优惠券", res)
      if (res.statusCode == 200) {
        this.setData({
          Receivecoupone: res.data
        })
        if (res.data.Result == "Faile") {
          wx.showToast({
            title: res.data.Msg,
          })
        }
        if (res.data.Result == "Success") {
          wx.showToast({
            title: res.data.Msg,
          })

        }
      }

    })
  },
  // 使用优惠券
  Byuser(e) {
    // 通用跳首页
    if (e.target.dataset.allactive == "allactive") {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    } else {
      console.log(e.target.dataset.index)
      let {
        Coupondata
      } = this.data
      console.log(Coupondata[e.target.dataset.index].CanUseProducts)
      var CanUseProducts = Coupondata[e.target.dataset.index].CanUseProducts

      if (CanUseProducts.indexOf(",") == -1) { //存在,号处理

        console.log("meiyou,", CanUseProducts)
        wx.navigateTo({
          url: `/pages/goodsDetail/goodsDetail?p=${CanUseProducts}`,
        })
      } else {
        var Productid = []
        Productid = CanUseProducts.split(",")
        console.log(Productid[e.target.dataset.index])
        wx.navigateTo({
          url: `/pages/goodsDetail/goodsDetail?p=${Productid[e.target.dataset.index]}`,
        })
      }
    }

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pageIndex++
    this.Getdata()
  },


})