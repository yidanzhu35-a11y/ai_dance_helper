# 部署指南

## 项目状态

项目已完成功能开发，包括：
- 视频播放控制功能
- 语音交互功能（唤醒词"小舞小舞"）
- 支持的语音命令：播放、暂停、回到开头、快一点、慢一点

## 当前部署状态

项目代码已提交到本地Git仓库，但推送至GitHub时遇到网络连接问题。建议的解决方案：

1. 检查网络连接是否稳定
2. 尝试使用HTTPS代理或SSH方式连接GitHub
3. 或者稍后网络状况改善时再次尝试推送

## 语音识别服务设置（重要）

语音交互功能需要ASRT语音识别服务支持：

1. 克隆ASRT_SpeechRecognition仓库：
   ```
   git clone https://github.com/nl8590687/ASRT_SpeechRecognition.git
   ```

2. 安装依赖：
   ```
   pip install -r requirements.txt
   ```

3. 启动服务：
   ```
   python asrserver_http.py
   ```

4. 服务默认运行在 http://localhost:8000

## 项目运行

1. 安装依赖：
   ```
   npm install
   ```

2. 启动开发服务器：
   ```
   npm run dev
   ```

3. 访问应用（默认端口3000，如果被占用会尝试3001, 3002等）

## 团队协作建议

1. 项目文档齐全，包括：
   - README.md：项目基本信息和运行说明
   - VOICE_INTERACTION_README.md：语音交互功能详细说明
   - Guidelines.md：设计指南

2. 代码结构清晰，便于团队成员理解和扩展

3. 语音交互功能模块化设计，易于维护和扩展