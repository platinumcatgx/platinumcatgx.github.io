---
title: Oracle基础
date: 2021-03-07 08:25:52
tags: Oracle

---

# 存储过程

<!--more-->

提前编译好的一段pl/sql语言,放置在数据库端,可以直接被调用.这一段pl/sql一般都是**固定步骤**的业务.

语法:

>create [or rplace] procedure 过程名(Name in type,...)
>
>as
>
>begin
>
>end;

```plsql
--给指定员工涨100工资
create or replace procedure p1(eno emp.empno%type)--创建
as

begin
	update emp set sal = sal+100 where empno = eno;
	commit;
end;
```

```plsql
--测试p1
declare

begin
	p1(7788);
end;
```



# 存储函数

语法:

> create [or rplace] functioon 函数名(Name in type,...) return 数据类型 
>
> is 结果变量 数据类型
>
> begin
>
> return (结果变量)
>
> end;

```plsql
--计算指定员工的年薪
create or replace function f_yearsal (eno emp.empno%type) return number --不能定义长度
is s number(10)
begin
	select sal * 12+nvl(comm,0) into s from emp where empno = eno;
	return s;
end;
```

**存储过程**和**存储函数**的*参数*, 都不能带长度,**存储函数**的*返回值*类型不能带长度

**存储函数**的*返回值*需要接受



## out类型参数

```plsql
--计算年薪
create or replace procedure p_yearsal(eno in emp.empno%type,yearsal out number )
is
	s number(10);
	s emp.comm%type;
begin
	select sal*12,nvl(comm,0) into s,c from emp where empno = eno;
	yearsal := s+c;
end;
```

```plsql
declare
	yearsal number(10)
begin
	p_yearsal(7788,yearsal);
	dbms_output.put_line(yearsal);
end;
```

**in 和 out类型参数的区别**

涉及到into 查询语句的赋值, 或 :=操作赋值,  都必须使用out修饰

# 区别

**存储过程于存储函数的取别**

语法:  

* 关键字不同
* 存储函数比存储过程比多了2个out [本质]
  * 存储函数有*返回值*, 存储过程没有*返回值*, 只有存储函数可以自定义函数
    * select 函数名(参数) from 表名;

