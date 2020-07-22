const app = getApp();
import { receiveCoupon } from '../../../utils/requestApi.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons: Array,  // 领劵
    promotionStr: Array  // 促销
  },

  /**
   * 组件的初始数据
   */

  data: {
    imgUrl: app.data.imgurl,
    hiddenModal: true,  //显示弹框  选择优惠券
    couponsData:[], // 优惠卷数据
  },

  ready: function () {
    // console.log(this.data.coupons)
    //切割时间
    this.data.coupons.forEach(item => {
      let sArr = item.StartTime.split('T');
      let sArr2 = sArr[0].split('-');
      let sArr3 = sArr[1].split(':');
      item.startTime = `${sArr2[1]}.${sArr2[2]}` + ' ' + `${sArr3[0]}:${sArr3[1]}`;
      let eArr = item.ClosingTime.split('T');
      let eArr2 = sArr[0].split('-');
      let eArr3 = sArr[1].split(':');
      item.endTime = `${eArr2[1]}.${eArr2[2]}` + ' ' + `${eArr3[0]}:${eArr3[1]}`;
    })
    this.setData({
      couponsData: this.data.coupons
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //打开 / 关闭  modal
    showModal:function(){
      if(this.data.coupons.length==0){
        wx.showModal({
          title: '暂无优惠券',
        })
        return
      }
      this.setData({
        hiddenModal: !this.data.hiddenModal
      })
    },

    //选择优惠券
    selectCou: function (e) {
      let { couponsData } = this.data;
      receiveCoupon({ couponId: e.currentTarget.dataset.id})
      .then(res =>{
        console.log('优惠券::：',res)
        if (res.data.Result == "Success"){
          couponsData.forEach(item => {
            if (item.CouponId == e.currentTarget.dataset.id){
              item.IsCurCouponUserGet = 1;
              this.setData({ couponsData })
            }
          })
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1500,
            mask: true,
          });
            
        }
      })
    },
  },

  // 关闭弹窗
  handleHide(){
    this.setData({
      hiddenModal: !this.data.hiddenModal
    })
  },



})
