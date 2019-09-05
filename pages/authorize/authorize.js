// pages/authorize/authorize.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasNoAuthorize: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var token = wx.getStorageSync('token')
    var userInfo = wx.getStorageSync('userInfo')

    var that = this
    //检查用户登录态
    if (token) {
      wx.showLoading({
        title: '正在登录',
      })
      wx.getUserInfo({
        success: e => {
          if (JSON.stringify(userInfo) !== JSON.stringify(e.userInfo)) {
            console.log('不相等')

            wx.request({
              url: app.globalData.url + '/api/request_userinfo_update',
              data: {
                token: token,
                nickname: e.userInfo.nickName,
                avatarurl: e.userInfo.avatarUrl,
                gender: e.userInfo.gender,
                city: e.userInfo.city,
                province: e.userInfo.province
              },
              success: function(res) {
                wx.setStorageSync('userInfo', e.userInfo)
              }
            })
          } else {
            console.log('相等')
          }

          // wx.login({
          //   success: res => {
          //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
          //     if (res.code) {
          //       wx.request({
          //         url: app.globalData.url + '/api/request_j_login',
          //         data: {
          //           code: res.code,
          //           nickname: e.userInfo.nickName,
          //           avatarurl: e.userInfo.avatarUrl,
          //           gender: e.userInfo.gender,
          //           city: e.userInfo.city,
          //           province: e.userInfo.province
          //         },
          //         success: function(res) {
          //           wx.hideLoading()

          //           console.log(res)
          //           if (res.data.token == null) {
          //             wx.showToast({
          //               title: '登录失败',
          //               mask: true,
          //               icon: 'none'
          //             })
          //           } else {
          //             wx.setStorageSync('token', res.data.token)
          //             wx.setStorageSync('id', res.data.id)
          //             wx.reLaunch({
          //               url: '../index/index',
          //             })
          //           }
          //         }
          //       })
          //     }
          //   }
          // })
        }
      })

      wx.checkSession({
        success() {
          // console.log("session_key未过期")
          //session_key 未过期，并且在本生命周期一直有效
          wx.request({
            url: app.globalData.url + '/api/request_get_identity_tel_status',
            data: {
              token: token
            },
            success: function(res) {
              //wx.setStorageSync('id', res.data.id)
              wx.hideLoading()
              if (res.data) {
                app.globalData.tel_status = res.data.tel_status
                //console.log("tel_status:"+res.data.tel_status)
                if (res.data.tel_status == 0) {
                  wx.reLaunch({
                    url: '../authentication/authentication',
                  })
                } else if (res.data.tel_status == 1) {
                  if (res.data.id == 0) { //技术员身份
                    wx.reLaunch({
                      url: '../index/index',
                    })
                  } else {
                    wx.reLaunch({
                      url: '../index/index',
                    })
                  }
                }
              }
            }
          })

        },
        fail() {
          console.log("session_key过期")
          //session_key 过期，重新登录
          wx.showLoading({
            title: '正在登录',
          })
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (res.code) {
                //发起网络请求
                //console.log(res.code)
                wx.getUserInfo({
                  success: e => {
                    wx.setStorageSync('userInfo', e.userInfo)

                    wx.request({
                      url: app.globalData.url + '/api/request_j_login',
                      data: {
                        code: res.code,
                        city: e.userInfo.city,
                        province: e.userInfo.province,
                        gender: e.userInfo.gender,
                        avatarurl: e.userInfo.avatarUrl,
                        nickname: e.userInfo.nickName
                      },
                      success: function(res) {
                        wx.hideLoading()
                        if (res.data.token == null) {
                          console.log("登录失败")
                        } else {
                          wx.setStorageSync('create_time', res.data.create_time)
                          wx.setStorageSync('token', res.data.token)
                          wx.setStorageSync('id', res.data.id)
                          app.globalData.tel_status = res.data.tel_status

                          if (res.data.tel_status == 0) {       //未认证电话号码
                            wx.reLaunch({                       //跳转至认证页面
                              url: '../authentication/authentication',  
                            })
                          } else if (res.data.tel_status == 1) {    //已认证号码
                            if (res.data.id == 0) { //技术员身份
                              wx.reLaunch({
                                url: '../index/index',
                              })
                            } else {
                              wx.reLaunch({
                                url: '../index/index',
                              })
                            }
                          }
                        }
                      }
                    })
                  }
                })
              } else {
                console.log("登陆失败！" + res.errMsg)
              }
            }
          })
        }
      })
    } else {
      console.log('未授权')
      that.setData({
        hasNoAuthorize: true
      })
    }
  },
  /**
   * 授权，获取用户信息
   */
  getuserinfo: function(e) {
    var that = this
    // 获取用户信息
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      wx.showLoading({
        title: '正在登录',
      })
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发起网络请求
            // console.log(res.code)
            wx.request({
              url: app.globalData.url + '/api/request_j_login',
              data: {
                code: res.code,
                city: e.detail.userInfo.city,
                province: e.detail.userInfo.province,
                gender: e.detail.userInfo.gender,
                avatarurl: e.detail.userInfo.avatarUrl,
                nickname: e.detail.userInfo.nickName
              },
              success: function(res) {
                wx.hideLoading()
                console.log(res)
                if (res.data.token == null) {
                  wx.showToast({
                    title: '登录失败',
                    mask: true,
                    icon: 'none'
                  })
                } else {
                  wx.setStorageSync('create_time', res.data.create_time)
                  wx.setStorageSync('token', res.data.token)
                  wx.setStorageSync('id', res.data.id)
                  app.globalData.tel_status = res.data.tel_status

                  if (res.data.tel_status == 0) {       //未认证电话号码
                    wx.reLaunch({
                      url: '../authentication/authentication',
                    })
                  } else if (res.data.tel_status == 1) {    //已认证号码
                    if (res.data.id == 0) { //技术员身份
                      wx.reLaunch({
                        url: '../index/index',
                      })
                    } else {
                      wx.reLaunch({
                        url: '../index/index',
                      })
                    }
                  }
                }
              }
            })
          } else {
            console.log("登陆失败！" + res.errMsg)
          }
        }
      })
    }
  }
})