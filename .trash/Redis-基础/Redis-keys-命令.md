# Redis keys 命令
2021-05-22 11:06:19
            
---


自身状态的相关操作
有效性控制相关操作
快速查询操作
<table><tbody><tr class="odd"><td><strong>序号</strong></td><td><strong>命令及描述</strong></td></tr><tr class="even"><td>1</td><td><p><a href="https://www.runoob.com/redis/keys-del.html">DEL key</a></p><p>该命令用于在 key 存在时删除 key。</p></td></tr><tr class="odd"><td>3</td><td><p><a href="https://www.runoob.com/redis/keys-exists.html">EXISTS key</a></p><p>检查给定 key 是否存在。</p></td></tr><tr class="even"><td>17</td><td><p><a href="https://www.runoob.com/redis/keys-type.html">TYPE key</a></p><p>返回 key 所储存的值的类型。</p></td></tr><tr class="odd"><td>2</td><td><p><a href="https://www.runoob.com/redis/keys-dump.html">DUMP key</a></p><p>序列化给定 key ，并返回被序列化的值。</p></td></tr><tr class="even"><td>4</td><td><p><a href="https://www.runoob.com/redis/keys-expire.html">EXPIRE key</a> seconds</p><p>为给定 key 设置过期时间，以秒计。</p></td></tr><tr class="odd"><td>5</td><td><p><a href="https://www.runoob.com/redis/keys-expireat.html">EXPIREAT key timestamp</a></p><p>EXPIREAT 的作用和 EXPIRE 类似，都用于为 key 设置过期时间。 不同在于 EXPIREAT 命令接受的时间参数是 UNIX 时间戳(unix timestamp)。</p></td></tr><tr class="even"><td>6</td><td><p><a href="https://www.runoob.com/redis/keys-pexpire.html">PEXPIRE key milliseconds</a></p><p>设置 key 的过期时间以毫秒计。</p></td></tr><tr class="odd"><td>7</td><td><p><a href="https://www.runoob.com/redis/keys-pexpireat.html">PEXPIREAT key milliseconds-timestamp</a></p><p>设置 key 过期时间的时间戳(unix timestamp) 以毫秒计</p></td></tr><tr class="even"><td>10</td><td><p><a href="https://www.runoob.com/redis/keys-persist.html">PERSIST key</a></p><p>移除 key 的过期时间，key 将持久保持。</p></td></tr><tr class="odd"><td>11</td><td><p><a href="https://www.runoob.com/redis/keys-pttl.html">PTTL key</a></p><p>以毫秒为单位返回 key 的剩余的过期时间。</p></td></tr><tr class="even"><td>12</td><td><p><a href="https://www.runoob.com/redis/keys-ttl.html">TTL key</a></p><p>以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)。</p></td></tr><tr class="odd"><td>8</td><td><p><a href="https://www.runoob.com/redis/keys-keys.html">KEYS pattern</a></p><p>查找所有符合给定模式( pattern)的 key 。</p></td></tr><tr class="even"><td>9</td><td><p><a href="https://www.runoob.com/redis/keys-move.html">MOVE key db</a></p><p>将当前数据库的 key 移动到给定的数据库 db 当中。</p></td></tr><tr class="odd"><td>13</td><td><p><a href="https://www.runoob.com/redis/keys-randomkey.html">RANDOMKEY</a></p><p>从当前数据库中随机返回一个 key 。</p></td></tr><tr class="even"><td>14</td><td><p><a href="https://www.runoob.com/redis/keys-rename.html">RENAME key newkey</a></p><p>修改 key 的名称</p></td></tr><tr class="odd"><td>15</td><td><p><a href="https://www.runoob.com/redis/keys-renamenx.html">RENAMENX key newkey</a></p><p>仅当 newkey 不存在时，将 key 改名为 newkey 。</p></td></tr><tr class="even"><td>16</td><td><p><a href="https://www.runoob.com/redis/keys-scan.html">SCAN cursor [MATCH pattern] [COUNT count]</a></p><p>迭代数据库中的数据库键。</p></td></tr><tr class="odd"><td>
</td><td>sort : 排序</td></tr></tbody></table>


*来自 <*<https://www.runoob.com/redis/redis-keys.html>*>*










查询模式规则
|                                   |                        |                           |
|-----------------------------------|------------------------|---------------------------|
| * 匹配**任意数量**的**任意符号** | ? 配合**一个任意符号** | [] 匹配一个**指定符号** |
|                  |                                                     |
|------------------|-----------------------------------------------------|
| keys *          | 查询所有                                            |
| keys it*        | 查询所有以it开头                                    |
| keys *heima     | 查询所有以heima结尾                                 |
| keys ??heima     | 查询所有前面两个字符任意，后面以heima结尾           |
| keys user:?      | 查询所有以user:开头，最后一个字符任意               |
| keys u[st]er:1 | 查询所有以u开头，以er:1结尾，中间包含一个字母，s或t |


1.  





