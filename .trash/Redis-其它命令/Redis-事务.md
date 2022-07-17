# Redis 事务
2021-05-22 11:09:57
            
---


<table><tbody><tr class="odd"><td><strong>序号</strong></td><td><strong>命令及描述</strong></td></tr><tr class="even"><td>1</td><td><p><a href="https://www.runoob.com/redis/transactions-discard.html">DISCARD</a></p><p>取消事务，放弃执行事务块内的所有命令。</p></td></tr><tr class="odd"><td>2</td><td><p><a href="https://www.runoob.com/redis/transactions-exec.html">EXEC</a></p><p>执行所有事务块内的命令。</p></td></tr><tr class="even"><td>3</td><td><p><a href="https://www.runoob.com/redis/transactions-multi.html">MULTI</a></p><p>标记一个事务块的开始。</p></td></tr><tr class="odd"><td>4</td><td><p><a href="https://www.runoob.com/redis/transactions-unwatch.html">UNWATCH</a></p><p>取消 WATCH 命令对所有 key 的监视。</p></td></tr><tr class="even"><td>5</td><td><p><a href="https://www.runoob.com/redis/transactions-watch.html">WATCH key [key ...]</a></p><p>监视一个(或多个) key ，如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断。</p></td></tr></tbody></table>


*来自 <*<https://www.runoob.com/redis/redis-transactions.html>*>*






