// pages/account/account.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasModify: false,
    telnumber: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var token = wx.getStorageSync("token")
    var userInfo = wx.getStorageSync('userInfo')
    var create_time = wx.getStorageSync('create_time')
    var gender = ''
    var province = ''
    var city = ''

    switch (userInfo.gender) {
      case 0:
        gender = '未设置'
        break
      case 1:
        gender = '男'
        break
      case 2:
        gender = '女'
        break
    }

    if (userInfo.province) {
      province = userInfo.province
    } else {
      province = '未设置'
    }
    if (userInfo.city) {
      city = userInfo.province
    } else {
      city = '未设置'
    }
    that.setData({
      nickname: userInfo.nickName,
      gender: gender,
      province: province,
      city: city,
      create_time: create_time
    })
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/api/request_get_telnumber',
      data: {
        token: token
      },
      success: function(res) {
        //console.log(res)
        wx.hideLoading()
        if(res.data.results[0].telnumber){
          that.setData({
            telnumber: res.data.results[0].telnumber
          })
        }
      }
    })  
  },
  toAuthen: function(e) {
    var telnumber = this.data.telnumber
    wx.navigateTo({
      url: '../authentication/authentication?page=account&telnumber=' + telnumber,
    })
  }
})