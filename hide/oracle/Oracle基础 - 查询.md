---
title: Oracle基础
date: 2021-03-07 08:25:52
tags: Oracle

---

# 条件表达式

<!--more-->

**通用**(Oracle与MySQL通用), 推荐使用, **可重用**性强

```sql
--给员工起中文名
select e.ename,
case e.ename
when 'SMITH' then '史密斯'
when 'ALLEN' then '爱丽丝'
when 'BLAKE' then '布雷克'
else '匿名' -- 可省略else
end
from emp e; 
```

```sql
--判断emp表中员工工资; >3000, 高收入; <3000, 低收入
select e.ename,
case
when e.sal>3000 then '高收入'
when e.sal>1500 then '中收入'
else '低收入'
end
from emp e; 
```

**Oracle专用条件表达式**

```sql
select e.ename,
decode(e.ename,
'SMITH','史密斯',
'ALLEN','爱丽丝',
'BLAKE','布雷克',
'匿名') 中文名 --这里不能加单引号
from emp e; 
```

`Oracle中除了取别名, 都用单引号`



# 函数(常用)

## 单行函数

作用于一行, 返回一个值

### 字符函数

```sql
select upper('yes') from dual;--小写变大写
select lower('YES') from dual;--大变小
```

### 数值函数

```sql
select round(26.18,-1) from dual;--四舍五入,后面的参数表示保留位数
select trunc(56.16,-1) from dual;--直接截取
select mod(10,3) from dual;--求余数
```

### 日期函数

```sql
select sysdate-e.hiredate from emp e;--查询所有员工入职距离现在几天
select sysdate+1 from dual;--算出明天此刻 
select months_between(sysdate,e.hiredate) from emp e;--查询所有员工入职距离现在几月
select months_between(sysdate,e.hiredate)/12 from emp e;--查询所有员工入职距离现在几月
select (sysdate-e.hiredate)/7 from emp e;--查询所有员工入职距离现在几周
```

### 转换函数

```sql
select to_char(sysdate,'fm yyyy-mm-dd hh24:mi:ss') from dual;-- 日期转字符串
select to_date('2020-6-27 10:33:41','yyyy-mm-dd hh24:mi:ss') from dual;--字符串转日期
```

### 通用函数

```sql

select e.sal*12+nvl(e.comm,0) from emp e;--算出emp表中所有员工的年薪
/*
null和任意数字做算数运算,结果都是null
nvl(e.comm,0)
如果第一参数为null, 则用第二个参数代替
*/
```



## 多行函数

作用于多行, 返回一个值, 也称 聚合函数

```sql
select count(1) from emp;--查询总数量,count(1)相当于count(主键)
```

* count(1)   查询总数量,count(1)相当于count(主键)
* sum(列名)  该列的和
* max(列名)  该列的最大值
* min(列名)  该列的最小值
* avg(列名)  该列的平均值



# 查询

注: 即使查询不报错, 结果也不一定对

首先用socct登录

## 分组查询

分组查询中 , 出现在**group by**后面的**原始列**, 才能出现在select后面

```sql
--查询每个部门的平均工资
select e.deptno,avg(e.sal)
from emp e
group by e.deptno;
```

```sql
--查询平均工资高于2000的部门信息
select e.deptno,avg(e.sal) asal
from emp e
group by e.deptno
having avg(e.sal)>2000;--不能写别名来判断(asal>2000)
```

```sql
--查询每个部门.工资高于800的员工的平均工资, 然后再查询出平均工资高于2000的部门
select e.deptno,avg(e.sal)
from emp e
where e.sal>800
group by e.deptno
having avg(e.sal)>2000;
```

Where: 过滤分组**前**的数据, 必须在group by之前

Having: 过滤分组**后**的数据, 在group by之后

## 多表查询

### 笛卡尔积

```sql
select count(1)
from emp, dept;--emp中12条数据, dept中4条,结果为48条
```

### 等值连接

```sql
select *
from emp e, dept d
where e.deptno=d.deptno;--结果12条
```

### 内连接

```sql
select *
from emp e inner join dept d
on e.deptno=d.deptno;--结果也是12条, 推荐使用等值连接
```

```sql
--查询出所有部门, 以及部门下的员工信息[右外连接]
select * 
from emp e right join dept d
on e.deptno = d.deptno;--结果13行, 多了一个没有员工的部门
```
```sql
--查询出所有员工, 以及员工所属部门[左外连接]
select * 
from emp e left join dept d
on e.deptno = d.deptno;--结果12行, 没有员工的部门并不存在
```

### Oracle专用外连接

```sql
select *
from emp e, dept d
where e.deptno(+) = d.deptno;--13

select *
from emp e, dept d
where e.deptno = d.deptno(+);--12
--(+)所在的位置列, 会显示所有的数据
```

```sql
--查询出员工姓名, 员工领导姓名[自连接: 在不同角度, 把一张表看成多张表]
select e1.ename , e2.ename
from emp e1 , emp e2
where e1.mgr = e2.empno;--11
--查询出 员工姓名, 员工部门名称, 员工领导名称, 员工领导部门名称
select e1.ename, d1.dname, e2.ename, d2.dname
from emp e1, emp e2 ,dept d1, dept d2
where e1.mgr = e2.empno
and e1.deptno = d1.deptno
and e2.deptno = d2.deptno;--11
```

### 子查询

子查询返回一个值

```sql
--查询出工资和scott一样的员工信息
select * 
from emp
where sal =(select sal from emp where ename in 'SMITH'); --1
--ename in 'SMITH' 
--ename 不能保证唯一, 所以用in 而不用=
```

子查询返回一个集合

```sql
--查询出工资和10号部门任意员工一样的员工信息
select * from emp where sal in
(select sal from emp where deptno=10);--3
```

子查询返回一张表

```sql
--查询出每个部门最低工资, 和最低工资员工姓名, 和该员工所在部门名称
select t.deptno , t.msal , e.ename , d.dname
from(
    select deptno ,min(sal) msal--每个部门最低工资
    from emp
    group by deptno
) t , emp e, dept d
where t.deptno =e.deptno
and t.msal = e.sal
and e.deptno = d.deptno;--3
```

### 分页查询

**rownum** 行号

在做select操作时, 每查询一行记录, 就会在该行上加一个行号, 从1开始,一次递增;

排序操作会影响rownum的顺序

```sql
select rownum, e.* from emp e order by sal desc;
```

下面这个就解决了行号乱序的问题

```sql
select rownum, t.* from (select e.* from emp e order by sal desc) t ;
```

分页

```sql
select rownum, t.* from (select e.* from emp e order by sal desc) t where rownum <11;
--如果加上rownum>5, 因为第一条数据rownum为1,导致第一个行号加不上去, 所以后面的行号也加不上去
--行号不能写 >一个正数
```

```sql
select *
from (
    select rownum r, t.* 
    from (
         select e.* 
         from emp e 
         order by sal desc
    ) t
    where rownum <11
)
where r >5;--5
```

