const app = getApp();
import { receiveCoupon } from '../../utils/requestApi.js'
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
    select:false, // 选择按钮
    id:'', // 优惠卷id
    nums:0, //选中的索引
    selectObj:{}, // 选中的数据
  },

  ready: function () {
    //切割时间
    // this.data.coupons.forEach(item => {
    //   let sArr = item.StartTime.split('T');
    //   let sArr2 = sArr[0].split('-');
    //   let sArr3 = sArr[1].split(':');
    //   item.startTime = `${sArr2[1]}.${sArr2[2]}` + ' ' + `${sArr3[0]}:${sArr3[1]}`;
    //   let eArr = item.ClosingTime.split('T');
    //   let eArr2 = sArr[0].split('-');
    //   let eArr3 = sArr[1].split(':');
    //   item.endTime = `${eArr2[1]}.${eArr2[2]}` + ' ' + `${eArr3[0]}:${eArr3[1]}`;
    // })

    // console.log('coupons=============',this.data)
    // this.setData({
    //   couponsData: this.data.coupons
    // })
    // console.log('coupons=============', this.data)
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //打开 / 关闭  modal
    showModal:function(){
      this.setData({
        hiddenModal: !this.data.hiddenModal
      })
      this.triggerEvent('selectedValue',this.data.selectObj)
    },

    //选择优惠券
    selectCou: function (e) {
      // let { couponsData } = this.data;
      // receiveCoupon({ couponId: e.currentTarget.dataset.id})
      // .then(res =>{
      //   if (res.data.Result == "Success"){
      //     couponsData.forEach(item => {
      //       if (item.CouponId == e.currentTarget.dataset.id){
      //         item.IsCurCouponUserGet = 1;
      //         this.setData({ couponsData })
      //       }
      //     })
      //   }
      // })

      // console.log("输出选中优惠卷的数据",e);
      let {id,index,name,price,code} = e.currentTarget.dataset;
      // console.log("优惠卷id",id);
      let obj ={
        id:id,
        index:index,
        name:name,
        price:price,
        code:code
      }
      this.setData({
        select:!this.data.select,
        id,
        nums:index+1,
        selectObj:obj
      })
      

    },
    
  },
  // 隐藏
  handleHide(){
    console.log("触发了吗");
  }
})
