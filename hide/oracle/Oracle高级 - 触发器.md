---
title: Oracle基础
date: 2021-03-07 08:25:52
tags: Oracle

---

# 触发器

<!--more-->

制定一个规则, 在增删该时, 只要满足则自动触发

加for each row 是为了使用:old 或者:new对象或者一行记录

## 语句触发器

不包含 for each row

```plsql
--插入一条记录,输入一个新员工入职
create or replace triggern t1
after
insert
on emp
declare

begin
	dbms_output.put_line('一个新员工入职');
end;
```



## 行级触发器

包含 for each row
```plsql
--不能给员工降薪
create or replace triggern t2
before
update
on emp
for each row
declare

begin
    if :old.sal>:new.sal then
        raise_application_error(-20001,'不能给员工降薪');---20001~-20999之间
    end if;
end;
```

#### 触发器实现主键自增

```plsql
/*分析:
在用户做插入操作之前, 拿到即将插入的数据, 给该数据的主键列赋值.*/
--创建触发器
create or replace trigger auid
befor
on emp
for each row
declare

begin
	select s_person.nextval into :new.pid from dual;
end;
```

