// pages/mine/mine.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    refreshPage: false // 是否刷新页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this
    var userInfo = wx.getStorageSync('userInfo')
    var token = wx.getStorageSync('token')

    // wx.showLoading({
    //   title: '正在加载',
    //   mask: true
    // })
    if (userInfo) {
      that.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    } else {
      wx.getUserInfo({
        success: res => {
          wx.setStorageSync('userInfo', res.userInfo)
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.request({
      url: app.globalData.url + '/api/request_get_sr_status',
      data: {
        token: token
      },
      success: function(res) {
        // wx.hideLoading()
        if (res.data.results != null) {
          that.setData({
            reply_status: res.data.results
          })
        }   
      }
    })
  },
  onShow: function () {
    var that = this
    var refreshPage = that.data.refreshPage
    that.onLoad()
    // if (refreshPage) {
    //   wx.showLoading({
    //     title: '正在加载',
    //     mask: true
    //   })
    //   wx.request({
    //     url: app.globalData.url + '/api/request_get_sr_status',
    //     data: {
    //       token: that.data.token
    //     },
    //     success: function (res) {
    //       wx.hideLoading()
    //       if (res.data.results != null) {
    //         that.setData({
    //           reply_status: res.data.results
    //         })
    //       }
    //     }
    //   })
    //   that.setData({
    //     refreshPage: false
    //   })
    // }
  },

  toAccount: function(e){
    wx.navigateTo({
      url: '../account/account',
    })
  },
  toAssess: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})