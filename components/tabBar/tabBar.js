const app = getApp()
import {
  getindexsharedata
} from '../../utils/requestApi.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    curActive: {
      type: Number,
      value: 0
    },
    tabH: Number || String
  },

  lifetimes: {
    attached: function () {
 
      let KjId = wx.getStorageSync('userInfo').KjCustomId;
      this.setData({
        KjId
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    isDefault: null, //判断是否为默认tab
    KjId: '', //代理id
    // 默认tab
    dList: [],
    list: [{
        t: '首页',
        i: 'icon_shouye@2x.png',
        si: 'icon_shouye@2x (4).png',
        u: 'index',
        w: 47
      },
      {
        t: '升会员',
        i: 'huiyuan.png',
        si: 'huiyuan_select.png',
        u: 'upgradeMember',
        w: 57
      },
      {
        t: '掌柜',
        i: 'icon_zhuanqian@2x.png',
        si: 'icon_zhuanqian_seleted@2x.png',
        u: 'shopkeeperList',
        w: 45
      },
      {
        t: '购物车',
        i: 'icon_gouwuche@2x.png',
        si: 'icon_gouwuche@2x_2.png',
        u: 'cart',
        w: 59
      },
      {
        t: '我的',
        i: 'icon_wode@2x (1).png',
        si: 'icon_wode@2x.png',
        u: 'member',
        w: 42
      }
    ],
    cList: [], //自定义tab
    showShare: false,
    sImgArr: [], //分享图片数组
    currentIndex: 0
  },

  pageLifetimes: {
    show() {
      let {
        PROJECT_TOP_MENU,
        PROJECT_THEME
      } = app.data;

      const userInfo = wx.getStorageSync('userInfo') || {};

      let {
        list,
        isDefault
      } = this.data;


      if (PROJECT_TOP_MENU) {
        if (PROJECT_THEME != 'fruit') {
          isDefault = 2

          PROJECT_TOP_MENU.forEach(item => {
            if (item.Content2 == 'upgradeMember') {
              item.Content2 = userInfo.StoreId == 0 ? 'pages/upgradeMember/upgradeMember' : 'pages/shopkeeperList/shopkeeperList';
              item.Name = userInfo.StoreId == 0 ? '升级' : '掌柜'
            }
          })
        } else {

          isDefault = 1
          PROJECT_TOP_MENU = JSON.stringify(list)
          PROJECT_TOP_MENU = JSON.parse(PROJECT_TOP_MENU)
          PROJECT_TOP_MENU.splice(userInfo.StoreId != 0 ? 1 : 2, 1)

        }
        this.setData({
          dList: PROJECT_TOP_MENU,
          cList: PROJECT_TOP_MENU,
          isDefault
        })

      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShare(e) {
      if (e.currentTarget.dataset.type == 'close') {
        this.setData({
          showShare: false
        });
        return
      }
      wx.showLoading({
        title: '获取中...'
      })
      getindexsharedata({
        Type: 1,
        Path: 'pages/home/home'
      }).then(res => {
        wx.hideLoading()
        if (res.data.Status == 'Login' || res.data.Status == 'Faile') {
          wx.showToast({
            icon: 'none',
            title: res.data.Message
          })
        } else this.setData({
          sImgArr: res.data.Result.Data,
          showShare: true
        })

      })
    },

    //自定义tap跳转逻辑判断
    handleGo(e) {
      let str = ''
      const {
        index,
        url,
        item
      } = e.currentTarget.dataset;
      str = url.includes('?') ? `/${url}&tabIndex=${index}&name=${item.Name}` : `/${url}?tabIndex=${index}&name=${item.Name}`
      app.goTo(str, 1)
    },



    // 获取swiper  current
    onChange(e) {
      this.setData({
        currentIndex: e.detail.current
      })
    },

    // 保存图片
    onSave() {
      let {
        sImgArr,
        currentIndex
      } = this.data;
      wx.showLoading({
        title: '保存中...'
      })
      wx.downloadFile({
        url: sImgArr[currentIndex].url,
        success(res) {
          wx.hideLoading()
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success() {
                wx.showToast({
                  icon: 'none',
                  title: '保存成功'
                })
              },
              fail() {
                wx.showToast({
                  icon: 'none',
                  title: '保存失败'
                })
              }
            })
          }
        }
      })
    }
  }
})