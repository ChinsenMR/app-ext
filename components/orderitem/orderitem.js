// components/orderitem/orderitem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: Object,
      value: {}
    },
    myindex: {
      type: Number,
      value: -1
    }
  },

  /** 
   * 组件的初始数据
   */
  data: {
    preIndex: -1,  // 上一次的优惠卷index
    selectIndex: -1, // 选中的index
    isShow: true, // 显示优惠劵选择列表
  },
  attached: function () {
    console.log('component',this.data)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 控制显示隐藏优惠券 
    toggle: function () {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /**
   * 优惠券的选择
   */
    select: function (e) {
      var index = e.currentTarget.dataset.index
      this.setData({
        selectIndex: index
      })
      this.triggerEvent('selectcoupon', { 
        parentIndex: this.properties.myindex,
        oldIndex: this.data.preIndex,
        currentIndex: index,
        CouponValue: this.properties.data.coupons[index].CouponValue,
        idcoupon: this.properties.data.coupons[index].Id
      })
      this.data.preIndex = index
    },
  }
})
