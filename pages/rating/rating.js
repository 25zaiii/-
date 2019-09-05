// pages/rating/rating.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt_length: 0,
    hiddenModal: true,
    txt: '',
    roid: -1, //订单号
    crid: -1, //回复id
    reply: '',
    r_modify_num: -1,
    token: '',
    c_status: -1
  },

  /**
   * 提交回复
   */
  submit: function(e) {
    var that = this
    var value = e.detail.value.textarea
    var token = wx.getStorageSync('token')

    if (value) {
      wx.showModal({
        title: '确认',
        content: '确认回复？',
        success: function(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '正在提交',
              mask: true
            })
            wx.request({
              url: app.globalData.url + '/api/request_reply_to_comments_t',
              data: {
                content: value,
                token: token,
                roid: that.data.roid
              },
              success(res) {
                //console.log(res)
                wx.hideLoading();
                wx.showToast({
                  title: '提交成功',
                  mask: true,
                  success:function() {
                    setTimeout(function() {
                      that.onShow()
                    },1500)
                  }
                })            
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请输入回复内容',
        mask: true,
        icon: 'none'
      })
    }
  },
  /**
   * 修改
   */
  alterReply: function(e) {
    var modify_num = this.data.r_modify_num
    var that = this
    if (modify_num >= 1) {
      wx.showToast({
        title: '没有修改次数了哦',
        mask: true,
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '确认',
        content: '确定修改？剩余修改次数:1次',
        success: function(res) {
          if (res.confirm) {
            that.setData({
              txt: that.data.reply,
              txt_length: that.data.reply.length,
              hiddenModal: false
            })
          }
        }
      })
    }
  },
  /**
   * 提交
   */
  modelconfirm: function(e) {
    var that = this
    var txt = that.data.txt
    var token = wx.getStorageSync('token')
    wx.showModal({
      title: '确认',
      content: '确认提交?',
      success: function(res) {
        if (res.confirm) {
          if (txt) {
            wx.showLoading({
              title: '正在提交',
              mask: true
            })
            wx.request({
              url: app.globalData.url + '/api/request_tu_cr_update',
              data: {
                crid: that.data.crid,
                token: token,
                content: txt,
                uort: 0,
                roid: that.data.roid
              },
              success: function(res) {
                wx.hideLoading()
                wx.showToast({
                  title: '修改成功',
                  duration: 2000,
                  mask: true,
                  success:function() {
                    setTimeout(function() {
                      that.onShow()
                    },1500)
                  }
                })
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
        }
      }
    })
  },
  /**
   * 取消
   */
  modelcancel: function(e) {
    this.setData({
      hiddenModal: true
    })
  },

  /**
   * 文本框字数限制
   */
  bindText: function(e) {
    var text = e.detail.value
    this.setData({
      txt_length: text.length,
      txt: text
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var token = wx.getStorageSync('token')
    var that = this

    that.setData({
      roid: e.roid,
      c_status: e.c_status,
      token: token
    })

    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    if (that.data.c_status == 1) {
      wx.request({
        url: app.globalData.url + '/api/request_modify_c_status',
        data: {
          roid: that.data.roid,
          token: token
        },
        success: function(res) {
          console.log(res.data.results)
        }
      })
    }
    wx.request({
      url: app.globalData.url + '/api/request_order_comments_reply',
      data: {
        roid: that.data.roid,
        token: token
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading()

        that.setData({
          reply: res.data.results[0].reply,
          crid: res.data.results[0].crid,
          content: res.data.results[0].content,
          creat_time: res.data.results[0].creat_time,
          r_modify_num: res.data.results[0].r_modify_num
        })
      }
    })
    /**
     * 更新上级页面的参数
     */
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      refreshPage: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/api/request_order_comments_reply',
      data: {
        roid: that.data.roid,
        token: that.data.token
      },
      success: function(res) {
        wx.hideLoading()

        that.setData({
          reply: res.data.results[0].reply,
          crid: res.data.results[0].crid,
          content: res.data.results[0].content,
          creat_time: res.data.results[0].creat_time,
          r_modify_num: res.data.results[0].r_modify_num
        })
      }
    })
  }
})