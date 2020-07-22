// component/two/two.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList:{
      type:Object,
      value:'',
      observer:function(newVal,oldVal) {
        console.log('new', newVal)
        console.log('old',oldVal)
      }
    }
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

  },
  created () {
    console.log("数据", this.properties.dataList)
  },
  ready() {
    console.log("数据2", this.properties.dataList)
  },
  attached() {
    console.log("数据1", this.properties.dataList)
  }
})
