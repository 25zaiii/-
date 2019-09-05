const app = getApp()

Page({
  data: {
    orderinfo: {},
    imageurl: [],
    scroll_height: 0, //scroll-view 动态高度
    roid: -1,
    hiddenModal: true,
    txt: '',
    token: '',
    c_status: -1,
    o_status: -1,
    txt_length: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    let windowHeight = wx.getSystemInfoSync().windowHeight //屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth //屏幕的宽度
    var that = this
    var token = wx.getStorageSync('token')

    that.setData({
      scroll_height: windowHeight * 750 / windowWidth - 120,
      roid: e.roid,
      o_status: e.status,
      c_status: e.c_status,
      token: token
    })
    /**
     * 请求数据
     */
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/api/request_orderpage_ordercontent',
      data: {
        roid: that.data.roid,
        token: token,
        isaccepted: that.data.o_status
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading()
        
        var imageurl = ""
        if (res.data.results[0].image_url != "") {
          imageurl = JSON.parse(res.data.results[0].image_url)
        } else {
          imageurl = res.data.results[0].image_url
        }   
        if (that.data.o_status == 0){
          that.setData({
            nickname: res.data.results[0].nickname,
            avatarurl: res.data.results[0].avatarurl,
            creat_time: res.data.results[0].creat_time,
            complete_time: res.data.results[0].complete_time,
            content: res.data.results[0].content,
            imageurl: imageurl
          })
        }else{
          that.setData({
            nickname: res.data.results[0].nickname,
            avatarurl: res.data.results[0].avatarurl,
            creat_time: res.data.results[0].creat_time,
            complete_time: res.data.results[0].complete_time,
            content: res.data.results[0].content,
            telnumber: res.data.results[0].telnumber,
            imageurl: imageurl
          })
        }    
      }
    })

  },
  /**
   * 接单按钮事件
   */
  acceptOrder: function(e) {
    var that = this;
    if (app.globalData.tel_status == 0) {    //未认证
      wx.showToast({
        title: '请先完成手机认证',
        mask: true,
        icon: "none"
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../authentication/authentication?page=pcrepair_content',
        })
      },500)
      return false
    }    

    wx.request({
      url: app.globalData.url + '/api/request_get_processingorder_num_t',
      data: {
        token: that.data.token
      },
      success: function(res) {
        console.log(res)
        if (res.data.results < 3) {
          wx.showModal({
            title: '确认',
            content: '是否接单？',
            success: function(res) {
              if (res.confirm) {

                wx.showLoading({
                  title: '正在接单',
                  mask: true
                })
                wx.request({
                  url: app.globalData.url + '/api/request_order_accept_t',
                  data: {
                    roid: that.data.roid,
                    token: that.data.token
                  },
                  success(res) {
                    console.log(res)
                    wx.hideLoading()

                    wx.showToast({
                      title: '接单成功',
                      mask: true,
                      success: function() {
                        setTimeout(function() {
                          /**
                           * 更新上级页面的参数
                           */
                          var pages = getCurrentPages();
                          var prevPage = pages[pages.length - 2]; //上一个页面
                          prevPage.setData({
                            refreshPage: true
                          })

                          wx.navigateBack({}) //返回上级页面           
                        }, 1500)
                      }
                    })

                  }
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '不能超过3单哦',
            mask: true,
            icon: 'none'
          })
        }
      }
    })

  },

  /**
   * 取消按钮事件
   */
  cancelOrder: function(e) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/request_get_today_cancellations_t',
      data: {
        token: that.data.token
      },
      success: function(res) {
        console.log(res.data.results)
        if (res.data.results < 1) {
          wx.showModal({
            title: '确认',
            content: '是否取消该订单?剩余次数:1次',
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  hiddenModal: false
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '无法取消，今日取消次数已用完',
            mask: true,
            icon: 'none'
          })
        }
      }
    })

  },
  /**
   * 填写原因确认提交
   */
  modelconfirm: function(e) {
    var that = this
    var txt = that.data.txt

    if (txt) {
      wx.showLoading({
        title: '正在取消',
        mask: true
      })
      wx.request({
        url: app.globalData.url + '/api/request_order_cancel_t',
        data: {
          roid: that.data.roid,
          reason: that.data.txt,
          token: that.data.token
        },
        success(res) {
          console.log(res)
          wx.hideLoading()

          wx.showToast({
            title: '取消成功',
            mask: true,
            success: function() {
              setTimeout(function() {
                /**
                 * 更新上级页面的参数
                 */
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2]; //上一个页面
                prevPage.setData({
                  refreshPage: true
                })

                wx.navigateBack({}) //返回上级页面
              }, 1500)
            }
          })


        }
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
   * 取消填写
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
    var text = e.detail.value
    this.setData({
      txt_length: text.length,
      txt: text
    })
  },
  /**
   * 完成订单
   */
  finishOrder: function(e) {
    var that = this
    wx.showModal({
      title: '确认',
      content: '是否确认完成?',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
            mask: true
          })
          wx.request({
            url: app.globalData.url + '/api/request_order_completed_t',
            data: {
              roid: that.data.roid,
              token: that.data.token
            },
            success: function(res) {
              console.log(res)
              wx.hideLoading()
              wx.showToast({
                title: '提交成功',
                duration: 2000,
                mask: true,
                success: function() {
                  setTimeout(function() {
                    /**
                     * 更新上级页面的参数
                     */
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2]; //上一个页面
                    prevPage.setData({
                      refreshPage: true
                    })

                    wx.navigateBack({}) //返回上级页面
                  }, 1500)
                }
              })

            }
          })
        }
      }
    })
  },
  /**
   * 跳转至用户评价
   */
  toRating(e) {
    app.globalData.order_id = e.currentTarget.dataset.id,
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
  },

  /**
   * 点击图片预览
   */
  previewImg: function(e) {
    var src = e.currentTarget.dataset.src;
    var imgurls = this.data.imageurl;
    wx.previewImage({
      current: src,
      urls: imgurls,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    })
  }
})