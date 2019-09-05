// pages/write_rating/write_rating.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rating_content: '请填写评价',
    roid: -1,
    token: '',
    c_status:-1
  },

  //获取评价内容
  getRating: function(event) {
    let that = this;
    that.setData({
      rating_content: event.detail.value
    });
    // console.log(that.data.rating_content)
  },

  submit: function(e) {
    var that = this;
    var value = e.detail.value.textarea
    var token = wx.getStorageSync('token')
    console.log(that.data.c_status)
    if(that.data.c_status!=0){
      wx.request({
        url: 'https://www.xujcyizhen.com/api/request_tu_cr_update',
        data: {
          token: token,
          roid: that.data.roid,
          content: value,
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          wx.showToast({
            title: '提交成功',
            duration: 1500,
            mask: true,
            success: function () {
              setTimeout(function () {
                /**
                 * 更新上级页面的参数
                 */
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2]; //上一个页面
                prevPage.setData({
                  refreshPage: true
                })

                wx.navigateTo({
                  url: '../../pages/pcrepair/pcrepair'
                })
              }, 1500)
            }
          })

        }
      })
    }else{
      wx.request({
        url: 'https://www.xujcyizhen.com/api/request_comments_u',
        data: {
          token: token,
          roid: that.data.roid,
          content: value,
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          wx.showToast({
            title: '提交成功',
            duration: 1500,
            mask: true,
            success: function () {
              setTimeout(function () {
                /**
                 * 更新上级页面的参数
                 */
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2]; //上一个页面
                prevPage.setData({
                  refreshPage: true
                })

                wx.navigateTo({
                  url: '../../pages/pcrepair/pcrepair'
                })
              }, 1500)
            }
          })
        }
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this
    var token = wx.getStorageSync('token')

    that.setData({
      roid: e.roid,
      token: token,
      c_status: e.c_status
    })
  },


/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function() {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function() {

},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function() {

},


})