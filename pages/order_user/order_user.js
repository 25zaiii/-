// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    order_type: '',
    order_content: '',
    imageList: [],
    //imageSrc: '',
    //tempFilePaths: '',
    msg: "维修详情:",
    selectArray: [{
      "id": "11",
      "text": "清灰类"
    }, {
      "id": "21",
      "text": "重装系统类"
    }, {
      "id": "31",
      "text": "其他类"
    }]
  },
  /**
   * 图片上传函数
   */
  chooseImage: function(event) {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        app.globalData.tempFilePaths = res.tempFilePaths;
        var tempFilePaths_o = app.globalData.tempFilePaths;
        var imgeList = that.data.imageList.concat(res.tempFilePaths);
        that.setData({
          tempFilePaths_o: res.tempFilePaths,
          imageList: imgeList
        });
        // for (var i = 0; i < res.tempFilePaths.length; i++) {
        //   var imageSrc = res.tempFilePaths[i];
        //   //console.log(imageSrc)
        //   console.log(res)
        //   wx.uploadFile({
        //     url: 'https://wxuseroderimage.oss-cn-shenzhen.aliyuncs.com',
        //     filePath: imageSrc, // 上传的路径
        //     name: 'file',
        //     formData: {
        //       name: "${filename}", //好像没用
        //       key: "${filename}",
        //       policy: "eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
        //       OSSaccessKeyId: "LTAIrIocyTfco1lU",
        //       success_action_status: "200",
        //       signature: "EL/24EqpAty8caJjoXRhtYKxRjE="
        //     },
        //     success: function (res) {
        //       console.log('https://wxuseroderimage.oss-cn-shenzhen.aliyuncs.com/' + imageSrc.replace('http://tmp/', ''))//该图片url地址
        //       wx.showToast({
        //         title: '上传成功',
        //         icon: 'success',
        //         duration: 1000
        //       })
        //       console.log(res)
        //       // self.setData({
        //       //   imageSrc
        //       // })
        //     },

        //   })
        // }
      }
    })
  },
  //预览图片
  previewImage: function(e) {
    var that = this;
    var dataid = e.currentTarget.dataset.id;
    var imageList = that.data.imageList;
    wx.previewImage({
      current: imageList[dataid],
      urls: this.data.imageList
    })
  },


  //获取订单修改类型
  getDate: function(e) {
    let that = this;
    that.setData({
      order_type: e.detail.text
    });
    //console.log(e.detail.text)
  },

  // //获取订单标题
  // getTitle: function(event) {
  //   let that = this;
  //   that.setData({
  //     order_title: event.detail.value
  //   });
  //   //console.log(that.data.order_title)
  // },

  //获取订单内容
  getContent: function(event) {
    let that = this;
    that.setData({
      order_content: event.detail.value
    });
    //console.log(that.data.order_content)
  },



  //提交订单
  submit: function() {

    var that = this;
    var token = wx.getStorageSync('token');
    for (var i = 0; i < app.globalData.tempFilePaths.length; i++) {
      var imageSrc = app.globalData.tempFilePaths[i];
      //console.log(imageSrc)
      // console.log(res)
      wx.uploadFile({
        url: 'https://wxuseroderimage.oss-cn-shenzhen.aliyuncs.com',
        filePath: imageSrc, // 上传的路径
        name: 'file',
        formData: {
          name: "${filename}", //好像没用
          key: "${filename}",
          policy: "eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
          OSSaccessKeyId: "LTAIrIocyTfco1lU",
          success_action_status: "200",
          signature: "EL/24EqpAty8caJjoXRhtYKxRjE="
        },
        success: function(res) {
          // console.log('https://wxuseroderimage.oss-cn-shenzhen.aliyuncs.com/' + imageSrc.replace('http://tmp/', '')) //该图片url地址
          // wx.showToast({
          //   title: '上传成功',
          //   icon: 'success',
          //   duration: 1000
          // })
          console.log(res)
          // self.setData({
          //   imageSrc
          // })
        },

      })
    }
    if (that.data.order_content != '') {
      // wx.showToast({
      //     title: '提交成功',
      //     icon: 'success',
      //     duration: 1500,
      //     mask: true
      //   }),
      wx.request({
          url: 'https://www.xujcyizhen.com/api/request_order_insert_u',
          data: {
            token: token,
            o_type: that.data.order_type,
            //orderTitle: that.data.order_title,
            content: that.data.order_content,
            image_urls: that.data.imageList
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res) {
            console.log(res.data);
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1500,
              mask: true
            })
          }
        }),
        wx.switchTab({
          url: '../../pages/index/index'
        })
    } else {
      wx.showToast({
        title: '请填写订单内容',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }

  },

  // returnToIndex: function() {
  //   wx.switchTab({
  //     url: '../../pages/index/index'
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})