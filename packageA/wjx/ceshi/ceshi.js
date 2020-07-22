
import { getMainColor, getUniqueColor } from '../../../utils/image-main-color'
const app = getApp()

Page({
  data: {
    imageSrc: "https://hyosstest.oss-cn-shenzhen.aliyuncs.com/agentphotoes/bg3.jpg",
    imageSrc2:'https://img.hmeshop.cn/hmeshopV3/Storage/master/201912261552509449511.jpg',
    imageSrc3:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591761899107&di=ffc6592a44b166b0083de50182a5a3bf&imgtype=0&src=http%3A%2F%2Fimg009.hc360.cn%2Fy2%2FM06%2F8A%2F0C%2FwKhQdFSp7fOEWqDgAAAAAEaC6CY186.jpg',
    imageSrc4:'https://img.hmeshop.cn/hmeshopV3/Storage/master/201912261608382728840.jpg',
    imageSrc5:'https://img.hmeshop.cn/hmeshopV3/Storage/master/201912261552509449511.jpg',
    
    startColor: '',
    endColor: '',
    newArr:[
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1897368321,507877066&fm=26&gp=0.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591777832218&di=352ace6ec7db08c10a756e4119d9a343&imgtype=0&src=http%3A%2F%2Fbpic.wotucdn.com%2F15%2F99%2F89%2F15998960-d42f1ff9fefa900235184c0c483039e0-1.jpg'
    ],
    colorArr:[],
    url: "https://wechat.weixinzjit.com/costa/public/uploads/images/20190109/67b16149693920598435315fd0d5ab3e.jpg"
  },

  onLoad: function () {
    let { newArr } = this.data;
    const promises = newArr.map(item => this.getBackgroundColor(item));
    // newArr.forEach(v=>{
    //   this.getBackgroundColor(v)
    // })

    Promise.all(promises)
      .then(resArr => {
        console.log('resArr', resArr)
        if (resArr) {
          this.setData({ colorArr: resArr });
        }
      }).catch(err => {
        console.log('err', err)
      })
  },

  getBackgroundColor(url) {
    const ctx = wx.createCanvasContext('myCanvas')
    const that = this

    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: `${url}`,
        success: res => {
          const poster = res.path
          ctx.drawImage(poster, 0, 0, 150, 100)
          ctx.draw(false, () => {
            // 这种方式获取canvas区域隐含的像素数据
            wx.canvasGetImageData({
              canvasId: 'myCanvas',
              x: 0,
              y: 0,
              width: 150,
              height: 100,
              success: res => {
                console.log("隐含的像素数据", res);
                const imageData = res.data
                // 分区块，可以拓展性的求主要色板，用来做palette

                let colorObj = getMainColor(imageData)
                console.log('resImageObj', colorObj)

                const { defaultRGB } = colorObj
                const { r, g, b, a } = defaultRGB;
                const percent = +(a / 255).toFixed(2);
                const endVal = Math.max(50, a - 50);        // 这里减去一个固定的数值，取出渐变的另一个数值，模拟渐变
                const endPercent = +(endVal / 255).toFixed(2);
                // obj.startColor = `rgba(${r}, ${g}, ${b}, ${percent})`
                // obj.endColor = `rgba(${r}, ${g}, ${b}, ${endPercent})`

                resolve({
                  startColor: `rgba(${r}, ${g}, ${b}, ${percent})`, 
                  endColor: `rgba(${r}, ${g}, ${b}, ${endPercent})`, 
                });

                // this.setData({
                //   startColor: `rgba(${r}, ${g}, ${b}, ${percent})`,
                //   endColor: `rgba(${r}, ${g}, ${b}, ${endPercent})`,
                // });
                // let resBackground = `rgb(${r}, ${g}, ${b})`
                // ctx.setFillStyle(resBackground)
                // ctx.fillRect(0, 0, 150, 100)
                // ctx.draw()
              },
            })

            // wx.canvasToTempFilePath({
            //   x: 0,
            //   y: 0,
            //   width: 150,
            //   height: 100,
            //   destWidth: 150,
            //   destHeight: 100,
            //   canvasId: "myCanvas",
            //   success(res) {
            //     let tempPath = res.tempFilePath

            //   },
            //   fail() {
            //     throw new Error()
            //   }
            // })
            // colorArr.push(obj)
            // that.setData({
            //   colorArr
            // })

            // console.log("++++", that.data.colorArr);
          })
        },
        fail: err => {
          console.log(err);
          reject(err)
        }
      });
    });
  },
  // 获取图片临时路径
  getImgPath(img) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: img,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },

  // 长按保存图片
  saveImg(e) {
    console.log("输出了吗?");
    let url = e.currentTarget.dataset.url;
    //用户需要授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              // 同意授权
              this.saveImg1(url);
            },
            fail: (res) => {
              console.log(res);
            }
          })
        } else {
          // 已经授权了
          this.saveImg1(url);
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  saveImg1(url) {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: (res) => {
            console.log(res);
          },
          fail: (res) => {
            console.log(res);
          }
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },


})




