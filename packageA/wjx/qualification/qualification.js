let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl,
    codeList:[],
    photoList: [],
    certificate:[],
    img: 'https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=269425474,3127521982&fm=85&s=B297256CA623B74F0C7C948B0300E099',
    obj: {},
    xgImg:'',
    active: 0,
    upLoad: [
      {
        name: '请上传营业执照',
        val: '',
        watch: [],
        max: 2,
      },
      {
        name: '请上传证书',
        val: '',
        watch: [],
        max: 3,
      },
    ],
    wxCode: '',
    isShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCation();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取资质数据
  getCation() {
    app.fg({
      url: "/API/MembersHandler.ashx?action=GetMyAgentInfo"
    }).then(res => {
      console.log("输出资质信息", res);
      // console.log("输出资质图片",obj.split(',')[1]);
      if (res.data.Status == "Success") {
        let obj = res.data.Data.CertImg;
        let str = res.data.Data;//数据
        let status = str.RequetStatus;//审核状态
        this.obj = res.data.Data;
        this.xgImg = obj.split(',')[1];
        let arr = []
        arr.push(str.WxImage)
        this.setData({
          obj:str,
          codeList:arr,
          photoList: str.LicenseImg.split(','),
          certificate: str.CertImg.split(','),
        })

        //判断审核状态
        if (status == 0) {
          this.setData({
            isShow:true,
          })
        }else if(status == 2){
          this.setData({
            isShow: true,
          })
        }else if(status==1){
          
        }
      }else{
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
          },
          fail: () => {},
          complete: () => {}
        });
          
      }
    });
  },

  //返回上一页
  handleClick(){
    wx.navigateBack({
      delta: 1
    });
  },
  //重新验证
  handleCX(){
    this.setData({
      isShow:false
    })
  },
  //二维码
  codeImg(e) {
    var that = this
    if (this.data.codeList.length == 1) {
      wx.showModal({
        title: '最多9张图',
      })
      return
    }
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('选中图片', res)
        that.codeUp(that, res.tempFilePaths)
      },
      fail: function (error) { }
    })
  },
  // 上传图片
  codeUp: function (page, path) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    let _this = this
    const fs = wx.getFileSystemManager()
    path.forEach(img => {
      fs.readFile({
        filePath: img,
        encoding: 'base64',
        success(data) {
          console.log("base64", data)
          wx.request({
            url: app.data.url + '/api/PublicHandler.ashx?action=uploadimgbybase64',
            data: {
              baseStr: data.data
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success(res) {
              console.log("输出上传的图片", res);
              wx.hideLoading()
              if (res.data.Status == "Success") {
                _this.data.codeList.push(res.data.Message)
                _this.setData({
                  codeList: _this.data.codeList
                })
              } else {
                wx.showToast({
                  title: '图片上传失败',
                })
              }
            }
          })
        }
      })
    })
  },
  // 删除图片
  codeDel(e) {
    let {
      index
    } = e.currentTarget.dataset.index
    this.data.codeList.splice(index, 1)
    this.setData({
      codeList: this.data.codeList
    })
  },


  // 拍照、选图
  postImg(e) {
    var that = this
    if (this.data.photoList.length == 2) {
      wx.showModal({
        title: '最多9张图',
      })
      return
    }
    wx.chooseImage({
      count: 2,
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('选中图片', res)
        that.upLoadImg(that, res.tempFilePaths)
      },
      fail: function (error) { }
    })
  },

  // 上传图片
  upLoadImg: function (page, path) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    let _this = this
    const fs = wx.getFileSystemManager()
    path.forEach(img => {
      fs.readFile({
        filePath: img,
        encoding: 'base64',
        success(data) {
          console.log("base64", data)
          wx.request({
            url: app.data.url + '/api/PublicHandler.ashx?action=uploadimgbybase64',
            data: {
              baseStr: data.data
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success(res) {
              console.log("输出上传的图片", res);
              wx.hideLoading()
              if (res.data.Status == "Success") {
                _this.data.photoList.push(res.data.Message)
                _this.setData({
                  photoList: _this.data.photoList
                })
              } else {
                wx.showToast({
                  title: '图片上传失败',
                })
              }
            }
          })
        }
      })
    })
  },
  // 删除图片
  Deleted(e) {
    let {
      index
    } = e.currentTarget.dataset.index
    this.data.photoList.splice(index, 1)
    this.setData({
      photoList: this.data.photoList
    })
  },

  // 上传证书
  // 拍照、选图
  certificate(e) {
    var that = this
    if (this.data.certificate.length == 3) {
      wx.showModal({
        title: '最多9张图',
      })
      return
    }
    wx.chooseImage({
      count: 3,
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('选中图片', res)
        that.certificateImg(that, res.tempFilePaths)
      },
      fail: function (error) { }
    })
  },

  // 上传图片
  certificateImg: function (page, path) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    let _this = this
    const fs = wx.getFileSystemManager()
    path.forEach(img => {
      fs.readFile({
        filePath: img,
        encoding: 'base64',
        success(data) {
          console.log("base64", data)
          wx.request({
            url: app.data.url + '/api/PublicHandler.ashx?action=uploadimgbybase64',
            data: {
              baseStr: data.data
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success(res) {
              console.log("输出上传的图片", res);
              wx.hideLoading()
              if (res.data.Status == "Success") {
                _this.data.certificate.push(res.data.Message)
                _this.setData({
                  certificate: _this.data.certificate
                })
              } else {
                wx.showToast({
                  title: '图片上传失败',
                })
              }
            }
          })
        }
      })
    })
  },
  // 删除图片
  Deleted2(e) {
    let {
      index
    } = e.currentTarget.dataset.index
    this.data.certificate.splice(index, 1)
    this.setData({
      certificate: this.data.certificate
    })
  },


  //提交
  submit(){
    let { codeList,photoList,certificate,} = this.data;
    let code = codeList.toString();
    let photo = photoList.toString();
    let cert = certificate.toString();
    app.fg({
      url: '/API/MembersHandler.ashx?action=UpdateAgentInfo',
      data: {
        LicenseImg: photo,	//是	string	营业执照
        CertImg: cert,   //否	string	相关资质
        WxImage: code,	    //是	string	微信二维码
      }
    }).then(res => {
      console.log("输出状态", res)
      if(res.data.Status=="Success"){
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
          },
          fail: () => {},
          complete: () => {}
        });
          
      }

    })
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})