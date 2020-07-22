import Moment from '../../utils/moment';
import { getProducts, applyLiveRoom } from '../../utils/requestApi';
import uploadFile from '../../utils/upload';
import { checkMore, isJSONStr } from '../../utils/util';
const app = getApp()
const nowTime = new Date().getTime() + 3900000;
const PAGE_SIZE = 10;

function normalizeProducts(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  const ret = [];
  data.forEach(item => {
    const { ProductName, Description, ImageUrl, ...rest } = item;
    const atom = {
      product: {
        name: item.ProductName,
        desc: item.Description || ' ',
        pic: item.ImageUrl,
      },
      ...rest,
    };
    ret.push(atom);
  });

  return ret;
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    timeVisible: false,
    startTimeVal: new Moment(nowTime).format('MM月DD日HH:mm:ss'),         // 用于展示
    endTimeVal: new Moment(nowTime + 1000).format('MM月DD日HH:mm:ss'),         // 用于展示
    minDate: new Date().getTime(),
    isStart: true,
    goodsVisible: false,
    categoryActive: 0,
    filedsValues: { 
      showImg: '',
      liveImg: '',
      liveTitle: '',
      beginTime: nowTime,
      endTime: nowTime + 60000,
      anchorName: '',
      wechatNum: '',
      enableEomment: false,//控制评论是否显示
    },
    page: 1,
    size: PAGE_SIZE,
    products: [],
    loading: true,
    finished: true,
    productsVal: [],
    checkAll: false,
    actionLoading: false,
    functionList: [],
    active: 0,
    checkedAll: false,
  },

  getData() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: "/AppShop/AppShopHandler.ashx?action=GetProductCategories",
    }, true).then(r => {
      app.fh()
      r.data.Result.Data.forEach(s => {
        let w = {
          name: s.Name,
          data: [],
          finsh: false,
          page: 1,
          post: s.CategoryId,
          BigImageUrl: s.BigImageUrl
        }
        data.functionList.push(w)
      })
      that.setData({
        functionList: data.functionList,
      })
      that.getDataList()
    })
  },

  // 
  onChange(e) {
    this.setData({
      active: e.detail.index
    })
    this.getDataList()
  },


  getDataList() {
    let data = this.data, that = this
    if (data.functionList[data.active].finsh) return
    app.fl()
    app.fg({
      url: '/api/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: data.functionList[data.active].page,
        CatetoryId: data.functionList[data.active].post,
        IsLiveProductsive:true
      }
    }, true).then(r => {
      app.fh()
      r.data.Result.Data.forEach(s => {
        s.isChoose = false
        s.gl=false
        data.functionList[data.active].data.push(s)
      })
      data.functionList[data.active].finsh = r.data.Result.Data.length < 10
      that.setData({
        functionList: data.functionList,
      })
      console.log(r)
    })
  },

  // 
  chooseFN(e) {
    console.log(e,111111112222222);
    let as = e.currentTarget.dataset
    this.setData({
      [as.name]: !as.choose
    })
    if(as.w)     this.handleCloseGoods();
  },
  chooseAll() {
    let data=this.data,that=this
    this.setData({
      checkedAll:!data.checkedAll
    })
    data.functionList[data.active].data.forEach(s=>{
      s.isChoose=data.checkedAll
    })
    this.setData({
      functionList:data.functionList
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timer = null;
    this.getData()
    this.getProducts().then(res => {
      if (res.Status === 'true') {
        const { page, size } = this.data;
        this.setData({
          products: normalizeProducts(res.Data.Data),
          finished: !checkMore(page, size, res.Data.Data.length, res.Data.TotalRecords),
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer);
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



  getProducts() {
    const { page, size } = this.data;
    return getProducts({
      index: page,
      size,
    });
  },

  handleShowTime() {
    this.setData({ timeVisible: true });
  },

  handleCloseTime() {
    this.setData({ timeVisible: false });
  },

  handleStartTimeInput(e) {
    this.setData({
      'filedsValues.beginTime': e.detail,
    });
  },

  handleEndTimeInput(e) {
    this.setData({
      'filedsValues.endTime': e.detail,
    });
  },

  hanldeSwitchTime(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ isStart: type === 'start' });
  },

  handleTimeConfirm() {
    this.setData({
      startTimeVal: new Moment(this.data.filedsValues.beginTime).format('MM月DD日HH:mm:ss'),
      endTimeVal: new Moment(this.data.filedsValues.endTime).format('MM月DD日HH:mm:ss'),
    });
    this.handleCloseTime();
  },

  handleCommentableonChange(e) {
    this.setData({
      'filedsValues.enableEomment': e.detail,
    });
  },

  handleShowGoods() {
    this.setData({ goodsVisible: true });
  },

  handleCloseGoods() {
    this.setData({ goodsVisible: false });
  },

  handleCategoryChange(e) {
    console.log(e.detail.index);
  },
  //提交直播间申请
  handleSubmit() {
    const { filedsValues, productsVal } = this.data;
    if (!filedsValues.showImg) {
      wx.showToast({
        title: '请上传分享封面',
        duration: 2800,
        icon: 'none',
      });
      return;
    };
    if (!filedsValues.liveImg) {
      wx.showToast({
        title: '请上传直播间封面图',
        duration: 2800,
        icon: 'none',
      });
      return;
    };
    if (!filedsValues.liveTitle) {
      wx.showToast({
        title: '请填写直播标题',
        duration: 2800,
        icon: 'none',
      });
      return;
    };
    if (filedsValues.liveTitle.length < 3 || filedsValues.liveTitle.length > 17) {
      wx.showToast({
        title: '直播标题不能少于3-17个汉字',
        duration: 2800,
        icon: 'none',
      });
      return;
    }
    if (!filedsValues.anchorName) {
      wx.showToast({
        title: '请填写主播昵称',
        duration: 2800,
        icon: 'none',
      });
      return;
    };
    if (filedsValues.wechatNum.length < 2 || filedsValues.wechatNum.length > 15) {
      wx.showToast({
        title: '直播昵称不能少于2-15个汉字',
        duration: 2800,
        icon: 'none',
      });
      return;
    }
    if (!filedsValues.wechatNum) {
      wx.showToast({
        title: '请填写主播微信号',
        duration: 2800,
        icon: 'none',
      });
      return;
    };
    this.data.functionList[this.data.active].data.forEach(s=>{
      s.gl?productsVal.push(s.ProductId):''
    })
    if (!productsVal.length) {
      wx.showToast({
        title: '请选择关联商品',
        duration: 2800,
        icon: 'none',
      });
      return;
    };
    this.setData({ actionLoading: true });
    const userInfo = wx.getStorageSync('userInfo');
    console.log("userInfo", userInfo);
    const { beginTime, endTime, enableEomment, ...rest } = filedsValues;
    applyLiveRoom({
      anchorId: userInfo.UserId,
      beginTime: new Moment(beginTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: new Moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
      enableEomment: enableEomment ? 1 : 2,
      productIds: productsVal.join(','),
      ...rest,
    }).then(res => {
      if (res.Status === 'true') {
        wx.showToast({
          title: '申请成功',
          duration: 2800,
          icon: 'none',
        });

        this.timer = setTimeout(() => {
          wx.redirectTo({
            url: '/subPackageC/liveRoom/index',
          });
        }, 2000);
      }

      this.setData({ actionLoading: false });
    });

  },

  handleUploadShareImg() {
    const _this = this;
    wx.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.getUrl('UploadAppletImage'),
          filePath: tempFilePaths[0],
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: wx.getStorageSync('cookie')
          },
          appid: app.globalData.appId,
          name: 'file',
          formData: {
            appid: app.globalData.appId,
            openId: app.data.openId,
            source:'live'
          },
          success: res2 => {
            let data = JSON.parse(res2.data);
            console.log("上传图片data", data);
            if (data.Status == "Success") {
              _this.setData({
                'filedsValues.showImg': data.Data[0].ImageUrl,
              });
            }
          }
        })
      }
    })
  },
  

  handleUploadPosterImg() {
    const _this = this;
    wx.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.getUrl('UploadAppletImage'),
          filePath: tempFilePaths[0],
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: wx.getStorageSync('cookie')
          },
          appid: app.globalData.appId,
          name: 'file',
       
          formData: {
            appid: app.globalData.appId,
            openId: app.data.openId,
            source:'live'
          },
          success: res2 => {
            let data = JSON.parse(res2.data);
            console.log("上传图片data", data);
            if (data.Status == "Success") {
              _this.setData({
                'filedsValues.liveImg': data.Data[0].ImageUrl,
              });
            }
          }
        })
      }
    })
  },

  handleTitleChange(e) {
    let { value } = e.detail;
    console.log("12321321",e);
    console.log("asdasdad",value.length);
    // if (value.length < 3) {
    //   wx.showToast({
    //     title: '直播标题必须为3-17个汉字(一个汉字等于两个英文字符或特殊字符)',
    //     icon: 'none',
    //     duration: 1500,
    //     mask: true,
    //   });
    //   return
    // } else {
    //   console.log("通过");
    //   this.setData({
    //     'filedsValues.liveTitle': e.detail.value,
    //   })
    // }
    // if (value.length >= 3){
    //   console.log("通过");
    //   this.setData({
    //     'filedsValues.liveTitle': e.detail.value,
    //   })
    // }else{
    //   setTimeout(() => {
    //     wx.showToast({
    //       title: '直播标题必须为3-17个汉字(一个汉字等于两个英文字符或特殊字符)',
    //       icon: 'none',
    //       duration: 1500,
    //       mask: true,
    //     });
    //     return
    //   }, 2000);
    // }
    this.setData({
      'filedsValues.liveTitle': e.detail.value,
    })
  },

  handleAnchorNameChange(e) {
    this.setData({
      'filedsValues.anchorName': e.detail.value,
    });
  },

  handleWechatNumChange(e) {
    this.setData({
      'filedsValues.wechatNum': e.detail.value,
    });
  },

  handleToggleCheckbox(e) {
    const { index } = e.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  handleCheckboxsChange(e) {
    const { products } = this.data;
    this.setData({
      productsVal: e.detail,
      checkAll: e.detail.length === products.length,
    });
  },

  handleCheckAllChange() {
    const { checkAll, products } = this.data;

    if (!products.length) {
      wx.showToast({
        title: '没用商品可以选哦~',
        duration: 2800,
        icon: 'none',
      });
      return;
    }

    this.setData({
      checkAll: !checkAll,
      productsVal: !checkAll ? products.map(item => item.ProductId + '') : [],
    });
  },

  handleMoreProducts() {
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

    this.getProducts()
      .then(res => {
        if (res.Status === 'true') {
          const { page, size, products, checkAll } = this.data;
          const newData = products.concat(normalizeProducts(res.Data.Data));
          this.setData({
            products: newData,
            finished: !checkMore(page, size, res.Data.Data.length, res.Data.TotalRecords),
            checkAll: checkAll ? newData.length === products.length : false,
          });
        }

        this.setData({ loading: false });
      }).catch(err => {
        this.setData({ loading: false });
      });
  },

  handleGoodsSubmit() {
    let data=this.data,that=this,i=0
    data.functionList[data.active].data.forEach(s=>{
      s.isChoose?(i++,s.gl=true):''
    })
    this.setData({
      functionList:data.functionList
    })
    if(!i) return app.fa('请选择需要关联的商品~')
    // const { productsVal } = this.data;

    // if (!productsVal.length) {
    //   wx.showToast({
    //     title: '请选择需要关联的商品~',
    //     duration: 2800,
    //     icon: 'none',
    //   });
    //   return;
    // }
    this.handleCloseGoods();
  },

  handleRelation() {
    this.handleCloseGoods();
  },
})