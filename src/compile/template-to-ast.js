// dom节点的标签字符串转换为ast抽象语法树

// startTagOpen也很明了，其实就是匹配起始标签，我们的标签有字母、下划线、中划线或点组成，因为可能有命名空间
const startTagOpen = /^<([a-zA-Z_0-9\-]+)/;
// 接着startTagClose比较简单，用于匹配起始标签的结束部分，这里做了单标签的区分，单标签匹配的第二个元素是/
const startTagClose = /^\s*(\/?)>/;
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]*)))?/;
// 匹配双标签结束符
const endTag = /^<\/([a-zA-Z_0-9\-]+)>/;
const tagRE = /{{((.)+?)}}/g;
const forRE = /([^]*?)\s+(?:in)\s+([^]*)/;
const onRe = /^@|^v-on/;
const bindRe = /^:|^v-bind:/;
const vRe = /^v-|^:|^@/





// 解析html字符串
function parseHTML() {
  // 储存非一元标签
  let stack = []
  
  // 初始解析的字符串位置
  let index = 0

  // 保存当前匹配到的最后一个标签
  let lastTag
  while(html) {
    let text
    let leftArrow = html.indexOf('<')
    
    // 纯文本
    if (leftArrow > 0) {

    }
    if (leftArrow < 0) {
      text = html;
      html = ''
    }
    if (leftArrow === 0) {
      //省略处理注释  Doctype
      // End tag:

      const tagEnd = html.match(endTag)
      if (tagEnd) {
        const curIndex = index
        advance(tagEnd[0].length)
        options.end(tagEnd[1], curIndex, index)
        continue
      }

      // 匹配标签的开始如 <div
      const tagStart = html.match(startTagOpen)

      // 存储匹配到标签的一些属性
      const match = {
        tagName: tagStart[1],
        attrs: [],
        start: index
      }
      advance(tagStart[0].length)
      let tagEndClose, attr

      // 获取开始标签结束符是否是这样的 >，若是直接退出while。 获取当前标签的属性值如：id=app，或@click=clickEvent用match匹配
      // [" />", "/", index: 0, input: " />"]
      // [" >", "", index: 0, input: " >"]
      // 这样的形式["href='https://www.imliutao.com'", "href", "=", undefined, "https://www.imliutao.com", undefined, index: 0, input: "href='https://www.imliutao.com'"]
      while(!(tagEndClose = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 获取标签内的属性
        advance(atrr[0].length)
        match.attrs.push(attr)
      }

      // 若开始标签的结束符 > 存在，就可以给当前match增加属性 
      if (tagEndClose) {
        match.unarySlash = tagEndClose[1]
        advance(tagEndClose[0].length)
        match.end = index
      }

      // 判断是不是单标签
      const unary = options.isUnaryTag(match.tagName) || !match.unarySlash

      // 将属性的match匹配的数组转换为正确格式的属性{name：“”， value：“”}形式
      match.attrs = match.attrs.map(item => {
        return {
          name: item[1],
          value: item[2] || item[3] || item [4] || true
        }
      })

      // 存入stack二元标签元素，并赋值结尾标签lastTag的标签值
      if (!unary) {
        stack.push({tag: match.tagName, attrs: match.attrs})
        lastTag = match.tagName
      }

      // 生成真正的元素
      if (options.start) {
        options.start(match.tagName, match.attrs, unary, match.start, match.end)
      }
    }
    if (text) {
      options.chars(text)
    }
  }

  // index加上匹配的长度的， html切割去掉已匹配的
  function advance(inx) {
    idnex += inx
    html = html.slice(inx)
  }


}