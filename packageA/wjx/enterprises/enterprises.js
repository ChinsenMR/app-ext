
import QQMapWX from '../../utils/qqmap-wx-jssdk.min';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgurl,
    bankList: ['工商银行', '交通银行', '招商银行', '民生银行', '中信银行',
      '浦发银行', '兴业银行', '光大银行', '广发银行', '平安银行', '北京银行',
      '华夏银行', '农业银行', '建设银行', '邮政储蓄银行', '中国银行', '宁波银行',
      '其他银行'],
    showBank: false,
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    iconImg: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/sjmed/icon_photo2@2x.png',
    iconDel: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/sjmed/close@2x (1).png',
    zwtpImg: app.imgurl + 'zwtp.jpg',
    keyShow:false,//控制营业执照信息中主体类型的选择
    basicData: [ //门店信息
      {
        title: '门店名',
        pla: '* 请填写门店名称',
        val: '',
        name: 'StoreName',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '门店省市区',
        pla: '* 请选择省市区',
        val: '',
        name: 'StoreArea',
        type: 'text',
        status: true,//用于控制省市区
        show: false,//用于控制是否上传图片
        ssq: true,
      },
      {
        title: '门店地址',
        pla: '* 请填写门店地址',
        val: '',
        name: 'StoreAdress',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '联系电话',
        pla: '* 请填写手机号码',
        val: '',
        name: 'Tel',
        type: 'number',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '联系人',
        pla: '* 请填写联系人',
        val: '',
        name: 'ContactMan',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '门店logo',
        pla: '* 请填写门店logo 1/1',
        val: '',
        name: 'StoreImages',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 0,//代表logo
      },
    ],
    businessData: [//营业执照信息
      {
        title: '主体类型',
        pla: '',
        val: '',
        name: 'SubjectType',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
        isShow:true,//控制下拉框选择
        newShow:true,//控制是否禁止输入
        list: ['个体户','企业']
      },
      {
        title: '营业执照',
        pla: '* 请填上传营业执照片',
        val: '',
        name: 'LicenseCopy',
        type: 'text',
        nums: 8,//代表补充材料照片
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        newShow: true,
      },
      {
        title: '营业执照号',
        pla: '* 请填写营业执照号',
        val: '',
        name: 'LicenseNumber',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
        newShow: false,
      },
      {
        title: '商户名称',
        pla: '* 请填写营业执照上的商户名称',
        val: '',
        name: 'MerchantName',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
        newShow: false,
      },
      {
        title: '个体户经营者',
        pla: '* 请填写个体户经营者/法人姓名',
        val: '',
        name: 'LegalPerson',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
        newShow: false,
      },
    ],
    legalPerson:[//法人信息
      {
        title: '证件类型',
        pla: '',
        val: '',
        name: 'IdDocType',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
        isShow: true,//控制下拉框选择
        newShow: true,//控制是否禁止输入
        //证件类型()
        list: ['身份证','护照(其他国家)', '中国香港居民', '中国澳门居民','中国台湾居民']
      },
      {
        title: '身份证人像正面照片',
        pla: '* 身份证人像正面照片 1/1',
        val: '',
        name: 'IdCardCopyIdentity',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 3,//代表身份证号码
      },
      {
        title: '身份证国徽照片',
        pla: '* 身份证国徽照片 1/1',
        val: '',
        name: 'IdCardNationalIdentity',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 4,//身份证国徽照片
      },
      {
        title: '身份证姓名',
        pla: '* 请填写身份证姓名',
        val: '',
        name: 'IdCardName',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '身份证号码',
        pla: '* 请填写身份证号码',
        val: '',
        name: 'IdCardNumber',
        type: 'idcard',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片

      },
      {
        title: '身份证有效期*',
        pla: '',
        val: '',
        name: 'identityTime',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
        period: true,//用于显示有效期输入框
        end: 'endTime',//结束时间
        str: 'strTime',//开始时间
      },
      {
        title: '联系邮箱',
        pla: '* 请填写联系邮箱',
        val: '',
        name: 'ContactEmail',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '联系人手机',
        pla: '* 请填写联系人手机',
        val: '',
        name: 'MobilePhone',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      
    ],
    information:[//线下门店信息
      {
        title: '商户简称',
        pla: '* 请填写商户简称',
        val: '',
        name: 'MerchantShortname',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '客服电话',
        pla: '* 请填写客服电话',
        val: '',
        name: 'ServicePhone',
        type: 'number',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '门店省市编码',
        pla: '* 请填写门店省市编码(如:广州市)',
        val: '',
        name: 'BizAddressCode',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '门店门头照片',
        pla: '* 请上传门店门头照片 1/1',
        val: '',
        name: 'StoreEntrancePic',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 1,//代表门店门口照片
      },
      {
        title: '店内环境照片',
        pla: '* 请上传店内环境照片 1/1',
        val: '',
        name: 'IndoorPic',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 7,//代表门店门口照片
      },
    ],

    smallData: [ //结算信息
      {
        title: '账户类型',
        pla: '* 请填写账户类型',
        val: '',
        name: 'BankAccountType',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '开户名称',
        pla: '* 请填写开户名称',
        val: '',
        name: 'AccountName',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '开户银行全称(含支行)',
        pla: '* 请填写开户银行全称',
        val: '',
        name: 'BankName',
        type: 'text',
        status: false,
        show: true,//用于控制是否上传图片
      },
      {
        title: '开户银行',
        pla: '* 请选择开户银行',
        val: '',
        name: 'AccountBank',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '开户银行省市编码',
        pla: '* 请填写开户银行市区(如:广州市)',
        val: '',
        name: 'BankAddressCode',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '银行账号',
        pla: '* 请填写银行账号',
        val: '',
        name: 'AccountNumber',
        type: 'number',
        status: false,
        show: false,//用于控制是否上传图片
      },
    ],
    
    region: ['广东省', '广州市', '越秀区'],
    customItem: '全部',
    photoList: [],  //照片数组 门店logo
    photoList2: [],  //照片数组 门店门口照片
    photoList4: [],  //照片数组 //身份证人像正面照片
    photoList5: [],  //照片数组 //身份证国徽照片
    photoList6: [],  //照片数组
    photoList7: [],  //照片数组
    photoList8: [],  //照片数组 //店内环境照片
    photoList9: [],  //照片数组 //经营场地照
    StoreImages: '',  //logo图片
    StoreEntrancePic: '', //门店门口照片
    IndoorPic: '',//店内环境照片
    SWXAddressCertification: '',//经营照片
    IdCardCopyIdentity: '', //身份证正面
    IdCardNationalIdentity: '',//反面
    businessImg: '',
    codeImg: '',
    environmentImg: '',
    premisesImg: '',
    uploadImg: [],
    imageLoad: [],
    logoLoad: [],
    prosivion: ['餐饮', '线下零售', '居民生活服务', '休闲娱乐', '交通出行', '其他'],
    pull: false,
    dateSta: '2019-11-13',
    dateEnd: '2019-12-13',
    staVal: '',
    endVal: '',
    getForm: {}, //获取表单的数据.
    UserId: '',//用户id
    StoreId: '',//门店id
    main: '',//驳回理由
    mrzhi: '审核不通过',
    sals: '',
    longitude: 113.324520,
    latitude: 23.099994,
    circles: [],
    srShow: false,
    newIndex:0,//营业信息
    newIndex2: 0,//法人信息,用于证件类型(0：中国大陆居民-身份证,1：其他国家或地区居民-护照,2：中国香港居民-来往内地通行证,3：中国澳门居民-来往内地通行证,4：中国台湾居民-来往大陆通行证)
    
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为1', e.detail.value)
    const {type} = e.currentTarget.dataset;
    if(type==1){
      this.setData({
        newIndex: e.detail.value
      })
    }else{
      this.setData({
        newIndex2: e.detail.value
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
   
    let { Stid, UserId } = wx.getStorageSync('userInfo');
    // let { StoreId, UserId } = wx.getStorageSync('userInfo');
    this.setData({
      StoreId: Stid || 0,//门店id
      UserId: UserId,
    })
    this.getForm(Stid);

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  
  //获取表单数据
  getForm(id) {
    let that = this;
    app.Fnpost({
      url:'/api/WeChatApplet.ashx?action=StoreApproval',
      data:{
        StoreType: 1, //	是	int	获取类型(0- 新增门店、1 - 获取门店申请)
        StoreId: id, //	是	int	门店Id
      }
    }).then(res => {
      // console.log("res",res);
      if (res.data.Status =="Success"){
        let data = JSON.parse(res.data.Message);
        console.log("获取表单数据",data);
        let basic = that.data.basicData;
        let legal = that.data.legalPerson;//法人信息
        let small = that.data.smallData;
        basic.forEach(item => {
          for (let v in data) {
            if (v == 'StoreArea') {
              that.setData({
                region: data[v].split(',')
              })
            }
            if (item.name == v) {
              if (item.name == 'StoreImages') { //
                let obj = {}
                obj.ImageUrl = data[v]
                let kArr = []
                kArr.push(obj)
                // console.log('门店logo', kArr);
                that.setData({
                  photoList: kArr,
                  StoreImages: data[v]
                })
              } else if (item.name == 'StoreEntrancePic') { //门店门口照片
                let obj = {}
                obj.ImageUrl = data[v]
                let kArr = []
                kArr.push(obj)
                that.setData({
                  photoList2: kArr,
                  StoreEntrancePic: data[v]
                })
              } else if (item.name == 'IndoorPic') { //店内环境图片
                let obj = {}
                obj.ImageUrl = data[v]
                let kArr = []
                kArr.push(obj)
                that.setData({
                  photoList8: kArr,
                  IndoorPic: data[v]
                })
              } else if (item.name == 'SWXAddressCertification') { //经营场地证明图片
                let obj = {}
                obj.ImageUrl = data[v] || that.data.zwtpImg//用于默认图片
                let kArr = []
                kArr.push(obj)
                // console.log('经营场地证明图片', kArr);
                that.setData({
                  photoList9: kArr,
                  SWXAddressCertification: data[v]
                })
              } else if (item.name == 'IdCardCopyIdentity') { //身份证人像面图片IdCardCopyIdentity
                let obj = {}
                obj.ImageUrl = data[v]
                let kArr = []
                kArr.push(obj)
                that.setData({
                  photoList4: kArr,
                  IdCardCopyIdentity: data[v]
                })
              } else if (item.name == 'IdCardNationalIdentity') { //身份证国徽面图片
                let obj = {}
                obj.ImageUrl = data[v]
                let kArr = []
                kArr.push(obj)
                that.setData({
                  photoList5: kArr,
                  IdCardNationalIdentity: data[v]
                })
              } else if (item.name == 'SWXBusinessAdditionDesc') {
                if (data[v] == '' || data[v] == null) {
                  that.setData({
                    'basicData[10].val': ''
                  })
                } else {
                  that.setData({
                    'basicData[10].val': data[v]
                  })
                }
              } else {
                item.val = data[v]
              }
            }
          }
        })
       
        //驳回理由
        let rl = data.RepelReason;
        //小微商户状态
        let sals = data.SWXApplyStatus;
        if (rl == '' || rl == null) {
          if (sals == -1) {
            that.setData({
              main: '申请失败',
              mrzhi: '申请失败'
            })
          } else if (sals == 0) {
            that.setData({
              main: '填写资料',
              mrzhi: '填写资料'
            })
          } else if (!sals && !rl) {
            that.setData({
              main: '审核中',
              mrzhi: '审核中'
            })
          } else if (sals == 2) {
            that.setData({
              main: '已驳回',
              mrzhi: '已驳回'
            })
          } else if (sals == 3) {
            that.setData({
              main: '已冻结',
              mrzhi: '已冻结'
            })
          } else if (sals == 4) {
            that.setData({
              main: '待签约',
              mrzhi: '待签约'
            })
          } else if (sals == 5) {
            that.setData({
              main: '完成',
              mrzhi: '完成'
            })
          }
        } else {
          that.setData({
            main: data.RepelReason,//驳回理由
          })
        }
        that.setData({
          getForm: data,
          dateSta: data.SWXIdCardValidTimeStart.split('T')[0],
          dateEnd: data.SWXIdCardValidTimeEnd.split('T')[0],
          basicData: basic,
          smallData: small,
          main: data.RepelReason,//驳回理由
          sals,//小微商户状态
        })
      }else{
        console.log(res.data.Message);
      }
    })
  },

  //form表单
  formSubmit: function (e) {
    
    app.fl('提交中~')
    let obj = e.detail.value, that = this, fu = this.data
    console.log("99999999999", this.data.newIndex2);
    console.log("输出form表单", obj);
    let data = {
      action: 'StoreApproval',
      UserId: this.data.UserId,
      StoreId: this.data.StoreId,
      StoreType: 0, //	是	string	获取类型（0-申请门店、1-获取门店）
      StoreName: obj.StoreName, //	是	string	门店名
      StoreArea: obj.StoreArea || '广东省,广州市,越秀区', //	是	string	省市区
      StoreAdress: obj.StoreAdress, //	是	string	地址
      ContactName: obj.ContactMan, //	是	string	联系人
      ContactTel: obj.Tel,  //	是	string	联系电话(必须为手机号)
      StoreLogo: obj.StoreImages,  //	是	string	门店logo
      SubjectType: obj.SubjectType == '个体户' ? 'SUBJECT_TYPE_INDIVIDUAL' : 'SUBJECT_TYPE_ENTERPRISE',//主体类型 个体户, -企业
      LicenseCopy: obj.LicenseCopy,  //	否	string	营业执照图片
      LicenseNumber: obj.LicenseNumber,//营业执照号
      MerchantName: obj.MerchantName,//商户名称( 1、请填写营业执照上的商户名称，2~110个字符，支持括号。2、个体户，不能以“公司”结尾。3、个体户，若营业执照上商户名称为“空“或“无”时，填写”个体户+经营者姓名”，如“个体户张三”)
      LegalPerson: obj.LegalPerson,//个体户经营者/法人姓名
      IdCardName: obj.IdCardName,  //	是	string	身份证姓名
      IdCardNumber: obj.IdCardNumber,  //	是	string	身份证号码
      IdDocType: this.data.newIndex2,//证件类型
      IdCardCopyIdentity: obj.IdCardCopyIdentity,  //	是	string	身份证人像面图片
      IdCardNationalIdentity: obj.IdCardNationalIdentity,  //	是	string	身份证国徽面图片
      CardPeriodBegin: obj.dateSta || '2018-11-12',  //	是	DateTime	身份证有限期限开始时间
      CardPeriodEnd: obj.dateEnd || '2026-12-31',  //	是	DateTime	身份证有限期限截止时间

      BankAccountType: 0,// 账户类型(0 - 对公银行账户, 1 - 经营者个人银行卡)
      AccountName: obj.AccountName,  //	是	string	开户名称
      BankName: obj.BankName,  //	是	string	开户银行全称（含支行 AccountBank选择其他银行必传)
      AccountBank: obj.AccountBank,  //	是	string	开户银行
      AccountNumber: obj.AccountNumber,  //	是	string	银行账号
      BankAddressCode: obj.BankAddressCode,  //	是	string	开户银行省市代码（输入地级市）*************
      ContactEmail: obj.ContactEmail,  //	是	string	联系邮箱
      MobilePhone: obj.MobilePhone, //联系人手机
      MerchantShortname: obj.MerchantShortname,  //	是	string	商户简称
      ServicePhone: obj.ServicePhone,  //	是	string	客服电话
      BizAddressCode: obj.BizAddressCode,  //	是	string	门店省市编码（输入地级市）***********
      StoreEntrancePic: obj.StoreEntrancePic,  //	是	string	门店门口照片
      IndoorPic: obj.IndoorPic,  //	是	string	店内环境图片
      Coordinate: fu.latitude + ',' + fu.longitude,//-----------门店坐标(例 23.657,35.589)

      // IsBlack: 0,
      // RateType: '10',  //	是	string	费率（下拉框0=0.38 % (默认)1= 0.39 % 2=0.40% 3=0.45% 4=0.48% 5=0.49% 6=0.50% 7=0.55% 8=0.58% 9=0.59% 10=0.60%）
      // StoreStreet: obj.SWXStoreStreet,  //	是	string	门店街道名称
      // ProductDesc: obj.SWXProductDesc || '线下零售',  //	是	string	提供服务描述
      
      // BusinessAdditionDesc: obj.SWXBusinessAdditionDesc,  //	否	string	补充说明
      
    }
    wx.request({
      url: app.data.url+'/api/WeChatApplet.ashx?action=StoreApproval',
      data: data,
      header: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: wx.getStorageSync('cookie')
      },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log("表单提交结果", res);
        if (res.data.Status == "Success") {
          that.updataUser()
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
              duration: 1500,
              mask: true,
              success: (result) => {
                setTimeout(() => {
                 wx.navigateBack({
                   delta: 1, // 回退前 delta(默认为1) 页面
                 })
                }, 1500);
              },
            });
          }, 1500);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        }
      },
    });
  },

  //选择省市区
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      'basicData[1].val': e.detail.value || this.data.region
    })
  },
  // 拍照、选图
  postImg(e) {
    let that = this;
    let { typeid } = e.currentTarget.dataset;
    console.log(typeid);
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const logoLoad = this.data.logoLoad.concat(res.tempFilePaths)
        let logoList = []
        logoList = logoLoad.length <= 1 ? logoLoad : logoLoad.slice(0, 1)
        
        that.uploadImgs(logoList, 0, 'logo', typeid).then(c => {
          console.log("图片上传--typeid", that.data.logo, typeid)
        })
      }
    })
  },
  uploadImgs(images, num, name, id) {
    let that = this
    const all = num
    let getImage = ''
    return new Promise((resolve, reject) => {
      function upload(num) {
        if (num < 0) {
          resolve(true)
          that.setData({
            [name]: getImage,
          })
          return
        }
        wx.uploadFile({
          url: app.data.url + '/AppShop/AppShopHandler.ashx?action=AppUploadImage',//上传图片路径
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: wx.getStorageSync('cookie')
          },
          filePath: images[num],
          NotCheck: true,
          name: 'file',
          success: res => {
            let datar = JSON.parse(res.data)
            let newArr = []
            if (num == all) {
              newArr.push(datar.Result)
              if (id == 0) { //logo
                getImage = datar.Result.ImageURL
                that.setData({
                  photoList: newArr,
                  StoreImages: getImage
                })
              } else if (id == 1) { //门店门口照片
                getImage = datar.Result.ImageURL
                that.setData({
                  photoList2: newArr,
                  StoreEntrancePic: getImage,
                })
              }else if (id == 3) { //身份证人像正面照片
                getImage = datar.Result.ImageURL
                console.log("国徽1", getImage);
                that.setData({
                  photoList4: newArr,
                  IdCardCopyIdentity: getImage,
                })
              } else if (id == 4) { //身份证国徽照片
                getImage = datar.Result.ImageURL

                console.log("国徽2", getImage);
                that.setData({
                  photoList5: newArr,
                  IdCardNationalIdentity: getImage,
                })
              } else if (id == 5) {
                getImage = datar.Result.ImageURL
                that.setData({
                  photoList6: newArr,
                  businessImg: getImage,
                })
              } else if (id == 6) {
                getImage = datar.Result.ImageURL
                that.setData({
                  photoList7: newArr,
                  codeImg: getImage,
                  environmentImg: '',
                  premisesImg: '',
                })
              } else if (id == 7) { //店内环境照片
                getImage = datar.Result.ImageURL
                that.setData({
                  photoList8: newArr,
                  IndoorPic: getImage,

                })
              } else if (id == 8) { //经营场地照
                console.log("输出经营场地照nums==8", id);
                getImage = datar.Result.ImageURL
                that.setData({
                  photoList9: newArr,
                  LicenseCopy: getImage,//** */
                })
              }
            } else {
              getImage += ',' + datar.Result.ImageURL
            }
          }
        })
      }
      upload(num)
    })
  },

  // 打开银行显示
  openBank(e) {
    console.log(e, '99999999');
    if (e.currentTarget.dataset.index == 1) {
      this.setData({
        showBank: true,
      })
    }
  },
  // 删除图片
  Deleted(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList.splice(index, 1)
    this.setData({
      photoList: this.data.photoList,
      StoreImages: '',
    })
  },
  Deleted2(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList2.splice(index, 1)
    this.setData({
      photoList2: this.data.photoList2,
      StoreEntrancePic: '',
    })
  },
  Deleted4(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList4.splice(index, 1)
    this.setData({
      photoList4: this.data.photoList4,
      IdCardCopyIdentity: '',
    })
  },
  Deleted5(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList5.splice(index, 1)
    this.setData({
      photoList5: this.data.photoList5,
      IdCardNationalIdentity: '',
    })
  },
  Deleted8(e) { //身份证正面
    let { index } = e.currentTarget.dataset;
    this.data.photoList8.splice(index, 1)
    this.setData({
      photoList8: this.data.photoList8,
      IndoorPic: '',
    })
  },
  Deleted9(e) { //身份证反面
    console.log("输出了啊");
    let { index } = e.currentTarget.dataset;
    this.data.photoList9.splice(index, 1)
    this.setData({
      photoList9: this.data.photoList9,
      LicenseCopy: '',
    })
  },
  //控制服务下拉框
  handlePull() {
    this.setData({
      pull: !this.data.pull
    })
  },
  //获取下拉框选中的值
  handleDown(e) {
    const { val, index } = e.currentTarget.dataset;
    this.setData({
      'smallData[10].val': val,
      pull: false
    })
  },
  //获取下拉框的值2
  handleChange(e){
    console.log(e);
  },

  //开始时间
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateSta: e.detail.value,
      staVal: e.detail.value || this.data.dateSta
    })
  },
  //结束时间
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateEnd: e.detail.value,
      endVal: e.detail.value || this.data.dateEnd
    })
  },

  updataUser() {
    app.getOpenId(function (a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          dataR.openId = a
          app.setMembersInfo(dataR)
          wx.setStorageSync('userinfo', dataR);

        } else {
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
      })
    })

  },

  // 触发点击地图
  DingWeiFN(e) {
    console.log(e, '=======');
    let a = {
      longitude: e.detail.longitude,
      latitude: e.detail.latitude,
      radius: 40,
      fillColor: '#ff0000',
    }

    this.setData({
      longitude: e.detail.longitude,
      latitude: e.detail.latitude,
      ['circles[0]']: a
    })
  },

  blurFN(e) {
    const { name } = e.currentTarget.dataset
    if (name == "StoreAdress") {
      this.getTencentMap(e.detail.value)
    } else if (name =="SubjectType"){
      console.log("----", name);
      this.setData({keyShow:true})
    }
  },

  //调取腾讯地图
  getTencentMap(address) {
    let that = this, data = this.data
    var qqmapsdk = new QQMapWX({
      key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
    });
    qqmapsdk.geocoder({
      address: data.region[0] + data.region[1] + data.region[2] + address,
      success: function (res) {
        console.log(res, '111111');
        that.setData({
          longitude: res.result.location.lng,
          latitude: res.result.location.lat,
        })
      },
      fail: function (e) {
      }
    })
  },

  // 保存二维码
  saveJScode() {
    let fileName = new Date().valueOf();
    let filePath = wx.env.USER_DATA_PATH+'/'+fileName+'.jpg'
    console.log("fileName", fileName);
    let url = this.data.getForm.SWXSignUrl;
    console.log("二维码路径",url);
    wx.downloadFile({
      url: url,     //仅为示例，并非真实的资源
      filePath: filePath,
      success: function (res) {
        console.log(res, 1111111);
        // wx.showModal({
        //   title: '提示02',
        //   content: res.tempFilePath,
        // })
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode == 200) {
          // app.fl('正在保存图片！')
          wx.saveImageToPhotosAlbum({
            // filePath: res.tempFilePath,
            filePath: filePath,
            success(data) {
              console.log("成功",data);
              app.fh();
              app.fa('保存图片成功！')
            },
            fail(res) {
              console.log(res, 222222);
              wx.showModal({
                title: '提示',
                content: '请打开相册授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({})
                    wx.hideLoading();
                      
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.hideLoading();
                  }
                }
              })
            }
          })
        }else{
          app.fh();
        }
      }
    })
  },
  //确认签约
  saveSignSWX(){
    app.fg({
      url:'/api/WeChatApplet.ashx?action=SignSWX'
    }).then(res=>{
      console.log("输出签约结果",res);
      if (res.data.Status =="OK"){
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          duration: 2000,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/member/member',
              });
            }, 2000);
          },
          fail: () => {},
          complete: () => {}
        });
        
      }else{
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          duration: 2000,
          mask: true,
        });
      }
    })
  },
  inputFN(e) {
    this.setData({
      [e.target.dataset.name]: e.detail.value
    })
  },
  // 選擇銀行
  chooseBank(e) {
    this.setData({
      ['smallData[1].val']: e.currentTarget.dataset.name,
      showBank: false,
      srShow: e.currentTarget.dataset.name == '其他银行'
    })

  },
  // 
  fuNameFN() {
    this.setData({
      srShow: false
    })
  }

})