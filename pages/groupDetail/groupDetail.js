import { getFightGroupInfo } from "../../utils/requestApi";
import { countdown } from '../../utils/util';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    joinGroup: false,  // 拼团成功： true，  拼团失败： false
    fightInfo: {}, // 参团产品数据
    groupUser: [], // 参团人员
    id: null, // 从拼团列表过来的id
    limitHours: '00',
    limitMin: '00',
    limitSecond: '00',
    isShow: false,
    shareInfo: {},
    productid: '',//1商品id
    prDid: '', //2商品id(支付的时候带过来的)
    fightId: null, // 支付完  跳转传过来的拼团id
    huodong: 'fightgroup', //活动
    dluser: '',//代理id
    imgNo: app.data.imgurl +'zawuicons.png',
    nums:1,//还有多少人可以参团
    agent:{},//代理信息
    agentShow:false,//代理信息弹窗
    url: "https://wechat.weixinzjit.com/costa/public/uploads/images/20190109/67b16149693920598435315fd0d5ab3e.jpg",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options+++", options);
    let id = options.id;
    this.setData({
      joinGroup: options.linkType,
      id,
      productid: options.productid,
      fightId: options.FightGroupId,
      prDid: options.p,
      dluser: options.d,
    })
    this.getFightData(id)
    setInterval(() => {
      this.Clusterdata()
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 拼团详情数据
  getFightData(id) {
    getFightGroupInfo({
      FightGroupId: id || this.data.fightId
    }).then(res => {
      console.log("拼团详情数据", res);
      if (res.data.Status == "Success") {
        let obj = res.data
        let nums = obj.NeedNum - obj.NowNum;
        if (obj.FightGroupUsers.length == obj.NeedNum) {
          this.setData({
            joinGroup: true
          })
        }
        this.setData({
          fightInfo: obj,
          groupUser: obj.FightGroupUsers,
          agent: obj.FightDistributorInfo,
          nums
        })
      }
    })
  },

  // 参团数据
  Clusterdata() {
    let { fightInfo } = this.data;
    let endDate = countdown(fightInfo.EndTime);
    fightInfo.limitHours = endDate.limitHours;
    fightInfo.limitMin = endDate.limitMin;
    fightInfo.limitSecond = endDate.limitSecond;
    this.setData({
      fightInfo
    })
  },
  // 分享
  onShare(id) {
    let { dluser, fightInfo } = this.data;
    let dlusers = dluser || fightInfo.FightDistributorId
    var _this = this
    
    wx.request({
      url: getApp().data.url + '/API/QrcodeHandler.ashx?action=GetProductQrcode',
      data: {
        Type: 1,
        // Path: 'pages/goodsDetail/goodsDetail?prDid=' + this.data.prDid + '&pagetype=' + this.data.pageType,
        Path: `pages/goodsDetail/goodsDetail?p=${id}&pagetype=6&d=${dlusers || ''}&f=${fightInfo.FightGroupId || ''}`,
        SalePrice: this.data.fightInfo.SalePrice,
        ProductId: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        Cookie: wx.getStorageSync('cookie') || app.data.cookie
      },
      success: function (res) {
        console.log("分享好友数据", res);
        console.log("+++++++", _this.data.productid);
        if (res.data.Status == "Faile") {
          wx.showModal({
            content: res.data.Message,
            showCancel: false
          })
          return
        }
        _this.setData({
          shareInfo: res.data.Result,
          isShow: true
        })
      }
    })
  },
  // 关闭分享
  closeEvent(e) {
    var mode = e.detail.mode;
    if (mode == 'mask') {
      this.setData({
        isShow: false
      })
    }
  },
  // 点击按钮
  handleBtn(e) {
    console.log("this.data.fightInfo", this.data.fightInfo);
    let {
      ProductSku,
      groupId,
      ProductId,
      FightGroupId,
      FightGroupStatus,
      NowNum,
    } = this.data.fightInfo
  
    let { dluser, fightInfo } = this.data;
    let dlusers = dluser || fightInfo.FightDistributorId
    console.log("能获取团id", dlusers);
    let { index, pid } = e.currentTarget.dataset;
    if (index == 1) {
      //查看拼团
      let myId = ProductId || this.data.prDid
      console.log("查看", myId);
      wx.navigateTo({
        // url: '/pages/goodsDetail/goodsDetail?prDid=' + myId + '&pagetype=6' + '&dlr=' + dlusers,
        url: '/pages/goodsDetail/goodsDetail?p=' + myId + '&pagetype=6' + '&d=' + dlusers + '&f=' + FightGroupId,
      });
    } else if (index == 2) {
      //邀请好友
      // this.onShare(pid);//打开分享二维码

    } else if (index == 3) {
      //参团
      let myid = this.data.fightId || FightGroupId
      wx.navigateTo({
        // url: `/pages/confirmationOfOrder/confirmationOfOrder?fromPage=fightgroup&sku=${ProductSku.trim()}&buyAmount=${NowNum}&productSku=${ProductSku.trim()}&groupId=${groupId}&ProductId=${ProductId}&FightGroupId=${myid}&d=${dlusers}&IsFightGroup="true"`,
        url: `/pages/confirmationOfOrder/confirmationOfOrder?fromPage=fightgroup&sku=${ProductSku.trim()}&buyAmount=1&productSku=${ProductSku.trim()}&groupId=${groupId}&ProductId=${ProductId}&FightGroupId=${myid}&d=${dlusers}&IsFightGroup="true"`,
      });
    } else {
      //我也开一团
      wx.navigateTo({
        // url: `/pages/confirmationOfOrder/confirmationOfOrder?fromPage=fightgroup&sku=${ProductSku.trim()}&buyAmount=${NowNum}&productSku=${ProductSku}&groupId=${groupId}&ProductId=${ProductId}&d=${dlusers}&FightGroupId=${FightGroupId}&IsFightGroup="true"`,
        url: `/pages/confirmationOfOrder/confirmationOfOrder?fromPage=fightgroup&sku=${ProductSku.trim()}&buyAmount=1&productSku=${ProductSku}&groupId=${groupId}&ProductId=${ProductId}&d=${dlusers}&FightGroupId=0&IsFightGroup="true"`,
      });
    }
  },

  // 右上角分享好友
  onShareAppMessage(res) {
    let { dluser, fightInfo, imgNo } = this.data;
    let dlusers = dluser || fightInfo.FightDistributorId
    
    return {
      title: fightInfo.ProductName || wx.getStorageSync('homeTitle'),
      path: `pages/goodsDetail/goodsDetail?p=${fightInfo.ProductId}&pagetype=6&d=${dlusers || ''}&f=${fightInfo.FightGroupId || ''}`,
      imageUrl: fightInfo.ProductImg || imgNo,
      
    }
  },
  //显示代理信息弹窗
  handleShow(e){
    const {type} = e.currentTarget.dataset;
    if(type==1){
      this.setData({
        agentShow: true
      })
    }else{
      this.setData({
        agentShow: false
      })
    }
  },

  //复制微信
  handleCopy(e){
    const {code} = e.currentTarget.dataset;
    app.copy(code)
  },

  // 长按保存图片
  saveImg(e) {
    console.log("长按",e);
    const { url } = e.currentTarget.dataset;
    console.log("长按图片路径",url);
    //用户需要授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              // 同意授权
              this.saveImg1(url);
            },
            fail: (res) => {
              console.log(res);
            }
          })
        } else {
          // 已经授权了
          this.saveImg1(url);
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  saveImg1(url) {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: (res) => {
            console.log("长按图片", res);
          },
          fail: (res) => {
            console.log(res);
          }
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },

})