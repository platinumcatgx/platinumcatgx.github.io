---
title: Oracle基础
date: 2021-03-07 08:25:52
tags: Oracle

---

# 基本概念

<!--more-->

数据库, 实例, 用户, 表空间, 数据文件

![](D:\Users\77344\Desktop\我的图片\Oracle\Oracle体系结构.png)

## 连接身份: 

> Normal(普通)
>
> Sysdba
>
> sysoper(管理员)

## 创建表空间(管理员身份)

``` sql
create tablespace tablespace_name

datafile 'D:/FilePathName.dbf'

size 100m

autoextend on 
next 10m;
```

## 删除表空间

```sql
deop tablespace tablespace_name;
```
## 创建用户

```sql
create user gx
identified by gx
default tablespace tablespace_name;
```

## 给用户授权

> 常用角色
> connect  连接角色, 基本角色
> resource 开发者角色
> dba 超级管理员角色

```sql
grant dba to gx;
```

## 切换用户

`conn 用户名 /密码`

# 数据类型

>  varchar, varchar2 字符串
>
> number(n)长度为n的整数
>
> number(m,n) 表示一个小数, 总长度m,小数是n
>
> Date 日期
>
> clob 大对象,文本数据,可存4G
>
> blob 大数据,二进制,可存4G

# 创建表

```sql
create table table_Name(
	tid number(20),
	tname varchar2(10)
);
```

# 修改表结构

添加列

`alter table table_Name add (gender number(1));`

修改列类型

`alter table table_Name modify gender char(1); `

修改列名称

`alter table table_name rename column gender to sex;`

删除列

`alter table table_name drop column sex;`

# 数据增删改

增删改, 必须提交事务, 否则为脏数据

`commit;` 

添加

`insert into table_name (tid,tname ) values(1,'张三');`

修改

`update table_name set tname='gx' where tid=1;`

删除

* `delete from table_name;`--删除表中全部记录
* `drop table table_name;`--删除表
* `truncate table table_name;`--先删表, 再创建表(数据量大的时候, 尤其是表中带有索引,该操作效率高)

# 

# 序列

默认1开始, 一次递增,主要用来给主键赋值

不属于某一 张表, 但是可以逻辑和表绑定

**dual**: 虚表 , 只是为了补全语法, 没有任何意义



 ```sql
--创建序列 
create sequence s_table_name;

select s_table_name.nextval from dual;

select s_table_name.currval from dual;

insert into table_name (tid,tname ) values(s_table_name.nextval,'张三');
 ```

# scott用户

默认密码: tiger

可以模拟各种复杂的查询

解锁scott用户

`alter user scott account unlock;`

解锁密码[重置密码]

`alter user scott identified by tiger;`

