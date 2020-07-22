const app = getApp();
let timeId = -1;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hiddenDrawer: Boolean,
    minPrice:{
      type:null,
      value:''
    },
    maxPrice:{
      type: null,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    // 抽屉 品牌logo
    brand: [
      'icon_label@2x.png', 'icon_label@2x.png', 'icon_label@2x.png', 'icon_label@2x.png', 'icon_label@2x.png',
      'icon_label@2x.png', 'icon_label@2x.png', 'icon_label@2x.png', 'icon_label@2x.png',
      'icon_label@2x.png', 'icon_label@2x.png', 'icon_label@2x.png', 'icon_label@2x.png',
    ],
    minmaxPrice:{}, // 最低价 最高价

    curBrand: -1, // 当前选择的品牌
    brandNum: 3, //显示品牌数量
    curPromote: -1, // 当前选择的促销
    minPrice: null, // 最小价格
    maxPrice: null, // 最大价格

    promoteList: ['9.9包邮', '节假促销', '春节活动', '全场包邮', '免费赠送', '买一送一']
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //选择品牌
    brandSelect: function(e) {
      this.setData({
        curBrand: e.currentTarget.dataset.id
      })
    },

    //选择促销
    promoteSelect: function(e) {
      this.setData({
        curPromote: e.currentTarget.dataset.id
      })
    },

    //显示全部品牌
    showBrand: function() {
      if (this.data.brandNum == 3) {
        this.setData({
          brandNum: this.data.brand.length
        })
      } else {
        this.setData({
          brandNum: 3
        })
      }
    },

    //重置
    reset: function() {
      this.triggerEvent('drawerState',{reset:true})
      this.setData({
        curBrand: -1,
        brandNum: 3,
        curPromote: -1,
        minPrice: null,
        maxPrice: null
      })
    },
    //取消
    cancel(){
      this.setData({
        hiddenDrawer:true
      })
    },
    //确定
    comfirm: function() {

      let minmaxPrice = this.data.minmaxPrice;
      //传递参数
      minmaxPrice.maxprice = this.data.maxPrice;
      minmaxPrice.minprice = this.data.minPrice;
      minmaxPrice.comfirm = true;

      this.triggerEvent('drawerState', minmaxPrice)
    },

    // 最低价
    minPrice(e){
      let minPrice = e.detail.value;
      this.setData({
        minPrice:minPrice,
        //'minmaxPrice.minprice': minPrice
      })
    },
    //最高价
    maxprice(e){
      let maxPrice = e.detail.value;
      this.setData({
        maxPrice: maxPrice,
        //'minmaxPrice.maxprice': maxPrice
      })
    },
  }
})