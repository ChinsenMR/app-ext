Component({
  /**
   * 组件的属性列表
   */
  properties: {
    adpicUrls: {
      type: Object,
      value: {}
    }
  },
  attached: function() {
    // console.log(this.properties.adpicUrls)
  },
  /**
   * 组件的初始数据
   */
  data: {
    swiperH: 150,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    indicatorColor: "#941435",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumptap: function(e) {
      console.log(e)
      let linkData = e.currentTarget.dataset.type
      let index = e.currentTarget.dataset.index
      // console.log('连接',linkData)
      var wxltype = ''
      switch (linkData) {
        case 1:
          var id = this.properties.adpicUrls.content.dataset[index].item_id
          wx.navigateTo({
            url: '/pages/productDetail/productDetail?id=' + id
          })
          break;
        case 2:
          var id = this.properties.adpicUrls.content.dataset[index].item_id
          wx.navigateTo({
            url: '/pages/couponDetail/couponDetail?id=' + id
          })
          break;
        case 3:
          var id = this.properties.adpicUrls.content.dataset[index].item_id
          wx.navigateTo({
            url: '/pages/productList/productList?typeId=' + id
          })
          break;
        case 5:
          var id = this.properties.adpicUrls.content.dataset[index].item_id
          var gameType = parseFloat(this.properties.adpicUrls.content.dataset[index].gameType)
          console.log(typeof gameType)
          switch (gameType) {
            //幸运大转盘
            case 0:
              wx.navigateTo({
                url: '/pages/lottery/lottery?id=' + id
              })
              break;
              //疯狂砸金蛋
            case 1:
              wx.navigateTo({
                url: '/pages/smashedGoldenEggs/smashedGoldenEggs?id=' + id
              })
              break;
              //好运翻翻看
            case 2:
              wx.navigateTo({
                url: '/pages/turnBrand/turnBrand?id=' + id
              })
              break;
              //大富翁
            case 3:
              wx.navigateTo({
                url: '/pages/zillionaire/zillionaire?id=' + id
              })
              break;
              //刮刮乐
            case 4:
              wx.navigateTo({
                url: '/pages/scratchTicket/scratchTicket?id=' + id
              })
              break;
          }
          break;
        case 6:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
        case 7:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
        case 8:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
        case 9:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
        case 10:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
        case 11:
          var link = this.properties.adpicUrls.content.dataset[index].link
          if(link){
            wx.navigateTo({
              url: '/pages/outIndex/outIndex?link=' + link
            })
          }else{
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
          break;
        case 14:
          var id = this.properties.adpicUrls.content.dataset[index].item_id
          wxlink = this.properties.adpicUrls.content.dataset[index].wxlink
          wx.navigateTo({
            url: '/' + wxlink + '?id=' + id
          })
          break;
        case 16:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
        case 17:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
        case 19:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
        case 23:
          var link = this.properties.adpicUrls.content.dataset[index].link
          wx.navigateTo({
            url: '/pages/joinNest/joinNest?parameter=' + link
          })
          break;
        case 24:
          var link = this.properties.adpicUrls.content.dataset[index].wxlink
          wxltype = this.properties.adpicUrls.content.dataset[index].wxlinkType
          if (wxltype == 1) {
            wx.switchTab({
              url: '/' + link
            })
          } else {
            wx.navigateTo({
              url: '/' + link
            })
          }
          break;
      }
    },
    /**  
     * 图片加载完成事件,动态设置swiper高度
     * */
    onLoadImg: function(e) {
      if (this.data.swiperH !== 150) {
        return
      }
      // console.log('设置swiper高度', e)
      var winWid = wx.getSystemInfoSync().windowWidth
      this.data.swiperH = winWid * e.detail.height / e.detail.width
      this.setData({
        swiperH: this.data.swiperH
      })
    },
  }
})