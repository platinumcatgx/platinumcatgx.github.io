---
title: JavaWeb文件上传
date: 2020-05-05 19:57:00
tags: java
---

比较基础的文件上传

<!--more-->

服务端用于接收文件,并保存到本地

```java
package com.gx.service;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@WebServlet("/file")
public class FileUploadService extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletFileUpload upload = new ServletFileUpload(new DiskFileItemFactory());
        upload.setHeaderEncoding("UTF-8");//二进制封装，所以应对解析器设置编码
        //判断上传表单类型
        if (!upload.isMultipartContent(req)) {
            return;
        }

        try {
            List<FileItem> fileItems = upload.parseRequest(req);//得到所有参数
            for (FileItem fi : fileItems) {//遍历参数
                if (fi.isFormField()) {//普通项
                    String fieldName = fi.getFieldName();//获得输入项名称
                    String value = fi.getString();//获取输入项的内容
                } else {
                    String name = fi.getName();
                    name = name.substring(name.lastIndexOf("\\") + 1);

                    InputStream is = fi.getInputStream();

                    File f = new File(" D:/Users/" +
                            new SimpleDateFormat("yyyyMMddHHmmss")//得到当前的精确时间
                                    .format(new Date()) + name);//得到理论上一个不会重复的文件名
                    System.out.println("该文件的绝对路径->" + f.getAbsolutePath());
                    FileOutputStream fos = new FileOutputStream(f);

                    byte[] b = new byte[1024];
                    while (is.read(b) != -1)
                        fos.write(b);
                    fos.flush();
                    fos.close();
                    is.close();
                }
            }
        } catch (FileUploadException e) {
            e.printStackTrace();
        }
        long l = System.currentTimeMillis();
        System.out.print("搞定->");
        long l1 = System.currentTimeMillis();
        System.out.println(l - l1);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }
}
	
```

前端页面,这里只用了简单的页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div style="width: 200px; margin: 0 auto ">

    <div style="margin-top: 30px">
        <span style="color: aqua">上传</span>
        <form enctype="multipart/form-data" action="http://localhost:8080/XiangMu_war_exploded/file" method="post">
            <input type="file" name="files" title="可上传任意文件"><br>
            <input type="submit" value="上传">
        </form>
    </div>

</div>

</body>
</html>
```

表单的entype属性必须为"multipart/form-data";

这里的提交地址是一个绝对地址,  jsp没办法实时预览,不太方便