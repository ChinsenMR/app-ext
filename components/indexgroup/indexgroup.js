// components/indexgroup/indexgroup.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
        groupdata:Array,

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgurl:app.data.imgurl,
     
  },

  /**
   * 组件的方法列表
   */
  methods: {
       Toprodetai(e) {
            console.log("shanglp", e)
            wx.navigateTo({
                 url: `/pages/goodsDetail/goodsDetail?p=${e.currentTarget.dataset.productid || ''}&pagetype=${e.currentTarget.dataset.pagetype || ''}`,
            })
       },
  }
})
