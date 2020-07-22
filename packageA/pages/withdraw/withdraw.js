import { subSplittinDraw, getBalanceData} from '../../../utils/requestApi';
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.data.imgurl,
    id:'',
    Balance:0, // 可用余额
    moneyVal:'', // 可输入的金额
    isShow:true, //控制按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("支付id",options);
    let {id} = options;
    console.log(id);
    this.setData({
      id
    })
    this.getBalance()
  },
  //获取余额明细
  getBalance(){
    getBalanceData({
      pageSize:10,      //	是	int	当前页显示数量，默认10
      pageIndex:1
    }).then(res=>{
      console.log("余额明细",res);
      let Balance = res.data.Balance;
      // let Balance = 0;
      if (Balance!=0){
        this.setData({
          Balance
        })
      } else if (Balance==0){
        this.setData({
          Balance,
          isShow:false
        })
      }
    })
  },
  // 获取输入框的值
  getMoneyVal(e){
    console.log("输入的值", e);
    let val = e.detail.value;
    this.setData({
      moneyVal:val
    })
  },
  // 提交全部金额
  handleAll(){
    this.setData({
      moneyVal: this.data.Balance
    })
  },

  //提交提现申请
  handleConfirm(){
    console.log(this.data.id);
    let that = this;
    if (that.data.moneyVal==''){
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: (result) => {
          
        },
        
      });
      return;
    }
    if (that.data.id == undefined || that.data.id ==''){
      wx.showToast({
        title: '请选择提现方式',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: (result) => {
          
        },
      });
    }else{
      let data = {
        drawtype: that.data.id,     //提现类型 2微信3支付宝
        Amount: that.data.moneyVal  // 提现金额
      }
      subSplittinDraw(data).then(res => {
        console.log("提交提现数据", res);
        if (res.statusCode==200){
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              
            },
          });
        }else{
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {

            },
          });
        }
      })
    }
  },
  // 跳转选择提现方式
  handleWay(){
    wx.navigateTo({
      url: '../../pages/withdrawalWay/withdrawalWay',
      success: (result) => {
        
      },
      
    });
      
  },

  
})