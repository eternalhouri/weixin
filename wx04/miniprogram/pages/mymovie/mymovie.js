// pages/mymovie/mymovie.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     content:"",
     image:"",
     id:""
  },
  //输入框保存内容
  onContentChange:function(e){
     this.setData({
          content:e.detail
     });
     console.log(this.data.content)
  },
  uploadImg:function(){
    wx.chooseImage({
      count:1,
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success:(res)=>{
          var file=res.tempFilePaths[0];
          this.setData({
            image:file
          })
      }
    })
      
  },
  submit:function(){
      //1.提交加载框
       wx.showLoading({
         title: '提交中',
       })
      //2.获取留言内容
       var content=this.data.content;
       //3.获取图片
       var item=this.data.image
       //4.创建正则表达式获取文件扩展名
       var ext = /\.\w+$/.exec(item)
      //5.上传图片
        wx.cloud.uploadFile({
           cloudPath:new Date().getTime()+ext,
           filePath:item,
           success:res=>{
             var id=res.fileID
             this.setData({
               id:id
             });
             db.collection("mymovie").add({
               data:{
                 content:content,
                 fileID:id
               }
              }).then(res=>{
               wx.hideLoading();
               wx.showToast({
                 title: '上传成功',
               })
              }).catch(err => {
                 wx.hideLoading();
                 wx.showToast({
                   title: '失败',
                 })
               })
           }
        })
      
           //5.1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})