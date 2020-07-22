const app = getApp();

function uploadFile(files, options = {}) {
  if (!Array.isArray(files)) {
    return;
  }

  const { 
    spin = true, 
    title = '正在上传...' 
  } = options;

  spin && wx.showLoading({
    mask: true,
    title,
  });
  // console.log("输出openid了吗", app.data.openId);
  const promises = files.map(item => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.getUrl('UploadAppletImage'),
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: wx.getStorageSync('cookie')
        },
        filePath: item,
        name: 'file',
        formData: {
          openId:wx.getStorageSync('openid'),
          appid: app.globalData.appId,
        },
        success(res) {
          let data = JSON.parse(res.data);
          console.log("上传图片data",data);
          if (data.Status === "OK") {
            let newArr = data.Data.map(item => item.ImageUrl);
            // resolve(data.Data.map(item => item.ImageUrl));
            resolve(data);
          } else {
            reject(data);
          }
          wx.hideLoading();
        },
        fail(err) {
          wx.hideLoading();
          reject(err);
        },
      });
    })
  });

  return Promise.all(promises);
};

export default uploadFile;