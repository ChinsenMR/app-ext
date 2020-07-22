import { AddlyQualifications } from '../../../utils/requestApi.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    active:0,
    upLoad:[
        {
            name:'请上传营业执照',
            val:'',
            watch:[],
            max:2,
        },
            {
            name:'请上传证书',
            val:'',
            watch:[],
            max:6,
        },
    ],
    imageSrc:[],// 初始显示预设图片
    pics:[],
    certificate:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  // 上传营业执照
  chooseImg: function () {
      var that=this,
　　　 pics=this.data.pics;
      wx.chooseImage({
        count: 2, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 1000
          });   
        var imgsrc=res.tempFilePaths; 
　　　　 pics=pics.concat(imgsrc);  
        that.setData({
          pics:pics
        });
        setTimeout(() => {
          that.uploadimg();
        }, 1000);
      },
    })
  },
  uploadimg:function(){//这里触发图片上传的方法
    var pics=this.data.pics;
    app.uploadimg({
      url:app.data.url+'/AppShop/AppShopHandler.ashx?action=AppUploadImage',   //这里是你图片上传的接口
      path:pics//这里是选取的图片的地址数组        
    });
  },

  //上传证书
  uploadCertificate(){
    var that=this,
    　certificate=this.data.certificate;
      wx.chooseImage({
        count: 4, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 1000
          });  
        var imgsrcs=res.tempFilePaths; 
　　　　 certificate=certificate.concat(imgsrcs);  
        that.setData({
          certificate
        });
        setTimeout(() => {
          that.certificateMethod();
        }, 800);
      },
    })
  },
  certificateMethod:function(){//这里触发图片上传的方法
    var certificate=this.data.certificate;
    app.uploadimg({
      url:app.data.url+'/AppShop/AppShopHandler.ashx?action=AppUploadImage',   //这里是你图片上传的接口
      path:certificate//这里是选取的图片的地址数组        
    });
  },

  // 提交数据
  upconfirm(){
    let arr = this.data.pics;
    let arrs = this.data.certificate;
    let newArr =[];
    let newArrs =[];
    arr.forEach(v=>{
      console.log(v);
      newArr += v +','
    })
    arrs.forEach(v=>{
      console.log(v);
      newArrs += v +','
    })
    console.log(newArr);
    let data ={
      LicenseImg:newArr,
      CertImg:newArrs
    }
    AddlyQualifications(data).then(res=>{
      console.log("提交数据",res);
      console.log(res.data.Message);
      if(res.data.Status=="Success"){
        
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          duration: 1500,
          mask: true,
          success: (result) => {
            console.log("输出了",result)
            // wx.navigateTo({
            //   url: '/pages/fuCombina/fuCombina',
            //   success: (result) => {
                
            //   },
            // });
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
  },
  
})