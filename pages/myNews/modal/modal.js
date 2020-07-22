// pages/myNews/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    animationData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeParent:function(){
      this.triggerEvent('closeModal')
    },
    close:function(e){
      console.log(e)
    }
  }
})
