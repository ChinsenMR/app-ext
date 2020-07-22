const app = getApp();
import { getOrderList } from '../../../utils/requestApi.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    activeItem: 0,
    active: 0, //选,
    page: 1, //页码
    pageType: 1, // 页面类型 --->   1为代理订单  2为分销订单
    orderList: [],
    allOrderNum: 0,  // 全部订单
    completeOrderNum: 0, //  已完成订单
    BuyerAlreadyPaid: 0,//待发货订单数
    WaitReceivedCount: 0,//待收货订单数
    showFH: false, //选择配送方式
    showEdit: false, //填写物流
    Delivery: [
      {
        name: "代理发货 (快递)",
        id: 0,
        status: true
      },
      {
        name: "代理发货 (自提)",
        id: 0,
        status: true
      },
      {
        name: "云仓发货",
        id: 1,
        status: true
      },
      {
        name: "转总部",
        id: 2,
        status: true
      }
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
    id: 0,//发货需要的SendType
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {

    //判断 页面类型  --->   1为代理订单  2为分销订单
    // let t = '代理订单';
    // if (opt.pageType == 2) t = '分销订单';
    // wx.setNavigationBarTitle({ title: t })
    this.setData({ pageType: opt })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    this.initData(0);
    // this.orderNum();
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
  //初始化数据
  initData: function (status) {
    let that = this;
    let { page, orderList } = this.data;
    wx.showLoading({
      title: '加载中...',
    })
    getOrderList({
      // IsReferralUserId: true,
      FightDistributorUserId: wx.getStorageSync('userInfo').UserId,
      pageSize: 10,
      pageIndex: page,
      status: status
    }).then(res => {
      console.log("分销订单", res);
      if (res.data.Data.Status = 'Success') {
        wx.hideLoading();
        if (res.data.Data.length != 0) {
          res.data.Data.forEach(item => {
            orderList.push(item)
          })
          that.setData({
            orderList,
            page: page + 1,
          })
        }
        that.setData({
          allOrderNum: res.data.AllOrderCount,  // 全部订单
          completeOrderNum: res.data.FinishedOrderCount, //  已完成订单
          BuyerAlreadyPaid: res.data.BuyerAlreadyPaid,//待发货
          WaitReceivedCount: res.data.WaitReceivedCount,//待收货
        })
      }else{
        wx.hideLoading();
        console.log("输出错误信息", res);
      }
      
    })
  },
  //切换导航栏
  selectNav: function (e) {
    let { status } = this.data;
    this.setData({
      activeItem: e.target.dataset.id,
      orderList: [],
      page: 1
    })
    this.initData(e.target.dataset.id)
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
    let num = e.currentTarget.dataset.num;
    let obj = e.currentTarget.dataset.item;
    let arr = this.data.showEditList
    console.log("item", obj);
    if (num == 2) {
      arr.forEach(c => {
        console.log("收货地址", c);
        c.val = obj[c.data];
      });
      console.log("物流", obj.AllExpressName);
      arr.forEach(c => {
        console.log("收货地址", c);
        c.val = obj[c.data];
      });
      this.setData({
        id: 0,
        columns: obj.AllExpressName,
        'sendData.orderId': obj.OrderId,
        showEditList: arr,
        showEdit: true
      })
      this.subMitFN(3);
    } else {
      let arr = this.data.showEditList
      console.log("物流", obj.AllExpressName);
      arr.forEach(c => {
        console.log("收货地址", c);
        c.val = obj[c.data];
      });
      if (obj.IsKjProducts == false) {
        let arr = this.data.Delivery
        arr.forEach(v => {
          if (v.name == "云仓发货") {
            v.status = false
          } else if (v.name == "代理发货 (自提)") {
            if (v.ShippingModeId == -2) {
              v.status = true
            } else {
              v.status = false
            }
          }
        })
        this.setData({
          Delivery: arr
        })
      }
      this.setData({
        columns: obj.AllExpressName,
        'sendData.orderId': obj.OrderId,
        showEditList: arr,
        showFH: true
      })
    }
  },
  //选择发货
  chooseFN(e) {
    // console.log(e);
    let { index, id } = e.currentTarget.dataset
    console.log("dasdasdada", id);
    this.setData({
      id,
      showFH: false
    })
    if (!index) return (this.setData({ showEdit: true }));
    index--
    this.subMitFN();
  },
  // 提交配送方式
  subMitFN(num) {
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
            this.initData(0);
          } else if (this.data.activeItem == 2) {
            this.setData({
              page: 1,
              orderList: []
            })
            this.initData(2);
          } else if (this.data.activeItem == 3) {
            this.setData({
              page: 1,
              orderList: []
            })
            this.initData(3);
          } else if (this.data.activeItem == 5) {
            this.setData({
              page: 1,
              orderList: []
            })
            this.initData(5);
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
  //分销详情
  handleQQ(e) {
    wx.navigateTo({
      url: '/packageA/wjx/distribution/distribution?id=',
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
  handleGB(e) {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.initData();
  },

 
})