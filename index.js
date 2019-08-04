import Vue from './src/index.js'
window.vm = new Vue({
  el: '#app',
  data: {
    src:'www.google.co111111111m',
    test: 'ttestww.test',
    lists:['v','u','e'],
    inputValue:'input1',
    value:'input2',
    statur:true
  },
  // computed: {

  // },
  // watch: {
  //   src(a,b){
  //     console.log(`变化了${a}和${b}`)
  //   }
  
  // },
  // methods: {
  //   click1(){
  //     console.log('click1')
  //     this.src = '11111111111'
  //   }

  // }
})

if (module.hot) {
  module.hot.accept();
}