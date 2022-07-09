---
title: JavaWeb页面转跳
date: 2020-03-30 21:27:35
tags: java , Web , SpringMVC
---

最近在学springMVC,把web和springMVC放在一起看看

刚刚入门写的不太好

<!--more-->

# WEB

先看看web的方式吧

## JSP页面	

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>

<h1>nihao</h1>
<a href="hi">111</a>

</body>
</html>
```

个人感觉xml配置方式更清楚一些,虽然不够简洁

## web.xml

```xml
<!DOCTYPE web-app PUBLIC
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
 "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>
    
  <servlet>
    <servlet-name>Servlet</servlet-name>
    <servlet-class>gx.controller.Servlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>Servlet</servlet-name>
    <url-pattern>/hi</url-pattern>
  </servlet-mapping>
    
</web-app>

```

对应的有一个servlet

## Servlet

```java
public class Servlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        重定向
//        response.setStatus(302);
//        response.setHeader("location","/WebDome_1/ok.jsp");
//        简单的转跳
        response.sendRedirect("/WebDome_1/ok.jsp");
    }
}
```

webApp目录下如果有一个ok.jsp ? 转跳 :  报错



在接触SpringMVC前,感觉不是太复杂

# SpringMVC

springMVC今晚刚刚入门

jsp页面还是那个

## web.XML

配置文件得改一下

```xml
<!DOCTYPE web-app PUBLIC
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
 "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>
  <servlet>
      <!--前端控制器-->
    <servlet-name>dispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <!--初始化参数-->
      <init-param>
          <!--spring配置文件的位置-->
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:bean.xml</param-value>
    </init-param>
      <!--配置为服务器启动时加载-->
    <load-on-startup>1</load-on-startup>
  </servlet>
  <servlet-mapping>
    <servlet-name>dispatcherServlet</servlet-name>
      <!--所有路径-->
    <url-pattern>/</url-pattern>
  </servlet-mapping>
</web-app>
```

spring的配置文件

## bean.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:mvc="http://www.springframework.org/schema/mvc" xmlns:context="http://www.springframework.org/schema/context" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation=" http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <!--开启注解配置-->
<context:component-scan base-package="gx.*"></context:component-scan>
<!--配置视图解析器-->
    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!--转跳的目录-->
        <property name="prefix" value="/WEB-INF/pages/"></property>
        <!--转跳的文件后缀-->
        <property name="suffix" value=".jsp"></property>
    </bean>
 
    <mvc:annotation-driver></mvc:annotation-driver>

</beans>
```

## servlet类

```java
@Controller
public class servlet {

    @RequestMapping(path = {"/hi"})
    public String ruMen(){
        System.out.println("入门执行");
        return "ok";
    }

}
```

完了?

对, 完了.

但是咱们博客还没完, 现在介绍下之前写的代码里的一些东西

<hr>

## 配置

web.XML配置里的*前端控制器*,springMVC是分模块的,每个模块的角色划分很清晰,`前端控制器`就是其中的一个

**初始化参数**:让tomcat加载springMVC的配置文件,使springmvc的配置生效

`<mvc:annotation-driver></mvc:annotation-driver>`

> 在 SpringMVC 的各个组件中，处理器映射器、处理器适配器、视图解析器称为 SpringMVC 的三大组件。 
>
> 使 用 <mvc:annotation-driven> 自动加载 RequestMappingHandlerMapping （处理映射器） 和 
>
> RequestMappingHandlerAdapter （ 处 理 适 配 器 ） ， 可 用 在 SpringMVC.xml 配 置 文 件 中 使 用 
>
> <mvc:annotation-driven>替代注解处理器和适配器的配置。 

@RequestMapping注解:

* 作用  :  用于建立**请求 URL** 和**处理请求方法**之间的对应关系
  * 类上： 

    请求 URL 的第一级访问目录。此处不写的话，就相当于应用的根目录。写的话需要以/开头。 

    它出现的目的是为了使我们的 URL 可以按照模块化管理: 

    例如： 

    账户模块： 

    > /account/add 
    >
    > /account/update 
    >
    > /account/delete 

    ... 

    订单模块： 

    > /order/add 
    >
    > /order/update 
    >
    > /order/delete 

    红色的部分就是把 RequsetMappding 写在类上，使我们的 URL 更加精细。 

  * 方法上： 请求 URL 的第二级访问目录。 

* **属性：** 

  * value：用于指定请求的 URL。它和 path 属性的作用是一样的。 

  * method：用于指定请求的方式。 

  * params：用于指定限制请求参数的条件。它支持简单的表达式。要求请求参数的 key 和 value 必须和 配置的一模一样。 

    例如： 

    params = {"accountName"}，表示请求参数必须有 accountName 

    params = {"moeny!100"}，表示请求参数中 money 不能是 100。 

  * headers：用于指定限制请求消息头的条件。