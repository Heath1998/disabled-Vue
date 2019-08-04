import {mergeOptions} from '../utils'
import initState from './init-state'
let uid = 0
export default function (Vue) {
  Vue.prototype.init = function (options) {
    let vm = this
    vm._uid = ++uid
    // vm._isVue = true;
    
    // 存储new Vue({})时，传进来的对象存储在vm.$options
    vm.$options = mergeOptions(
      vm.constructor,
      options,
      vm
    )
    vm._self = vm;

    //处理methods compited,data,watch
    //依赖收集
    // initState(vm)

    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}