---
title: "Hexo搭建手册"
pubDatetime: 2018-07-25T11:36:19+08:00
description: "记录用 Hexo 搭建个人博客的过程，包括安装、部署到 GitHub、发布文章和配置主题"
categories: ["前端工程"]
tags: ["Hexo"]
---

> 起源：
> 
> 博客是一项被我误认为已经快消失殆尽的信息表达形式，简直是上一个时代的东西。直到大一，自己对博客才有了一个全新的认识，好记性不如烂键盘，博客可以详细的记载下在学习过程中遇到的那些扎心知识点和自己对其的见解。并且可以展示出来，这样假如有错误也能够最快程度的发现。因此萌生了一个自己建一个博客的想法。
> 
> 后来接触了CSDN以及博客园，平台里的文章虽然相当不错，但是在页面美化上总是不尽人意。直到遇见了Hexo，嗯？原来还能这样玩！

<a id="简介"></a>

## 简介

Hexo是一个十分高效、简洁的博客框架。因为这个框架的诞生，促使了许多有趣又好看的主题的汇入，而Next就是其中之一。由于Hexo是基于Node.JS的，所以在接下来要介绍的安装教程中我们需要安装Node.JS。

<a id="安装Hexo"></a>

## 安装Hexo

> 目前环境：
> 
> -   Windows\_NT 10.0.17134
> -   Node.JS v9.11.1
> -   Git v2.17.1

<a id="准备工作"></a>

### 准备工作

1.  预先下载好一下软件：

-   [Node.JS](http://nodejs.cn/download/)
-   [Git](https://git-scm.com/download/win)

2.  检查：
    
    1.  桌面空白处右击，选择Git Bash Here。(如果没有，则说明Git安装失败)
        
    2.  打开后，输入`node -v`回车（如果没有显示版本号，则Node.JS安装失败）
        
    3.  继续输入`npm -version`回车(如果没有则需要额外添加变量环境)
        
        以上出现的问题都可以在百度中找到解决方案，在此不再赘述。
        

<a id="安装Hexo-1"></a>

### 安装Hexo

-   新建一个你自己的博客文件夹
    
-   在建好的博客文件夹里打开Git Bash Here,输入`npm install hexo-cli -g`回车。
    
-   等待安装完毕后输入`hexo -v`可以看到hexo的版本信息。
    
    > 有些文章说安装时hexo可能会被墙，导致安装失败，可以尝试输入`$ npm install -g cnpm --registry=https://registry.npm.taobao.org`命令，不过第一个命令在我这里是有效的。
    
-   输入`hexo init`进行初始化。初始化成功后会生成下列文件![](https://i.imgur.com/pCCVxlP.jpg)
    
-   输入`hexo s`此时本地博客端口就已经打开了，在浏览器地址栏中输入`http://localhost:4000/`即可看到Hexo默认博客页面了。
    

<a id="将Hexo部署到GitHub"></a>

## 将Hexo部署到GitHub

1.  在已有的GitHub中新建一个仓库，仓库的名称格式务必为：`username.github.io`。之后点击确定即可。![](https://i.imgur.com/WxA5Z2H.png)
2.  为GitHub与Git通过SSH进行绑定
    1.  git中输入`ssh-keygen -t rsa -C "xxx@xxx.com"`（你的github账号绑定的邮箱） 连续3次回车。
    2.  直到出现下列信息：![](https://i.imgur.com/FB8g976.png)
    3.  根据到绿框中的路径，找到并复制`id_rsa.pub`文件中的内容
    4.  进入到GitHub的账户设置中，找到`SSH and GPG keys`这个选项卡中，选择New SSH key。标题任意，然后将刚刚复制的Key信息粘贴到文本框中。![](https://i.imgur.com/gSMqFf9.png)
    5.  git中输入命令`npm install --save hexo-deployer-git`
    6.  git中输入命令`git config --global user.email "xxxx@xxx.com"`
3.  更改你博客中的配置文件`_config.yml`,修改`deploy`项为
    
    ```less
    deploy:
      type: git
      repo: git@github.com:username/username.github.io.git
      branch: master
    ```
    
4.  依次输入命令`hexo g`和`hexo d`完成部署。如出现一下对话框，则输入`yes`即可。![](https://i.imgur.com/cwboOyp.png)
5.  在你刚刚创建的仓库的设置中，下拉找到`Github Pages`，Source中选择master并保存![](https://i.imgur.com/xuCGN9w.jpg)

这时你就可以通过浏览器输入`http://username.github.io`来访问属于你的Hexo博客了。并且你可以为你的hexo博客绑定自己的域名（<strong>这部分如不需要绑定则可以忽略</strong>）：

1.  在你刚刚创建的仓库的设置中，下拉找到Github Page ,在箭头指向的文本框中输入你的域名，并Save保存。![](https://i.imgur.com/IWZ8uY9.png)
2.  打开hexo站点配置文件`_config.yml`![](https://i.imgur.com/1Sk68un.png)
3.  修改你的url项（注意：冒号后务必空一格再输入你的信息！）。![](https://i.imgur.com/y3Or2iC.png)
4.  在`Source`文件夹中添加`CNAME`文件（无后缀），里面内容写入为你自己的域名`xxxx.xx`（前面没有http://）保存即可。
5.  输入`hexo d` 完成部署。

<a id="Hexo发布博客"></a>

## Hexo发布博客

hexo博客文章是支持markdown的，所以可以下载一个markdown编辑器。我用的是[MarkdownPad](http://markdownpad.com/)。

> 起初我看到它专业版的价格是14块钱左右，当时那个内心简直是版权心爆棚，（我就是饿死，从这跳下去！我也要买正版！），后来一看是美元，免费密匙真香~

```groovy
邮箱：

Soar360@live.com

授权秘钥：

GBPduHjWfJU1mZqcPM3BikjYKF6xKhlKIys3i1MU2eJHqWGImDHzWdD6xhMNLGVpbP2M5SN6bnxn2kSE8qHqNY5QaaRxmO3YSMHxlv2EYpjdwLcPwfeTG7kUdnhKE0vVy4RidP6Y2wZ0q74f47fzsZo45JE2hfQBFi2O9Jldjp1mW8HUpTtLA2a5/sQytXJUQl/QKO0jUQY4pa5CCx20sV1ClOTZtAGngSOJtIOFXK599sBr5aIEFyH0K7H4BoNMiiDMnxt1rD8Vb/ikJdhGMMQr0R4B+L3nWU97eaVPTRKfWGDE8/eAgKzpGwrQQoDh+nzX1xoVQ8NAuH+s4UcSeQ==
```

1.  改语言（英语大佬请无视）`Tools`\->`Options`页面
2.  升级为专业版：`帮助`\->`升级为专业版`对应输入邮箱和密匙即可
3.  右侧预览窗口出现“This view has crashed!”错误（如没有请无视）。解决方法：下载[Awesomium 1.6.6 SDK](http://117.143.109.141/cache/markdownpad.com/download/awesomium_v1.6.6_sdk_win.exe?ich_args2=134-25164704011207_568bfa3c404598c914c9fbb247dffd70_10001002_9c89672ed2c3f9d5933a518939a83798_04f69856e11e874892cdb4f3c7e1015a)，安装完成后重启MP即可。

准备工作完成后即可开始创建博客文章：

1.  在博客根目录下打开git，输入`hexo new '博客名称'`
2.  在source文件夹的\_posts文件夹中找到刚刚创建的博客，进行编辑即可
3.  编辑完成保存文件后，可以输入`hexo s`命令进行预览。

<a id="Hexo的主题"></a>

## Hexo的主题

Hexo拥有丰富的主题和插件，所以你可以在[官网](https://hexo.io/themes/)上预览这些主题并渲染在自己的博客上。![](https://i.imgur.com/cmIb6XG.jpg)  
通常，主题的github链接在主题的底部，将它从github上clone或下载下来。并存放在你博客的themes文件夹中。最后修改配置文件`_config.yml`中的`theme`为`theme: 主题名称`。

<a id="Hexo根目录文件信息解释"></a>

## Hexo根目录文件信息解释

1.  scaffolds ：三种默认布局的模板文件的存放处，分别是：draft 、page 以及post三种格式。
    
2.  source ：用于存放博客和其他信息
    
3.  themes ：主题 文件夹。Hexo 会根据主题来生成静态页面。
    
4.  \_config.yml ：全局的配置文件，每次更改要重启服务。
    

<a id="站点配置文件解释"></a>

### 站点配置文件解释

1.  网站（Site）
    
    ```properties
    参数              描述
    title           网站标题
    subtitle        网站副标题
    description     网站描述
    author          您的名字
    language        网站使用的语言
    timezone        网站时区。Hexo 默认使用您电脑的时区。时区列表。比如说：America/New_York, Japan, 和 UTC 。
    ```
    
    其中，description主要用于SEO，告诉搜索引擎一个关于您站点的简单描述，通常建议在其中包含您网站的关键词。author参数用于主题显示文章的作者。
    
2.  网址（URL）
    
    ```elixir
    参数                 描述                       默认值
    url                  网址     
    root               网站根目录    
    permalink         文章的永久链接格式      :year/:month/:day/:title/
    permalink_defaults  永久链接中各部分的默认值
    ```
    
3.  目录（Directory）
    
    ```properties
    参数                 描述   
    source_dir       资源文件夹，这个文件夹用来存放内容。     
    public_dir       公共文件夹，这个文件夹用于存放生成的站点文件。 
    tag_dir          标签文件夹  
    archive_dir      归档文件夹  
    category_dir     分类文件夹  
    code_dir         Include code 文件夹   
    i18n_dir         国际化（i18n）文件夹   
    skip_render      跳过指定文件的渲染，您可使用 glob 表达式来匹配路径。
    ```
    
4.  写作（Writing）
    
    ```properties
    参数                  描述  
    new_post_name       新文章的文件名称    
    default_layout      预设布局    
    auto_spacing        在中文和英文之间加入空格    
    titlecase           把标题转换为 title case   
    external_link       在新标签中打开链接 
    filename_case       把文件名称转换为 (1) 小写或 (2) 大写     
    render_drafts       显示草稿    
    post_asset_folder   启动 Asset 文件夹    
    relative_link       把链接改为与根目录的相对位址  
    future              显示未来的文章     
    highlight           代码块的设置
    ```
    
5.  分类&标签(Category & Tag)
    
    ```properties
    参数                  描述          默认值
    default_category    默认分类    uncategorized
    category_map        分类别名    
    tag_map             标签别名
    ```
    
6.  时间/日期格式(Date / Time format)
    
    ```css
    参数              描述      默认值
    date_format     日期格式    YYYY-MM-DD
    time_format     时间格式    H:mm:ss
    ```
    
7.  分页（Pagination）
    
    ```text
    参数          描述                              默认值
    per_page    每页显示的文章量 (0 = 关闭分页功能)   10
    pagination_dir  分页目录                        page
    ```
    
8.  扩展(Extensions)
    
    ```text
    参数          描述
    theme       当前主题名称。值为false时禁用主题
    ```
    
9.  部署(Deployment)
    
    ```text
    参数          描述
    deploy      部署部分的设置
    ```
    

<a id="总结"></a>

## 总结

Hexo框架十分好用，搭建起来只要细心一下，也并不是太困难，还有一个类似的工具叫Jekyll。再选择一个强大的主题辅佐就更完美了，推荐Next主题。GitHub是一个面向开源及私有软件项目的托管平台,大约有300Mb的免费存储空间,毕竟也与微软喜结良缘了，所以会相对稳定很多，而Github Pages原本是用来展示github上项目用的。

大概是在6月中旬的时候把博客模模糊糊搭好，后续也一直在“解锁”新功能。当时也是按着网上各种教程说的一步一步走，但是遇到了不少坑，不得不自己再重新百度、调试、尝试。所以刚刚搭完那会儿就想写一个教程能让以后搭Hexo的人尽量的少走些弯路，但是由于时间关系一直拖到了现在。不多说了，这也算是找到以后写博客的归宿地了。<em>Hello world!</em>
