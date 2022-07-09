---
title: Spring纯注解实现事务管理
date: 2020-03-29 23:35:33
tags: spring
---

 其实并不推荐使用纯注解的方式开发,注解与XML结合的方式可能会更方便

<!--more-->

第一步是导包,一般是maven开发,坐标的导入就不在此处写了,唯一要注意的是版本,spring的包要版本一直

然后是写持久层,实体类,服务层,表现层,配置文件

首先看看XML的方式配置了哪些东西

```xml
<?xml version="1.0" encoding="UTF-8"?>
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
<!--数据源-->
    <bean id="datasource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"></property>
        <property name="url" value="jdbc:mysql:///test"></property>
        <property name="username" value="root"></property>
        <property name="password" value="1234"></property>
    </bean>
<!--持久层和业务层-->
    <bean id="deptDao" class="gx.dao.impl.DeptDaoImpl">
        <property name="dataSource" ref="datasource"></property>
    </bean>
    <bean id="deptSer" class="gx.ser.impl.DeptSerImpl">
        <property name="deptDao" ref="deptDao"></property>
    </bean>
<!--事务管理器-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="datasource"></property>
    </bean>
<!--通知,引用事务管理器-->
    <tx:advice id="txAdcvice" transaction-manager="transactionManager">
        <!--配置方法事务属性-->
        <tx:attributes>
            <tx:method name="*" propagation="REQUIRED"/>
        </tx:attributes>
    </tx:advice>
<!--切入点表达式,关联切入点表达式和通知-->
    <aop:config>
        <aop:pointcut id="pt1" expression="execution(* gx.ser.impl.*.*(..))"/>
        <aop:advisor advice-ref="txAdcvice" pointcut-ref="pt1"></aop:advisor>
    </aop:config>

</beans>
```

我们就一步一步地去掉这些配置

首先是数据源

新建jdbcConfig.java文件,配置数据源

```java
public class JdbcConfig {
//从配置文件中导入配置
    @Value("${driver}")//注入数据
    private String driver;

    @Value("${url}")
    private String url;

    @Value("${ausername}")
    private String ausername;

    @Value("${pwssword}")
    private String password;

    //dao层所需的参数
    @Bean(name = "jdbcTemplate")
    public JdbcTemplate createJdbcTemplate(@Qualifier("dataSource") DataSource dataSource){
        return new JdbcTemplate(dataSource);
    }

    //数据源
    @Bean(name = "dataSource")
    public DataSource createDatasurce (){
        System.out.println(ausername);
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(url);
        ds.setUsername(ausername);
        ds.setPassword(password);
        return ds;
    }

}
```

新建一个SpringConfig.java类,提供一个配置类,导入jdbcConfig.java文件,引入配置文件

```java
@Configurable//声明为配置类
@ComponentScan(basePackages = "gx.*")//声明要扫描的包
@PropertySource("jdbcConfig.properties")
@Import({JdbcConfig.class,transactionManager.class})
public class SpringConfig {
}
```

接下来是去掉对持久层和业务层的配置,再持久层和业务层的实现类上使用`@Repository("deptDao")`和`@Service("deptSer")`

继续新建一个类

配置事务管理器

DataSourceTransactionManager是PlatformTransactionManager的实现类,直接返回接口类型

```java
public class transactionManager {

    @Bean(name = "transactionManager")//创建对象并存入容器
    public PlatformTransactionManager transactionManager(DataSource dataSource){
        return new DataSourceTransactionManager(dataSource);
    }

}
```

配置通知和事务管理器的关联,以及事务的属性

此时,在业务层的实现类上使用`@Transactional()`,直接为实现类中的所有事务方法配置事务属性

缺点:

当某及个方法需要的属性与其他的方法不同时,每个方法都需要用该注解配置



现在只剩最后一项配置了:切入点表达式和事务通知的对应关系

```
@EnableTransactionManagement//开启spring对注解事务的支持
```



这时候所有的声明式XML配置都改成了声明式注解配置,不出意外的话是没问题的



不过......天有不测风云......





















































