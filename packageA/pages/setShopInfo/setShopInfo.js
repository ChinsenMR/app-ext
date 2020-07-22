import {
  setUpdateStoreInfo,
  getHerderList
} from '../../../utils/requestApi';
const app = getApp();
Page({
  data: {
    imgurl: app.data.imgurl,
    StoreId: '', // 门店id
    isShow: true,
    isShow2: true,
    isShow3: true,
    default:"https://dlyl.hmeshop.cn/templates/common/images/headerimg.png", //默认头像
    infoObj: { // 门店基础信息
      StoreSlideImages: '', // 门店大图              
      StoreImages: '', // 门店小图
      StoreName: '', // 门店名称
      OpenStartDate: '', // 营业开始时间
      OpenEndDate: '', // 营业结束时间
      Address: '', // 地址
      WxImage: '', // 微信二维码
      CellPhone: "", // 联系电话
      Introduce: '', // 门店介绍
      // Longitude	否	string	经度
      // Latitude	否	string	纬度
    },
    list:[
      {
        name:'门店名称',
        placeholder:'',
        value:''
      },
      {
        name:'联系电话',
        placeholder:'请输入手机号码',
        value:''
      },
      {
        name:'营业开始时间',
        placeholder:'',
        value:''
      },
      {
        name:'营业结束时间',
        placeholder:'',
        value:''
      },
     
    ]
  },
  onLoad() {

    this.getStoreId();


    this.getHerderData(this.data.StoreId);
  },

  // 获取门店id
  getStoreId() {
    const {
      StoreId
    } = wx.getStorageSync("userInfo");
    this.setData({
      StoreId
    })
  },

  // 获取门店信息
  getHerderData(ids) {
    let that = this;
    let id = ids;
    let url = "/packageA/pages/shopkeeperList/shopkeeperList"
    let url2 = 'packageA/pages/setShopInfo/setShopInfo'
    let data = {
      storeId: id,
      Type: 1,
      Path: url2
    }
    getHerderList(data).then(res => {
      console.log("门店信息", res);
      const {
        StoreImages,
        StoreName,
        OpenStartDate,
        OpenEndDate,
        Address,
        WxImage,
        CellPhone,
        Introduce,
        StoreSlideImages
      } = res.data.Result;
      if (res.statusCode == 200) {
        that.setData({
          'infoObj.StoreSlideImages': StoreSlideImages,
          'infoObj.StoreImages': StoreImages,
          'infoObj.StoreName': StoreName,
          'infoObj.OpenStartDate': OpenStartDate,
          'infoObj.OpenEndDate': OpenEndDate,
          'infoObj.Address': Address,
          'infoObj.WxImage': WxImage,
          'infoObj.CellPhone': CellPhone,
          'infoObj.Introduce': Introduce
        })
      }
    })
  },

  // 上传图片
  postImg(e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('选中图片', res)
        that.upLoadImg(that, res.tempFilePaths)
      },
      fail: function (error) {}
    })
  },
  /**
   * 上传图片
   * */
  upLoadImg: function (page, path) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    let _this = this
    const fs = wx.getFileSystemManager()
    fs.readFile({
      filePath: path[0],
      encoding: 'base64',
      success(res) {
        wx.hideLoading();
        let baseImg = res.data
        let baseImg2 = 'data:image/png;base64,' + res.data;
        baseImg = baseImg.replace(/[\r\n]/g, "");
        _this.setData({
          isShow: false,
          'infoObj.StoreImages': baseImg,
        })
      }
    })
  },

  // 上传背景图
  handleShopImg() {
    var that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('选中图片', res)
        that.upLoadBigImg(that, res.tempFilePaths)
      },
      fail: function (error) {}
    })
  },
  upLoadBigImg: function (page, path) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    let _this = this
    const fs = wx.getFileSystemManager()
    fs.readFile({
      filePath: path[0],
      encoding: 'base64',
      success(res) {
        wx.hideLoading();
        console.log(res);
        let baseImg = res.data
        let baseImg2 = 'data:image/png;base64,' + res.data;
        baseImg = baseImg.replace(/[\r\n]/g, "");
        _this.setData({
          isShow2: false,
          'infoObj.StoreSlideImages': baseImg,
        })
      }
    })
  },

  // 上传微信图片
  handleWxImg() {
    var that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('选中图片', res)
        that.upLoadWxImg(that, res.tempFilePaths)
      },
      fail: function (error) {}
    })
  },
  upLoadWxImg: function (page, path) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    let _this = this
    const fs = wx.getFileSystemManager()
    fs.readFile({
      filePath: path[0],
      encoding: 'base64',
      success(res) {
        wx.hideLoading();
        console.log(res);
        let baseImg = res.data
        let baseImg2 = 'data:image/png;base64,' + res.data;
        baseImg = baseImg.replace(/[\r\n]/g, "");
        _this.setData({
          isShow3: false,
          'infoObj.WxImage': baseImg,
        })
      }
    })
  },


  // 修改门店信息
  handleStoreInfo() {
    let that = this;
    let data = {
      storeId: that.data.StoreId,
      StoreImages: that.data.infoObj.StoreImages,
      StoreSlideImages: that.data.infoObj.StoreSlideImages,
      StoreNameLatitude: that.data.infoObj.StoreName,
      OpenStartDate: that.data.infoObj.OpenStartDate,
      OpenEndDate: that.data.infoObj.OpenEndDate,
      Address: that.data.infoObj.Address,
      WxImage: that.data.infoObj.WxImage,
      Tel: that.data.infoObj.CellPhone,
      // Latitude:'',
      // Longitude:'',
      // Introduce:this.infoObj.Introduce,
    }
    console.log(data);
    setUpdateStoreInfo(data).then(res => {
      console.log(res);
      if (res.statusCode == 200) {
        wx.showToast({
          title: '修改成功',
          icon: 'loading',
          duration: 1000,
          // 蒙版  遮罩层 
          mask: true
        })
        setTimeout(function () {
          wx.hideToast();
          wx.navigateTo({
            url: '../../pages/shopkeeperList/shopkeeperList',
            success: (result) => {
              console.log("跳转", result);
            },
          });
        }, 2000)
      }
    })
  },

  // 获取表单值
  getStoreName(e) {
    console.log(e);
    const {
      value
    } = e.detail;
    this.setData({
      'infoObj.StoreName': value
    })
  },
  getCellPhone(e) {
    const {
      value
    } = e.detail;
    this.setData({
      'infoObj.CellPhone': value
    })
  },
  getOpenStartDate(e) {
    const {
      value
    } = e.detail;
    this.setData({
      'infoObj.OpenStartDate': value
    })
  },
  getOpenEndDate(e) {
    const {
      value
    } = e.detail;
    this.setData({
      'infoObj.OpenEndDate': value
    })
  },
  getAddress(e) {
    const {
      value
    } = e.detail;
    this.setData({
      'infoObj.Address': value
    })
  },




  // 先择地址
  handleRegion(e) {
    let region = e.detail.value;
    this.setData({
      'infoObj.Address': region
    })
  },

})