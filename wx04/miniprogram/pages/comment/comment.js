// pages/comment/comment.js
const db=wx.cloud.database({
  env:"houri-web-test-jd6ah"
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieid:0,//电影id
    detailList:[],//电影详细信息
    content:"",//评论初始值
    score:5,
    imageList:[],  //保存用户选中的图片
    fileIds:[]
  },
  onContentChange:function(e){
    // console.log(e.detail);
    this.setData({
      content:e.detail
    })
  },
  onScoreChange:function(e){
    this.setData({
      score:e.detail
    })
  },
  uploadImg:function(){
    // 选中图片  9张
    wx.chooseImage({
      count:9,
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success: res=>{
        const tempFiles=res.tempFilePaths;
        console.log(tempFiles);
        this.setData({
          imageList:tempFiles
        })
      },
    })
  },
  submit:function(){
    // 1.上传9张图片
    wx.showLoading({
      title: '评论中',
    });
    console.log(this.data.content+"_"+this.data.score);
    // 2.上传图片到云存储
    // 3.创建promise数组
    let promiseArr=[];
    // 4.创建循环9次
    for (let i = 0; i < this.data.imageList.length;i++){
      // 5.创建Promise push数组中
      promiseArr.push(new Promise((reslove,reject)=>{
        // 5.1获取当前上传图片
        var item=this.data.imageList[i];
        // 5.2创建正则表达式拆分文件后缀 .jpg  .png
        let suffix = /\.\w+$/.exec(item)[0];
        // 5.3上传图片->将data中图片上传云存储
        wx.cloud.uploadFile({
          cloudPath:new Date().getTime()+suffix,//上传至云端的路径
          // cloudPath:new Date().getTime()+Math.floor(Math.random()*9999)+suffix   防止一秒钟上传多张图片导致图片名称相同
          filePath:item,//小程序临时路径
          success:res=>{
            console.log(res.fileID);
            var ids=this.data.fileIds.concat(res.fileID);
            // 5.4上传成功将当前云存储fileID保存数组
            this.setData({
              fileIds:ids
            })
            // 5.5追加任务列表
            reslove();
          },
           // 5.6失败显示出错信息
          fail:err=>{
            console.log(err);
          }
        })               
      }));
    }
    // 6.一次性将图片fileID,分数,内容保存集合中[集合中一条记录]
    Promise.all(promiseArr).then(res=>{
      // 6.1添加数据
      db.collection("comment")
        .add({
          data:{
            content:this.data.content,//评论内容
            score:this.data.score,//评论分数
            movieid:this.data.movieid,//评论电影id
            fileIds:this.data.fileIds//上传图片id
          }
        }).then(res=>{
          wx.hideLoading();  //隐藏加载框
          wx.showToast({     //显示提示框
            title: '评论成功',
          })
        }).catch(err=>{
          console.log(err);
          wx.hideLoading();
          wx.showToast({
            title: '评论失败',
          })
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.接收电影列表传递参数id并且保存data
    console.log(options.id);
    this.setData({
      movieid:options.id
    })
    // 2.提示数据加载框
    wx.showLoading({
      title: '加载中',
    });
    // 3.调云函数，将电影传递云函数
    wx.cloud.callFunction({
      name:"getDetail1",
      data:{
        movieid:options.id
      }
    }).then(res=>{
      // 4.获取云函数返回数据并且保存data
      // console.log(res);
      // 5.隐藏加载框
      wx.hideLoading();
      this.setData({
        detailList:JSON.parse(res.result)
      })
      // console.log(JSON.parse(res.result));
    }).catch(err=>{
      console.log(err);
      wx.hideLoading();
    })    
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