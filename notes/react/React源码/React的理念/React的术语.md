# React

- Reconciler工作的阶段被称为render阶段，因为在这个阶段会执行render方法。
- Renderer工作的阶段被称为commit阶段，就像你完成了一个需求编码后git commit提交代码。commit阶段会把render阶段提交的信息渲染在页面上。
- 处于render和commit阶段的统称为work。即在调度Scheduler中的不是处于work。