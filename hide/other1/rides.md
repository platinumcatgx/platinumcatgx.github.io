---
title: rides基础命令使用
date: 2020-05-07 09:37:57
tags: 数据库 rides
---

# Rides基础

<!--more-->

rides的存储结构：键值对

启动：`rides-server.exe`  

登录：`rides-cli.exe`， 完整命令`redis-cli -h host -p port -a password`

支持的数据类型：

string（字符串），set（集合），list（列表），hash（Map），zset（sorted set，有序集合）