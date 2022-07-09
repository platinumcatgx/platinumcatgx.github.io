---
title: SpringMVC返回值类型及响应数据类型
date: 2020-04-02 12:05:55
tags: springmvc java
---

# 返回值

根据方法的返回值类型,可分为**三类**:

<!--more-->

## `String`

根据返回的值,直接在视图转发器配置的路径下找到对应文件

配置:

```xml
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" id="internalResourceViewResolver">
    <property name="prefix" value="/"></property>
    <property name="suffix" value=".jsp"></property>
</bean>
```

Java代码:

```java
@RequestMapping("/t1")
    public String t1(Model model) {
        System.out.println("执行了...");
        return "ok";
    }
```

页面:

```jsp
<a href="t1">t1</a><br>
```

访问后的结果:

跳转到`ok.jsp`

![1585800991405](img\1585800991405.png)

## `void`

void类型是有默认值的,例如,当前方法为:

```java
@Component
@RequestMapping("user")
public class test {
    @RequestMapping("/test")
    public void t4(){
        System.out.println("执行了...");
    }
}
```

那么跳转到的页面是:`/`+`user/test.jsp`

前面是视图转发器配置的目录,后面是路径

如果想用默认,可以用**转发**,或者**重定向**

```java
/**
     * 转发
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @RequestMapping("/t2")
    public void t2(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("执行了t2...");
        request.getRequestDispatcher("/ok.jsp").forward(request,response);
    }

    /**
     * 重定向
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @RequestMapping("/t2_2")
    public void t2_2(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("执行了t2_2...");
        response.sendRedirect(request.getContextPath()+"/ok.jsp");
    }
```

当然,也可以直接输出

```java
/**
     * 直接响应输出
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @RequestMapping("/t2_3")
    public void t2_3(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("执行了t2_3...");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().print("张飞");
    }
```



## `ModelAndView`

```java
/**
 * 返回ModelAndView对象
 * @return
 */
@RequestMapping("/t2_4")
public ModelAndView t2_4() {
    System.out.println("执行了...");
    ModelAndView mv = new ModelAndView();//新建对象
    User user = new User();//模拟数据处理
    user.setUsername("张三1");
    user.setPassword("158424");
    user.setAge(10);
    //添加数据到responese
    mv.addObject("user3",user);
	//设置转跳的视图的名称
    mv.setViewName("t2_0");
    return mv;
}
```



# 数据响应

界面可能会只用AJXS技术,发送异步请求,此时发送的一般是json数据,后台也会响应一个json数据

## 发送JSON数据

界面:

```html
<html>
<head>
    <title>Title</title>
    <script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
    <script>
        // 页面加载，绑定单击事件
        $(function () {
            // 发送ajax请求
            $("#btn").click(function () {
                $.ajax({
                    url: "user/testAjax",
                    contentType: "application/json;charset=UTF-8",
                    data: '{"username":"hehe","password":"123","age":30}',
                    dataType: "json",
                    type: "post",
                    success: function (data) {
                        // data服务器端响应的json的数据，进行解析
                        alert(data);
                        alert(data.username);
                        alert(data.password);
                        alert(data.age);
                    }
                })
            })
        });
    </script>
</head>
<body>
    <button id="btn">
        发送AJXS请求
    </button>
</body>
</html>

```

## 获取并返回JSON数据

Java部分:

```java
@RequestMapping("user")
public class test {
@RequestMapping("/testAjax")
    public @ResponseBody
    User t5(@RequestBody User user){
        System.out.println("执行了..."+user);
        User u = new User();
        u.setUsername("张三丰");
        u.setPassword("武当第一");
        u.setAge(100);
        return u;
    }
}
```

Java代码中,直接使用`@RequestBody`注解将请求到的数据封装为JavaBean对象,用`@ResponseBody`注解响应请求,并传输对象

此处需要导入的Jar包

```xml
<dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-web</artifactId>
      <version>5.2.4.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>5.2.4.RELEASE</version>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>jstl</groupId>
      <artifactId>jstl</artifactId>
      <version>1.2</version>
    </dependency>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>servlet-api</artifactId>
      <version>2.5</version>
    </dependency>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>jsp-api</artifactId>
      <version>2.0</version>
    </dependency>

<!--    json封装到Javabean-->
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-core</artifactId>
      <version>2.10.1</version>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.10.1</version>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-annotations </artifactId>
      <version>2.10.1</version>
    </dependency>
  </dependencies>
```



