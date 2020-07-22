let app = getApp();
import {
  initApply,
  applyRefund
} from "../../../utils/requestApi"
import {
  debounce
} from '../../../utils/myutil';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    list: [{
        title: '申请原因',
        pla: '请选择申请原因',
        imgSta: true,
        inpSta: true,
        name: 'reason',
        val: '',
        met: 'handleWin'
      },
      {
        title: '退款订单',
        pla: '',
        imgSta: false,
        inpSta: true,
        name: 'order',
        val: '',
        met: ''
      },
      {
        title: '退款金额',
        pla: '',
        imgSta: false,
        inpSta: true,
        name: 'priceWay',
        val: '',
        met: ''
      },
      {
        title: '退款方式',
        pla: '',
        imgSta: true,
        inpSta: true,
        name: 'modeWay',
        val: '',
        met: 'handleTk'
      },
      {
        title: '备注',
        pla: '填写退款备注信息',
        imgSta: false,
        inpSta: false,
        name: 'remark',
        val: '',
        met: ''
      }
    ],
    search: [{
        title: '拍错/多拍/不想要',
        sta: false
      },
      {
        title: '缺货',
        sta: false
      },
      {
        title: '未按约定时间发货',
        sta: false
      }
    ],
    refund: [
      // {
      //   title: '退到预付款',
      //   type: 1
      // },
      // {
      //   title: '原来返回',
      //   type:3
      // }
    ],
    rindex: 0,
    nums: 4,
    isShow: false,
    val: '', //选择原因申请原因
    isHandle: false,
    newVal: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("输出数据", options);
    const {
      orderid,
      price
    } = options;
    this.getInit(orderid);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 初始化数据
  getInit(id) {
    initApply({
      OrderId: id || '' //是	string	订单Id
    }).then(res => {
      console.log("输出结果", res);
      if (res.data.Status == "Success") {
        let data = res.data;
        let arrList = this.data.list;
        let arr = data.TypeList; //数据返回的数组
        let oldArr = this.data.refund;
        let obj = {}
        let obj2 = {}
        arrList.forEach(v => {
          if (v.title == "退款订单") {
            v.val = data.OrderId
          } else if (v.title == "退款金额") {
            v.val = data.Total + '元'
          } else if (v.title == "退款方式") {
            arr.forEach(item => {
              if (item == 1) {
                v.val = "退到预付款"
              } else if (item == 3) {
                v.val = "原路返回"
              }
            })
          }
        })
        if (arr.length >= 2) { //当返回的数组长度为2的时候执行下方逻辑
          arr.forEach(v => {
            if (v == 1) {
              obj.title = "退到预付款"
            } else if (v == 3) {
              obj2.title = "原路返回"
            }
          })
          oldArr.push(obj);
          oldArr.push(obj2);
        } else {
          arr.forEach(v => {
            if (v == 1) {
              obj.title = "退到预付款"
            }
          })
          oldArr.push(obj);
        }
        this.setData({
          newVal: oldArr[0].title,
          refund: oldArr,
          list: arrList
        })
      } else {
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
          },
          fail: () => {},
          complete: () => {}
        });

      }
    })
  },


  //输入框的值
  handleInput: debounce(function (e) { //防抖
    let {
      list
    } = this.data;
    const {
      value
    } = e.detail;
    const {
      remark,
      index
    } = e.currentTarget.dataset;
    list.forEach((v, i) => {
      if (v.name == remark) {
        v.val = value
      }
    })
    this.setData({
      list
    })
  }, 500),

  //申请退款
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let obj = e.detail.value;
    let type = 1
    if (!obj.reason) {
      app.fa('请选择申请原因')
      return;
    } else if (obj.modeWay == "退到预付款") {
      type = 1
    } else if (obj.modeWay == "原路返回") {
      type = 3
    }
    wx.showLoading({
      title: "申请中~",
      mask: true,
    });
    applyRefund({
      OrderId: obj.order || '', //	是	string	订单Id
      Remark: obj.remark || '', //	否	string	备注文本
      refundType: type || '', //	是	int	退款方式
      RefundReason: obj.reason || '', //	是	string	退款原因
    }).then(res => {
      // console.log("输出申请退款状态",res);
      if (res.data.Status == "Success") {
        wx.hideLoading();
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          duration: 1500,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
          },
          fail: () => {},
          complete: () => {}
        });

      }
    })
  },

  //打开弹窗
  handleWin() {
    this.setData({
      isShow: true
    })
  },
  //关闭弹窗
  handleGb() {
    this.setData({
      isShow: false
    })
  },

  //点击选择申请原因
  handleClick(e) {
    console.log(e);
    const {
      index,
      val
    } = e.currentTarget.dataset;
    this.setData({
      nums: index,
      val
    })
  },
  //点击确定
  handleSearch() {
    let arr = this.data.list;
    arr.map(v => {
      if (v.title == "申请原因") {
        v.val = this.data.val
      }
    })
    this.setData({
      list: arr,
      isShow: false
    })
  },


  //打开选择退款方式
  handleTk() {
    this.setData({
      isHandle: true
    })
  },
  //点击选择的值
  handleNew(e) {
    const {
      index,
      val
    } = e.currentTarget.dataset;
    this.setData({
      rindex: index,
      newVal: val
    })
  },
  //关闭退款方式弹窗
  handleGb2() {
    this.setData({
      isHandle: false
    })
  },

  //选择退款方式确定
  handleQD() {
    let arr = this.data.list;
    arr.forEach(v => {
      if (v.title == "退款方式") {
        v.val = this.data.newVal
      }
    })
    this.setData({
      list: arr,
      isHandle: false
    })
  },

  //返回上一页
  handleFH() {
    wx.navigateBack({
      delta: 1
    });
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

  },

 
})