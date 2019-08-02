
import {translateToAst} from '../compile/template-to-ast'

export default function (Vue) {

  // Vue.prototype._update = function (oldVnode, newVnode, vm) {
  //   console.log(oldVnode)
  //   patch(oldVnode, newVnode, vm)
  // }
  Vue.prototype.$mount = function (el) {
    const vm = this;
    
    // 获取要挂载的标签的dom的字符串
    const ele = document.querySelector(el).outerHTML.trim();

    // 解析成ast树的形式
    const ast = translateToAst(ele);
    
    // 解析生成render的字符串with(this){return _c("div",{attrs:{"id":"app",}},formatChildren([_c("div",{directives:[],domProps:{"textContent":src,}},formatChildren([]))]))}形式
    // 并返回一个方法 ， new Function()
    const render = translateTorender(ast);

    // 执行render函数在vm作用域下
    const _render = function () {
      return render.call(vm)
    }
    vm.$options._render = _render;

    // 执行render字符串生成一个虚拟dom即vdom
    const fn = function () {
      // 执行render字符串生成虚拟dom,但是还没有实例dom
      let vnode = vm.$options._render();

      // alert(JSON.stringify(vnode))
      // console.log(vnode)

      // debugger
      vm._update(vm.vnode, vnode, vm);
      vm.vnode = vnode
    }

    // 挂载到watcher
    new Watcher(fn, this, false)
  }

  // render字符串的_c函数创造虚拟dom对象
  Vue.portotype._c = function (tag, data, childern) {
    return '123'
  }
}