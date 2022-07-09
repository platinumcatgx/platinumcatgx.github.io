---
title: JSP基础
date: 2020-04-01 19:30:39
tags: java
---

先介绍一下JSP

<!--more-->

## 什么是Java Server Pages?

JSP全称Java Server Pages，是一种动态网页开发技术。它使用JSP标签在HTML网页中插入Java代码。标签通常以<%开头以%>结束。

JSP是一种Java servlet，主要用于实现Java web应用程序的用户界面部分。网页开发者们通过结合HTML代码、XHTML代码、XML元素以及嵌入JSP操作和命令来编写JSP。

JSP通过网页表单获取用户输入数据、访问数据库及其他数据源，然后动态地创建网页。

JSP标签有多种功能，比如访问数据库、记录用户选择信息、访问JavaBeans组件等，还可以在不同的网页中传递控制信息和共享信息。



------

## 为什么使用JSP？

JSP程序与CGI程序有着相似的功能，但和CGI程序相比，JSP程序有如下优势：

- 性能更加优越，因为JSP可以直接在HTML网页中动态嵌入元素而不需要单独引用CGI文件。
- 服务器调用的是已经编译好的JSP文件，而不像CGI/Perl那样必须先载入解释器和目标脚本。
- JSP 基于Java Servlet API，因此，JSP拥有各种强大的企业级Java API，包括JDBC，JNDI，EJB，JAXP等等。
- JSP页面可以与处理业务逻辑的 Servlet 一起使用，这种模式被Java servlet 模板引擎所支持。

最后，JSP是Java EE不可或缺的一部分，是一个完整的企业级应用平台。这意味着JSP可以用最简单的方式来实现最复杂的应用。

------

## JSP的优势

以下列出了使用JSP带来的其他好处：

- 与ASP相比：JSP有两大优势。首先，动态部分用Java编写，而不是VB或其他MS专用语言，所以更加强大与易用。第二点就是JSP易于移植到非MS平台上。
- 与纯 Servlet 相比：JSP可以很方便的编写或者修改HTML网页而不用去面对大量的println语句。
- 与SSI相比：SSI无法使用表单数据、无法进行数据库链接。
- 与JavaScript相比：虽然JavaScript可以在客户端动态生成HTML，但是很难与服务器交互，因此不能提供复杂的服务，比如访问数据库和图像处理等等。
- 与静态HTML相比：静态HTML不包含动态信息。

**以上摘自 < 菜鸟教程 >** 



## 头部

jsp的头部是很重要的

定义了很多信息,这里说一些常用的

- `page`:配置jsp页面
- `contenType`：
    - 设置响应体的类型以及字符集
    - 设置当前页面的编码（只能是高级的IDE才能生效，如果使用低级工具，则需要设置pageEncoding属性设置当前页面的字符集）
  - `import`:导入包的，一般建议单独写
  - `errorPage`：指定发生异常后转跳到指定的页面，例如404
  - `isErrorPage`：表示当前页面是否为错误页面，是否可以使用exception
  
- `include`: 页面包含
- 例如：`<%@include file="top.jsp"%>`
  
- `taglib`：导入资源
- 例如：`<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>`
  - `prefix`：前缀，自定义的
    - 使用导入标签：`<c:for...></c:for>`


在JSP中可以使用html的注释,也可以使用jsp特有的注释

```
<!-- 只能注释html代码片段 -->
<%-- 可以注释所有 --%>
```

## 包含Java代码

在jsp中可以直接写java代码,动态显示页面

写Java代码的方式:

```jsp
<% 定义的java代码，在service方法中。service方法中可以定义什么，该脚本中就可以定义什么。 %>
<%! 定义的java代码，在jsp转换后的java类的成员位置。 %>
<%= 定义的java代码，会输出到页面上。输出语句中可以定义什么，该脚本中就可以定义什么。 %>
```

## JSP内置对象

| 变量名      | 真实类型            | 作用                                         |
| ----------- | ------------------- | -------------------------------------------- |
| response    | HttpServletResponse | 响应对象                                     |
| request     | HttpServletRequest  | 一次请求访问的多个资源(转发)                 |
| out         | JspWrite            | 输出对象，数据输出到页面上                   |
| session     | HttpSession         | 一次会话的多个请求间                         |
| application | ServletContext      | 所有用户间共享数据                           |
| pageContext | PageContext         | 当前页面共享数据，还可以获取其他八个内置对象 |
| page        | Object              | 当前页面(Servlet)的对象 this                 |
| config      | ServletConfig       | Servlet的配置对象                            |
| exception   | Throwable           | 异常对象                                     |

out

> 字符输出流对象。可以将数据输出到页面上。和response.getWriter()类似
>
> response.getWriter()和out.write()的区别：
>
> 在tomcat服务器真正给客户端做出响应之前，会先找response缓冲区数据，再找out缓冲区数据。
>
> **response.getWriter()数据输出永远在out.write()之前**

## EL表达式使用方式

设置jsp中page指令中：isELIgnored="true" 忽略当前jsp页面中所有的el表达式

`\${表达式}` ：忽略当前这个el表达式

语法:`${域名称.键名}`

`${键名}`：表示依次从最小的域中查找是否有该键对应的值，直到找到为止。

隐式对象 : el表达式中有11个隐式对象

## JSTL

[菜鸟教程JSP教程]: https://www.runoob.com/jsp/jsp-jstl.html

