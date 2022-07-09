---
title: Oracle基础
date: 2021-03-07 08:25:52
tags: Oracle

---

# pl/sql编程

<!--more-->

是对sql语言的扩展, 使得sql语言具有**过程**化编程的特性

主要用来编写存储过程和存储函数等

## 定义变量

**声明方法**

没有大括号, 用begin/end表示开始和结束

```plsql
declare
--可以定义变量
	i number(3,2) := 10;--用:=赋值
	s varchar2(10) :='小明';
	ena emp.ename%type;--指定为emp表的ename列的数据类型, 引用型变量
	emprow emp%;--记录型变量
begin--处理业务逻辑
	dbms_output.put_line(i);--输出,相当于Java的System.out.println(i)
	dbms_output.put_line(s);
	select ename into ena from emp where empno = 7788;--用查询语句[into ena]赋值
	select * into emprow from emp where empno = 7788;
	dbms_output.put_line(ena);
	dbms_output.put_line(emprow.ename|| '的工作为' || emprow.job);--||是连接符
end;
```

**定义且赋值:**

* 变量名 类型 := 值;
* select 列明 into 变量名 from 表明 where 条件;

## pl/sql中的if判断

> 输入小于18的数字, 输出未成年
>
> , >18 && <40 中年人
>
> , >40 老年人

```plsql
declare
	i num(3) :=&i;--得到一个输入的值
begin
	if i<18 then
		dbms_output.put_line('未成年');
	elsif i<40 then
		dbms_output.put_line('中年人');
	else
		dbms_output.put_line('老年人');
	end if;
end;
```

## loop循环

```plsql
declare
	i number(2) :=1;
begin
	while i<11 loop
		dbms_output.put_line(i);
		i := i+1;
	end loop;
end;
```

## exit循环

```plsql
declare
	i number(2) :=1;
begin
	loop
		exit when i>10;
			dbms_output.put_line(i);
		i := i+1;
	end loop;
end;
```

## for循环

```plsql
declare

begin
	for i in 1..10 loop
		dbms_output.put_line(i);
	end loop;
end;
```

## 游标

类似Java中的集合, 可以存放多个对象, 多行记录

> 输出emp表中所有员工的姓名

```plsql
declare
	cursor c1 is select * from emp;
	emprow emp%rowtype;
begin
	open c1;
		loop
			fetch c1 into emprow;--取值
			exit when c1%notfound;--无法取到里面的值则退出
			dbms_output.put_line(emprow.ename);
		end loop;
	close c1;
end;
```

给指定部门员工涨工资

```plsql
declare
	cursor c2(eno emp.deptno%type) 
	is select empno from emp where deptno = eno;--带参数的游标
	en emp.empmo%type;
begin
	open c2(10);
		loop
			fetch c2 into en;
			exit when c2%notfound;
			update emp set sal = sal+100 where empno=en;
			commit;
		end loop;
	close c1;
end;
```

