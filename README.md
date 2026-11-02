# 体态打卡

每天打卡、跟练改善体态小动作的网页 App（PWA），纯 HTML/CSS/JS，无需构建。

- 今日计划 + 打卡，连续天数（休息日不断签）
- 动作库：可添加 B站 / YouTube（youtube-nocookie）视频链接和动作照片
- 跟练计时、打卡日历、每周体态照对比
- 每日 / 久坐 / 体态照提醒，可导出到系统日历（.ics）

数据只保存在手机浏览器里（localStorage + IndexedDB），不上传。

## 本地运行

```bash
python3 -m http.server 5173
```

打开 http://localhost:5173 。

## 发布更新

修改后把 `sw.js` 里的 `VERSION` 加一，然后推送到 `main`，GitHub Pages 会自动更新。
