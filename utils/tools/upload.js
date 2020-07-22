/*
   * 文件上传
   * 支持多文件数量,格式上传
   使用:
    upload({
      count: 9,
      url: '/AppShop/AppShopHandler.ashx?action=AppUploadImage',
    }).then(res => {
      ...todo
    })
    参数:
   * options: {
   *  url: String | api接口 | /AppShop/AppShopHandler.ashx?action=AppUploadImage
   *  name: String | 上传文件的关键词 | 'file'
   *  count: Number | 选择文件的数量
   *  formData: Object | form-data | {}
   *  type: String | 上传文件类型 | ["all", "video", "image", "file"]
   *  header: Object | 自定义header
   *  editResult: Boolean | 如果为true则返回后端请求结果,反之则以数组格式返回图片路径
   *  minSize: Number | 最小图片字节 1024 = 1kb
   *  maxSize: Number | 最大图片字节 1024 = 1kb
   * } 
   */
export default async (options) => {
    const app = getApp(),
        {
            url,
            name = "file",
            count = 1,
            formData = {},
            type = "image",
            eidtResult = false,
            minSize = 1024 * 20, // 20kb
            maxSize = 1024 * 1024 * 10, // 10mb
            header = {
                "content-type": "multipart/form-data",
            },
        } = options;


    /* 参数校验 */
    if (!url && typeof url !== "string" && url[0] !== "/") {
        return app.alert.message("错误URL");
    }

    if (
        typeof type !== "string" ||
        !["all", "video", "image", "file"].includes(type)
    ) {
        return app.alert.message("错误TYPE");
    }

    /* 根据传入type选择上传文件类型 */
    const choose = () => {
        return new Promise((resolve) => {
            wx.chooseMessageFile({
                type,
                count,
                success(file) {
                    const tempFiles = file.tempFiles;
                    const filterFiles = []; // 过滤不符合规格的文件
                    const fileList = tempFiles.filter(f => {
                        if (f.size < maxSize && f.size > minSize) {
                            return f
                        } else {
                            filterFiles.push(f.name)
                        }
                    })

                    // 输出符合规格的文件
                    const outPut = {
                        filePaths: fileList.map((f) => f.path),
                        fileList,
                    };

                    // 如果有不符合规格的文件,提示用户
                    if (filterFiles.length) {
                        app.alert.confirm({
                            content: `以下文件规格不符合系统要求,将无法上传:\n ${ filterFiles.join(';')}`,
                            showCancel: false,
                        }, () => {
                            resolve(outPut);
                        })
                    } else {
                        resolve(outPut);
                    }
                },
            });
        });
    };

    /* 上传文件到服务器 */
    const $upload = (target) => {
        const {
            fileList
        } = target;

        // 把promise存成数组,统一调用
        const uploaders = fileList.map(file =>
            new Promise(resolve => {
                // 上传文件的所有参数
                const params = {
                    header,
                    name,
                    formData,
                    filePath: file.path,
                    url: app.data.url + url,
                    complete(response) {
                        console.log(response)
                        app.alert.closeLoading();

                        /* 微信服务端返回包装结果 */
                        if (response.errMsg !== "uploadFile:ok" || response.statusCode !== 200) {
                            app.alert.message("文件上传失败");
                        }

                        /* 服务器返回错误结果处理 */
                        try {
                            JSON.parse(response.data);
                        } catch (error) {
                            console.log(response)
                            app.alert.message(response.data);
                        }

                        // 确认后端返回的data是一个可用对象
                        const res = JSON.parse(response.data);

                        // 传入此参数会接受一个相当于callback
                        if (eidtResult) {
                            resolve(res)
                        }

                        if (!res.Result) {
                            app.alert.message(res.errorMsg);
                        } else {
                            resolve(res.Result.ImageURL);
                        }
                    },
                };

                // 执行服务器上传
                const uploadTask = wx.uploadFile({
                    ...params,
                })

                // 输出上传进度
                uploadTask.onProgressUpdate(res => {
                    app.alert.loading("上传中..." + res.progress + "%");
                })
            }))

        return Promise.all(uploaders);
    };

    /* 执行选择文件并上传到服务器，拿取结果 */
    return await choose().then((res) => $upload(res));
};