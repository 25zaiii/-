// pages/ranklist/ranklist.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    var token = wx.getStorageSync('token')
    var that = this
    this.setData({
      usernickname: userInfo.nickName
    })
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/api/request_get_id',
      data: {
        token: token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          id: res.data.id
        })

        wx.request({
          url: app.globalData.url + '/api/request_leaderboard',
          data: {
            token: token,
            select: 'all'
          },
          success: function (res) {
            wx.hideLoading()
            console.log(res)
            var Arr = {}
            for (var i = 0; i < res.data.results.length; i++) {
              Arr[i] = {}
              Arr[i]['avatarurl'] = res.data.results[i].avatarurl
              Arr[i]['nickname'] = res.data.results[i].nickname
              Arr[i]['ranknum'] = res.data.results[i].ranknum
              Arr[i]['tid'] = res.data.results[i].tid
              Arr[i]['t_completed_number'] = res.data.results[i].t_completed_number

              if (that.data.id == res.data.results[i].tid) {
                that.setData({
                  no: res.data.results[i].ranknum,
                  num: res.data.results[i].t_completed_number
                })
              }
            }
            that.setData({
              user: Arr
            })
          }
        })
      }
    })
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
  toRatingTech: function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})