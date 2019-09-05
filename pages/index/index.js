//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imageUrls:[
      'https://www.xujc.com/uploads2/img/2017/06/01/2017060113403072.jpg',
      'https://www.xujc.com/uploads2/img/2017/06/01/2017060113401940.jpg',
      'https://www.xujc.com/uploads2/img/2017/06/01/2017060113409087.jpg'
    ],
    msg: "\xa0\xa0\xa0\xa0电脑义诊小程序马上要上线啦！！！！！！",
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640'
    ],
    indicatordots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    icon:[
      {
        imgurl: '../../images/index/icon1.png',
        name: '电脑义诊',
        url: '../pcrepair/pcrepair?name=订单查询'
      },
      {
        imgurl: '../../images/index/icon2.png',
        name: '学习互助',
        url: '../test/test'
      },
      {
        imgurl: '../../images/index/icon3.png',
        name: '资源共享',
        url: '../test/test'
      }
    ],
    active: 0
  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var uid = wx.getStorageSync('id')
    that.setData({
      uid: uid
    })
    if(uid == 0){
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      wx.request({
        url: app.globalData.url + '/api/request_hostpage_orderinfo',
        data: {
          token: token
        },
        success: function (res) {
          that.setData({
            acceptNum: res.data.results[0].t_accepted_number,
            cancelNum: res.data.results[0].order_all_cancellations_number,
            dealNum: res.data.results[0].t_completed_number
          })
        }
      }),
        wx.request({
          url: app.globalData.url + '/api/request_leaderboard',
          data: {
            token: token,
            select: 'three'
          },
          success: function (res) {
            wx.hideLoading()

            var Arr = {}
            for (var i = 0; i < res.data.results.length; i++) {
              Arr[i] = {}
              Arr[i]['avatarurl'] = res.data.results[i].avatarurl
              Arr[i]['nickname'] = res.data.results[i].nickname
              Arr[i]['ranknum'] = res.data.results[i].ranknum
              Arr[i]['tid'] = res.data.results[i].tid
              Arr[i]['t_completed_number'] = res.data.results[i].t_completed_number
            }
            that.setData({
              rank: Arr
            })
          }
        })
    }
  },
  onShow: function(e) {
    this.onLoad()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading();
    that.onLoad()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();// 停止下拉动作
  },
  /**
   * 跳转页面
   */
  toTap(e) {
    //console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  toOrderSearch :function(){
    wx.navigateTo({
      url: '../pcrepair/pcrepair',
    })
  },
  toOrderDealing :function(){
    wx.navigateTo({
      url: '../pcrepair/pcrepair?name=正在处理',
    })
  },
  toOrderFinish :function(){
    wx.navigateTo({
      url: '../pcrepair/pcrepair?name=处理完成',
    })
  },
  toRankList: function () {
    wx.navigateTo({
      url: '../ranklist/ranklist',
    })
  },
  toRatingTech: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  // 普通用户
  /**
   * 跳转至个人订单
   */
  myorder: function () {
    //console.log("点击成功")
    wx.navigateTo({
      url: '../pcrepair_user/pcrepair_user'
    })
  },
  /**
   * 跳转至创建订单
   */
  order: function () {
    console.log(app.globalData.tel_status)
    if (app.globalData.tel_status == 0) {
      wx.navigateTo({
        url: '../../pages/authentication/authentication'
      })
    }
    else {
      wx.navigateTo({
        url: '../../pages/order_user/order_user'
      })
    }
  },
  /**
   * 按钮触发事件
   */
  repair: function () {
    //console.log("点击成功")
    wx.navigateTo({
      url: '../../pages/repair_user/repair_user'
    })
  }
})
