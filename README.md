
【0】概述：为了提高开发效率，规范化开发标准，3.0+对项目进行模块化，确保日后进行可持续性维护与开发，请大家遵守W3C标准来开发项目，
      新的版本加入了很多便于开发的工具，根据我司项目开发的特点，我们对项目的定位是快，准，稳，既要保证效率，也要有序有标准
      有规划，更要保证代码稳定性，所以新开发的特性大部分集成在了getApp中，以便我们在开发的过程中灵活使用。
【1】规范：身为开发人员，遵循开发规范并写整洁的代码也是实力的一部分，请大家严格遵守W3C标准开发项目。
      -> javascript: 
        1 尽量使用ES6+语法，减少冗余代码，遵循短小精悍守则     
        2 变量 / 常量 / 私有变常量命名
            1 不以动词开头（isNeedBind, isShow）
            2 小写驼峰（goodsDetail, goodsList）
            3 不以大写开头
            4 私有变量必须以双下划线开头（__data，__static）
            5 命名必须语义化（显示一个弹窗：isShowDialog）
        3 方法名必须以动词开头
            demo：
                function handleEdit(){}
                const changeRadio = () => {}
                const getData = async () => {} 
        4 方法
            1 命名必须语义化（获取购物车列表：getCartList）
            2 不允许用简写（handleFn, Fg, getDt），你的代码别人也要维护
            3 不能以大写开头（InitData）
      -> css
        1 命名：
            错误：_coitainer, Container, goods1, aa, a-b, goodsItem
            正确: container, container-list, container__list-item, item-1   
      -> html
        1 使用弹性布局
        2 循环体内不写逻辑判断
            错误：<view wx:for="{{ [0,1,2] }}" wx:if="{{ index === 0}}" />
            正确：<block wx:for="{{ [0,1,2] }}"> <view  wx:if="{{ index === 0}}" /></block>
        3 不写行内样式 
            错误：<view style="width: 100%" />
            正确：<view class="width-100" />
      -> component
            使用:   
                错误：<Action /> <toDo /> <goodsitem>
                正确：<action /> <to-do /> <goods-item />
            定义
                错误：components/sharecode/sharecode.wxml
                正确：components/share-code/share-code.wxml || components/shareCode/shareCode.wxml

      
【2】项目新增目录结构：      
    --apis                  接口存放地址，（user.js, goods.js, agent.js等） 集中在index.js暴露 
    --stores                状态管理库，（user.js...）
    --assets                静态文件存放，（wxss, scss...）
    --subPackageD           使用了状态管理和自定义PAGE的页面参考
    --utils            
        --mixins            方法库混合器
        --store             状态管理
        --tools             工具库
            --alert.js      系统弹窗二次封装
            --cache.js      缓存的二次封装
            --request.js    高级请求方法封装，app.js有详解，这里不赘述，请移步
            --tools.js      常用工具库
            --verify.js     字段校验封装，类似身份证，邮箱，手机等的校验都有
            --wxPage.js     在Page生成之前，我们有机会重新定义一个对象传给Page，这是自定义的方法
        --wxs               提供一些在wxml使用的全局转换方法
    --config.js             配置文件，如domain和appid等都放这里

【3】app聚合库：
    mixin:
        * 修改当前标题
            app.setTitle(String);
        * 查看大图(xx.png,[xx.png,xx.jpg])
            app.previewImage(String, Array) 
        * 封装过的跳转方式，用法类似于vue的router.push
            app.goPage({url: 'page', options: { id: 11, fromType: 2}})  
        * 对象拼接成可供url的哈希值
            app.concatOptions({a: 11, b: 2312})  
    $api：
        声明：
            import $api from "../request";
            bindAgent(data) {
                return $api.request({
                    url: '/API/VshopProcess.ashx?action=BindAgent',
                    data,
                }).then(res => res)
            }, 
        调用：
            app.$api.bindAgent({id: 1}).then(res => {})
        参数：
            *   data: Object | 请求参数
            *   url: String | 后端接口路径,
            *   method: String | 请求方式
            *   hideLoading: Boolean | 请求是否需要loading
            *   header: Object | 传入自定义header
            *   loadingText: String | loading的文案
            *   hideToast: Boolean | 关闭请求后的弹窗
            *   closeDebugger: Boolean | 关闭debugger打印
    alert: 
        loading: app.alert.loading(String)
        toast: app.alert.toast(String)
        success: app.alert.success(String)
        error: app.alert.error(String)
        confirm: app.alert.confirm(Object, callback)  
        message: app.alert.message(String)
        closeLoading: app.alert.closeLoading()
    verify:
        * 普通调用：
            const verifyObj = app.verfiy.idCard(4465416161); 
            verifyObj.verify | 检验结果的布尔值
            verifyObj.error | 默认的弹窗，结果错误时可以调用
            if(verifyObj.verify){ 
                verifyObj.error(); 
            }
        * 校验所有参数
            * 参数...args，检验多少个字段就全部传进来
            * app.verify.verifyAllField(
                app.verify.name('陈静'),
                app.verify.email('2645800@qq.com'),
                app.verify.idCard(440582199607117219)
              ).then(result => {
                    console.log(result 为布尔值,'参数')
              })
        * 请移步到verify.js查看详细使用
    tools: 
        app.tools.setImage(String) | 把后端传给的图片链接进行校验，如果格式不对会自动转为默认图
        app.tools.saveImage(String) | 保存图片到本地，处理了用户拒绝授权的问题
        app.tools.upload() | 可上传多图、多文件格式
        app.tools.goPageTimeOut({ url }, time | required: false) | 延时跳转，用户操作成功或失败后使用
        app.tools.goBackTimeOut(time | required: false)  | 延时返回
        app.tools.scopeAuth() | 权限检验，并重新打开
    cache：
        app.cache.get('cookie', res => {})
        app.cache.set('cookie', data, res => {})
        app.cache.remove('cookie', res => {}))
    wxs：
        <wxs src="../../../utils/wxs/common.wxs" module="common" />
		<image src="{{ common.setImage(imgUrl + 'bg_04@2x.png') }}" />
        <view>订单状态：{{common.transOrderStatus(1)}}</view>
【4】高级request：
    业务逻辑
        1 接口请求之前根据请求方式过滤header
        2 开始检验权限并拦截请求，优先拦截未登录跳转，再拦截未登录而无需调用的接口
        3 请求response拿到后，处理所有异常
            顺序：1 NO_RESPONSE | 无返回值
                  2 NO_LOGIN | 未登录
                  3 IS_WARNNING | 返回值携带错误信息弹出
        4 过滤response返回的无效数据，并转换成前端相对稳定的两个值
            filterData：
                  1 errorMsg | 请求结果提示
                  2 success | 请求结果 t || f 
        5 检查是否需要打印
            打印结果提供了我们调试bug所需的基本参数
    参数用处
        1 解决了重复跳转登录页的问题
        2 如果未登录，且当前页面有N个接口调用，那么只要有一个需要登录，执行顺序次之的接口将被拦截
        3 兼容了后端多个版本的返回结果处理，如果发现新的，欢迎到tools/request.js加入
        4 正常的请求调用，结果处理
        5 console定位，没调用一个接口在打印台可以看到常用的信息，以便后端，测试人员也能定位bug
        6 集中处理了后端返回的状态值，{ errorMsg: "请求成功" success: true }
        7 使用：app.$api.getList().then(res => {})

【5】状态管理机$store：
    * 说明：状态管理机是在页面onload的时候将变量注入到data里，后面调用状态管理的文件只会执行setData，
            而不会给变量赋值；
      例如：         
            执行js
                pointStore.changeDetailList([1,2,3]) 
            结果 
                view层的detailList =  [1,2,3]
                js逻辑层的detailList = [];

            执行js
                this.data.detailList = [12,3,4];
                pointStore.changeDetailList([1,2,3]) 
            结果 
                view层的detailList = [1,2,3]
                js逻辑层的detailList = [12,3,4] ;
      所以：如果要保证逻辑层的detailList和视图层的一致，那就需要两者赋同样的值
      备注：（【详细案例】可以在/subPackageC/testDemo/index预览）

    * api：
        1 app.$store：
            这个api暴露了所有的$store，并集中管理，可以直接调用其方法属性

            例如：app.$store.demo.update({a: 1})
        2 app.$page：
            状态管理的连接方式只有一个，就是通过此api，加入固定属性state就
            能够直接将store里属性与this.data链接

            例如：Page(app.$page({
                state: {
                    demo: ['xxx', xxx] // 注意，必须是字符串
                }
            }))
    * demo目录结构：
        --stores
            --demo.js // 存储store
            --index.js // 暴露demoStore
        --pages // 普通页面
            --demo
                --demo.js 
                --demo.wxml
    * 实际使用：
        1 ./stores文件夹中创建一个demo.js（file: stores/demo.js）
            <file>
                import { observe } from '../utils/store/index'
                const app = getApp()
                class DemoStore {
                    constructor() {
                        this.detailList = [];
                        this.point = 0;
                    }
                   /* 通用修改值的方法 */
                    update(obj) {
                        Object.keys(obj).forEach(key => {
                            this[key] = obj[key]
                        })
                    }
                   ...todo
                }
                * 第二个参数'user'会将当前store的所有内部变量绑定在全局变量的user属性上
                * 如果第二个参数没有写，会默认使用该class名字的全小写

                export default observe(new DemoStore(), 'demo')
            </file>

        2./pages/demo/demo.js 使用connect（file: pages/demo/demo.js）
            <file>
                const app = getApp();

                Page(app.$page({
                    state: {
                        /* demo 对应的是app.$store.demo  数组中的值则是app.$store.demo的属性*/
                        demo: ['detailList', 'point']
                    }
                    methods: {
                        handleEdit(){
                            /* 修改state值的 api */
                            app.$store.demo.update({
                                detailList: [12,41],
                                point: 2123
                            })
                        }
                    }
                }))
            </file>
        4 ./pages/demo/demo.wxml wxml使用跟平时在data里面定义变量无异
            <block wx:for="{{detailList}}" wx:key="index">
                <view calss="demo">{{item.name + point}}</view>
            </block>
            
    * 组件使用$store
        注意：组件没有办法像Page一样使用app.$page，但是尽管如此，但是我们可以通过在父组件获取到state的属性，传入子组件
              这样，我们就可以通过app.$store.xx.fn更新值，无需再与父组件进行通讯，就能简单的修改$store的值
              
        使用：通过父组件将状态
            
            父组件：
                <v-test wallet="{{wallet}}" />
                <father.js>
                    state: {
                            user: ['wallet'],
                            cart: ['goodsCount']
                        },
                </father.js>
            子组件：
                <component.js>
                    const app = getApp();
                    Component({
                        properties: {
                            wallet: {
                                type: Number,
                                value: 0
                            }
                        },
                        methods: {
                            lost() {
                            if (this.data.wallet < 3) {
                                return app.alert.message('你没钱了')
                            }
                            app.$store.user.update({
                                wallet: this.data.wallet - 3
                            })
                            },

                        }
                    })
                </component.js>
【6】app.$page:
        说明：在我们创建page之前，我们有机会对page进行全局更改，由于小程序的限制，有些功能我们只能通过特定的方法去调用
              所以如果要做到全局，必须在page生成之前进行对象重构，我们将通过$page强行改造成适用于我们业务范围的结构。
        
【7】wxss类库：
        说明：wxss类库可以帮助你快速为页面布局，该类库已在app.wxss引入，可在任意页面随意使用
        例子：
            <view class="wrap flex-center padding-30 margin-t-30 margin-b-40">
                <view class="item flex-col-1 text-center">左边<view>
                <view class="item flex-col-1 text-center">右边<view>
            </view>
            <view class="flex col-xs-12">
                <view class="item col-xs-4 text-left">左<view>
                <view class="item col-xs-4 text-center">中<view>
                <view class="item col-xs-4 text-right">右<view>
            </view>
【8】scss类库：
        说明：提供一些minxin方法，如果使用less请再创建文件夹并将scss文件拷贝过去



小程序问题：
    1 打开体验版小程序时必须打开调试模式
    2 
    

    
            
            
