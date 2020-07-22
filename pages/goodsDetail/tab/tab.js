const app = getApp();
import { countdown } from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object,
    num:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    buyTxt: '立即购买',
    buyBtnBg: 'inner2-bg1',
    isDefault: null
  },

  ready:function(){
    if (wx.getStorageSync('tab').WapTheme == 'fruit') this.setData({ isDefault: 1 })
    else this.setData({ isDefault: 2 })
    this.initData();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 分享
    onShare(){
      this.triggerEvent("share")
    },
    //初始化页面数据
    initData: function () {
      let { buyTxt, buyBtnBg, goodsInfo } = this.data;
      if (goodsInfo.IsDiscount) buyBtnBg = 'inner2-bg2'
      if (goodsInfo.Is99) buyBtnBg = 'inner2-bg3'
      if (goodsInfo.IsCountDown) buyBtnBg = 'inner2-bg4'
      if (goodsInfo.IsWaitSale) buyBtnBg = 'inner2-bg5', buyTxt = '即将开抢'
      this.setData({ buyTxt, buyBtnBg })
      
      if (goodsInfo.FightGroupActivityInfo == null ) return;
      if (goodsInfo.FightGroupActivityInfo.length == 0 ) return;
      let endState = countdown(goodsInfo.FightGroupActivityInfo.EndDate);
      if (endState.overTime) {
        goodsInfo.IsFightGroup = false;
        this.setData({
          goodsInfo: this.data.goodsInfo
        })
      }
    },

    onAdd: function (e) {
      // console.log("输出点击拼团",e);
      let obj = e.currentTarget.dataset
      wx.setStorageSync('buyType', e.currentTarget.dataset.type)
      this.triggerEvent('open',obj)
    },
    
  },
})
