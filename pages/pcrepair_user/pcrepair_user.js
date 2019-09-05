//search.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //第一个导航条的内容
    navbar_up:[
      {
        key: 0,
        name: '等待接单',
      },
      {
        key: 1,
        name: '正在处理',
      },
      {
        key: 23,
        name: '处理完成',
      }
    ],
    //第二个导航条的内容
    navbar_down: [
      {
        key: 'all',
        name: '全部'
      },
      {
        key: 'cs',
        name: '类别2'
      },
      {
        key: 2,
        name: '类别3'
      },
      {
        key: 3,
        name: '类别4'
      },
      {
        key: 4,
        name: '类别5'
      },
      {
        key: 5,
        name: '类别6'
      }
    ],
    currentNavbar_up: 0,//默认激活的页面
    currentNavbar_down: 'all',//默认激活的页面

    page: 1,//当前页码
    next: true, //是否有下一页
    scroll_height: 0,
    refreshPage: false,
    order: []
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    /**
     * 动态设置滚动窗高度
     */
    let windowHeight = wx.getSystemInfoSync().windowHeight //屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth //屏幕的宽度
    var that = this
    that.setData({
      onReachBottom: false,
      scroll_height: windowHeight * 750 / windowWidth -100,
    })

    that.Order(that.data.currentNavbar_up,that.data.currentNavbar_down)
    console.log(that.data.currentNavbar_up)
    console.log(that.data.currentNavbar_down)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var refreshPage = that.data.refreshPage
    if(refreshPage)
    {
      that.Order(that.data.currentNavbar_up, that.data.currentNavbar_down)

      that.setData({
        refreshPage: false
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading();
    that.Order(that.data.currentNavbar_up, that.data.currentNavbar_down)
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();// 停止下拉动作
  },
  /**
   * 封装类，加载不同状态和类别的订单
   */
  Order:function(status,type){
    var that=this
    var token = wx.getStorageSync('token')
    console.log(token)
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/api/request_orderpage_orderinfo_u',
      data: {
        token: token,
        o_type: type,
        o_status: status
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var Arr = {}
        for (var i = 0; i < res.data.results.length; i++) {
          Arr[i] = {}
          Arr[i]['avatarurl'] = res.data.results[i].avatarurl
          Arr[i]['nickname'] = res.data.results[i].nickname
          Arr[i]['roid'] = res.data.results[i].roid
          Arr[i]['creat_time'] = res.data.results[i].creat_time
          Arr[i]['o_status'] = res.data.results[i].o_status
          Arr[i]['c_status'] = res.data.results[i].c_status
          Arr[i]['r_status']=res.data.results[i].r_status
          Arr[i]['o_type'] = res.data.results[i].o_type
          Arr[i]['content'] = res.data.results[i].content20
          if (res.data.results[i].image_url != "") {
            Arr[i]['imageurl'] = JSON.parse(res.data.results[i].image_url)
            Arr[i]['classname'] = "order"
          } else {
            Arr[i]['imageurl'] = res.data.results[i].image_url
            Arr[i]['classname'] = "order1"
          }     
        }
        console.log(Arr)
        that.setData({
          order: Arr
        })
        
      }
    })
  },
  /**
   * 切换导航栏选项卡
   */
  switchNavbar_up: function(e){
    var that=this
    that.setData({
      currentNavbar_up: e.currentTarget.dataset.key
    })

    that.Order(that.data.currentNavbar_up, that.data.currentNavbar_down)
    /*
    wx.redirectTo({
      url: e.currentTarget.dataset.url
    })
    */
  },
  /**
   * 切换分类选项卡
   */
  switchNavbar_down: function (e) {
    var that = this
    that.setData({
      currentNavbar_down: e.currentTarget.dataset.key,
    })

    that.Order(that.data.currentNavbar_up, that.data.currentNavbar_down)
  },

  /**
   * 跳转页面
   */
  toContent(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /**
   * 跳转至用户评价
   */
  toRating(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /**
   * 点击图片预览
   */
  previewImg: function (e) {
    var src = e.currentTarget.dataset.src;
    var imgurls = this.data.order[e.currentTarget.dataset.bindex].imageurl;

    wx.previewImage({
      current: src,
      urls: imgurls,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  onUnload: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
})