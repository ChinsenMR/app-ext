// components/selectTabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    codeType: {
      type: String,
      value: '0'
    },
    firstTitle: {
      type: String,
      value: '标题1'
    },
    secondTitle: {
      type: String,
      value: '标题2'
    },
    color: {
      type: String,
      value: 'red'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    codeType: 0
  },
  attached: function() {
    this.setData({
      codeType: this.properties.codeType
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTapSelectCode: function(event) {
      // console.log(event)
      this.setData({
        codeType: parseInt(event.target.dataset.code)
      })
      this.triggerEvent('myTabsEvent', {
        code: parseInt(event.target.dataset.code)
      })
    }
  }
})