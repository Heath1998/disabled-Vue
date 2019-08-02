// 1.添加静态方法
// 2. 添加实例方法
// 3. 添加初始化函数
import initGlobal from './core/global'
import initInstance from './core/instance'
import initConstruction from './core/construction'

export default class Vue {
  constructor(options) {
    this.init(options)
  }
}

initGlobal(Vue);

// 执行Vue.portotype.   ,挂载函数如_C,$mount等. 向Vue原型上挂载函数
initInstance(Vue);

// 注册init化函数， 包括依赖收集，和编译模板
initConstruction(Vue);