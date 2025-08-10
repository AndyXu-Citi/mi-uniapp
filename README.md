# 马拉松报名小程序

基于uni-app开发的马拉松赛事报名小程序，支持多端运行（微信小程序、H5、App）。

## 功能特性

- 🔍 **赛事搜索**：支持关键词搜索、筛选条件
- ❤️ **赛事收藏**：收藏感兴趣的赛事
- 📝 **在线报名**：支持赛事报名、支付
- 👤 **个人中心**：用户信息管理、报名记录
- 📱 **多端适配**：微信小程序、H5、App

## 技术栈

- **框架**：uni-app
- **UI组件库**：uView UI
- **状态管理**：Vuex
- **网络请求**：基于uni.request封装
- **构建工具**：HBuilderX

## 项目结构

```
mi-uniapp/
├── src/
│   ├── api/              # API接口封装
│   ├── components/       # 公共组件
│   ├── config/          # 配置文件
│   ├── pages/           # 页面文件
│   │   ├── index/       # 首页
│   │   ├── event-detail/ # 赛事详情
│   │   ├── search/      # 搜索页面
│   │   ├── search-results/ # 搜索结果
│   │   ├── favorites/   # 我的收藏
│   │   ├── profile/     # 个人中心
│   │   ├── registration/ # 赛事报名
│   │   ├── registration-records/ # 报名记录
│   │   └── login/       # 登录页面
│   ├── static/          # 静态资源
│   ├── store/           # Vuex状态管理
│   └── utils/           # 工具函数
├── App.vue              # 应用入口
├── main.js              # 主入口文件
├── manifest.json        # 应用配置
├── pages.json           # 页面路由配置
└── package.json         # 项目依赖
```

## 快速开始

### 环境要求

- HBuilderX（推荐）
- Node.js 14+
- 微信开发者工具（微信小程序开发）

### 安装依赖

```bash
npm install
```

### 运行项目

#### 微信小程序

1. 使用HBuilderX打开项目
2. 点击菜单栏的"运行" -> "运行到小程序模拟器" -> "微信开发者工具"
3. 在微信开发者工具中查看效果

#### H5

```bash
npm run dev:h5
```

#### App

```bash
npm run dev:app
```

## 开发规范

### 代码规范

- 使用ES6+语法
- 组件命名采用PascalCase
- 页面文件采用kebab-case
- 变量命名采用camelCase

### 文件组织

- 每个页面独立文件夹，包含.vue文件
- 公共组件放在components目录
- 工具函数按功能分类存放

## 功能模块

### 用户模块

- 用户登录/注册
- 用户信息管理
- 微信授权登录

### 赛事模块

- 赛事列表展示
- 赛事详情查看
- 赛事搜索筛选
- 赛事收藏管理

### 报名模块

- 在线报名
- 报名信息管理
- 支付功能
- 报名记录查看

## API接口

### 用户相关

- POST /api/user/login - 用户登录
- POST /api/user/register - 用户注册
- GET /api/user/info - 获取用户信息
- PUT /api/user/info - 更新用户信息

### 赛事相关

- GET /api/events - 获取赛事列表
- GET /api/events/:id - 获取赛事详情
- GET /api/events/search - 搜索赛事

### 报名相关

- POST /api/registration - 提交报名
- GET /api/registration/records - 获取报名记录
- GET /api/registration/:id - 获取报名详情

## 部署说明

### 微信小程序

1. 在HBuilderX中点击"发行" -> "小程序-微信"
2. 上传代码到微信公众平台
3. 提交审核发布

### H5部署

```bash
npm run build:h5
```

将dist/build/h5目录下的文件部署到服务器

## 注意事项

1. 需要配置合法的request域名
2. 微信小程序需要配置业务域名
3. 图片资源建议使用CDN加速
4. 注意数据安全和用户隐私保护

## 技术支持

如有问题，请联系项目维护团队。

## 许可证

MIT License