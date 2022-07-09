---
title: Oracle基础
date: 2021-03-07 08:25:52
tags: Oracle

---

# 视图

<!--more-->

一个查询的窗口, 所有的数据来自于原表

视图的作用:

* 屏蔽掉一些敏感字段
* 保证总部和分部数据及时同意

>  使用查询语句创建表
>
> create table emp as select * from scott.emp;

创建视图 **[**必须有dba权限**]**

```sql
create view v_emp as select ename, job from emp;
create view v_emp_r as select ename, job from emp with read only;--创建只读视图
```

查询视图

```sql
select * from v_emp;
```

修改视图

```sql
update v_emp set job='JAVA' where ename='SMITH';--不推荐
```

# 索引

在表的列上构建一个二叉树,

可以大幅度提升查找的效率, 但是会影响增删改的效率

## 单列索引

创建索引

```sql
create index idx_ename on emp(ename);
```

#### 触发规则

必须是索引列中的原始值, **单行函数**, **模糊查询**, 都会影响索引的触发

## 复合索引

第一列为优先检索列

```sql
create index idx_ename_job on emp(ename,job);
```

#### 触发规则

必须包含有优先检索列中的原始值



例

```sql
select * from emp where ename='SMITH' and job='JAVA';--触发复合索引
select * from emp where ename='SMITH' or job='JAVA';--不触发索引, or本质是2条语句, 其中有一个不触发, 则这条语句不触发
select * from emp where ename='SMITH';--触发单列索引
```

