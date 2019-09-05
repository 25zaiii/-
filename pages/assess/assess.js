// pages/assess/assess.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: [{
        name: '我的建议'
      },
      {
        name: '所有建议'
      }
    ],
    currentNavbar: '我的建议',
    txt_length: 0,
    hiddenModal: true,
    txt: '',
    token: '',
    reply_status: -1
  },
  /**
   * 切换导航栏
   */
  switchNavbar: function(e) {
    var that = this

    that.setData({
      currentNavbar: e.currentTarget.dataset.name,
    })

    if (that.data.currentNavbar == that.data.navbar[0].name) {
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      wx.request({
        url: app.globalData.url + '/api/request_weapp_my_feedback_reply',
        data: {
          token: that.data.token
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res)

          var Arr = {}
          for (var i = 0; i < res.data.results.length; i++) {
            Arr[i] = {}
            Arr[i]['creat_time'] = res.data.results[i].creat_time
            Arr[i]['feedback'] = res.data.results[i].feedback
            Arr[i]['reply'] = res.data.results[i].reply
            Arr[i]['wfid'] = res.data.results[i].wfid
          }
          that.setData({
            rating: Arr
          })
        }
      })
    } else if (that.data.currentNavbar == that.data.navbar[1].name) {
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      wx.request({
        url: app.globalData.url + '/api/request_weapp_feedback_reply',
        data: {
          token: that.data.token
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res)

          var Arr = {}
          for (var i = 0; i < res.data.results.length; i++) {
            Arr[i] = {}
            Arr[i]['avatarurl'] = res.data.results[i].avatarurl
            Arr[i]['uort'] = res.data.results[i].uort
            Arr[i]['nickname'] = res.data.results[i].nickname
            Arr[i]['creat_time'] = res.data.results[i].creat_time
            Arr[i]['feedback'] = res.data.results[i].feedback
            Arr[i]['reply'] = res.data.results[i].reply
            Arr[i]['wfid'] = res.data.results[i].wfid
          }
          that.setData({
            rating: Arr
          })
        }
      })
    }
  },
  /**
   * 点击浮动按钮，弹出输入框
   */
  showModal: function(e) {
    this.setData({
      hiddenModal: false
    })
  },
  /**
   * 提交
   */
  modelconfirm: function(e) {
    var that = this
    var txt = that.data.txt

    if (txt) {
      wx.showLoading({
        title: '正在提交',
        mask: true
      })
      wx.request({
        url: app.globalData.url + '/api/request_feedback_to_weapp_t',
        data: {
          token: that.data.token,
          content: txt
        },
        success: function(res) {
          wx.hideLoading()
          if (res.data.results == "建议成功") {
            wx.showToast({
              title: '提交成功',
              mask: true,
              success: function() {
                setTimeout(function() {
                  that.refreshMyAssess()
                }, 1500)
              }
            })
          } else {
            wx.showToast({
              title: '提交失败',
              mask: true,
              success: function() {
                setTimeout(function() {
                  that.refreshMyAssess()
                }, 1500)
              }
            })
          }
        }
      })
      that.setData({
        txt: '',
        hiddenModal: true
      })
    } else {
      wx.showToast({
        title: '请输入内容',
        mask: true,
        icon: 'none'
      })
    }
  },
  /**
   * 取消
   */
  modelcancel: function(e) {
    this.setData({
      txt: '',
      hiddenModal: true
    })
  },

  /**
   * 文本框字数限制
   */
  bindText: function(e) {
    var text = e.detail.value;
    this.setData({
      txt_length: text.length,
      txt: text
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var token = wx.getStorageSync('token')
    var reply_status = options.reply_status
    /**
     * 动态设置滚动窗高度
     */
    let windowHeight = wx.getSystemInfoSync().windowHeight //屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth //屏幕的宽度

    that.setData({
      token: token,
      scroll_height: windowHeight * 750 / windowWidth - 100,
      reply_status: reply_status
    })
    wx.showLoading({
      title: '正在加载',
      mask: true
    })

    if (reply_status == 1) {
      wx.request({
        url: app.globalData.url + '/api/request_modify_sr_status',
        data: {
          token: token
        },
        success: function(res) {
          if (res.data.results == "我的建议已读/未读回复状态提交成功") {
            /**
             * 更新上级页面的参数
             */
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            prevPage.setData({
              refreshPage: true
            })
          }
        }
      })
    }

    wx.request({
      url: app.globalData.url + '/api/request_weapp_my_feedback_reply',
      data: {
        token: that.data.token
      },
      success: function(res) {
        wx.hideLoading()

        var Arr = {}
        for (var i = 0; i < res.data.results.length; i++) {
          Arr[i] = {}
          Arr[i]['creat_time'] = res.data.results[i].creat_time
          Arr[i]['feedback'] = res.data.results[i].feedback
          Arr[i]['reply'] = res.data.results[i].reply
          Arr[i]['wfid'] = res.data.results[i].wfid
        }
        that.setData({
          rating: Arr
        })
      }
    })
  },
  refreshMyAssess: function () {
    var that = this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    if(that.data.reply_status == 1){
      that.setData({
        reply_status: -1
      })
    }
    wx.request({
      url: app.globalData.url + '/api/request_weapp_my_feedback_reply',
      data: {
        token: that.data.token
      },
      success: function (res) {
        wx.hideLoading()

        var Arr = {}
        for (var i = 0; i < res.data.results.length; i++) {
          Arr[i] = {}
          Arr[i]['creat_time'] = res.data.results[i].creat_time
          Arr[i]['feedback'] = res.data.results[i].feedback
          Arr[i]['reply'] = res.data.results[i].reply
          Arr[i]['wfid'] = res.data.results[i].wfid
        }
        that.setData({
          rating: Arr
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    wx.showNavigationBarLoading()

    if (that.data.reply_status == 1) {
      that.setData({
        reply_status: -1
      })
    }
    
    if (that.data.currentNavbar == that.data.navbar[1].name) {
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      wx.request({
        url: app.globalData.url + '/api/request_weapp_feedback_reply',
        data: {
          token: that.data.token
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res)

          var Arr = {}
          for (var i = 0; i < res.data.results.length; i++) {
            Arr[i] = {}
            Arr[i]['avatarurl'] = res.data.results[i].avatarurl
            Arr[i]['uort'] = res.data.results[i].uort
            Arr[i]['nickname'] = res.data.results[i].nickname
            Arr[i]['creat_time'] = res.data.results[i].creat_time
            Arr[i]['feedback'] = res.data.results[i].feedback
            Arr[i]['reply'] = res.data.results[i].reply
            Arr[i]['wfid'] = res.data.results[i].wfid
          }
          that.setData({
            rating: Arr
          })
        }
      })
    }
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  deleteAssess: function(e) {
    var wfid = e.currentTarget.dataset.wfid
    var that = this
    wx.showModal({
      title: '确认',
      content: '确定删除?',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
            mask: true
          })
          wx.request({
            url: app.globalData.url + '/api/request_delete_myfeedback',
            data: {
              token: that.data.token,
              wfid: wfid
            },
            success: function(res) {
              wx.hideLoading()
              console.log(res)
              if (res.data.results == "删除我的建议成功    删除对应回复成功") {
                wx.showToast({
                  title: '删除成功',
                  mask: true,
                  success: function() {
                    setTimeout(function() {
                      that.refreshMyAssess()
                    }, 1500)
                  }
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  mask: true
                })
              }
            }
          })
        }
      }
    })
  }

})