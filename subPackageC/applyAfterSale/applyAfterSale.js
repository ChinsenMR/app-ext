const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    productlist: [],
    reasonList: [],
    imgUrl: app.data.imgurl,
    reasonArr: ['收件与实际不符', '产品质量问题', '商家发错货', '尺码不适合', '其他'],
    curReason: '',
    curSelect: '0',
    voucherImg: [],
    orderId: '',
    price: 0,
    point: 0,
    orderStatus: '',
    orderType: '', //订单类型 主流 、 引流
    amount: 0, //订单总价
    orderInfo: [],
    count: 1, // 件数
    remark: '', // 备注
    logInfo: {
      ShipTo: '',
      ShipAddress: '',
      CellPhone: '',
    }, //收货人物流信息
    initData: {}, // 初始化售后的数据
    refundType: [],
    refundTypeIndex: null,
    params: {
      orderId: '',
      type: '',
      skuId: '',
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      params: options
    });
    
    const returnReason = [
      "收件与实际不符",
      "产品质量问题",
      "商家发错货",
      "尺码不适合",
      "其他",
    ]
    const refundReason = [
      '拍错或多拍',
      '我不想要了',
      '发货太慢',
      '其他'
    ]

    this.setData({
      reasonArr: options.type != 0 ? returnReason : refundReason
    })

    this.initAfterSaleInfo();

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

  //当前选择的radio
  onRadio(e) {
    this.setData({
      curSelect: e.detail
    });
  },
  /* 初始化售后数据 */
  initAfterSaleInfo() {

    const {
      params: {
        orderId,
        skuId = '',
        type
      }
    } = this.data;

    app.$api.initAfterSaleInfo({
      orderId,
      type,
      skuId,
    }).then((res) => {

      const {
        Status,
        TypeList = []
      } = res;

      if (Status == 'Faile') {
        return app.tools.goBackTimeOut(3000);
      }

      const tempArr = [];

      TypeList.forEach(item => {
        tempArr.push({
          value: item,
          text: item == 1 ? '退到余额' : '原路返回'
        })
      })

      this.setData({
        refundType: tempArr,
        initData: res,
      });
    });
  },
  // 选择退货原因
  onChange(e) {
    this.setData({
      curReason: this.data.reasonArr[e.detail.value],
    });
  },
  onChangeType(e) {
    this.setData({
      refundTypeIndex: e.detail.value,
    });
  },
  // input输入收货人物流信息
  onShipToInput(e) {
    let {
      logInfo
    } = this.data;
    logInfo[e.currentTarget.dataset.name] = e.detail.value;
    this.setData({
      logInfo
    });
  },
  // input输入收货人物流信息
  inputText(e) {
    const {
      currentTarget: {
        dataset: {
          name
        }
      },
      detail: {
        value
      }
    } = e;

    const {
      initData: {
        SkuInfo
      }
    } = this.data;

    const maxCount = SkuInfo[0].Quantity;

    if (name == 'count') {
      this.data[name] = value > maxCount ? maxCount : value;

    } else {
      this.data[name] = value;
    }


    this.setData({
      count: this.data.count,
      remark: this.data.remark
    });

  },
  goSetPassword() {
    app.alert.confirm({
      content: '请设置交易密码'
    }).then(confirm => {
      if (confirm) {
        wx.navigateTo({
          url: '/packageA/pages/addPassword/addPassword?fromType=applyAfterSale',
        })

      }
    })
  },
  // 提交
  onSubmit(e) {
    let {
      curReason,
      count,
      remark,
      voucherImg,
      orderStatus,
      initData,
      refundType,
      refundTypeIndex,
      params: {
        orderId,
        skuId,
        type
      }
    } = this.data;
    if (curReason == '') return app.alert.message('请选择原因')


    if (type == 0) {
      if (!refundTypeIndex) {
        return wx.showToast({
          icon: 'none',
          title: '请选择退款方式'
        });
      }

      const currentType = refundType[refundTypeIndex].value

      app.$api.applyRefund({
        orderId, //	是	string	订单Id
        remark, //	否	string	备注文本
        refundType: currentType, //	是	int	退款方式
        RefundReason: curReason || '', //	是	string	退款原因
      }).then((res) => {
        // console.log("输出申请退款状态",res);
        const {
          Status,
          Message
        } = res;

        if (Status == 'Success') {
          app.alert.message(Message)
          app.tools.goBackTimeOut();
        } else {
          if (Message === "请先设置交易密码") {
            return this.goSetPassword();

          }
        }
      });
    } else {

      app.$api.applyReturn({
        orderId,
        skuId,
        Quantity: count,
        Remark: remark || '', //	否	string	备注文本
        RefundReason: curReason,
        afterSaleType: type,
        UserCredentials: voucherImg.join(','),
        ShipTo: initData.ShipTo,
        ShipAddress: initData.ShipAddress,
        CellPhone: initData.CellPhone,
      }).then((res) => {
        const {
          Status,
          Message
        } = res;

        if (Status === 'Success') {
          app.alert.message(Message)
          app.tools.goBackTimeOut();
        } else if (Message === '请先设置交易密码') {
          return this.goSetPassword();
        } else {
          app.tools.goBackTimeOut();
        }
      });
    }
  },

  // 上传图片
  onUpdate() {
    let {
      voucherImg
    } = this.data;

    app.tools.upload({
      url: app.data.url + '/AppShop/AppShopHandler.ashx?action=AppUploadImage',
      count: 5
    }).then(res => {
      console.log(res)
    })
    return
    wx.chooseImage({
      count: 1,
      success: (res) => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64',

          success: (data) => {
            Uploadimgbybase64({
              baseStr: data.data,
            }).then((res2) => {
              if (res2.data.Status == 'Success') {
                voucherImg = [...voucherImg, res2.data.Message];
                this.setData({
                  voucherImg
                });
              }
            });
          },
        });
      },
    });
  },

  // 删除图片
  onClear(e) {
    let {
      voucherImg
    } = this.data;
    let {
      index
    } = e.currentTarget.dataset;
    voucherImg.splice(index, 1);
    this.setData({
      voucherImg
    });
  },

  // 查询订单在代理系统中的状态（主要是备货订单）
  getOrderStatus() {
    let {
      orderType,
      orderStatus,
      orderId
    } = this.data;
    getKjOrderStatus({
      OrderId: orderId,
    }).then((res) => {
      if (res.data.Status == 'Success') {
        let s = res.data.Data.Data.Status;
        if (orderType == 0) {
          //主流订单
          this.setData({
            curSelect: s == 0 ? '0' : '1',
            orderStatus: s == 0 ? 0 : 3,
          });
        } else {
          //引流订单
          this.setData({
            curSelect: s == 2 && (orderStatus == 2 || orderStatus == 100) ? '0' : '1',
            orderStatus: s == 2 && (orderStatus == 2 || orderStatus == 100) ? 0 : 3,
          });
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

});