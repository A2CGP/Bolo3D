# Bolo3D - 基于 WebGPU 的 Blender 实现

预览地址：https://a2cgp.github.io/bolo3d/

### 项目说明
计算机图形学的内容有趣且复杂，网络上的文章和教程也能找到很多，但大多数的内容要么止步于入门教程，要么关注的是某种效果如何实现，很难找到理论和实践结合的比较好的完整学习项目。因此，我打算借着浏览器新特性 WebGPU 的发布，以开源的 Blender 为学习目标，从零开始一步步实现 Blender。

我会尽量保证项目的目录、数据结构、界面、操作等等和 Blender 保持一致，但如果 JavaScript 有更优雅的写法，我会优先使用 JavaScript 的写法。由于这是一个学习项目，因此，在代码文件中，我会尽可能地将我对 Blender 的学习体会添加在注释中，以及列出相关的参考资料、网站等。如对某处代码仍有不理解的地方，也欢迎提 Issues。

### 开发计划
[] 基本项目结构
[] 绘制正方体

### 本地运行
和大多数前端项目一样，执行以下步骤：
```bash
$ git clone https://github.com/A2CGP/bolo3d.git
$ cd bolo3d/
$ yarn
$ yarn dev
```
执行完以上步骤后打开浏览器输入`http://localhost:5173/`查看效果。