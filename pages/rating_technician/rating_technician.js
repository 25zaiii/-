// pages/rating_technician/rating_technician.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rating: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var tid = e.tid

    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: app.globalData.url +'/api/request_order_completed_comments_t',
      data: {
        token: token,
        tid: tid
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading()
        var Arr = {}
        for( var i = 0; i < res.data.results.length; i++){
          Arr[i] = {}
          Arr[i]['avatarurl'] = res.data.results[i].avatarurl
          Arr[i]['nickname'] = res.data.results[i].nickname
          Arr[i]['comment_time'] = res.data.results[i].comment_time
          Arr[i]['comment'] = res.data.results[i].comment
          Arr[i]['reply'] = res.data.results[i].reply
        }
        that.setData({
          rating: Arr
        })
      }
    })
  }
})