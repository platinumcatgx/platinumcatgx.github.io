---
title: Spring_IOC_AOP
date: 2020-03-29 08:11:44
tags: spring
---

直接切入正题

<!--more-->

Spring需要的包:Spring-context



## 准备XML文件:

```XML
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

## 配置

### XML配置

**bean标签**

- 让Spring创建核心容器时,创建配置的类

- **属性**

  - **id**:唯一标志,在在spring核心容器中创建对象时将使用ID值

  - **class**:需要配置的类的全限定类名

  - **scope**:指定对象的生命周期

    - 值： 

      > singleton :默认值，单例的. 
      >
      > prototype :多例的. 
      >
      > request :WEB 项目中,Spring 创建一个 Bean 的对象,将对象存入到 request 域中. 
      >
      > session :WEB 项目中,Spring 创建一个 Bean 的对象,将对象存入到 session 域中. 
      >
      > global session 
      >
      > :WEB 项目中,应用在 Portlet 环境.如果没有 Portlet 环境那么 
      >
      > globalSession 相当于 session.

  - init-method:指定类中的初始化方法名称。

  - destroy-method：指定类中销毁方法名称。 

  - factory-method 属性：指定生产对象的静态方法 

  - factory-bean 属性：用于指定实例工厂 bean 的 id。 

  - factory-method 属性：用于指定实例工厂中创建对象的方法。 

**Spring实例化对象的三种方式：**

- 使用默认无参构造函数

- spring 管理静态工厂使用静态工厂的方法创建对象

  -  factory-method=*"createAccountService"*

- spring 管理实例工厂使用实例工厂的方法创建对象

  - <bean id=*"instancFactory"* class=*"com.itheima.factory.InstanceFactory"*></bean> 

    <bean id=*"accountService"* 

     factory-bean=*"instancFactory"* 

     factory-method=*"createAccountService"*></bean>





### 注解配置

配置XML文件:

```xml
指定 bean 的作用范围。<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">


<!--    配置spring创建容器要扫描的包-->
    <context:component-scan base-package="gx"></context:component-scan>

<!--    配置spring开启注解AOP的支持-->
    <aop:aspectj-autoproxy></aop:aspectj-autoproxy>

</beans>
```

**@Component**：让spring在创建容器时，创建对象，**属性**:value:指定id

**@Controller @Service @Repository**：与@Component相同，语义化

**改变作用范围：**

**@Scope** ：指定 bean 的作用范围；value：指定范围的值。 

​				 取值：singleton prototype request session globalsession 

**生命周期**：

**@PostConstruct**：初始化

 **@PreDestroy** ：销毁



#### 脱离XML文件

**@Configuration** ：指定当前类是一个配置类；value:用于指定配置类的字节码

**@ComponentScan**：指定初始化容器时要扫描的包；basePackages：用于指定要扫描的包

**@Bean**：该注解只能写在方法上，表明使用此方法创建一个对象，并且放入 spring 容器；name：bean的id

**@PropertySource**：用于加载.properties 文件中的配置。value[]：用于指定 properties 文件位置，如果是在类路径下，需要写上 classpath:

使用：

```java
@Value("${jdbc.driver}")
private String driver;
```

**@Import** :用于导入其他配置类，在引入其他配置类时，可以不用再写@Configuration 注解；value[]：用于指定其他配置类的字节码



## 注入

### XML注入

注入数据适用于:数据不会频繁改变的值

#### 1.使用**构造函数**，给属性传值

要求： 

​	类中需要提供一个对应参数列表的构造函数。 

> **constructor-arg** 
>
> 属性： 
>
> > 指定参数
> >
> > **index**:指定参数在构造函数参数列表的索引位置 
> >
> > **type**:指定参数在构造函数中的数据类型
> >
> > **name**:指定参数在构造函数中的名称 
>
> > 赋值
> >
> > **value**:它能赋的值是基本数据类型和 String 类型 
> >
> > **ref**:它能赋的值是其他 bean 类型，也就是说，必须得是在配置文件中配置过的 bean 

#### 2.set方法3注入

要求：有set方法	

> **property**
>
> 属性： 
>
> > **name**：找的是类中 set 方法后面的部分 
> >
> > **ref**：给属性赋值是其他 bean 类型的 
> >
> > **value**：给属性赋值是基本数据类型和 string 类型的

#### 3.P命名空间植入（本质还是set方法注入）

配置文件

```XML
<beans xmlns="http://www.springframework.org/schema/beans"
 xmlns:p="http://www.springframework.org/schema/p"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation=" http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans.xsd">
 
<bean id="accountService" 
 class="com.itheima.service.impl.AccountServiceImpl4"
 p:name="test" p:age="21" p:birthday-ref="now"/>
</beans>
```

#### 4.复杂类型注入

> List 结构的： 
>
> **array,list,set** 
>
> Map 结构的 
>
> **map,entry,props,prop** 

```XML
<bean id="accountService" class="com.itheima.service.impl.AccountServiceImpl">
<!-- 在注入集合数据时，只要结构相同，标签可以互换 -->
<!-- 给数组注入数据 --> 
    <property name="myStrs"> 
        <set>
            <value>AAA</value> 
            <value>BBB</value> 
            <value>CCC</value>
        </set>
    </property>
<!-- 注入 list 集合数据 --> 
    <property name="myList"> 
        <array> 
            <value>AAA</value> 
            <value>BBB</value>
            <value>CCC</value>
        </array>
	</property>
<!-- 注入 set 集合数据 --> 
    <property name="mySet"> 
        <list>
            <value>AAA</value> 
            <value>BBB</value> 
            <value>CCC</value>
        </list>
	</property>
<!-- 注入 Map 数据 --> 
    <property name="myMap"> 
        <props> 
            <prop key="testA">aaa</prop> 
            <prop key="testB">bbb</prop>
        </props>
    </property>
<!-- 注入 properties 数据 -->
    <property name="myProps"> 
        <map><entry key="testA" value="aaa"></entry> 
            <entry key="testB"> 
                <value>bbb</value>
            </entry>
        </map>
    </property>
</bean>
```



### 注解注入

 **@Autowired** ：自动按照类型注入。当使用注解注入属性时，set 方法可以省略。它只能注入其他 bean 类型

**@Qualifier** ：在自动按照类型注入的基础之上，再按照 Bean 的 id 注入。它在给字段注入时不能独立使用

 **@Resource**：直接按照 Bean 的 id 注入。它也只能注入其他 bean 类型；name：指定 bean 的 id

**@Value**：注入基本数据类型和 String 类型数据的 



## 测试

获取Spring核心容器:

```
new ClassPathXmlApplicationContext("bean.xml");
```

> **BeanFactory** **和** **ApplicationContext** **的区别** 
>
> > BeanFactory 才是 Spring 容器中的顶层接口。 
> >
> > ApplicationContext 是它的子接口。 
> >
> > BeanFactory 和 ApplicationContext 的区别： 
> >
> > 创建对象的时间点不一样。 
> >
> > ​	ApplicationContext：只要一读取配置文件，默认情况下就会创建对象。 
> >
> > ​	BeanFactory：什么使用什么时候创建对象

> **ApplicationContext** **接口的实现类** 
>
> > **ClassPathXmlApplicationContext****：** 
> >
> > 它是从类的根路径下加载配置文件 ,推荐使用这种 
> >
> > **FileSystemXmlApplicationContext****：** 
> >
> > 它是从磁盘路径上加载配置文件，配置文件可以在磁盘的任意位置。 
> >
> > **AnnotationConfigApplicationContext:** 
> >
> > 当我们使用注解配置容器对象时，需要使用此类来创建 spring 容器。它用来读取注解。



## Spring整合Junit

1. 导入：spring-test，junit4.12

2. 使用**@RunWith**注解替换原有运行器

3. 使用**@ContextConfiguration** 指定 spring 配置文件的位置

   > 1. **@ContextConfiguration** **注解：** 
   >
   > **locations** **属性：**用于指定配置文件的位置。如果是类路径下，需要用 **classpath:**表明 
   >
   > **classes** **属性：**用于指定注解的类。当不使用 xml 配置时，需要用此属性指定注解类的位置。 

4. 使用**@Autowired** 给测试类中的变量注入数据

```
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations= {"classpath:bean.xml"})
public class AccountServiceTest {
@Autowired
private IAccountService as ; }
```



# SpringAOP

## AOP相关概念

- 概念:面向切面编程
- 作用:在程序运行期间,不修改源码对方法进行增强
- 优势:减少重复代码;提高开发效率;维护方便
- 实现:动态代理
  - 动态代理的特点:字节码随用随创建;随用随加载
  - 方式:基于接口的动态代理
    - 提供者:JDK的Proxy类
    - 要求:被代理的类至少实现一个接口
    - 实现:*
  - 方式:基于子类的动态代理
    - 提供者:第三方CGLib
    - 要求:被代理类不能用final修饰符
    - 实现:*

## Spring中的AOP

- AOP相关术语:
  - **Joinpoint(连接点)**:所谓连接点是指那些被拦截到的点。在 spring 中,这些点指的是方法,因为 spring 只支持方法类型的连接点
    - 接口中所有的方法
  - **Pointcut(切入点)**:所谓切入点是指我们要对哪些 Joinpoint 进行拦截的定义
    - 接口中被增强的方法
  - **Advice(通知/增强)**:所谓通知是指拦截到 Joinpoint 之后所要做的事情就是通知。
    - 通知的类型：前置通知,后置通知,异常通知,最终通知,环绕通知。
  - **Introduction(引介)**:引介是一种特殊的通知在不修改类代码的前提下, Introduction 可以在运行期为类动态地添加一些方法或 Field。
  - **Target(目标对象)**:代理的目标对象
  - **Weaving(织入)**:是指把增强应用到目标对象来创建新的代理对象的过程。spring 采用动态代理织入，而 AspectJ 采用编译期织入和类装载期织入
  - **Proxy(代理)**:一个类被 AOP 织入增强后，就产生一个结果代理类
  - **Aspect(切面)**:是切入点和通知（引介）的结合

## **SpringAOP(XML配置)**

### XML约束:

```XML
<?xml version="1.0" encoding="UTF-8"?><beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop" xsi:schemaLocation="http://www.springframework.org/schema/beanshttp://www.springframework.org/schema/beans/spring-beans.xsdhttp://www.springframework.org/schema/aophttp://www.springframework.org/schema/aop/spring-aop.xsd">
</beans>
```

#### 配置通知类

```XML
<bean id="logger" class="gx.utils.Logger"></bean>

```

#### 声明AOP配置

配置标签,用于声明开始aop的配置

```xml
<!--
aop:config:
	作用：用于声明开始 aop 的配置
-->
<aop:config>
	<!--配置的代码都写着这里-->
</aop:config>

```

#### 配置切面

```XML
<!--
    aop:aspect:
    作用：
    	用于配置切面。
    属性：
    	id：给切面提供一个唯一标识。
    	ref：引用配置好的通知类 bean 的 id。
-->
<aop:aspect id="txAdvice" ref="txManager">
	<!--配置通知的类型要写在此处-->
</aop:aspect>

```

####  配置切入点表达式

切入点表达式的写法：

- 关键字:execution(表达式)
- 表达式:
  - 访问修饰符 返回值 全限定类名.方法名(参数列表)
- 简写:
  - **访问修饰符**,可以省略
  - **返回值**可以使用通配符,表示任意返回值
  - **包名**可以使用通配符,表示任意包,有几级包,就需要写几个*,可以使用..表示当前包及其子包
  - **类名**和**方法**,都可以使用'*',表示通配
  - 参数列表:
    - 可以直接写数据类型:
      - 基本类型直接写名称
      - 引用类型写 包名.类名 的方式 java.lang.String
      - 可以使用通配符表示任意类型,但是必须有参数
      - 可以使用..表示有无参数均可,有参数可以是任意类型
  - 全通配写法:[尽量不要使用]
    - *..*.*(..)
    - 通常写法:切到业务层实现类的所有方法
          - gx.service.impl.*.*(..)


```XML
<!--
aop:pointcut：
    作用：
        用于配置切入点表达式。就是指定对哪些类的哪些方法进行增强。
    属性：
expression：用于定义切入点表达式。
id: 用于给切入点表达式提供一个唯一标识
-->
<aop:pointcut expression="execution(
public void com.itheima.service.impl.AccountServiceImpl.transfer(
java.lang.String, java.lang.String, java.lang.Float) )" id="pt1"/>

```

#### 配置对应的通知类型

- 前置通知:

  - ```XML
    <!--
    aop:before
    作用：
    用于配置前置通知。指定增强的方法在切入点方法之前执行
    属性：
    method:用于指定通知类中的增强方法名称
    ponitcut-ref：用于指定切入点的表达式的引用
    poinitcut：用于指定切入点表达式
    执行时间点：
    切入点方法执行之前执行
    -->
    <aop:before method="beginTransaction" pointcut-ref="pt1"/>
    
    ```

- 后置通知:

  - ```XML
    <!--
    aop:after-returning
    作用：
    用于配置后置通知
    属性：
    method：指定通知中方法的名称。
    pointct：定义切入点表达式
    pointcut-ref：指定切入点表达式的引用
    执行时间点：
    切入点方法正常执行之后。它和异常通知只能有一个执行
    -->
    <aop:after-returning method="commit" pointcut-ref="p
    
    ```

- 异常通知:

  - ```XML
    <!--
    aop:after-throwing
    作用：
    用于配置异常通知
    属性：
    method：指定通知中方法的名称。
    pointct：定义切入点表达式
    pointcut-ref：指定切入点表达式的引用
    执行时间点：
    切入点方法执行产生异常后执行。它和后置通知只能执行一个
    -->
    <aop:after-throwing method="rollback" pointcut-ref="pt1"/>
    
    ```

- 最终通知:

  - ```XML
    <!--
    aop:after
    作用：
    	用于配置最终通知
    属性：
    	method：指定通知中方法的名称。
    	pointct：定义切入点表达式
    	pointcut-ref：指定切入点表达式的引用
    执行时间点：
    	无论切入点方法执行时是否有异常，它都会在其后面执行。
    -->
    <aop:after method="release" pointcut-ref="pt1"/>
    
    ```

- 环绕通知:

  - ```XML
    <!--配置方式: -->
    <aop:config> 
        <aop:pointcut expression="execution(* gx.service.impl.*.*(..))" id="pt1"/>
    	<aop:aspect id="txAdvice" ref="txManager">
    	<!-- 配置环绕通知 --> 
        <aop:around method="transactionAround" pointcut-ref="pt1"/>
    	</aop:aspect>
    </aop:config>
    <!--
    aop:around:
    作用：
    	用于配置环绕通知
    属性：
    method：指定通知中方法的名称。
    pointct：定义切入点表达式
    pointcut-ref：指定切入点表达式的引用
    说明：
    	它是 spring 框架为我们提供的一种可以在代码中手动控制增强代码什么时候执行的方式。
    注意：
    	通常情况下，环绕通知都是独立使用的
    -->
    
    ```

    ```java
    /**
    * 环绕通知
    * @param pjp
    * spring 框架为我们提供了一个接口：ProceedingJoinPoint，它可以作为环绕通知的方法参数。
    * 在环绕通知执行时，spring 框架会为我们提供该接口的实现类对象，我们直接使用就行。
    * @return
    */
    public Object transactionAround(ProceedingJoinPoint pjp) {
        //定义返回值
        Object rtValue = null;
        try {
            //获取方法执行所需的参数
            Object[] args = pjp.getArgs();
            //前置通知：开启事务
            beginTransaction();
            //执行方法
            rtValue = pjp.proceed(args);
            //后置通知：提交事务
            commit();
        }catch(Throwable e) {
            //异常通知：回滚事务
            rollback();
            e.printStackTrace();
        }finally {
            //最终通知：释放资源
            release();
        }
        return rtValue; 
    }
    
    ```

## SpringAOP(注解配置)

#### 导jar包/maven坐标:

```
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.2.4.RELEASE</version>
</dependency>
<!--切入点表达式用到的[aspectj:语言的软件联盟;解析execution表达式] -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.8.7</version>
</dependency>

```

#### 配置命名空间

第二部:在配置文件中导入`context命名空间`

```XML
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:aop="http://www.springframework.org/schema/aop"
xmlns:context="http://www.springframework.org/schema/context"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd
 http://www.springframework.org/schema/aop
 http://www.springframework.org/schema/aop/spring-aop.xsd
 http://www.springframework.org/schema/context
 http://www.springframework.org/schema/context/spring-context.xsd">
</beans>

```

#### 配置资源

把资源使用注解配置

在spring中配置要扫描的包,这也是所有Spring基于开发需要做的;

在通知类上用`@Aspect`注解声明这是一个通知类

在增强方法上使用注解配置通知

**Spring注解的通知调用顺序有问题**

```java
@Before
作用：
	把当前方法看成是前置通知。
属性：
	value：用于指定切入点表达式，还可以指定切入点表达式的引用。


@AfterReturning
作用：
	把当前方法看成是后置通知。
属性：
	value：用于指定切入点表达式，还可以指定切入点表达式的引用


@AfterThrowing
作用：
	把当前方法看成是异常通知。
属性：
	value：用于指定切入点表达式，还可以指定切入点表达式的引用


@After
作用：
	把当前方法看成是最终通知。
属性：
	value：用于指定切入点表达式，还可以指定切入点表达式的引用

```

##### Spring环绕通知

```
@Around
作用：
	把当前方法看成是环绕通知。
属性：
	value：用于指定切入点表达式，还可以指定切入点表达式的引用。

```

##### 配置切入点表达式

```
@Pointcut
作用：
	指定切入点表达式
属性：
	value：指定表达式的内容
@Pointcut("execution(* com.itheima.service.impl.*.*(..))")
private void pt1() {}

```

不适用XMl的配置方式

```
在类上加入
@EnableAspectJAutoProxy

```

