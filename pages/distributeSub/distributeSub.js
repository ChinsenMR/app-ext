import {
  distributeSub,
  referralGrades,
  updateMemberGrade
} from '../../utils/requestApi.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    activeItem: null,
    timeArr: ['全部', '近7天', '近30天', '近半年'],
    seTime: null, //筛选时间
    joinTimeIcon: 0,
    totalPriceIcon: 0,
    empolyIcon: 0,
    listData: {},
    page: 1, // 页码
    obj: {},
    Grade: [], //等级
    agentList:[], //代理下属
    showWin:false, //弹窗
    userid:null, // 用户id
    teamNus:0, // 团队数
    newArr:[], // 下级数据
    uid:0,
    list:[],// 处理数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //    1:分销下属    / 2：代理下属
    let t = "分销下属"
    var opt = options.Type || 1
    if (opt == 2) t = "代理下属"
    wx.setNavigationBarTitle({ title: t })
    this.getGrades();
    this.getAgent()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  // 点击tab栏 切换数据
  selectNav: function(e) {
    // console.log("切换tab栏的数据id",e);
    this.setData({
      "listData.MySubUsersList": [],
      activeItem: e.target.dataset.id,
      page: 1
    })
    this.initData({gradeId: e.target.dataset.id});
  },

  //筛选时间
  selectTime: function(e) {
    this.setData({
      seTime: this.data.timeArr[e.detail.value]
    })
  },

  //搜索
  search: function(e) {
    let {value} = e.detail;
    this.initData({
      search: value
    })
  },

  //排序
  attrSort: function(e) {
    let {id} = e.currentTarget.dataset;
    let {joinTimeIcon,totalPriceIcon,empolyIcon} = this.data, obj = {};
    if (id == 1) {
      joinTimeIcon = joinTimeIcon == 0 ? 1 : (joinTimeIcon == 1 ? 2 : 0)
      if (joinTimeIcon != 0) {
        obj.sortOrder = joinTimeIcon == 1 ? false : true
        obj.sortBy = 'CreateDate'
      }
    }
    if (id == 2) {
      totalPriceIcon = totalPriceIcon == 0 ? 1 : (totalPriceIcon == 1 ? 2 : 0)
      if (totalPriceIcon != 0) {
        obj.sortOrder = totalPriceIcon == 1 ? false : true
        obj.sortBy = 'SubSumOrderTotal'
      }
    }
    if (id == 3) {
      empolyIcon = empolyIcon == 0 ? 1 : (empolyIcon == 1 ? 2 : 0)
      if (empolyIcon != 0) {
        obj.sortOrder = empolyIcon == 1 ? false : true
        obj.sortBy = 'SubMemberAllSplittin'
      }
    }
    this.setData({
      joinTimeIcon,
      totalPriceIcon,
      empolyIcon,
      obj
    })
    this.initData(obj)
  },


  // 初始话数据
  initData: function(obj) {
    let { page, listData } = this.data;
    distributeSub({  // 分销下属
      pageSize:  10 || obj.pageSize,
      pageIndex: obj.page || page,
      SortBy: obj.sortBy || '',
      SortOrder: obj.sortOrder || '',
      StartTime: obj.startTime || '',
      search: obj.search || '',
      GradeId:obj.gradeId || '',
      UserId:obj.userid || ''
    }).then(res => {
      console.log("分销下属",res);
      if (res.data.Status == 'Success') {
        if (res.data.MySubUsersList.length != 0) {
          if (!listData.MySubUsersList.length ==0) listData.MySubUsersList = []
          listData.MySubUsersList = [...listData.MySubUsersList, ...res.data.MySubUsersList]
          page ++
        }
        console.log("输出res", res); 
        listData.ExpandMemberAll = res.data.ExpandMemberAll
        listData.NextMemberTotal = res.data.NextMemberTotal
        listData.SplittinTotal = res.data.SplittinTotal
        this.setData({ listData, page })
      }
    })
  },

  // 获取会员等级导航栏
  getGrades(){
    referralGrades({ NotKjLevel: false }).then(res =>{
      // console.log("分销下属导航栏1", res);
      // console.log("分销下属导航栏2", res.data.Data);
      // console.log(res.data)
      if (res.data.Status == 'Success') {
        this.setData({ Grade: res.data.Data, activeItem: res.data.Data[0].GradeId })
        this.initData({ gradeId: res.data.Data[0].GradeId })
      }
    })
  },

  //代理下属
  getAgent(){
    referralGrades({ NotKjLevel:true}).then(res=>{
      // console.log("代理下属",res);
      if(res.data.Status=="Success"){
        this.setData({
          agentList:res.data.Data
        })
      }
    })
  }, 

  // 点击展示下属
  handleUnderling(e){
    // console.log('展示下属id',e);
    let userid = e.currentTarget.dataset.userid;
    // this.setData({
    //   'listData.MySubUsersList': []
    // })
    // this.initData({ userid, pageSize: 1000, page:1 })
    distributeSub({
      pageSize: 1000,
      pageIndex: 1,
      UserId: userid
    }).then(res=>{
      // console.log("展示数据",res);
      let oldArr = this.data.listData.MySubUsersList;
      let newArr = res.data.MySubUsersList;
      let add = [...oldArr, ...newArr]
      if (res.data.Status=="Success"){
        this.setData({
          teamNus:res.data.AllSubCount,
          newArr: add,
          uid: userid
        })
      }
    })
  },

  // 修改等级
  handleChange(e){
    // console.log("输出修改e",e);
    let userid = e.target.dataset.userid
    this.setData({
      showWin:true,
      userid
    })
  },
  //修改会员等级
  handleAlter(e){
    // console.log("修改会员的数据id",e);
    let {gradeid} = e.currentTarget.dataset;
    updateMemberGrade({
      GradeId: gradeid,
      UserId:this.data.userid
    }).then(res=>{
      // console.log("修改会员",res);
      if (res.data.Status =='Faile'){
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          duration: 1500,
          mask: true,
          success: (result) => {
            this.setData({
              "listData.MySubUsersList": [],
              showWin: false, 
              page: 1
            })
            this.initData({ gradeId: gradeid});
          },
        });
      }else{
        if (res.data.Status == 'Success') {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              this.setData({
                showWin: false
              })
              // this.initData()
            },
          });
          // console.log('修改成功');
        }
      }
    })
  },
  // 隐藏弹窗
  changeHide() {
    this.setData({
      showWin: false
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.initData();
  },

 
})