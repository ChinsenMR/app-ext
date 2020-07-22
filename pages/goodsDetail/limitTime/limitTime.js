const app = getApp();
import { countdown } from '../../../utils/util.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    limitHours: '00',
    limitMin: '00',
    limitSecond: '00'    
  },

  ready: function () {
    let { EndDate, StartDate } = this.data.goodsInfo.CountDownSkuInfo;
    setInterval(() => {
      this.setData({
        limitHours: countdown(EndDate).limitHours,
        limitMin: countdown(EndDate).limitMin,
        limitSecond: countdown(EndDate).limitSecond
      })
    }, 1000);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData:function(){

    }    
  }
})
