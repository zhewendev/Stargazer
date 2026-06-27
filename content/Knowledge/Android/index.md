---
title: Android 知识库
description: Android 系统全层面知识体系，从底层原理到工程实践。
type: hub
heroStyle: mountain
tabs:
  - id: learning-map
    label: 学习地图
    type: learning-map
  - id: core-topics
    label: 核心专题
    type: core-topics
  - id: recommended
    label: 推荐阅读
    type: list
  - id: graph
    label: 图谱概览
    type: graph
learningPath:
  - stage: 基础层
    items:
      - Linux 内核
      - HAL
      - Binder
  - stage: 系统服务
    items:
      - AMS / PMS
      - WMS
      - SurfaceFlinger
  - stage: 通信机制
    items:
      - Binder 机制
      - AIDL
      - Handler
  - stage: 应用框架
    items:
      - Activity 启动
      - Service 生命周期
      - ContentProvider
  - stage: 性能优化
    items:
      - 内存优化
      - 布局优化
      - 卡顿治理
  - stage: 工程实践
    items:
      - Jetpack Compose
      - Gradle 构建
      - CI/CD
sections:
  - title: 精选文章
    type: cards
    filter:
      featured: true
      tags: [android]
    limit: 4
  - title: 最新笔记
    type: list
    filter:
      tags: [android]
    limit: 8
---
