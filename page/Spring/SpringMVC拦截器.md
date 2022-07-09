---
title: SpringMVC拦截器
date: 2020-04-04 12:19:32
tags: springMVC java
---

关于拦截器

<!--more-->

1. SpringMVC框架中的拦截器用于对处理器进行预处理和后处理的技术。 

2. 可以定义拦截器链，连接器链就是将拦截器按着一定的顺序结成一条链，在访问被拦截的方法时，拦截器链 

中的拦截器会按着定义的顺序执行。 

3. 拦截器和过滤器的功能比较类似，有区别 
   1. 过滤器是Servlet规范的一部分，任何框架都可以使用过滤器技术。 
   2. 拦截器是SpringMVC框架独有的。 
   3. 过滤器配置了/*，可以拦截任何资源。 
   4. 拦截器只会对控制器中的方法进行拦截。 

4. 拦截器也是AOP思想的一种实现方式 

5. 想要自定义拦截器，需要实现HandlerInterceptor接口。

   <hr>

##  **HandlerInterceptor接口中的方法** 

1. preHandle方法是controller方法执行前拦截的方法 
   1. 可以使用request或者response跳转到指定的页面 
   2. return true放行，执行下一个拦截器，如果没有拦截器，执行controller中的方法。 
   3. return false不放行，不会执行controller中的方法。 

2. postHandle是controller方法执行后执行的方法，在JSP视图执行前。 
   1. 可以使用request或者response跳转到指定的页面 
   2. 如果指定了跳转的页面，那么controller方法跳转的页面将不会显示。 

3. postHandle方法是在JSP执行后执行 
   1. request或者response不能再跳转页面了

## 自定义拦截器

创建类，实现HandlerInterceptor接口，重写需要的方法

```java
public class MyInterceptor1 implements HandlerInterceptor{ 
    /*** controller方法执行前，进行拦截的方法 
    * return true放行 
    * return false拦截 
    * 可以使用转发或者重定向直接跳转到指定的页面。 */ 
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("拦截器执行了...");
        return true; 
    } 
}
```

## 配置

```xml
<mvc:interceptors> 
    <mvc:interceptor> 
        <!-- 哪些方法进行拦截 --> 
        <mvc:mapping path="/user/*"/> 
        <!-- 哪些方法不进行拦截 <mvc:exclude-mapping path=""/> --> 
        <!-- 注册拦截器对象 --> 
        <bean class="cn.itcast.demo1.MyInterceptor1"/> 
    </mvc:interceptor> </mvc:interceptors>
```

