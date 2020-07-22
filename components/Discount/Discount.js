const app = getApp();
import {
  countdown
} from '../../utils/util.js'
let timer = null;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productlist: {
      type: Array,
      value: []
    },
    // 页面类型  
    pagetype:{
         type: Number,
         value:[]
    } ,
    notime:{
         type:Object,
         value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgurl: app.data.imgurl,
     // productlist:[]
    
  },

  pageLifetimes: {
    show: function() {

    },
    hide: function() {
     
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    Toprocuctdetail(e) {
     //  console.log("xinren", e)
      wx.navigateTo({
        url: `/pages/goodsDetail/goodsDetail?p=${e.currentTarget.dataset.productid || ''}&pagetype=${e.currentTarget.dataset.pagetype || ''}`,
      })
    },

  }
})