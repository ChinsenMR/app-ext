import { getGoodsDetail, getProductsDataList, getGrade } from "../../utils/requestApi";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    tabIndex:'',//导航栏索引值
    list:[],  // 会员索引为index0
    lists:[], // 会员索引为index1
    ProductIds:'', //商品id
    GetReferralGrades:[],
    goodsInfo: null,
    likeList:[],//喜欢的商品列表
    level:[],//等级列表
    num:10,
    num2:2,
  },
  pageSize: 10, //	每页数量
  pageIndex:1,	//	当前第几页
  user:{},//用户信息
  newStr:'',//浏览过的商品id


  onLoad(options){
    this.getDefauslt();

    this.setData({ tabIndex: options.tabIndex })
    let user = wx.getStorageSync("userInfo");
    this.user = user
    if (user != '') {
      this.getProductIds(); // 获取本地缓存 同时将还原商品id => getProductsData()
    }
  },
  //获取默认会员升级商品等级数组
  getDefauslt(){
    let that = this
    app.fg({ url:'/API/MembersHandler.ashx?action=GetMemberGradesProduct'})
    .then(res=>{
      console.log("会员等级",res);
      if (res.data.Status=="Success"){
        let arr = res.data.Data.MemberGradesProduct;
        // 循环出数组中的商品 ProductIds
        arr.forEach((value, index) => {
          value.bg_img = app.data.imgurl + 'max_bg_01.png';
          value.title = `成为${value.Name}会员`
          that.getProductsData(value.ProductIds, value.Name, 2, 1)
        })
        that.setData({
          level:arr
        })
      }
    })
  },

  // 根据本地缓存获取相对应会员等的上商品id
  getProductIds(){
    let pIdArr = wx.getStorageSync('pIdArr');//浏览过的商品id数组
    if (pIdArr){
      let str = ''
      pIdArr.forEach(v=>{
        str += v+','
      })
      str = str.substring(0, str.lastIndexOf(','));//去除最后一个字符
      this.newStr = str
      this.getProductsData(str,'',1);//传入type==1,是说明此时是要获取浏览过的商品数据
    }
  },

  // 获取根据会员等级获取升级商品
  getProductsData(ids,name,type,sta){
    let prDid = ids;
    let that = this;
    let data ={
      pageSize:that.pageSize,
      pageIndex:that.pageIndex,
      ProductIds:prDid
    }
    getGrade(data).then(res=>{
      console.log("升级商品数据", res);
      const { level } = this.data;
      let newData = res.data.Result.Data;
      if (type == 1 && that.newStr){//获取浏览过的商品列表
        level.forEach(v => {
          // newData.forEach(item=>{
          //   console.log("喜欢的数组",item);
          //   if (item.SkuItems[0].SKUMemberPriceInfoList.length !=0){
          //     item.SkuItems[0].SKUMemberPriceInfoList.forEach(s=>{
          //       if (v.GradeId == s.GradeId){
          //         console.log("喜欢商品会员价", s);
          //         console.log('item.SalePrice', item.SalePrice);
          //         console.log('s.MemberSalePrice', s.MemberSalePrice);
          //         item.newPrice = (Number(item.SalePrice) - Number(s.MemberSalePrice)).toFixed(2)

          //       }
          //     })
          //   }
          // })
          v.like = newData
        })
        that.setData({ 
          likeList: newData,
          level
        })
      }else{//获取升级会员上列表
        that.setData({ list: newData })
      }
    })
  },

  //获取详情数据
  getDetailData(id){
    let prDid = id
    let data ={
      action: 'getProductDetail',
      ProductID: prDid
    }
    getGoodsDetail(data).then(res=>{
      console.log("详情数据",res);
      if(restusCode == 200){
        wx.hideLoading();
        let { Result } = res.data;
        this.setData({
          bannerArr: Result.ImgList,
          animationImg: Result.ImgList[0],
          description: Result.Description,
          skuItem: Result.SkuItem,
          skus: Result.Skus,
          coupons: Result.Coupons,
          promotionStr: Result.PromotionStr,
          freight: Result.Freight,
          goodsInfo: Result
        })
      }
    })
  },
  //监听商品滚动
  scroll(e) {
    console.log(e)
  },


  // 跳转详情
  handleDetail(e){
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?p=${e.currentTarget.dataset.productid}`,
    })
    wx.setStorageSync("buyType", "fightgroup")
  },
  //跳转页面
  handleGo(e){
    const {type} = e.currentTarget.dataset;
    if (type == 1) {//升级代理
      app.goTo('/packageA/wjx/equities/equities')
    }else{//去首页
      app.goTo('/pages/moduleHome/moduleHome')
    }
  },
  // 添加购物车
  handleAdds(e){
    let id =e.currentTarget.dataset.productid;
    this.getDetailData(id);
    wx.setStorageSync('buyType', e.currentTarget.dataset.type)
    this.triggerEvent('open')
  },


  // 跳转权益说明
  handlte(){
    wx.navigateTo({
      url: '/pages/regulation/regulation',
    });
  },

  // 跳转代理页面
  handleMember() {
    wx.navigateTo({
      url: '/packageA/wjx/equities/equities',
    })
  },

})