import {
  getAddressList,
  getOrderInfo,
  submitOrderInfo,
  payOrder
} from "../../utils/requestApi";
import {
  toPay
} from '../../utils/util.js';

const app = getApp()

Page({
  data: {
    imgurl: app.data.imgurl,
    expressList: ['顺丰', '圆通', '中通', '韵达'],
    currentExpress: null, // 快递值
    defaultAddressData: null, //地址
    orderInfo: null, //商品列表
    goodsCountTotal: 0, // 商品列表总数
    goodsPriceTotal: 0, //商品总价
    sku: null, //商品id
    fromPage: null,
    hiddenPay: true, //支付modal
    payType: false, // 选择支付类型
    buyAmount: null, //
    groupId: null, //拼团活动id
    couponList: null, //优惠券 
    FightGroupId: 0, //开团为0，参团为FightGroupId
    isDefault: true,
    OrderFreight: 0, //运费
    Balance: 0, // 余额
    isUseDeduction: false, // 控制是否采用余额抵消
    extractType: 0, // 提取方式(0快递-1门店-2自提)
    isPay: 0, // 控制支付
    remark: '', // 备注
    orderStatus: false, // 自提信息的显示隐藏
    isOnlyTotal: true, // 控制订单号的获取,false才可以支付
    BalanceAmount: 0, //可用于抵扣的值
    couponData: {}, // 选中的优惠卷数据
    prDid: null, //商品id
    tuxedo: '', //判断是不是从详情那边立即参团跳过来的字符串
    IsFightGroup: null, //拼团状态
    agentId: '', //代理id
  },

  onLoad(opt) {

    const {
      sku,
      fromPage,
      buyAmount,
      groupId,
      FightGroupId,
      p, //商品丶
      ProductId,
      productSku,
      tuxedo,
      IsFightGroup,
      d, //代理id
    } = opt;


    this.setData({
      sku,
      fromPage,
      buyAmount,
      groupId,
      FightGroupId,
      prDid: p,
      ProductId,
      productSku,
      tuxedo,
      IsFightGroup,
      agentId: d,
      fromPage: fromPage || ''
    })

    /* 提交的样式 */
    if (wx.getStorageSync('tab').WapTheme != 'fruit') {
      this.setData({
        isDefault: false
      })
    }

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      goodsCountTotal: 0
    })
    this.getdefaultAddress()
  },

  /* 选择快递 */
  selectExpress(e) {
    this.setData({
      currentExpress: this.data.expressList[e.detail.value]
    })
  },


  /* 跳转选择地址页面 */
  goSelectAddress() {
    wx.navigateTo({
      url: '../receivingAddress/receivingAddress',
    })
  },


  /* 获取地址 */
  getdefaultAddress() {
    getAddressList({}).then(res => {
      const {
        Status,
        Data
      } = res.data;

      if (Status === "Success")
        this.setData({
          defaultAddressData: Data[0]
        }, () => {
          this.getOrderInfo()
        })

    })
  },

  /* 获取订单详情 */
  getOrderInfo() {
    let {
      fromPage,
      sku,
      buyAmount = '',
      productSku,
      FightGroupId,
      tuxedo,
      goodsCountTotal,
      goodsPriceTotal,
      defaultAddressData,
      groupId
    } = this.data;

    app.alert.loading('加载中...')


    const ajaxData = {
      shipAddressId: defaultAddressData.ShippingId,
      fromPage: fromPage ? fromPage.trim() : '',
      productSku: sku.trim() || productSku.trim(),
      buyAmount,
      fightGroupActivityId: groupId ? groupId.trim() : '',
      FightGroupId: tuxedo ? FightGroupId : ''
    }

    getOrderInfo(ajaxData).then(res => {
      const {
        Status,
        Data,
      } = res.data;

      app.alert.closeLoading();

      if (Status == 'Success') {
        const {
          ProductAmount,
          OrderFreight,
          Balance,
          ProductItems,
          CouponList
        } = Data;

        /* 计算商品数量和价格 */
        ProductItems.forEach(item => {
          goodsCountTotal = item.Quantity
          goodsPriceTotal = ((ProductAmount * 100) + (OrderFreight * 100)) / 100
        })

        this.setData({
          Balance,
          OrderFreight,
          goodsCountTotal,
          goodsPriceTotal,
          orderInfo: ProductItems,
          couponList: CouponList
        })
      }
    })

  },

  /* 确认订单 */
  submitOrder() {
    this.setData({
      isOnlyTotal: false // 用于改变状态  可以获取到订单号
    }, () => {
      this.updateOrder(); // 提交订单
    })
  },




  /* 修改提交数据 */
  updateOrder() {
    app.alert.loading('订单生成中...');

    const {
      sku,
      defaultAddressData: {
        ShippingId = ''
      },
      defaultAddressData,
      buyAmount = '',
      groupId,
      FightGroupId,
      agentId = '',
      remark = '',
      isUseDeduction,
      extractType,
      isPay,
      couponData: {
        code = ''
      },
      isOnlyTotal,
      fromPage = '',
      prDid
    } = this.data;


    const ajaxData = {
      buyAmount, // 购买数量
      remark, //	备注
      shippingId: ShippingId || '', //收货地址id（测试值43）
      productSku: sku.trim(), //购物车商品规格 多个商品用,隔开
      fromPage: fromPage ? fromPage.trim() : 'signbuy', // 活动（详情见备注）
      fightGroupActivityId: fromPage == 'signbuy' ? '' : groupId, // 拼团活动ID
      FightGroupId: fromPage == 'signbuy' ? '' : FightGroupId, // 参团的拼团ID，开团为0
      OrderSource: 8,
      couponCode: code, //优惠劵代码 price
      IsAdvancePay: isUseDeduction, // 是否使用余额抵扣
      IsGetOrderTotal: isOnlyTotal, // 是否只计算订单金额（true只计算金额false生成订单）
      ShippingModeId: extractType, // 配送方式(0快递-1门店-2自提)
      RoomId: app.data.roomid || '', //	否	int	直播间ID
      FightDistributorUserId: agentId, //代理id,有就传,没有就传空字符串
      MustHasFightDistributorUserId: true,
    }

    submitOrderInfo(ajaxData).then(res => {
      app.alert.closeLoading();

      const {
        Status,
        BalanceAmount,
        OrderTotal,
        Message
      } = res.data;


      /*  为1的时候  调用支付功能 */
      if (Status === "Success") {
        if (Boolean(isPay)) {
          const {
            OrderTotal,
            OrderId
          } = res.data;

          const groupId = res.data.FightGroupId // 拼团id
          const generalUrl = `/pages/paySuccess/paySuccess?total=${OrderTotal}`; // 普通支付成功页
          const groupUrl = `/groupDetail/groupDetail?FightGroupId=${groupId}&prDid=${prDid}`; // 查看拼团详情
          const groupDetailUrl = `/groupDetail/groupDetail?fromPage=${fromPage}&FightGroupId=${groupId}&sku=${sku}&prDid=${this.data.prDid}&agentId=${agentId}`;

          /* 开启抵扣余额 */
          if (isUseDeduction) {
            /* 如果有拼团id就证明是拼团订单, 判断是跳转拼团详情还是普通支付完成页面 */
            if (Boolean(groupId)) {
              wx.redirectTo({
                url: groupDetailUrl,
              })
            }
            /* 普通支付 */
            else {
              this.goPayOrder(OrderId, groupId, OrderTotal)
            }
          }
          /* 没有开启余额的支付 */
          else {
            toPay(OrderId, () => {
              wx.navigateTo({
                url: Boolean(groupId) ? groupUrl : generalUrl,
              })
            })
          }
        }

        this.setData({
          BalanceAmount: BalanceAmount, // 可抵扣的钱
          goodsPriceTotal: OrderTotal // 抵扣前后的值
        })
      } else {
        app.alert.toast(Message)
      }


    })
  },
  /* 支付订单 */
  goPayOrder(OrderId, groupId, OrderTotal) {
    /* 将订单号传给后台 */
    payOrder({
      orderId: OrderId,
      pinId: groupId
    }).tnen(() => {
      wx.redirectTo({
        url: `/pages/paySuccess/paySuccess?total=${OrderTotal}`,
      })
    })
  },
  /* 关闭modal */
  handleOpenPayModal() {

    this.selectPayType();

  },

  /* 选择支付方式 */
  selectPayType() {
    this.setData({
      payType: true,
      isPay: 1
    }, () => {
      this.submitOrder()
    })

  },

  /* 获取优惠券 */
  selectCoupons() {
    this.selectComponent("#coupon").showModal();
  },

  /* 余额抵扣 */
  handleOpenDeduction(e) {
    const {
      value
    } = e.detail;

    /* 未选择地址 */
    if (!this.data.defaultAddressData.ShippingId) {

      return app.alert.confirm({
        content: '前往设置地址',
        showCancel: false
      }, res => {
        this.goSelectAddress()
      })
    }

    this.setData({
      isUseDeduction: value,
      isOnlyTotal: true
    }, () => {
      this.updateOrder()
    })
  },

  /* 是否自提  */
  handlePickUp(e) {
    const {
      value
    } = e.detail;;

    this.setData({
      extractType: value ? -2 : 0,
      orderStatus: value,
      isOnlyTotal: true
    }, () => {
      this.updateOrder()
    })
  },

  /* 修改备注的值 */
  handleEditRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /* 获取选中的优惠卷的数据 */
  getCouponData(e) {
    this.setData({
      couponData: e.detail
    }, () => {
      this.updateOrder();
    })
  },
})