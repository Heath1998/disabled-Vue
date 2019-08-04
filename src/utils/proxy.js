
// 将Vue实例vm的vm.key映射到$options.data上的key上
export function proxy (obj, vm) {
  Object.keys(obj).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        if(typeof obj[key] === 'function') {
          return obj[key].bind(vm)
        } else{
          return obj[key]
        }
      },
      set(value) {
        obj[key] = value
      }
    })
  })
}