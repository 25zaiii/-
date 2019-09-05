// pages/authentication/authentication.js
const app = getApp()
var interval = null //倒计时函数
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: 0,
    code: 0,
    correctCode: 0,
    tip: "获取验证码",
    currentTime: 61, //倒计时
    //oldtime: 0,
    newtime: 0,
    invisibility: false,
    currentTel: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.page == "account" || options.page == "pcrepair_content"){
      this.setData({
        invisibility: true,
        currentTel: options.telnumber
      })
    }
  },
  authenNow: function(e) { //确认
    var code = this.data.code
    var correctCode = this.data.correctCode
    var tel = this.data.tel
    var currentTel = this.data.currentTel

    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; //正则表达式
    if (tel == "") {
      wx.showToast({
        title: '手机号不能为空',
        mask: true,
        icon: "none"
      })
      return false
    }
    if (tel.length != 11) {
      wx.showToast({
        title: '手机号长度有误',
        mask: true,
        icon: "none"
      })
      return false
    }
    if (!phonetel.test(tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        mask: true,
        icon: "none"
      })
      return false
    }
    if(currentTel != 0 && currentTel == tel){
      wx.showToast({
        title: '当前手机号已认证',
        mask: true,
        icon: "none"
      })
      return false
    }
    if (code == "") {
      wx.showToast({
        title: '请输入验证码',
        mask: true,
        icon: "none"
      })
      return false
    }
    // if (code.length != 6) {
    //   wx.showToast({
    //     title: '验证码长度有误',
    //     mask: true,
    //     icon: "none"
    //   })
    //   return false
    // }
    wx.showLoading({
      title: '正在验证',
      mask: true
    })

    if (code == correctCode) {
      var newtime = Date.now()
      var oldtime = wx.getStorageSync("oldtime")
      var time = (newtime - oldtime) / 1000
      if (time <= 300) { //5分钟内
        var token = wx.getStorageSync("token")
        wx.request({
          url: app.globalData.url + '/api/request_update_telnumber',
          data: {
            token: token,
            telnumber: tel
          },
          success: function(res) {
            // console.log(res)
            wx.hideLoading()
            if (res.data.results == "更新号码成功") {
              wx.showToast({
                title: '验证成功',
                mask: true
              })
              app.globalData.tel_status = 1
              setTimeout(function() {
                wx.reLaunch({
                  url: '../index/index',
                })
              }, 1500)
            }
          }
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '超过5分钟，请重新获取验证码',
          mask: true,
          icon: "none"
        })
      }
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '验证码有误',
        mask: true,
        icon: "none"
      })
    }
  },
  authenAfter: function(e) { //稍后认证
    wx.reLaunch({
      url: '../index/index',
    })
  },
  sendCode: function(e) { //获取验证码
    var that = this
    var currentTime = that.data.currentTime
    var tel = that.data.tel
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; //正则表达式
    var currentTel = this.data.currentTel

    if (tel == "") {
      wx.showToast({
        title: '手机号不能为空',
        mask: true,
        icon: "none"
      })
      return false
    }
    if (tel.length != 11) {
      wx.showToast({
        title: '手机号长度有误',
        mask: true,
        icon: "none"
      })
      return false
    }
    if (!phonetel.test(tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        mask: true,
        icon: "none"
      })
      return false
    }
    if (currentTel != 0 && currentTel == tel) {
      wx.showToast({
        title: '当前手机号已认证',
        mask: true,
        icon: "none"
      })
      return false
    }
    var token = wx.getStorageSync("token")
    wx.showLoading({
      title: '正在获取验证码',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/api/request_sms_verification',
      data: {
        token: token,
        phonenumber: tel
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '验证码已发送',
          mask: true,
          icon: "none"
        })

        wx.setStorageSync("oldtime", Date.now())
        that.setData({
          //oldtime: Date.now(),
          correctCode: res.data.results,
          disabled: true
        })
        interval = setInterval(function() { //定时函数
          currentTime--
          that.setData({
            tip: currentTime + "秒"
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              tip: '重新发送',
              currentTime: 61,
              disabled: false
            })
          }
        }, 1000)
      }
    })
  },
  bindinput1: function(e) { //电话输入
    this.setData({
      tel: e.detail.value
    })
  },
  bindinput2: function(e) { //验证码输入
    this.setData({
      code: e.detail.value
    })
  },
})