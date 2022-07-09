# NIO

## 基本概念

### 什么是NIO?

非阻塞的IO

### 与IO的区别

![image-20210407073746030](\nio.assets\image-20210407073746030.png)

### Path, Paths, Files

#### 出现原因

![image-20210407073836825](\nio.assets\image-20210407073836825.png)

Path: 代表一个平台无关的路径, 实际引用的资源可以不存在

![image-20210407074248435](\nio.assets\image-20210407074248435.png)

![image-20210407074314037](\nio.assets\image-20210407074314037.png)

URI: 统一资源标识符 (抽象的)

​	URL: 统一资源定位符

​	URN: 统一资源命名

### API

Path

![image-20210407074515926](\nio.assets\image-20210407074515926.png)

**Files**

操作文件或目录的工具类

![image-20210407074556100](\nio.assets\image-20210407074556100.png)

Files: 判断方法

![image-20210407074626846](\nio.assets\image-20210407074626846.png)

操作内容

![image-20210407074649170](\nio.assets\image-20210407074649170.png)

### 自动资源管理

Java 7 增加了一个新特性，该特性提供了另外一种管理资源的方式，这种方式能自动关闭文件

该特性以 try 语句的扩展版为基础。自动资源管理主要用于当不再需要文件（或其他资源）时，可以防止无意中忘记释放它们。

```java
try(需要关闭的资源声明){
	//可能发生异常的语句
}catch(异常类型 变量名){
	//异常的处理语句
}
……
finally{
	//一定执行的语句
}

```

①try 语句中声明的资源被隐式声明为 final ，资源的作用局限于带资源的 try 语句

②可以在一条 try 语句中管理多个资源，每个资源以“;” 隔开即可。

**③需要关闭的资源，必须实现了*AutoCloseable*接口或其子接口 *Closeable***

## 缓冲区 Buffer

NIO的核心: 通道, 缓冲区

通道: 表示IO源到 IO 设备(例如：文件、套接字)的连接

> l若需要使用 NIO 系统，需要获取用于连接 IO 设备的通道以及用于容纳数据的缓冲区。然后操作缓冲区，对数据进行处理。

**Channel负责传输，Buffer负责存储数据**

### 缓冲区

一个用于特定基本数据类型(除了boolean)的容器, 底层使用数组存储

由 java.nio 包定义的，所有缓冲区都是 Buffer 抽象类的子类。

> lJava NIO 中的 Buffer 主要用于与 NIO 通道(Channel)进行交互，数据是从通道读入缓冲区，从缓冲区写入通道中的。

### IO / NIO

IO

![image-20210407075410676](\nio.assets\image-20210407075410676.png)

NIO

![image-20210407075434000](\nio.assets\image-20210407075434000.png)

### Buffer常用子类

```java
Buffer
    ByteBuffer
    	MapperByteBuffer
    CharBUffer
    ShortBuffer
    IntBuffer
    LongBuffer
    FloatBuffer
    DoubleBuffer
// 上述Buffer都采用了相似的方式管理数据, 都是通过各自类方法获取一个Buffer对象
//static XxxBuffer allocate(int 容量) 
```

#### 基本属性

**容量 (capacity)** :表示 Buffer 最大数据容量，一旦声明后，*不能更改*。通过Buffer中的capacity()获取。缓冲区capacity不能为负。

**限制 (limit)**:第一个不应该读取或写入的数据的索引，即位于 limit 后的数据不可读写。通过Buffer中的limit()获取。缓冲区的limit不能为负，并且不能大于其capacity。

**位置 (position)**:当前要读取或写入数据的索引。通过Buffer中的position()获取。缓冲区的position不能为负，并且不能大于其limit。

**标记 (mark)**:标记是一个索引，通过 Buffer 中的 mark() 方法将mark标记为当前position位置。 之后可以通过调用 reset() 方法将 position恢复到标记的mark处。

标记、位置、限制、容量遵守以下不变式  :  0 <= mark <= position <= limit <= capacity 

#### 基本操作

put: 写入缓存

get: 获取数据![image-20210407080241520](\nio.assets\image-20210407080241520.png)

![image-20210407080338069](\nio.assets\image-20210407080338069.png)

> **字节缓冲区要么是直接的，要么是非直接的**。如果为直接字节缓冲区，则 Java 虚拟机会尽最大努力直接在此缓冲区上执行本机 I/O 操作。也就是说，在每次调用基础操作系统的一个本机 I/O 操作之前（或之后），虚拟机都会尽量避免将缓冲区的内容复制到中间缓冲区中（或从中间缓冲区中复制内容）。 
> 直接字节缓冲区可以通过调用ByteBuffer的 **allocateDirect()** 工厂方法来创建。此方法返回的**缓冲区进行分配和取消分配所需成本通常高于非直接缓冲区**。直接缓冲区的内容可以驻留在常规的垃圾回收堆之外，因此，它们对应用程序的内存需求量造成的影响可能并不明显。所以，**建议将直接缓冲区主要分配给那些易受基础系统的本机 I/O 操作影响的大型、持久的缓冲区。**一般情况下，**最好仅在直接缓冲区能在程序性能方面带来明显好处时分配它们。** 
> 直接字节缓冲区还可以通过 **FileChannel 的 map()** 方法 将文件区域直接映射到内存中来创建。该方法返回ByteBuffer的子类：**MappedByteBuffer** 。Java 平台的实现有助于通过 JNI 从本机代码创建直接字节缓冲区。如果以上这些缓冲区中的某个缓冲区实例指的是不可访问的内存区域，则试图访问该区域不会更改该缓冲区的内容，并且将会在访问期间或稍后的某个时间导致抛出不确定的异常。 
> 字节缓冲区是直接缓冲区还是非直接缓冲区可通过调用其 isDirect() 方法来确定。提供此方法是为了能够在性能关键型代码中执行显式缓冲区管理。

![image-20210407081314569](\nio.assets\image-20210407081314569.png)

![image-20210407081326913](\nio.assets\image-20210407081326913.png)

## 通道

由Java.nio.channels包定义

- Channel 表示数据源与目标节点之间打开的连接
- Channel 类似于传统的“流”。只不过 Channel 本身不能直接存储数据，Channel 只能与 Buffer 进行交互。

#### 传统IO处理方式

![image-20210407081639765](\nio.assets\image-20210407081639765.png)

> DMA(Direct Memory Access，直接内存存取器)
>
> 在DMA模式下，CPU只须向DMA控制器下达指令，让DMA控制器来处理数据的传送，数据传送完毕再把信息反馈给CPU，这样就很大程度上减轻了CPU资源占有率，可以大大节省系统资源。DMA模式又可以分为Single-Word DMA（单字节DMA）和Multi-Word DMA（多字节DMA）两种，其中所能达到的最大传输速率也只有16.6MB/s

#### 使用Channel的处理方式

Channel:专门用于IO

![image-20210407081727458](\nio.assets\image-20210407081727458.png)

**Channel接口的主要实现类**

- FileChannel：用于读取、写入、映射和操作文件的通道
- SocketChannel：通过 TCP 读写网络中的数据 
- ServerSocketChannel：可以监听新进来的 TCP 连接，对每一个新进来的连接都会创建一个SocketChannel
- DatagramChannel：通过 UDP 读写网络中的数据通道 

获取通道的三种方式

1. 对支持通道的对象调用 getChannel() 方法

   ![image-20210407082125272](\nio.assets\image-20210407082125272.png)

2. 通过XxxChannel的静态方法 open() 打开并返回指定的XxxChannel

3. 使用 Files 工具类的静态方法 newByteChannel() 获取字节通道

**FileChannel的常用方法**

![image-20210407082223591](\nio.assets\image-20210407082223591.png)