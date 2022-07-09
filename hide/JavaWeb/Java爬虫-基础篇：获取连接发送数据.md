---
title: java爬虫基础篇
date: 2020-03-28 13:37:59
tags: java
---

爬虫，python做起来方便一些，但是Java也值得一试

<!--more-->

关于爬虫的一些理论方面的知识就不介绍了;

大概流程跟是：
获取HttpClient对象和HttpGet对象，设置URL地址，然后再发起请求，接受请求后解析代码;

平时浏览器开网页的流程是：
打开浏览器，输入地址，发起请求，将收到的页面数据变成网页页面

代码;

```java
public class pc01{
public static void main(String[] args) {
        CloseableHttpClient httpclients=null;//获取浏览器对象
        HttpGet httpget = null;//创建httpget对象，设置URL访问地址
        CloseableHttpResponse response = null;//使用httpclient发起请求，获取response
        try {
            
            httpclients = HttpClients.createDefault();//获取浏览器对象
            
            httpget = new HttpGet("httP://www.itcast.cn");//创建httpget对象，设置URL访问地址
            
            response = httpclients.execute(httpget);//使用httpclient发起请求，获取response
            
            if(response.getStatusLine().getStatusCode() == 200){//解析响应
                String counts = EntityUtils.toString(response.getEntity(), "utf8");
                System.out.println(counts.length());
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
                httpget.clone();
                httpclients.close();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

连接池代码：
```java
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;
import java.io.IOException;

public class pcPooling {
    public static void main(String[] args) {
        //创建连接池管理器
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        //设置最大连接数
        cm.setMaxTotal(100);
        //设置每个主机最大连接数
        cm.setDefaultMaxPerRoute(10);
        doGet(cm);
        doGet(cm);
        doGet(cm);
    }

    private static void doGet(PoolingHttpClientConnectionManager cm) {
        //从每次创建新的HttpClient改为从连接池中获取HttpClient对象
        CloseableHttpClient httpClient = HttpClients.custom().setConnectionManager(cm).build();
        HttpGet get = new HttpGet("Http://www.itcast.cn");
        CloseableHttpResponse response = null;
        try {
            response = httpClient.execute(get);
            if(response.getStatusLine().getStatusCode()==200){
                String content = EntityUtils.toString(response.getEntity(),"utf8");
                System.out.println(content.length());
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
                get.clone();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

代码比Python的多了很多，不过我就想用java^-^
