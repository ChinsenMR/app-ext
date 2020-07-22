const app = getApp();
import {countdown} from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object,
    dlr: String,
    fid: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    hiddenModal: true,
    limitShow: false,
    limitTxt: '',
    limitHours: '00',
    limitMin: '00',
    limitSecond: '00',
    groupList: [],  // 参团数据
    isShow:false,
    newArr:[],
  },

  ready: function() {
    // console.log("拼团数据+++", this.data.goodsInfo.FightGroupInfos);
    // 参团倒计时
    setInterval(() => {
      this.Clusterdata()
    }, 1000)

    // 拼图狂欢倒计时
    setInterval(() => {
      this.initData()
    }, 1000)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData: function() {
      let {FightGroupActivityInfo,FightGroupInfos} = this.data.goodsInfo;
      // console.log("拼团组件的数据", FightGroupActivityInfo);
      let startState = countdown(FightGroupActivityInfo.StartDate);
      let endState = countdown(FightGroupActivityInfo.EndDate);
      // console.log("拼团倒计时", startState);
      if (startState.overTime) {
        this.setData({
          limitTxt: '距结束',
          limitHours: endState.limitHours,
          limitMin: endState.limitMin,
          limitSecond: endState.limitSecond
        })
      } else {
        this.setData({
          limitTxt: '距开始',
          limitHours: startState.limitHours,
          limitMin: startState.limitMin,
          limitSecond: startState.limitSecond
        })
      }
    },
    // 参团数据
    Clusterdata() {
      let {goodsInfo} = this.data;
      // console.log("参团数据", goodsInfo.FightGroupInfos);
      goodsInfo.FightGroupInfos.forEach((item, index) => {
        let endDate = countdown(item.EndTime);
        item.limitHours = endDate.limitHours;
        item.limitMin = endDate.limitMin;
        item.limitSecond = endDate.limitSecond;
        item.index = index;
      })
      // console.log("输出时间", goodsInfo.FightGroupInfos.limitSecond);
      // console.log("拼团数据", goodsInfo.FightGroupInfos);
      if (goodsInfo.FightGroupInfos.length !=0){
        let arr = goodsInfo.FightGroupInfos[0].FightGroupUsers
        this.setData({
          newArr: arr
        })
      }

      this.setData({
        groupList: goodsInfo.FightGroupInfos,
        // groupList: goodsInfo.FightGroupSkuInfos
      })
    },

    //立即拼团
    joinGroup: function(e) {
      console.log("点击参团", e)
      let {
        id,
        isown,
        sku,
        fightgroupid, 
        tuxedo,//用判断是不是立即参团,有这个值就是参团
        dluser,//代理id
      } = e.currentTarget.dataset;
      console.log("立即参团id", fightgroupid);
      if (isown) {
        wx.showToast({
          icon: 'none',
          title: '不能参加自己的团'
        })
        return
      }
      wx.navigateTo({
        url: `../confirmationOfOrder/confirmationOfOrder?fromPage=fightgroup&sku=${sku.trim()}&buyAmount=1&groupId=${id}&FightGroupId=${fightgroupid}&tuxedo=${tuxedo}&d=${dluser}`,
      })
    },
    //拼团结束
    joinOver(){
      wx.showToast({
        title: '已经结束啦!',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: (result) => {
          
        },
        fail: () => {},
        complete: () => {}
      });
        
    },
    //打开代理弹窗
    handleClick(){
      this.setData({
        isShow:true
      })
    },
    //关闭弹窗
    handleOff(){
      this.setData({
        isShow: false
      })
    },
    //复制微信号
    copyBtn(){
      let that = this;
      console.log("this.data",this.data);
      let { goodsInfo } = this.data;
      wx.setClipboardData({
        data: goodsInfo.FightDistributorInfo.wechat,
        success: (result) => {
          wx.showToast({
            title: '复制成功',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        },
        fail: (result) => {
          console.log("输出复制错误信息", result);
        },
        complete: () => {}
      });
        
    },



  }
})