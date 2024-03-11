# loong-cli 介绍

作者：[GitHub:LoveEmiliaForever](https://github.com/LoveEmiliaForever)  
GitHub库：[LoveEmiliaForever/loong-cli](https://github.com/LoveEmiliaForever/loong-cli)
完成时间：2024.3.11

这是一个用来搭建前端开发环境的命令行工具，使用`Node.js`编写  
它会以克隆`GitHub仓库`的形式搭建项目结构，并自动安装好相关依赖  
  
程序内设定的默认仓库是我自己的模板库 [loong-cli-template](https://github.com/LoveEmiliaForever/loong-cli-template)  
目前只有一个我自己编写的`Vue`模板，使用`Webpack5`构建，常见功能都包含其中  
该模板是依照我的开发习惯搭建的，我用着还挺喜欢（至少比vue-cli灵活很多）  

## 安装loong-cli

```shell
npm i -g loong-cli
```

## 使用loong-cli

```shell
loong -h
```

```shell
loong create my-app-name
```
