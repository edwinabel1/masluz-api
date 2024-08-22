@echo off
REM 定义请求的URL (将其替换为你的Cloudflare Worker的实际URL)
set URL=http://127.0.0.1:8787/api/upload-subtitle

REM 发送 POST 请求
curl -X POST %URL% ^
  -F "subtitle=这是一个示例字幕222" ^
  -F "video_id=12346" ^
  -F "language=zh-CN" ^
  -F "start_time=0.0" ^
  -F "end_time=10.0"

pause
