import { getStoreProductsList, getUploadStoreProduct, getHerderList, getDeleteStoreProducts, getProductsDataList } from '../../utils/requestApi.js';
const app = getApp();
let timeId = -1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    items: 0,
    imgUrl: app.data.imgurl,
    nav: [{ txt: '全部商品', path: '' }, { txt: '商品管理', path: '' }, { txt: '掌柜订单', path: '' }, { txt: '店铺会员', path: '' }],
    list: [], //全部商品
    managerList: [], // 管理商品列表
    infoObj: {}, // 门店信息
    nums: 1, // 总条数
    Keywords: '', // 搜索关键词
    SortBy: 'SaleNum', //排序字段 SalePrice价格SaleNum销量
    isCode: false, // 微信弹窗
    isShare: false, // 分享弹窗
    StoreSlideImages: '', // 背景图
    WxImage: '', // 微信图片
    StoreName: '', // 门店用户名
    bgImgPath: '',
    WxImgPath: '',
    hideShow:true, // 控制管制底部导航栏
  },
  queryflag: true, //传参带的id
  StoreId: '', // 门店id
  pageSize: 10, //	每页数量
  pageIndex: 1, // 当前第几页
  totalPage: 1, // 总页码
  IsFilterStoreProducts: false, //	是否排除门店商品（门店上架用）
  ProductId: '', //	商品ID,多个用，逗号隔开 例子105,106
  SaleStatus: 1, // 获取全部商品  必传参数
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      StoreId
    } = wx.getStorageSync("userInfo");
    this.StoreId = StoreId;
    this.getAllData(this.StoreId, this.data.Keywords, this.data.SortBy);
    this.getProductsData(this.StoreId, this.data.Keywords);
    this.getHerderData(this.StoreId);
  },
  // tab 栏切换
  selected: function (e) {
    if (e.target.dataset.status == this.data.status) {
      return
    }
    this.setData({
      list: [],
      status: e.target.dataset.status
    })
    this.getAllData(this.StoreId, this.data.Keywords, this.data.SortBy);
  },
  handleShelves(e) {
    if (e.target.dataset.items == this.data.items) {
      return
    }
    this.setData({
      managerList: [],
      items: e.target.dataset.items
    })
    this.getProductsData(this.StoreId);
  },
  //获取管理商品列表
  getProductsData(StoreId, val) {
    wx.showLoading({
      title: '加载中~~',
    })
    let that = this;
    // const {StoreId} = wx.getStorageSync("userInfo");
    let id = StoreId;
    let search = that.data.Keywords;
    let data = {
      storeId: id,
      pageSize: that.pageSize,
      pageIndex: that.pageIndex,
      Keywords: search,
      IsFilterStoreProducts: that.IsFilterStoreProducts
    }
    getProductsDataList(data).then(res => {
      setTimeout(function () {
        wx.hideLoading();
      }, 800);
      console.log("管理商品All", res);
      // console.log(res.data.Result.Data)
      //  执行加载下一页的时候 list 应该是 叠加 
      // 拼接数组 
      let managerList = [...that.data.managerList, ...res.data.Result.Data];
      // 计算总页码
      that.totalPage = Math.ceil(res.data.Result.TotalRecords / that.pageSize);
      // console.log(that.totalPage);
      let nums = res.data.Result.TotalRecords;
      that.setData({
        managerList,
        nums
      });

    })
  },
  // 商品上架
  getUploadStore(e) {
    let id = e.currentTarget.dataset.productid;
    // console.log(id);
    let data = {
      ProductId: id
    }
    getUploadStoreProduct(data).then(res => {
      console.log("商品上架", res);
      wx.showToast({
        title: res.data.Message,
        icon: 'none',
        duration: 1500,
        // 蒙版  遮罩层 
        mask: false
      });
    })
  },
  // 商品下架
  getDeleteStore(e) {
    let id = e.currentTarget.dataset.productid;
    let data = {
      ProductId: id
    }
    getDeleteStoreProducts(data).then(res => {
      console.log("商品下架", res);
      wx.showToast({
        title: res.data.Message,
        icon: 'none',
        duration: 1500,
        // 蒙版  遮罩层 
        mask: false
      });
    })
  },
  // 获取门店信息
  getHerderData(storeId) {
    let id = storeId;
    let url = "/packageA/pages/shopkeeperList/shopkeeperList"
    // console.log(id);
    let data = {
      storeId: id,
      Type: 1,
      Path: url
    }
    getHerderList(data).then(res => {
      let that = this;
      console.log("门店信息", res);
      const { FansCount, StoreImages, StoreSlideImages, WxImage, StoreName, OpenStartDate, OpenEndDate, Address } = res.data.Result;
      if (res.statusCode == 200) {
        that.setData({
          infoObj: {
            FansCount,
            StoreImages,
            StoreSlideImages,
            WxImage,
            StoreName,
            OpenStartDate,
            OpenEndDate,
            Address,
          },
          WxImage,
          StoreSlideImages,
          StoreName
        })
      }
    })
  },

  onShow() {
    // 底部自定义导航栏
    // app.globalData.template.tabbar("tabBar", 1, this, app.data.cartNum) //0表示第一个tabba/最后一个表示购物车的长度
  },
  // 输入框的值
  handleValue(e) {
    let that = this;
    const { value } = e.detail;
    clearTimeout(timeId);
    if (!value.trim()) {
      that.setData({
        Keywords: ''
      });
      return;
    }
    that.setData({
      Keywords: value,
      list: [],
      managerList: []
    })
    timeId = setTimeout(() => {
      that.getAllData(that.StoreId, value, that.data.SortBy);
      that.getProductsData(that.StoreId, value);
    }, 800);
  },
  // 清空输入框
  handleEmpty() {
    this.setData({
      Keywords: '',
      list: [],
      managerList: []
    })
    this.getAllData(this.StoreId, this.data.Keywords, this.data.SortBy);
    this.getProductsData(this.StoreId, this.data.Keywords);
  },

  // 获取全部商品列表
  getAllData: function (storeid, vals, sale) {
    wx.showLoading({
      title: '加载中~~',
    })
    // console.log("门店id",id,sale);
    let that = this;
    let id = storeid // 门店id
    let val = vals; // 搜索关键字
    let sortby = sale; // 排序字段
    let data = {
      storeId: id,
      pageSize: that.pageSize,
      pageIndex: that.pageIndex,
      SortBy: sortby,
      sortAction: 1,
      SaleStatus: that.SaleStatus,
      Keywords: val,
    }
    getStoreProductsList(data).then(res => {
      setTimeout(function () {
        wx.hideLoading();
      }, 800);
      console.log("全部商品", res);
      let data = res.data.Result.Data;
      // console.log(data);
      let list = [...this.data.list, ...data];
      if (res.statusCode == 200) {
        that.setData({
          list
        })
      }
    })
  },

  // 点击分享
  handleShare() {
    // this.sumUp(); // 下载在临时路径
    // this.BgdownLoad();

    this.getAvaterInfo();



    let isShare = true;
    this.setData({
      isShare
    })
  },
  handleOff() {
    let isShare = false;
    this.setData({
      isShare
    })
  },
  // 点击跳转 分销订单/店铺会员/编辑门店信息
  handlebuteOrder() {
    wx.navigateTo({
      url: '../distributeOrder/distributeOrder',
      success: function (res) {
        wx.showLoading({
          title: '跳转中',
          mask: true,
          success: (result) => {

          },
        });
        setTimeout(function () {
          wx.hideLoading()
        }, 800)

      }
    })
  },
  handlebuteSub() {
    wx.navigateTo({
      url: '../distributeSub/distributeSub',
      success: function (res) {
        wx.showLoading({
          title: '跳转中',
          mask: true,
          success: (result) => {

          },
        });
        setTimeout(function () {
          wx.hideLoading()
        }, 800)
      }
    })
  },
  handleEditInfo() {
    wx.navigateTo({
      url: '../../packageA/pages/setShopInfo/setShopInfo',
    })
  },

  // 点击切换推荐/销量/价格
  handleRecom() { // 推荐
    this.setData({
      list: [],
      SortBy: ''
    })
    this.getAllData(this.StoreId, this.data.Keywords, this.data.SortBy);
  },
  handleSaleNum() { // 按销量
    this.setData({
      list: [],
      SortBy: 'SaleNum'
    })
    this.getAllData(this.StoreId, this.data.Keywords, this.data.SortBy);
  },

  handleSalePrice() { // 按价格
    this.setData({
      list: [],
      SortBy: 'SalePrice'
    })
    this.getAllData(this.StoreId, this.data.Keywords, this.data.SortBy);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触底了");
    //判断是否有没有下一页
    if (this.pageIndex >= this.totalPage) {
      // 没有数据
      // console.log("没有数据");
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 1500,
        // 蒙版  遮罩层 
        mask: false
      });
    } else {
      this.pageIndex++;
      this.getAllData(this.StoreId, this.data.Keywords, this.data.SortBy);
      this.getProductsData(this.StoreId);
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.pageIndex = 1;
    this.setData({
      list: [],
      managerList: []
    })
    this.getAllData(this.StoreId, this.data.Keywords, this.data.SortBy);
    this.getProductsData(this.StoreId);
    //  结束下拉刷新组件的显示
    wx.stopPullDownRefresh();
  },

 

  //跳转商品详情
  Toprodetai(e) {
    console.log("shanglp", e)
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?p=${e.currentTarget.dataset.productid}`,
    })
    wx.setStorageSync("buyType", "fightgroup")
  },

  // 点击二维码显示二维
  handleWxCode() {
    this.setData({
      isCode:true,
      hideShow:false
    })
  },
  handleNegation() {
    // console.log("触发了码")
    this.setData({
      isCode:false,
      hideShow:true
    })
  },


  /**
   * 先下载背景图片
   */
  getAvaterInfo: function () {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.infoObj.StoreSlideImages, //头像图片路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var avaterSrc = res.tempFilePath; //下载成功返回结果
          that.getQrCode(avaterSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var avaterSrc = "";
              that.getQrCode(avaterSrc);
            }
          })
        }
      }
    })
  },

  /**
   * 下载二维码图片
   */
  getQrCode: function (avaterSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.infoObj.WxImage, //二维码路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.sharePosteCanvas(avaterSrc, codeSrc);
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var codeSrc = "";
              that.sharePosteCanvas(avaterSrc, codeSrc);
            }
          })
        }
      }
    })
  },

  /**
   * 开始用canvas绘制分享海报
   * @param avaterSrc 下载的头像图片路径
   * @param codeSrc   下载的二维码图片路径
   */
  sharePosteCanvas: function (avaterSrc, codeSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    })
    var that = this;
    var cardInfo = that.data.infoObj; //需要绘制的数据集合
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    var width = "";
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
      var height = rect.height;
      var right = rect.right;
      width = rect.width * 0.8;
      var left = rect.left + 5;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, rect.width, height);
      //背景
      if (avaterSrc) {
        ctx.drawImage(avaterSrc, left, 20, width, width);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }
      //姓名
      if (cardInfo.StoreName) {
        ctx.setFontSize(20);
        ctx.setFillStyle('orange');
        ctx.setTextAlign('left');
        ctx.fillText(cardInfo.StoreName, left + 13, width +90);
      }
      //  绘制二维码
      if (codeSrc) {
        ctx.drawImage(codeSrc, left + 160, width + 45, width / 3, width / 3)
        ctx.setFontSize(10);
        ctx.setFillStyle('#000');
        ctx.fillText("保存二维码识别", left + 165, width + 150);
      }
    }).exec()

    setTimeout(function () {
      ctx.draw();
      wx.hideLoading();
    }, 1000)
  },

  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) { 
                    that.setData({
                      isShare:false
                    })
                  }
                },
                fail: function (res) { }
              })
            },
            fail: function (res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      });
    }, 1000);
  },

  // 阻止遮罩层滚动问题
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },

  // 点击图片 关闭分享界面
  shutShare() {
    this.setData({
      isShare: false
    })
  },


})