# Docker基础(clone)
2021-03-19 23:12:26
            
---


**docker**
基本概念:
-   镜像（Image）：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
-   容器（Container）：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
-   仓库（Repository）：仓库可看成一个代码控制中心，用来保存镜像。
**镜像**
**获取镜像**
-   **查找镜像**
    -   在 docker hub 上找 <https://hub.docker.com/>
    -   docker search NAME
-   **从仓库拉取**
    -   docker pull ID_OR_NAME
-   从已经创建的容器中**更新镜像, 并提交这个镜像**
    -   docker commit -m="has update" -a="group" e218edb10161 group/ubuntu:v2
    -   参数说明
        -   -m: 提交的描述信息
        -   -a: 指定镜像作者
        -   e218edb10161：容器 ID
        -   group/ubuntu:v2: 指定要创建的目标镜像名
-   **使用 Dockerfile 指令来创建一个新的镜像**
    -   docker build 从零开始来创建一个新的镜像
        -   需要创建一个 Dockerfile(这里不描述了) 文件，其中包含一组指令来告诉 Docker 如何构建我们的镜像
    -   docker build -t runoob/centos:6.7 . 通过 docker build 命令, 使用 Dockerfile 文件来构建一个镜像
**管理**
-   docker images (列出本地镜像)
    -   REPOSITORY：表示镜像的仓库源
    -   TAG：镜像的标签
    -   IMAGE ID：镜像 ID
    -   CREATED：镜像创建时间
    -   SIZE：镜像大小
-   删除镜像
    -   docker rmi ID_OR_NAME
**设置镜像标签**
使用docker tag命令, docker tag 860c279d2fec runoob/centos:dev docker tag 镜像 ID，这里是 860c279d2fec ,用户名称、镜像源名(repository name)和新的标签名(tag)
**容器**
-   **查看容器**
    -   docker ps
        -   -a 查询所有容器, 包括已停止的
        -   -l 查询最后一次创建的容器：
            > 输出详情介绍：
            > **CONTAINER ID**: 容器 ID。
            > **IMAGE**: 使用的镜像。 ex
            > **COMMAND**: 启动容器时运行的命令。
            > **CREATED**: 容器的创建时间。
            > **STATUS**: 容器状态。
            > **状态**有 7 种：
            > created（已创建）
            > restarting（重启中）
            > running 或 Up（运行中）
            > removing（迁移中）
            > paused（暂停）
            > exited（停止）
            > dead（死亡）
            > **PORTS**: 容器的端口信息和使用的连接类型（tcpudp）。
            > **NAMES**: 自动分配的容器名称。输出详情介绍：
-   **运行容器**
    -   直接运行(输出在当前控制台,例如 cmd 中)
        > docker run ubuntu:15.10 /bin/echo "Hello world" > *docker*: Docker 的二进制执行文件。
        > *run*: 与前面的 docker 组合来运行一个容器
        > *ubuntu:15.10* 指定要运行的镜像，Docker 首先从本地主机上查找镜像是否存在，如果不存在，Docker 就会从镜像仓库 Docker Hub 下载公共镜像。
        > */bin/echo "Hello world"*: 在启动的容器里执行的命令
    -   运行交互式容器(会进入交互模式)
        > docker run -i -t ubuntu:15.10 /bin/bash
        > -t: 在新容器内指定一个伪终端或终端。
        > -i: 允许你对容器内的标准输入 (STDIN) 进行交互。
        > -d: 在后台运行
        > -P :是容器内部端口**随机**映射到主机的高端口。
        > -p : 是容器内部端口**绑定**到指定的主机端口。
        > 默认都是绑定 tcp 端口，如果要绑定 UDP 端口，可以在端口后面加上 /udp。还可以用-p 绑定网络地址(例如 127.0.0.1)
        > --name 更改容器名称docker run -d -P --name runoob training/webapp python app.py
        > docker run -d -p 127.0.0.1:5001:5000 training/webapp python app.py
    -   在后台运行
        > docker run -d ubuntu:15.10 /bin/sh -c "while true; do echo hello world; sleep 1; done" 在当前控制台输出的一长串字符串是*容器 id*
-   **重启正在运行的容器**
    -   docker restart
-   **停止容器**
    -   docker stop [容器ID/容器名称]
-   **启动已停止的容器**
    -   docker start [容器ID/容器名称]
-   **进入后台启动的容器**
    -   docker attach : 如果从这个容器退出，会导致容器的停止。
        -   docker attach 243c32535da7
    -   docker exec: docker exec 命令退出容器终端，不会导致容器的停止
        -   docker exec -it 243c32535da7 /bin/bash
-   **容器的导入和导出**
    -   导出
        > docker export DOCKER_NAME > FILENAME.tar 导出容器 DOCKER_NAME 快照到本地文件 ubuntu.tar
    -   导入
        > cat docker/ubuntu.tar | docker import - test/ubuntu:v1 将快照文件 ubuntu.tar 导入到镜像 test/ubuntu:v1:
        > docker import <http://example.com/exampleimage.tgz> example/imagerepo 通过指定 URL 或者某个目录来导入
-   **删除容器**
    -   docker rm DOCKER_NAME
    -   删除容器时，容器必须是停止状态，否则会报错
-   容器命名
    -   -
    -   docker run -d -P --name runoob training/webapp python app.py
-   快速查看 docker 端口
    -   docker port [ID或者名字]
-   查看 web 应用的日志
    -   docker logs [ID或者名字] 可以查看容器内部的标准输出。
    -   -f: 让 docker logs 像使用 tail -f 一样来输出容器内部的标准输出。
-   查看 web 应用的进程
    -   docker top [ID或者名字] 查看内部运行的程序
-   检查 WEB 应用程序
    -   docker inspect
        > 使用 docker inspect 来查看 Docker 的底层信息。它会返回一个 JSON 文件记录着 Docker 容器的配置和状态信息。
**容器连接**
> 前面实现了通过网络端口来访问运行在 docker 容器内的服务。 容器中可以运行一些网络应用，要让外部也可以访问这些应用，可以通过 -P 或 -p 参数来指定端口映射。
**Docker 容器互联**
docker 有一个连接系统, 可以将多个系统连接到一起, 共享连接信息
docker 连接会创建一个父子关系，其中 父容器可以看到子容器的信息
**新建 Docker 网络**
docker network create -d bridge test-net
-d：参数指定 Docker 网络类型，有 *bridge*、*overlay* overlay 网络类型用于 Swarm mode
**连接容器**
运行一个容器并连接到新建的网络




