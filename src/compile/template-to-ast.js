
import options from './options' 
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
debugger

export function translateToAst(template) {
  let currentParent, root;

  console.log(template)
  debugger
  // 存放当前标签集合
  let stack = []
  parseHTML(template, {
    isUnaryTag: options.isUnaryTag,

    // 生成ast抽象语法树即对象
    start(tagName, attrs, unary, start, end) {

      let element = createASTElement(tagName, attrs, currentParent)
      if (!root) {
        root = element
      }
      //       //解析 class
      //解析style
      processStaticNormal(element);
      // //解析v-for
      // processFor(element)
      // //解析key
      // processKey(element)

      // //解析v-if
      // processIf(element)
      //v-bind
      //v-on
      processAttrs(element)

      // v-text、v-html、v-show、、v-model这些在运行时处理
      //其他

      // 如果存在父元素，
      if(currentParent) {
        if (element.elseif || element.else) {
          const pre = currentParent.children[currentParent.children.length - 1]
          if (pre && pre.if) {
            pre.ifJudge.push({
              exp: element.elseif,
              block: element
            })
          }
        } else {
          currentParent.childern.push(element)
          element.parent = currentParent
        }
      }

      // 如果是二元标签，将自己变为父元素，并入栈
      if (!unary) {
        currentParent = element
        stack.push(element)
      }

    },

     // 去掉stack尾当前标签并把当前父亲节点等于上一层
    end(tagName, start, end) {
      stack.pop()
      currentParent = stack[stack.length-1]
    }
  }) 
  return root
}


// 解析html字符串
function parseHTML(html, options) {
  let stack = [];//储存非一元标签
  let index = 0;
  let last, lastTag
  while (html) {
    last = html;
    let text;
    let leftArrow = html.indexOf('<');
    if (leftArrow > 0) {  //纯文本

      text = html.substring(0, leftArrow);
      advance(leftArrow)
      let lastMatch = stack[stack.length - 1]

    }
    if (leftArrow < 0) {
      text = html;
      html = ''
    }
    if (leftArrow === 0) {

      //省略处理注释  Doctype
      // End tag:
      
      // 匹配闭合标签的结束符如 </div> tagEnd[1]是div
      const tagEnd = html.match(endTag)
      if (tagEnd) {
        const curIndex = index
        advance(tagEnd[0].length)
        options.end(tagEnd[1], curIndex, index)
        continue
      }

      //startTag

      // 匹配标签的开始如 <div
      const tagStart = html.match(startTagOpen);
      // 存储匹配到标签的一些属性
      const match = {
        tagName: tagStart[1],
        attrs: [],
        start: index
      }
      advance(tagStart[0].length)
      let tagEndClose, attr
      
      // 获取是否是标签结束符是这样的 >，若是直接退出while。 html当前的属性值如：id=app，或@click=clickEvent用match匹配
      // [" />", "/", index: 0, input: " />"]
      // [" >", "", index: 0, input: " >"]
      // 这样的形式["href='https://www.imliutao.com'", "href", "=", undefined, "https://www.imliutao.com", undefined, index: 0, input: "href='https://www.imliutao.com'"]
      while (!(tagEndClose = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push(attr)
      }
      // 若开始标签的结束符 > 存在，就可以给当前match增加属性 
      if (tagEndClose) {
        match.unarySlash = tagEndClose[1]
        advance(tagEndClose[0].length)
        match.end = index
      }

      // 判断是否是单标签.是的话返回true
      const unary = options.isUnaryTag(match.tagName) || !!match.unarySlash

      // 将属性的match匹配的数组转换为正确格式的属性{name：“”， value：“”}形式
      match.attrs = match.attrs.map(item => {
        return {
          name: item[1],
          value: item[2] || item[3] || item[4] || true
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
      // options.chars(text)
    }
  }


  function advance(idx) {
    index += idx
    html = html.slice(idx);
  }


}

// 生成一个ast对象节点
function createASTElement(tagName, attrs, parent) {
    return {
        type: 1,
        tagName,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent,
        childern: []
    }
}

// 合成一个属性对象
function makeAttrsMap(attrs) {
  return attrs.reduce((obj, {name, value}) => {
    return {
      ...obj,
      [name]: value
    }
  }, {})

}

// class和style赋值
function processStaticNormal(el) {
  ['class', 'style'].forEach(key => {
    const staticValue = getAndRemoveAttr(el, key);
    if (staticValue) {
      el[`static${key}`] = JSON.stringify(staticValue)
    }
  })
}

// 处理属性进程
function processAttrs(element) {
  let attrLists = element.attrsList;
  attrLists.forEach(({name, value}) => {
    // 是指令v-开头
    if (vRe.test(name)) {
      element.binding = true  //不纯
      // :和v-bind:开头
      if (bindRe.test(name)) {
        // 替代:和v-bind:
        name = name.replace(bindRe, '');
        element.plain = false
        if (useProps(element.tagName, element.attrsMap.type, name)) {
          addProp(element, name, value)
        } else {
          addAttr(element, name, value)
        }
      } else if (onRe.test(name)) {
        element.plain = false
        // 去掉@click的@
        name = name.replace(onRe, '')
        // 将事件推入element.events数组
        addHandler(element, name, value)
      } else {
        name = name.replace(vRe, '')
        addDirective(element, name, value)
      }
    } else {
      addAttr(element, name, JSON.stringify(value))
    }
  })
}

// 去掉attr中得class
function getAndRemoveAttr(el, name, removeFromMap) {
  let val
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name]
  }
  return val
}

// 判断是否是单标签
function useProps(tag, type, name) {
  return (tag === 'input' || tag === 'textarea') && (name === 'value')
}

// 增加
export function addProp(element, name, value) {
  (element.props || (element.prop = [])).push({
    [name]: value
  })
}


// 增加指令
function addDirective(element, name, value) {
  let directives = element.directives || (element.directives = [])
  directives.push({
    name,
    value
  })
}

// 增加正常的属性
export function addAttr(element, name, value) {
  (element.attrs || (element.attrs = [])).push({
    [name]: value
  })
}