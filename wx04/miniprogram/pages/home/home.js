// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movielist:[]//保存电影列表
  },
  loadMore:function(){
    // 1.调云函数
    wx.cloud.callFunction({
      name: "movelist",//云函数名称
      data: {
        start: this.data.movielist.length,
        count: 10
      }
    }).then(res => {
      // console.log(res);
      // 2.将云函数返回电影列表保存
      // 将字符串转为js对象
      // console.log(JSON.parse(res.result).subjects);
      this.setData({
        movielist: this.data.movielist.concat(JSON.parse(res.result).subjects)
      })
      // 3.显示当前组件
    }).catch(err => {
      console.log(err);
    }) 
  },
  // loadMore2:function(){
  //   url:'http://127.0.0.1:3000/movielist',
  //   data:{pno:1,pageSize:10},
  //   success:res=>{
  //     console.log(res);
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jumpComment:function(e){
    // 跳转：关闭并且跳转
    // wx.redirectTo({
    //   url: '/pages/comment/comment?id=1'
    // });
    // 获取电影id
    // e  当前事件对象；target触发事件元素button
    // dataset所有自定义属性
    var id=e.target.dataset.movieid;
    // 跳转：保留并且跳转
    wx.navigateTo({
      url: `/pages/comment/comment?id=`+id,
    })

  }
})
