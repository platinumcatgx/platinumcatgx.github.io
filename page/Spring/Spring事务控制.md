---
title: Spring事务控制
date: 2020-03-28 14:12:33
tags: Spring
---

# Spring事务管理--[基于XML的配置]

我觉得自己写的不好，所以先贴一个写的好的帖子

看完不用回来了。。。。

<!--more-->

这是一个大佬写的的博客 :   https://www.cnblogs.com/yixianyixian/p/8372832.html

> 第一：JavaEE 体系进行分层开发，事务处理位于业务层，Spring 提供了分层设计**业务层**的事务处理解决方 
>
> 案。 
>
> 第二：spring 框架为我们提供了一组事务控制的接口。具体在后面的第二小节介绍。这组接口是在 
>
> spring-tx-5.0.2.RELEASE.jar 中。 
>
> 第三：spring 的事务控制都是基于 AOP 的，它既可以使用编程的方式实现，也可以使用配置的方式实现。我 
>
> 们学习的重点是使用配置的方式实现。 

## API 介绍

### PlatformTransationManager

Spring提供了一个事务管理器接口`PlatformTransationManager`,该接口包含了三个方法:

> - getTransation()//提交事务
> - commit();//提交事务
> - rollback();//回滚事务
>

在开发中，根据应用的技术不同，使用不同的实现类

> SpringJDBC / iBatis：org.springframework.jdbc.datasource.**DataSourceTransactionManager** 
>
> Hibernate：org.springframework.orm.hibernate5.**HibernateTransactionManager**
>

### TransactionManager

`Transactionmanager`是事务信息对象，定义了与事务信息相关的方法

> 获取事务对象名称`String getName()`
>
> 获取事务隔离级别`int getIsolationLevel()`
>
> 获取事务传播行为`int getPropagationBehavior()`
>
> 获取事务超时时间`getTimeOut()`
>
> 获取事务是否为只读`IsReadOnly()`
>

TransactionManager的隔离级别和传播行为有固定的参数

隔离级别

> ISOLATION_DEFAULT ---（数据库）默认基本
>
> ISOLATION_READ_UNCOMMITTED ---可读取未提交的数据
>
> ISOLATION_READ_COMMITTED --- 只能读取已提交的数据（oracle默认级别）
>
> ISOLATION_REPEATABLE_READ --- 是否读取其他事务提交修改后的数据，解决不可重复读的问题（mysql默认级别）
>
> ISOLATION_SERIALIZABLE --- 是否读取其他事务提交添加后的数据，解决幻影读问题
>

事务传播行为

> **REQUIRED**:如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。一般的选 
>
> 择（默认值） 
>
> **SUPPORTS**:支持当前事务，如果当前没有事务，就以非事务方式执行（没有事务） 
>
> MANDATORY：使用当前的事务，如果当前没有事务，就抛出异常 
>
> REQUERS_NEW:新建事务，如果当前在事务中，把当前事务挂起。 
>
> NOT_SUPPORTED:以非事务方式执行操作，如果当前存在事务，就把当前事务挂起 
>
> NEVER:以非事务方式运行，如果当前存在事务，抛出异常 
>
> NESTED:如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行 REQUIRED 类似的操作。 

事务超时时间：默认`-1`没有时间限制，以秒为单位

### TransationStatus

这个接口提供了事务的运行状态

> flush();刷新事务
>
> hasSavepoint();是否在存储点
>
> isCompleted();是否完成
>
> isNewTransaction();是否是新事务
>
> isRollbackOnly();是否回滚事务
>
> setRollbackOnly();设置事务回滚

## 基于XML的配置

首先最基本几件事：导入jar包/坐标，导入(xml)约束

spring-jdbc包，spring-tx包，aspectjweaver

如果需要测试，需要加上junit-4.12,spring-test

### 约束

这个可以在文档里找到

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
```

### DAO

真正与数据库交互的层

在准备dao之前应准备表的实体类[略]

dao层的接口,只写连个,其他的方法都类似

```java
public interface IDeptDao {

    List<Dept> findAll(Integer id);

    void Update(Dept dept);

}
```

实现类继承`JdbcDaoSupport`,减少代码冗余

```java
public class DeptDaoImpl extends JdbcDaoSupport implements IDeptDao {

    public List<Dept> findAll(Integer id) {
        return null;
    }

    public void Update(Dept dept) {
        int update = getJdbcTemplate().update("update dept set deptno= ? where dname = 'a' ",dept.getDeptno());
        System.out.println("更改后----"+update);
    }
}
```



### Service层

根据DAO层，准备Service层的`接口`与`实现类`

接口

```java
public interface IDeptSer {

    List<Dept> findAll(Integer id);

    void Update(Dept dept);

}
```

这里的`实现类`直接调用对应的方法

```java
public class DeptSerImpl implements IDeptSer {

    private DeptDaoImpl deptDao;

    public void setDeptDao(DeptDaoImpl deptDao) {
        this.deptDao = deptDao;
    }

    public List<Dept> findAll(Integer id) {
        return deptDao.findAll(id);
    }

    public void Update(Dept dept) {
            deptDao.Update(dept);
            dept.setDeptno(80);
//            int k = 0/0;//手动制造异常
            deptDao.Update(dept);
    }

}
```



### xml配置

与数据库交互的写好了，现在就是配置了

配置数据源

```xml
<!--数据源-->
<bean id="datasource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"></property>
    <property name="url" value="jdbc:mysql:///test"></property>
    <property name="username" value="root"></property>
    <property name="password" value="1234"></property>
</bean>
```

配置`dao`层和`service`层

```xml
<!--dao层实现类-->
<bean id="deptDao" class="gx.dao.impl.DeptDaoImpl">
    <property name="dataSource" ref="datasource"></property>
</bean>
<!--service层实现类-->
<bean id="ds" class="gx.ser.impl.DeptSerImpl">
    <property name="deptDao" ref="deptDao"></property>
</bean>
```

#### 事务管理

终于到了重点了

配置时间到

配置步骤

1. 配置事务管理器

   ```xml
   <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
           <property name="dataSource" ref="datasource"></property>
       </bean>
   ```

2. 配置事务管理器的通知引用事务管理器

3. 配置事务的属性

   ```xml
   <!--第二步-->
   <tx:advice id="txAdcvice" transaction-manager="transactionManager">
       <!--第三步-->
       <tx:attributes>
       	<tx:method name="*" propagation="REQUIRED"/>
       </tx:attributes>
   </tx:advice>
   ```

4. 配置AOP切入点表达式

5. 配置切入点表达式和事务通知的对应关系

```xml
<aop:config>
    <!--第四步-->
    <aop:pointcut id="pt1" expression="execution(* gx.ser.impl.*.*(..))"/>
    <!--第五步-->
    <aop:advisor advice-ref="txAdcvice" pointcut-ref="pt1"></aop:advisor>
</aop:config>
```

> <tx:method>标签
>
> 属性：name  ---  方法名称
>
> 可用 通配符*  例：
>
> 匹配所有find开头的方法：find*（优先级高）
>
> 匹配所有方法：*
>
> 其他属性
>
> > 指定方法名称：是业务核心方法 
> >
> > read-only：是否是只读事务。默认 false，不只读。 
> >
> > isolation：指定事务的隔离级别。默认值是使用数据库的默认隔离级别。 
> >
> > propagation：指定事务的传播行为。 
> >
> > timeout：指定超时时间。默认值为：-1。永不超时。 
> >
> > rollback-for：用于指定一个异常，当执行产生该异常时，事务回滚。产生其他异常，事务不回滚。 
> >
> > 没有默认值，任何异常都回滚。 
> >
> > no-rollback-for：用于指定一个异常，当产生该异常时，事务不回滚，产生其他异常时，事务回 
> >
> > 滚。没有默认值，任何异常都回滚。 

# 晚安

开啥玩笑,测试不过想睡觉????

不想!!!

经过几次修改,能够正常提交、回滚

测试类代码

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:bean.xml"})
public class TestService {

    @Autowired
    IDeptSer ds;
    @Test
    public void TestFindAll(){
        Dept dept = new Dept();
        dept.setDeptno(60);
        ds.Update(dept);
    }

}
```

如果你按照我写的做,出了异常

不要方

注意细节,再去看看大佬们的博客