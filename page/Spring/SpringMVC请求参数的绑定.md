---
title: SpringMVC请求参数的绑定
date: 2020-03-31 14:44:41
tags: SpringMVC java
---

之前写了入门案例，里面只有页面转跳，并没有参数，但是一般情况下都会带有参数的

<!--more-->

## 参数绑定

首先需要一个页面,页面上有一个链接和表单

**如果传参失败记得看看name属性和方法的参数名是否一致**

index.jsp

```jsp
<%--
  Created by IntelliJ IDEA.
  User: Gx
  Date: 2020/3/31
  Time: 16:59
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<a href="user/t1?name=java">t1</a>

<form action="user/t2" method="post">
    <%--传递Javabean类型普通属性--%>
    <p>name</p>
    <input type="text" name="name"/><br/>
    <p>age</p>
    <input type="text" name="age"/><br/>

    <%--引用类型--%>
    <p>User2引用</p><br>
    <p>user2.name</p>
    <input type="text" name="user2.name"><br/>
    <p>user2.age</p>
    <input type="text" name="user2.age"><br/>

    <%--传递集合类型属性--%>
    <p>集合类型</p> <br>
    <p>list[0]</p>
    <input type="text" name="list[0]"/><br/>

    <p>MAP集合</p><br>
    <p>map['kayName'].name</p>
    <input type="text" name="map['kayName'].name"/><br/>
    <p>map['kayName'].age</p>
    <input type="text" name="map['kayName'].age"/><br/>
        
    <input type="submit" value="t2">
</form>


<form action="user/stringtodata" method="post">
    <input type="text"/>
    <input type="submit" value="提交"/>
</form>

</body>
</html>

```

## web.xml

配置文件里 , 配置了springmvc的一些配置,包括前端控制器等

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
    <display-name>Archetype Created Web Application</display-name>
    <!--  前端控制器-->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    <!--解决中文乱码-->
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

## spring.xml

springmvc的配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <context:component-scan base-package="gx.*"/>

    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/PAGE/"></property>
        <property name="suffix" value=".jsp"></property>
    </bean>

    <mvc:annotation-driven ></mvc:annotation-driven>

</beans>
```

## servlet

```java
@Controller
@RequestMapping("user")
public class Test {

    @RequestMapping("/t1")
    public String t1(String name){
        System.out.println("t1=>"+name);
        return "ok";
    }

    @RequestMapping("/t2")
    public String t2(User user){
        System.out.println(user);
        return "ok";
    }

}
```

## 实体类

```java
public class User {
    private String name;
    private Integer age;

    private User2 user2;
    public User2 getUser2() {
        return user2;
    }
    public void setUser2(User2 user2) {
        this.user2 = user2;
    }

    private List<String> list;
    public List<String> getList() {
        return list;
    }
    public void setList(List<String> list) {
        this.list = list;
    }

    private Map<String,User2> map;
    public Map<String, User2> getMap() {
        return map;
    }

    public void setMap(Map<String, User2> map) {
        this.map = map;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", user2=" + user2 +
                ", list=" + list +
                ", map=" + map +
                '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

}
/////////////////////////////////////////////////////////////////////////////////
public class User2 {
    private String name;
    private Integer age;

    @Override
    public String toString() {
        return "User2{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}

```

还有一个ok.jsp

位于webApp/WEB-INF/PAGE/ok.jsp



讲解:

1. 请求参数的绑定说明 

   1. 绑定机制 
      1. 表单提交的数据都是k=v格式的 username=haha&password=123 
      2. SpringMVC的参数绑定过程是把表单提交的请求参数，作为控制器中方法的参数进行绑定的 
      3. 要求：提交表单的name和参数的名称是相同的 

   2. 支持的数据类型 
      1. 基本数据类型和字符串类型 
      2. 实体类型（JavaBean） 
      3. 集合数据类型（List、map集合等） 

2. 基本数据类型和字符串类型 
   1. 提交表单的name和参数的名称是相同的 
   2. 区分大小写 

3. 实体类型（JavaBean） 
   1. 提交表单的name和JavaBean中的属性名称需要一致 
   2. 如果一个JavaBean类中包含其他的引用类型，那么表单的name属性需要编写成：对象.属性 例如： 

4. 给集合属性数据封装
   
1.  JSP页面编写方式：list[0].属性 
   
5. 请求参数中文乱码的解决
   
1. 在web.xml中配置Spring提供的过滤器类 
   
6. 自定义类型转换器 
   1. 表单提交的任何数据类型全部都是字符串类型，但是后台定义Integer类型，数据也可以封装上，说明Spring框架内部会默认进行数据类型转换。 

   2. 如果想自定义数据类型转换，可以实现Converter的接口 

      自定义类型转换器 

      ```java
      /**
       * 把字符串转换成日期的转换器 
       * @author rt 
      */ 
      
      public class StringToDateConverter implements Converter<String, Date>{ 
      
      	/**
      	 * 进行类型转换的方法 
      	*/ 
          public Date convert(String source) { 
              // 判断 
              if(source == null) { 
                  throw new RuntimeException("参数不能为空"); 
              }
              try {
                  DateFormat df = new SimpleDateFormat("yyyy-MM-dd"); 
                  // 解析字符串 
                  Date date = df.parse(source); 
                  return date; 
              } catch (Exception e) { 
                  throw new RuntimeException("类型转换错误"); 
              } 
      	} 
      }
      ```

      注册自定义类型转换器，在springmvc.xml配置文件中编写配置 

      ```xml
      <!-- 注册自定义类型转换器 --> 
      <bean id="conversionService" class="org.springframework.context.support.ConversionServiceFactoryBean">
          <property name="converters"> 
          	<set>
              	<bean class="cn.itcast.utils.StringToDateConverter"/> 
              </set> 
          </property> 
      </bean> 
      <!-- 开启Spring对MVC注解的支持 --> 
      <mvc:annotation-driven conversion-service="conversionService"/>
      ```

7. 在控制器中使用原生的`ServletAPI`对象 
   
   1. 只需要在控制器的方法参数定义`HttpServletRequest`和`HttpServletResponse`对象 