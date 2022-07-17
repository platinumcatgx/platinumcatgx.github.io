# Dockers 基础
2021-03-19 23:11:55
            
---


> **安装**
>
> 

>
> **运行与停止**
>
> 

>
> **运行**
>
> docker run ubuntu:15.10 /bin/echo "Hello world"
-   docker: Docker 的二进制执行文件。
-   run: 与前面的 docker 组合来运行一个容器
-   ubuntu:15.10 指定要运行的镜像，Docker 首先从本地主机上查找镜像是否存在，如果不存在，Docker 就会从镜像仓库 Docker Hub 下载公共镜像。
-   /bin/echo "Hello world": 在启动的容器里执行的命令
> **运行交互式容器**
>
> docker run -i -t ubuntu:15.10 /bin/bash
-   -t: 在新容器内指定一个伪终端或终端。
-   -i: 允许你对容器内的标准输入 (STDIN) 进行交互。
-   -d: 在后台运行
-   -P: 将容器内部使用的网络端口随机映射到我们使用的主机上
> **运行(后台模式)**
>
> docker run -d ubuntu:15.10 /bin/sh -c "while true; do echo hello world; sleep 1; done"
>
> 运行只有一长串字符, 这个字符叫容器ID,
>
> 通过docker ps 查看容器信息
>
> 输出详情介绍：
>
> **CONTAINER ID**: 容器 ID。
>
> **IMAGE**: 使用的镜像。
>
> **COMMAND**: 启动容器时运行的命令。
>
> **CREATED**: 容器的创建时间。
>
> **STATUS**: 容器状态。
>
> **状态**有 7 种：
>
> created（已创建）
>
> restarting（重启中）
>
> running 或 Up（运行中）
>
> removing（迁移中）
>
> paused（暂停）
>
> exited（停止）
>
> dead（死亡）
>
> **PORTS**: 容器的端口信息和使用的连接类型（tcpudp）。
>
> **NAMES**: 自动分配的容器名称。输出详情介绍：
>
> **停止容器**
>
> docker stop [容器ID/容器名称]
>
> 

>
> **容器的使用**
>
> **docker 客户端**
>
> **容器使用**
>
> 获取镜像
>
> docker pull ubuntu
>
> 启动已停止运行的容器
>
> 查看所有容器 docker ps -a; docker start dc0819ab449f
>
> 进入后台启动的容器
>
> docker attach : 如果从这个容器退出，会导致容器的停止。
>
> docker exec: docker exec 命令退出容器终端，不会导致容器的停止
>
> **容器的导入和导出**
>
> **导出**
>
> docker export DOCKER_NAME > FILENAME.tar 导出容器 DOCKER_NAME 快照到本地文件 ubuntu.tar
>
> **导入**
>
> cat docker/ubuntu.tar | docker import - test/ubuntu:v1 将快照文件 ubuntu.tar 导入到镜像 test/ubuntu:v1:
>
> docker import <http://example.com/exampleimage.tgz> example/imagerepo 通过指定 URL 或者某个目录来导入
>
> **删除容器**
>
> docker rm -f DOCKER_NAME
>
> **运行一个 web 应用**
>
> 
runoob@runoob:~# docker pull training/webapp # 载入镜像
>
> 
runoob@runoob:~# docker run -d -P training/webapp python app.py
>
> docker ps -a 可以看到, 多了端口信息 0.0.0.0:32769->5000/tcp : Docker 开放了端口 5000, 并映射到了本机的 32769 端口
>
> 通过 -P 设置端口 docker run -d -p 5000:5000 training/webapp python app.py
>
> **快速查看 docker 端口**
>
> docker port NAME
>
> **查看 web 应用的日志**
>
> docker logs [ID或者名字] 可以查看容器内部的标准输出。
>
> **查看 web 应用的进程**
>
> docker top [ID或者名字] 查看内部运行的程序
>
> **检查 WEB 应用程序**
>
> 使用 docker inspect 来查看 Docker 的底层信息。它会返回一个 JSON 文件记录着 Docker 容器的配置和状态信息。
>
> **停止 WEB 应用容器**
>
> docker stop NAME
>
> **重启 WEB 应用容器**
>
> 已经停止的容器，我们可以使用命令 docker start 来启动。
>
> 
docker start wizardly_chandrasekhar
>
> 
wizardly_chandrasekhar
>
> docker ps -l 查询最后一次创建的容器：
>
> 
CONTAINER ID 
 
 
 IMAGE 
 
 
 
 
 
 
 
 
 
 
 
 
 
 PORTS 
 
 
 
 
 
 
 
 
 
 NAMES
>
> 
bf08b7f2cd89 
 
 
 training/webapp 
 
 ... 
 
 
 0.0.0.0:5000->5000/tcp 
 wizardly_chandrasekhar
>
> 正在运行的容器，我们可以使用 docker restart 命令来重启。
>
> **移除 WEB 应用容器**
>
> 我们可以使用 docker rm 命令来删除不需要的容器
>
> docker rm wizardly_chandrasekhar 删除容器时，容器必须是停止状态，否则会报如下错
>
> 

>
> **docker 镜像使用**
-   管理镜像
-   创建镜像
> 列出本地镜像 docker images
-   REPOSITORY：表示镜像的仓库源
-   TAG：镜像的标签
-   IMAGE ID：镜像 ID
-   CREATED：镜像创建时间
-   SIZE：镜像大小
> 预先下载镜像 docker pull dockerIDNAME
>
> 查找镜像 在 docker hub 上找 <https://hub.docker.com/> docker search name
-   NAME: 镜像仓库源的名称
-   DESCRIPTION: 镜像的描述
-   OFFICIAL: 是否 docker 官方发布
-   stars: 类似 Github 里面的 star，表示点赞、喜欢的意思。
-   AUTOMATED: 自动构建。
> huo 取镜像 docker pull name
>
> 删除镜像 docker rm name
>
> **创建镜像**
-   从已经创建的容器中更新镜像，并且提交这个镜像
-   使用 Dockerfile 指令来创建一个新的镜像
```{=html}
<!-- -->
```
-   docker commit -m="has update" -a="runoob" e218edb10161 runoob/ubuntu:v2
-   参数说明
-   -m: 提交的描述信息
-   -a: 指定镜像作者
-   e218edb10161：容器 ID
-   runoob/ubuntu:v2: 指定要创建的目标镜像名
> **构建镜像**
>
> docker build ， 从零开始来创建一个新的镜像
>
> 为此，我们需要创建一个 Dockerfile(这里不描述了) 文件，其中包含一组指令来告诉 Docker 如何构建我们的镜像。
>
> 
runoob@runoob:~$ cat Dockerfile
>
> 
FROM 
 centos:6.7
>
> 
MAINTAINER 
 
 Fisher "fisher@sudops.com"
>
> 
​
>
> 
RUN 
 
 /bin/echo 'root:123456' |chpasswd
>
> 
RUN 
 
 useradd runoob
>
> 
RUN 
 
 /bin/echo 'runoob:123456' |chpasswd
>
> 
RUN 
 
 /bin/echo -e "LANG="en_US.UTF-8"" >/etc/default/local
>
> 
EXPOSE 
22
>
> 
EXPOSE 
80
>
> 
CMD 
 
 /usr/sbin/sshd -D
>
> 每一个指令都会在镜像上创建一个新的层，每一个指令的前缀都必须是大写的。
>
> 第一条 FROM，指定使用哪个镜像源
>
> RUN 指令告诉 docker 在镜像内执行命令，安装了什么。。。
>
> 然后，我们使用 Dockerfile 文件，通过 docker build 命令来构建一个镜像。
>
> docker build -t runoob/centos:6.7 .
-   -t ：指定要创建的目标镜像名
-   . ：Dockerfile 文件所在目录，可以指定 Dockerfile 的绝对路径
> **设置镜像标签**
>
> 使用docker tag命令 docker tag 860c279d2fec runoob/centos:dev docker tag 镜像 ID，这里是 860c279d2fec ,用户名称、镜像源名(repository name)和新的标签名(tag)
>
> **容器连接**
>
> 前面我们实现了通过网络端口来访问运行在 docker 容器内的服务。 容器中可以运行一些网络应用，要让外部也可以访问这些应用，可以通过 -P 或 -p 参数来指定端口映射。 下面我们来实现通过端口连接到一个 docker 容器。
>
> 
docker run -d -P training/webapp python app.py
>
> 还可以用-p 绑定网络地址(例如 127.0.0.1)
-   **-P** :是容器内部端口**随机**映射到主机的高端口。
-   **-p** : 是容器内部端口**绑定**到指定的主机端口。
> 
docker run -d -p 127.0.0.1:5001:5000 training/webapp python app.py
>
> 默认都是绑定 tcp 端口，如果要绑定 UDP 端口，可以在端口后面加上 /udp。
>
> docker port 命令可以让我们快捷地查看端口的绑定情况。
>
> **Docker 容器互联**
>
> docker 有一个连接系统, 可以将多个系统连接到一起, 共享连接信息
>
> docker 连接会创建一个父子关系，其中 父容器可以看到子容器的信息
>
> **容器命名**
>
> docker run -d -P --name runoob training/webapp python app.py
>
> docker rename oldName newName 重命名已有容器
>
> **新建 Docker 网络**
>
> docker network create -d bridge test-net
>
> -d：参数指定 Docker 网络类型，有 bridge、overlay。 overlay 网络类型用于 Swarm mode
>
> **连接容器**
>
> 运行一个容器并连接到新建的网络 创建见两个容器, 并加入网络 test-net
>
> 
docker run -itd --name test1 --network test-net ubuntu /bin/bash
>
> 
docker run -itd --name test2 --network test-net ubuntu /bin/bash
>
> 在容器中使用 ping [另一个容器的 name]
>
> **配置 DNS**
-   在宿主机的/etc/docker/daemon.json 文件中加入一下内容来设置全部容器的 DNS
> 
{
>
> 
 "dns" : [
>
> 
 
 "114.114.114.114",
>
> 
 
 "8.8.8.8"
>
> 
 ]
>
> 
}
>
> 设置后，启动容器的 DNS 会自动配置为 114.114.114.114 和 8.8.8.8。
>
> 配置完，需要重启 docker 才能生效。
>
> 查看容器的 DNS 是否生效可以使用以下命令，它会输出容器的 DNS 信息： docker run -it --rm ubuntu cat etc/resolv.conf 2. 手动指定容器的配置 在指定的容器设置 DNS docker run -it --rm -h host_ubuntu --dns=114.114.114.114 --dns-search=test.com ubuntu
-   参数说明：
-   --rm：容器退出时自动清理容器内部的文件系统。
-   -h HOSTNAME 或者 --hostname=HOSTNAME： 设定容器的主机名，它会被写到容器内的 /etc/hostname 和 /etc/hosts。
-   --dns=IP_ADDRESS： 添加 DNS 服务器到容器的 /etc/resolv.conf 中，让容器用这个服务器来解析所有不在 /etc/hosts 中的主机名。
-   --dns-search=DOMAIN： 设定容器的搜索域，当设定搜索域为 .example.com 时，在搜索一个名为 host 的主机时，DNS 不仅搜索 host，还会搜索 host.example.com。
> 如果在容器启动时没有指定 --dns 和 --dns-search，Docker 会默认用宿主主机上的 /etc/resolv.conf 来配置容器的 DNS
>
> 

>
> 解决 windows 系统无法对 docker 容器进行端口映射的问题 1、问题：
>
> 在 Windows 家庭版下安装了 docker，并尝试在其中运行 jupyter notebook 等服务，但映射完毕之后，在主机的浏览器中，打开 localhost:port 无法访问对应的服务。
>
> 2、问题出现的原因：
>
> 
The reason you're having this, is because on Linux, the docker daemon (and your containers) run on the Linux machine itself, so "localhost" is also the host that the container is running on, and the ports are mapped to.
>
> 
​
>
> 
On Windows (and OS X), the docker daemon, and your containers cannot run natively, so only the docker client is running on your Windows machine, but the daemon (and your containers) run in a VirtualBox Virtual Machine, that runs Linux.
>
> 因为 docker 是运行在 Linux 上的，在 Windows 中运行 docker，实际上还是在 Windows 下先安装了一个 Linux 环境，然后在这个系统中运行的 docker。也就是说，服务中使用的 localhost 指的是这个 Linux 环境的地址，而不是我们的宿主环境 Windows。
>
> 3、解决方法：
>
> 通过命令:
>
> docker-machine ip default # 其中，default 是 docker-machine 的 name，可以通过 docker-machine -ls 查看 找到这个 Linux 的 ip 地址，一般情况下这个地址是 192.168.99.100，然后在 Windows 的浏览器中，输入这个地址，加上服务的端口即可启用了。
>
> 比如，首先运行一个 docker 容器：
>
> docker run -it -p 8888:8888 conda:v1 其中，conda:v1 是我的容器名称。然后在容器中开启 jupyter notebook 服务：
>
> jupyter notebook --no-browser --port=8888 --ip=172.17.0.2 --allow-root 其中的 ip 参数为我的容器的 ip 地址，可以通过如下命令获得：
>
> docker inspect container_id 最后在 windows 浏览器中测试结果：
>
> [**http://192.168.99.100:8888**](http://192.168.99.100:8888)
>
> 

>
> **Docker 仓库**
>
> Docker Hub, docker 官方维护的一个公共仓库
>
> 注册 在 <https://hub.docker.com> 免费注册一个 Docker 账号。
>
> 登录和退出 登录需要输入用户名和密码，登录成功后，我们就可以从 docker hub 上拉取自己账号下的全部镜像。
>
> 
docker login
>
> 
docker logout
>
> 搜索镜像 docker search ubuntu 拉取镜像 docker pull ubuntu 推送镜像 docker push
>
> 
$ docker tag ubuntu:18.04 Docker账号用户名/ubuntu:18.04
>
> 
$ docker image ls
>
> 
​
>
> 
REPOSITORY 
 
 TAG 
 
 
 IMAGE ID 
 
 
 
 
 CREATED 
 
 
 
 
 ...
>
> 
ubuntu 
 
 
 
 
18.04 
 
 275d79972a86 
 
 
 
6 days ago 
 
 
 ...
>
> 
username/ubuntu 18.04 
 
 275d79972a86 
 
 
 
6 days ago 
 
 
 ...
>
> 
$ docker push username/ubuntu:18.04
>
> 
$ docker search username/ubuntu
>
> 
​
>
> 
NAME 
 
 
 
 
 
 DESCRIPTION 
 
 
 STARS 
 
 
 
 OFFICIAL 
 AUTOMATED
>
> **Dockerfile 文件**
>
> Dockerfile 是一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明
>
> 指令介绍
-   FROM
-   定制的镜像都是基于 FROM 的镜像
-   RUN
-   用于执行后面跟着的命令行命令
> shell 格式：
>
> 
RUN <命令行命令>
>
> 
# <命令行命令> 等同于，在终端操作的 shell 命令。
>
> exec 格式：
>
> 
RUN ["可执行文件", "参数 1", "参数 2"]
>
> 
​
>
> 
# 例如：
>
> 
# RUN ["./test.php", "dev", "offline"] 等价于 RUN ./test.php dev offline
>
> Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大, 以 && 符号连接命令，这样执行后，可以减少镜像层数
>
> **构建镜像**
>
> docker build -t NAME:TAG . 这里的. 是上下文路径
>
> 上下文路径，是指 docker 在构建镜像，有时候想要使用到本机的文件（比如复制），docker build 命令得知这个路径后，会将路径下的所有内容打包。
>
> 解析：由于 docker 的运行模式是 C/S。我们本机是 C，docker 引擎是 S。实际的构建过程是在 docker 引擎下完成的，所以这个时候无法用到我们本机的文件。这就需要把我们本机的指定目录下的文件一起打包提供给 docker 引擎使用。
>
> 如果未说明最后一个参数，那么默认上下文路径就是 Dockerfile 所在的位置。
>
> 注意：上下文路径下不要放无用的文件，因为会一起打包发送给 docker 引擎，如果文件过多会造成过程缓慢。
>
> 指令介绍
>
> COPY
>
> 复制指令，从上下文目录中复制文件或者目录到容器里指定路径。
>
> 
COPY [--chown=<user>:<group>] <源路径1>... <目标路径>
>
> 
COPY [--chown=<user>:<group>] ["<源路径1>",... 
"<目标路径>"]
>
> [--chown=<user>:<group>]：可选参数，用户改变复制到容器内文件的拥有者和属组。 <源路径>：源文件或者源目录，这里可以是通配符表达式，其通配符规则要满足 Go 的 filepath.Match 规则 <目标路径>：容器内的指定路径，该路径不用事先建好，路径不存在的话，会自动创建
>
> **ADD** ADD 指令和 COPY 的使用格式一致（同样需求下，官方推荐使用 COPY）。功能也类似，不同之处如下：
-   ADD 的优点：在执行 <源文件> 为 tar 压缩文件的话，压缩格式为 gzip, bzip2 以及 xz 的情况下，会自动复制并解压到 <目标路径>。
-   ADD 的缺点：在不解压的前提下，无法复制 tar 压缩文件。会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢。具体是否使用，可以根据是否需要自动解压来决定。 **CMD** 类似于 RUN 指令，用于运行程序，但二者运行的时间点不同:
-   CMD 在 docker run 时运行。
-   RUN 是在 docker build。 *作用*：为启动的容器指定默认要运行的程序，程序运行结束，容器也就结束。CMD 指令指定的程序可被 docker run 命令行参数中指定要运行的程序所覆盖。
> *注意*：如果 Dockerfile 中如果存在多个 CMD 指令，仅最后一个生效。
>
> 格式：
>
> CMD <shell 命令>
> CMD ["<可执行文件或命令>","<param1>","<param2>",...]
> CMD ["<param1>","<param2>",...]# 该写法是为 ENTRYPOINT 指令指定的程序提供默认参数
>
> 推荐使用第二种格式，执行过程比较明确。第一种格式实际上在运行的过程中也会自动转换成第二种格式运行，并且默认可执行文件是 sh。
>
> **ENTRYPOINT** 类似于 CMD 指令，但其不会被 docker run 的命令行参数指定的指令所覆盖，而且这些命令行参数会被当作参数送给 ENTRYPOINT 指令指定的程序。
>
> 但是, 如果运行 docker run 时使用了 --entrypoint 选项，此选项的参数可当作要运行的程序覆盖 ENTRYPOINT 指令指定的程序。
>
> 优点：在执行 docker run 的时候可以指定 ENTRYPOINT 运行所需的参数。
>
> 注意：如果 Dockerfile 中如果存在多个 ENTRYPOINT 指令，仅最后一个生效。
>
> 格式：
>
> ENTRYPOINT ["<executeable>","<param1>","<param2>",...]
>
> 可以搭配 CMD 命令使用：一般是变参才会使用 CMD ，这里的 CMD 等于是在给 ENTRYPOINT 传参，以下示例会提到。
>
> 示例：
>
> 假设已通过 Dockerfile 构建了 nginx:test 镜像：
>
> FROM nginx
>
> ENTRYPOINT ["nginx","-c"]# 定参
> CMD ["/etc/nginx/nginx.conf"]# 变参
>
> 1、不传参运行
>
> $ docker run nginx:test 容器内会默认运行以下命令，启动主进程。
>
> nginx -c /etc/nginx/nginx.conf 2、传参运行
>
> $ docker run nginx:test -c /etc/nginx/new.conf 容器内会默认运行以下命令，启动主进程(/etc/nginx/new.conf:假设容器内已有此文件)
>
> nginx -c /etc/nginx/new.conf **ENV** 设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。
>
> 格式：
>
> ENV <key><value> ENV <key1>=<value1><key2>=<value2>... 以下示例设置 NODE_VERSION = 7.2.0 ， 在后续的指令中可以通过 $NODE_VERSION 引用：
>
> ENV NODE_VERSION 7.2.0
>
> RUN curl -SLO "<https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz>" 
> && curl -SLO "<https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc>"
>
> **ARG** 构建参数，与 ENV 作用一至。不过作用域不一样。ARG 设置的环境变量仅对 Dockerfile 内有效，也就是说只有 docker build 的过程中有效，构建好的镜像内不存在此环境变量。
>
> 构建命令 docker build 中可以用 --build-arg <参数名>=<值> 来覆盖。
>
> 格式：
>
> ARG <参数名>[=<默认值>] **VOLUME** 定义匿名数据卷。在启动容器时忘记挂载数据卷，会自动挂载到匿名卷。
>
> 作用：
>
> 避免重要的数据，因容器重启而丢失，这是非常致命的。 避免容器不断变大。 格式：
>
> VOLUME ["<路径 1>","<路径 2>"...] VOLUME <路径> 在启动容器 docker run 的时候，我们可以通过 -v 参数修改挂载点。
>
> **EXPOSE** 仅仅只是声明端口。
>
> 作用：
>
> 帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射。 在运行时使用随机端口映射时，也就是 docker run -P 时，会自动随机映射 EXPOSE 的端口。 格式：
>
> EXPOSE <端口 1>[<端口 2>...] **WORKDIR** 指定工作目录。用 WORKDIR 指定的工作目录，会在构建镜像的每一层中都存在。（WORKDIR 指定的工作目录，必须是提前创建好的）。
>
> docker build 构建镜像过程中的，每一个 RUN 命令都是新建的一层。只有通过 WORKDIR 创建的目录才会一直存在。
>
> 格式：
>
> WORKDIR <工作目录路径> **USER** 用于指定执行后续命令的用户和用户组，这边只是切换后续命令执行的用户（用户和用户组必须提前已经存在）。
>
> 格式：
>
> USER <用户名>[:<用户组>] **HEALTHCHECK** 用于指定某个程序或者指令来监控 docker 容器服务的运行状态。
>
> 格式：
>
> HEALTHCHECK [选项] CMD <命令>：设置检查容器健康状况的命令 HEALTHCHECK NONE：如果基础镜像有健康检查指令，使用这行可以屏蔽掉其健康检查指令
>
> HEALTHCHECK [选项] CMD <命令>:这边 CMD 后面跟随的命令使用，可以参考 CMD 的用法。 **ONBUILD** 用于延迟构建命令的执行。简单的说，就是 Dockerfile 里用 ONBUILD 指定的命令，在本次构建镜像的过程中不会执行（假设镜像为 test-build）。当有新的 Dockerfile 使用了之前构建的镜像 FROM test-build ，这是执行新镜像的 Dockerfile 构建时候，会执行 test-build 的 Dockerfile 里的 ONBUILD 指定的命令。
>
> 格式：
>
> ONBUILD <其它指令>




