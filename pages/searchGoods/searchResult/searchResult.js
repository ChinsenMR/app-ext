import {getProductsList} from "../../../utils/requestApi"
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hiddenResult: Boolean,
    comList: {
      type: Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    storeNum: 2,  // 显示店铺的数量
    showResult: false,  //显示搜索结果
    sortType: true,  // 排序类型
    sortIcon: 'icon_jiage@2x.png',  //排序图标
    sort:'',  //价格排序图标
    //商店列表
    storeList:[
      { img: 'touxiang_03@2x.png', title: '盼超 物理蚊香物理蚊香', coupon: false, info:'换购驱蚊扣 经济环保 物理灭蚊' },
      { img: 'touxiang_03@2x.png', title: '盼超 物理蚊香物理蚊香', coupon: true, info: '换购驱蚊扣 经济环保 物理灭蚊' },
      { img: 'touxiang_03@2x.png', title: '盼超 物理蚊香物理蚊香', coupon: false, info: '换购驱蚊扣 经济环保 物理灭蚊' },
      { img: 'touxiang_03@2x.png', title: '盼超 物理蚊香物理蚊香', coupon: true, info: '换购驱蚊扣 经济环保 物理灭蚊' },
      { img: 'touxiang_03@2x.png', title: '盼超 物理蚊香物理蚊香', coupon: false, info: '换购驱蚊扣 经济环保 物理灭蚊' },
      { img: 'touxiang_03@2x.png', title: '盼超 物理蚊香物理蚊香', coupon: false, info: '换购驱蚊扣 经济环保 物理灭蚊' }
    ],
    resultList:[
      { img: 'big_pic@2x.png', title:'明星同款 蜜丝佛轻薄透气不浮粉，好上妆', curPrice:'156', prePrice:'188' },
      { img: 'big_pic@2x.png', title: '明星同款 蜜丝佛轻薄透气不浮粉，好上妆', curPrice: '435', prePrice: '188' },
      { img: 'big_pic@2x.png', title: '明星同款 蜜丝佛轻薄透气不浮粉，好上妆', curPrice: '89', prePrice: '188' },
      { img: 'big_pic@2x.png', title: '明星同款 蜜丝佛轻薄透气不浮粉，好上妆', curPrice: '566', prePrice: '188' },
      { img: 'big_pic@2x.png', title: '明星同款 蜜丝佛轻薄透气不浮粉，好上妆', curPrice: '899', prePrice: '188' },
      { img: 'big_pic@2x.png', title: '明星同款 蜜丝佛轻薄透气不浮粉，好上妆', curPrice: '29', prePrice: '188' },
      { img: 'big_pic@2x.png', title: '明星同款 蜜丝佛轻薄透气不浮粉，好上妆', curPrice: '109', prePrice: '188' }
    ],

    pageSize: 10,
    pageIndex: 1,
    sortAction:0, // 排序字段
    SortBy:'SalePrice',
    newArray:[]
  },

  
  


  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  lifetimes: {
    attached() {
      // 底部自定义导航栏
      // app.globalData.template.tabbar("tabBar", 1, this, app.data.cartNum) //0表示第一个tabba
      // this.getDataList()
      console.log(this.properties); // 父组件传过来的数组
      
    },
    
  },


  /**
   * 组件的方法列表
   */
  methods: {

    getDataList() {
      let that = this;
      let data = {
        // SortBy: that.data.sortby,
        pageSize: that.data.pageSize,
        pageIndex: that.data.pageIndex,
        // Keywords: that.searchVal
      }
      getProductsList(data).then(res => {
        console.log("组件中商品数据", res)
      })
    },

    //跳转商品详情
    Toprodetai(e) {
        console.log("shanglp",e)
      wx.navigateTo({
        url: `/pages/goodsDetail/goodsDetail?p=${e.currentTarget.dataset.productid}`,
      })
      wx.setStorageSync("buyType", "fightgroup")
    },

    // 加入购物车
    addCart(){
      console.log("加入了")
    },

    // 更多会场
    moreStore:function(param){
      //  当paran == true 是  表示用户点击取消搜索按钮  还原默认设置
      this.setData({
        storeNum: param == true ? 2:this.data.storeList.length,
        showResult: param == true ? false:true
      })
    },

    //价格排序
    priceSort:function(e){
      this.triggerEvent("saleprice");
      // console.log(e)
      // let { resultList } = this.data;
      // resultList.sort(this.compare('curPrice', this.data.sortType))
      // let newArr = this.properties
      // console.log(newArr);
      // // let sortAction = '';
      // // let SortBy = this.data.SortBy;
      // // if(this.data.sortAction==0){
      // //   //SortBy	否	string	排序字段 SalePrice价格SaleNum销量
      // //   // sortAction=1
      // //   SortBy = 'SaleNum'
      // // }else{
      // //   // sortAction=0
      // //   SortBy = 'SalePrice'
      // // }
      // this.setData({
      //   resultList,
      //   sortType: !this.data.sortType,
      //   sortIcon: this.data.sortType ? 'icon_moretoless@2x.png' :'icon_lesstomore@2x.png',
      //   // sortAction:sortAction
      // })

      // // this.triggerEvent("saleprice", sortAction);
      // // this.triggerEvent("saleprice", SortBy);
    },
    
    // 排序比较函数
    compare: function (property, type){
      return function (a, b) {
        var value1 = parseInt(a[property]);
        var value2 = parseInt(b[property]);
        if (type){
          return value1 - value2;
        }else{
          return value2 - value1;
        }
      }
    },
    
    // 打开抽屉
    openDrawer:function(){
      this.triggerEvent('drawerState')
    }


  }
})
