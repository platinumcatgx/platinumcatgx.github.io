---
title: Java集合框架
date: 2020-04-08 20:45:01
tags: java
---

# 顶层接口:`Collection`,`Map`

<!--more-->

`Collection`:有三个子接口:`List`,`Set`,`Queue`;

Collection定义了一些基本的方法

![CollectionMethod](img\CollectionMethod.png)

## List集合:

特点:有序,允许重复

子类：

* ArrayList：
  * 是一个动态数组，比较常用， 允许任何符合规则的元素插入甚至包括null，初始容量为10，添加元素时会检查容器是否会溢出，随着元素的添加，会进行多次扩容，可以在创建时指定容器的大小，过多的扩容会造成内存浪费以及浪费时间、降低效率
  * ArrayLiat内部以数组的形式保存集合的元素，所以随机访问集合元素有较好的性能；
* LinkedList：
  *  LinkedList是List接口的另一个实现，除了可以根据索引访问集合元素外，LinkedList还实现了Deque接口，可以当作双端队列来使用，也就是说，既可以当作“栈”使用，又可以当作队列使用。 
  *  LinkedList的实现机制与ArrayList的实现机制完全不同
  * LinkedList内部以链表的形式保存集合中的元素，所以随机访问集合中的元素性能较差，但在插入删除元素时有较好的性能。 
* Vector：
  *  与ArrayList相似，但是Vector是同步的。所以说Vector是线程安全的动态数组。它的操作与ArrayList几乎一样。 
* srack： Stack继承自Vector，实现一个后进先出的堆栈。
  * Stack提供5个额外的方法使得Vector得以被当作堆栈使用。基本的`push`和`pop` 方法，还有`peek`方法得到栈顶的元素，`empty`方法测试堆栈是否为空，`search`方法检测一个元素在堆栈中的位置。
  * Stack刚创建后是空栈。 

## Set集合:

特点:无序,不允许重复

子类:

* HashSet

  * hashSet线程不安全
  * 查找原理：根据元素的hashcode值存储和查找,所以查找较快

* LinkedHashSet

  * hashSet的子类使用链表维护元素的次序,元素顺序与添加一致，由于LinkedHashSet需要维护元素的插入顺序，因此性能略低于HashSet，但在迭代访问Set里的全部元素时由很好的性能。 

* TreeSet:

  * 是 SortedSet 接口的实现类,可以保证元素处于排序状态,有两种配许方式：自然排序和定制排序; 当一个对象需要添加到TreeSet中，必须实现Comparable接口
    * 自然排序:调用comparableTo(Object obj)方法,根据返回值类型(<0,0,>0),进行排序
    * 定制排序：创建时提供一个Comparator对象，有该对象管理排序逻辑

* EnumSet：

  * 根据枚举值定义在枚举内部的顺序来确定元素排序

* > 性能：
  >
  > HashSet的性能比TreeSet的性能好（特别是添加，查询元素时），因为TreeSet需要额外的红黑树算法维护元素的次序，如果需要一个保持排序的Set时才用TreeSet，否则应该使用HashSet。
  >
  > 　　LinkedHashSet是HashSet的子类，由于需要链表维护元素的顺序，所以插入和删除操作比HashSet要慢，但遍历比HashSet快。
  >
  > 　　EnumSet是所有Set实现类中性能最好的，但它只能 保存**同一个枚举类**的枚举值作为集合元素。
  >
  > 　　以上几个Set实现类都是线程不安全的，如果多线程访问，必须手动保证集合的同步性，

## Map集合：

API:

![MapMethed](img\MapMethed.png)

![MapMethed2](img\MapMethed2.png)

实现类:

* HashMap 和 HashTable
  * HashMap工作原理： 基于hashing原理，通过put()和get()方法存储和获取对象。当我们将键值对传递给put()方法时，它调用建对象的hashCode()方法来计算hashCode值，然后找到bucket位置来储存值对象。当获取对象时，通过建对象的equals()方法找到正确的键值对，然后返回对象。HashMap使用链表来解决碰撞问题，当发生碰撞了，对象将会存储在链表的下一个节点中。 
  *  HashMap是线程不安全，HashTable是线程安全的 ,但是HashTable提供的方法比较繁琐
  * HasjMap中可以将null作为键或值，HashTable会报空指针异常
* LinkedHashMap
  *  使用双向链表来维护key-value对的次序（其实只需要考虑key的次序即可），该链表负责维护Map的迭代顺序，与插入顺序一致，因此性能比HashMap低，但在迭代访问Map里的全部元素时有较好的性能。 
* Properties
  *  它相当于一个key、value都是String类型的Map，主要用于读取配置文件 
* TreeMap
  *  TreeMap是SortedMap的实现类，是一个红黑树的数据结构，每个key-value对作为红黑树的一个节点。TreeMap存储key-value对时，需要根据key对节点进行排序 
  * 和TreeSet相同，有自然排序和定制排序两种方式
* 性能:
  *  HashMap通常比Hashtable（古老的线程安全的集合）要快 
  *  TreeMap通常比HashMap、Hashtable要慢，因为TreeMap底层采用红黑树来管理key-value。 
  *  LinkedHashMap比HashMap慢一点，因为它需要维护链表来爆出key-value的插入顺序。　  











## 工具：

 `Iterator`接口 和 `ListIterator` 接口：

 `Iterator`是集合的迭代器。集合可以通过Iterator去遍历集合中的元素 

*  boolean hasNext()：判断集合里是否存在下一个元素。如果有，hasNext()方法返回 true。
* Object next()：返回集合里下一个元素。
* void remove()：删除集合里上一次next方法返回的元素。 

`ListIterator`接口继承Iterator接口，提供了专门操作List的方法。ListIterator接口在Iterator接口的基础上增加了以下几个方法：

* boolean hasPrevious()：判断集合里是否存在上一个元素。如果有，该方法返回 true。
* Object previous()：返回集合里上一个元素。
* void add(Object o)：在指定位置插入一个元素。