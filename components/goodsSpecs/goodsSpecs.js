Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSelect: '',  //当前的颜色选择
    goodsNum: 1,  //物品数量
    selected: '',   // 已选
    colorArr:['黑色','红色', '绿色'],
    sizeArr:['24cm','59cm']
  },

  lifetimes:{
    attached(){
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //减少数量
    reduceFun:function(){
      if (this.data.goodsNum > 1){
        this.setData({
          goodsNum: this.data.goodsNum - 1
        })
      }
    },
    // 增加数量
    addFun:function(){
      this.setData({
        goodsNum: this.data.goodsNum + 1
      })
    },
    // 颜色选择
    selectItem:function(e){
      console.log(e)
      this.setData({
        currentSelect: e.target.dataset.id
      })
    },
    // 点击确定按钮
    btn:function(){
      
    },
    // 点击关闭按钮
    showModal:function(){
      this.triggerEvent('showModal')
    },

    closeFun:function(){
      this.showModal();
    },
    
    //添加购物车
    addGoods:function(){
      this.showModal();
    }
  }
})
