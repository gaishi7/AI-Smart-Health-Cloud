// pages/caption/caption.js
Page({
  data: {
    textInput: '',
    imageUrl: '',
    modelResponse: '',
    imagePath: '',
    buttonText: '进行询问'
  },

  onTextInput: function(e) {
    this.setData({ textInput: e.detail.value });
  },

  chooseAndUploadImage: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 获取图片的临时路径
        const tempImagePath = res.tempFilePaths[0];
        this.readImageFile(tempImagePath);
        this.setData({ imagePath: tempImagePath,
        });
      }
    });
  },
  readImageFile: function(tempImagePath) {
    const that = this;
    wx.getFileSystemManager().readFile({
      filePath: tempImagePath,
      encoding: 'base64',
      success: (res) => {
        // 图片文件内容为base64编码
        const base64Image = res.data;
        // 您可以将base64Image用于API调用或其他用途
        that.setData({ imageBase64: base64Image });
      },
      fail: (err) => {
        // 处理读取错误
        console.error(err);
      }
    });
  },
  submitData: function() {
    const text = this.data.textInput;
    const image = this.data.imageBase64;
    this.setData({ 
      buttonText: '正在为您分析病理...'});
    // 构造请求参数
    const data = {
      model: 'glm-4v', // 替换为实际的模型编码
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": text
            },
            {
              "type": "image_url",
              "image_url": {
                "url": image
              }
            }
          ]
        }
      ],
    };

    // 发送HTTP请求
    wx.request({
      url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': '52c4c4d108abd27c65a5e02118131011.pCu6UXXEod2FJA80' // 替换为您的API密钥
      },
      data: data,
      success: (res) => {
        
        // 解析API响应
        const response = res.data;
        const message = response.choices[0].message;
        // 更新modelResponse数据
        this.setData({ modelResponse: message.content });
        this.setData({ 
          buttonText: '分析完成'})

      },

      fail: (err) => {
        // 处理错误
        console.error(err);
      }
    });
  }
});
