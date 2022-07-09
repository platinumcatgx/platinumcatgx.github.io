---
title: SpringMVC异常处理
date: 2020-04-04 12:19:22
tags: springMVC java
---

直接贴代码吧

<!--more-->

## 自定义异常类

```java
public class SysException extends Exception{ 
    private static final long serialVersionUID = 4055945147128016300L; // 异常提示信息
    private String message; public String getMessage() { 
        return message; 
    }
    public void setMessage(String message) { 
        this.message = message;
    }
    public SysException(String message) {
        this.message = message; 
    }
}
```



## 自定义异常处理器

需要实现`HandlerExceptionResolver`接口

```java
public class SysExceptionResolver implements HandlerExceptionResolver{ 
    /*** 跳转到具体的错误页面的方法 */ 
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        ex.printStackTrace(); 
        SysException e = null; 
        // 获取到异常对象 
        if(ex instanceof SysException) {
            e = (SysException) ex;
        }else {
            e = new SysException("请联系管理员"); 
        }ModelAndView mv = new ModelAndView();
        // 存入错误的提示信息 
        mv.addObject("message", e.getMessage()); 
        // 跳转的Jsp页面 
        mv.setViewName("error"); 
        return mv; 
    } 
}
```

## 配置异常处理器

```java
<bean id="sysExceptionResolver" class="cn.itcast.exception.SysExceptionResolver"/>
```



