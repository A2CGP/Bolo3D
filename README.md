# Bolo3D - 基于 WebGPU 的 Blender 实现

预览地址：https://a2cgp.github.io/bolo3d/

### 项目说明
　　计算机图形学的内容有趣且复杂，网络上的文章和教程也能找到很多，但大多数的内容要么止步于入门教程，要么关注于某种效果如何实现，很难找到理论和实践结合的比较好的完整学习项目。因此，我打算借着浏览器新特性 [WebGPU](https://github.com/gpuweb/gpuweb) 的发布，以开源的 [Blender](https://github.com/blender/blender) 为学习目标，从零开始一步步实现 [Blender](https://github.com/blender/blender)。

　　我会尽量保证项目的目录、数据结构、界面、操作等等和 [Blender](https://github.com/blender/blender) 保持一致，但如果 [TypeScript](https://www.typescriptlang.org/) 有更优雅的写法，我会优先使用 [TypeScript](https://www.typescriptlang.org/) 的写法。由于这是一个学习项目，因此，在代码文件中，我会尽可能地将我对 [Blender](https://github.com/blender/blender) 的学习体会添加在注释中，以及列出相关的参考资料、网站等。如对某处代码仍有不理解的地方，也欢迎提 [Issues](https://github.com/A2CGP/bolo3d/issues)。

### 主要文档
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [React 官方文档](https://beta.reactjs.org/)
- [Blender 官方文档](https://wiki.blender.org/wiki/Main_Page)
- [WebGPU 官方文档](https://gpuweb.github.io/gpuweb/)
- [WebGPU Shading Language 官方文档](https://gpuweb.github.io/gpuweb/wgsl/)
- [A2CGP 文档合集](https://a2cgp.github.io/tutorials/)
- [A2CGP WebGPU 中文文档](https://a2cgp.github.io/webgpu/)
- [A2CGP WebGPU Shading Language 中文文档](https://a2cgp.github.io/wgsl/)

### 开发计划
- [ ] 基本项目结构
- [ ] 绘制正方体

### 本地运行
和大多数前端项目一样，执行以下步骤：
```bash
$ git clone https://github.com/A2CGP/bolo3d.git
$ cd bolo3d/
$ yarn
$ yarn dev
```
执行完以上步骤后打开浏览器输入`http://localhost:5173/`查看效果。