import {isArray, defineReactive, proxy} from '../utils'
import {isObject} from '../utils'
// import Watcher from './watcher'
// import Dep from './dep'

export default function (vm) {
  // vm._watchers = []
  const options = vm.$options
  // if (options.props) initProps(vm, options.props)
  // if (options.methods) initMethods(vm, options.methods)

  // 初始化data数据，将data中的数据绑定到vm上，并绑定data中的每一个key到data上
  if (options.data) {
    initData(vm)
  }
}


function initData(vm) {
  let data = vm.$options.data;

  // 代理vm上的数据到$options.data上
  proxy(data, vm)

  // 循环遍历每一个data中的key值，用Object.defineProperty来绑定。过程中会深度循环，执行observer
  observe(data)
}

export function observe(data) {
  let ob
  if(data.hasOwnProperty('_ob_')) {
    ob = data._ob_
  } else if(isObject(data)) {
    ob = new Observer(data)
  } else {
    ob = null
  }
  return ob
}

class Observer {
  constructor() {
    this.value = data
    // this.dep = new Dep();
    this.vmCount = 0;
    data._ob_ = this;
    if(isArray(data)) {

    } else {
      Object.keys(data).forEach(item => {
        defineReactive(data, item)
      })
    }
  }
}