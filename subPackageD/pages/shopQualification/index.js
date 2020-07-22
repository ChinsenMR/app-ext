const app = getApp();



Page({
  /**
   * 页面的初始数据
   */
  data: {
    LicenseImg: "",
    CertImg: "",
    WxImage: "",
    RequetStatus: -1,
    isShow: false,
    statusIconUrls: [
      "https://img.hmeshop.cn/hmeshopV3/Storage/master/202005151346548567740.png",
      "https://img.hmeshop.cn/hmeshopV3/Storage/master/202005151346552005272.png",
      "https://img.hmeshop.cn/hmeshopV3/Storage/master/202005151346550755241.png",
    ],
    iconUrl: "https://img.hmeshop.cn/hmeshopV3/Storage/master/202005141509443964190.png",
    fleidList: [{
        type: "联系电话",
        desc: "手机或固话",
        value: "",
        fleid: "Phone"
      },
      {
        type: "微信号",
        desc: "请输入微信号",
        value: "",
        fleid: "WeChat"
      },
      {
        type: "身份证号",
        desc: "请输入身份证号",
        value: "",
        fleid: "IdCardNo"
      },
      {
        type: "法定代表人",
        desc: "请输入法人姓名",
        value: "",
        fleid: "Name"
      },
      {
        type: "经营地区",
        desc: "地区信息",
        value: "",
        fleid: "region"
      },
      {
        type: "详细地址",
        desc: "街道门牌信息",
        value: "",
        fleid: "CustomField5"
      },
    ],
    sexArr: ["男", "女"],
    avatar: null,
    refuseReason: '',
  },
  setAllData() {
    app.tools.setAllData(this, this.data);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(this.data, "ready");
    this.initData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  //获取协议弹窗
  agreementData() {
    app.$api.getAgreement({
      typeId: 1, //	是	int	协议类型，1为推广员协议，2为提现协议
    }).then((res) => {
      const {
        AContent,
        IsSign,
        success
      } = res;

      if (success) {
        if (!IsSign) {
          this.setData({
            isWin: true,
          });
        }


        app.wxParse.wxParse("article", "html", AContent, this, 0);
      }
    });
  },
  //点击同意协议
  handleTY(e) {
    const {
      status
    } = e.currentTarget.dataset;
    this.setData({
      isShow: true,
      status,
    });
  },
  //点击同意弹窗
  handleAgree() {
    let status = this.data.status;
    if (status == 1) {
      app.$api.signAgreement({
        TypeId: 1, //	是	int	协议类型id，1为推广员协议，2为提现协议
      }).then((res) => {

        if (res.success) {
          this.setData({
            isWin: false,
          });
        }

      });
    } else {
      wx.showToast({
        title: "请点击同意",
        icon: "none",
        duration: 1500,
        mask: true,
      });
    }
  },
  // 初始化页面数据
  initData() {
    let {
      fleidList,
      LicenseImg,
      CertImg,
      WxImage,
      RequetStatus,
      refuseReason
    } = this.data;



    this.agreementData();

    const userInfo = app.cache.loadUserInfo()

    app.$api.getAgentInfoByDistributorSystem({
      ReferralUserId: userInfo.UserId
    }).then(
      (res) => {


        if (res.success) {
          const {
            Data
          } = res;

          fleidList.forEach((item) => {
            Object.getOwnPropertyNames(Data).forEach((item2) => {
              if (item.fleid == item2) {
                item.value = Data[item2];
              }
              if (item.fleid == "region") {
                item.value = Data.CustomField6 + Data.CustomField7;
              }
            });
          });

          LicenseImg = Data.LicenseImg;

          CertImg = Data.CertImg;
          WxImage = Data.WxImage;
          RequetStatus = Data.RequetStatus;
          refuseReason = Data.RefuseReason;

          this.setData({
            fleidList,
            LicenseImg,
            CertImg,
            WxImage,
            RequetStatus,
            refuseReason
          });
        }

      }
    );
  },

  // 选择picker
  onPicker(e) {
    const {
      fleidList,
      sexArr
    } = this.data;

    const {
      currentTarget: {
        dataset: {
          type
        },
      },
      detail: {
        value
      }
    } = e;

    if (type === "性别") {
      fleidList.forEach((item) => {
        if (item.type === type) item.value = sexArr[value];
      });
    } else {
      fleidList.forEach((item) => {
        if (item.type === type) item.value = value;
      });
    }
    this.setData({
      fleidList
    });
  },

  // 上传
  upload(e) {


    if (this.data.RequetStatus == 0) {
      return;
    }

    wx.showNavigationBarLoading();
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.data.url + "/AppShop/AppShopHandler.ashx?action=AppUploadImage",
          filePath: tempFilePaths[0],
          name: "file",
          success: (res2) => {
            wx.hideNavigationBarLoading();

            let {
              LicenseImg,
              CertImg,
              WxImage
            } = this.data;

            const {
              type
            } = e.currentTarget.dataset;
            const url = JSON.parse(res2.data).Result.ImageURL;

            if (type == 1) {
              LicenseImg = url;
            } else if (type == 2) {
              CertImg = url;
            } else {
              WxImage = url;
            }

            this.setData({
              LicenseImg,
              CertImg,
              WxImage
            });
          },
          fail: (err) => {
            app.alert.message('上传失败')
          },
        });
      },
    });
  },
  submit(e) {
    const {
      fleidList,
      LicenseImg,
      CertImg,
      WxImage
    } = this.data;
    const wechat = fleidList.find((d) => d.fleid === "WeChat").value;

    const data = {
      LicenseImg,
      CertImg,
      WxImage,
      wxNumber: wechat
    }

    if (!data.wxNumber) {
      return app.alert.message('请填写微信号')
    }
    if (!data.LicenseImg) {
      return app.alert.message('请上传营业执照')
    }
    if (!data.WxImage) {
      return app.alert.message('请上传微信二维码')
    }

    app.$api.updateAgentInfo(data).then((res) => {

      if (res.success) {
        app.alert.success('申请成功');
        app.tools.goBackTimeOut();
      }

    });
  },

  // 提交保存
  onSubmit(e) {

    const {
      NickName,
      realName,
      Gender,
      BirthDate,
      Address,
      PerDescribe,
      QQ,
    } = e.detail.value;

    app.$api.updateAgentInfo({
      picture: this.data.avatar,
      gender: Gender === "男" ? 0 : 1,
      birthday: BirthDate,
      realName: realName,
      nickname: NickName,
      address: Address,
      qq: QQ,
      perDescribe: PerDescribe,
      region: Address,
    }).then((res) => {

      if (res.success) {
        app.alert.success('提交成功')
        app.tools.goBackTimeOut()
      }

    });
  },
  //获取输入框的值
  handleInput(e) {
    const {
      detail: {
        value
      },
      currentTarget: {
        dataset: {
          name
        }
      }
    } = e;
    const current = this.data.fleidList.findIndex(v => v.fleid === name);

    this.data.fleidList[current].value = value;

    this.setData({
      fleidList: this.data.fleidList
    });
  },

});