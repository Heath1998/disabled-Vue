// 判断是否是单标签，是的话返回true
export default {
  isUnaryTag(tagName) {
    return 'area,br,hr,img,input'.split(',').filter(item => item === tagName).length > 0
  }
}