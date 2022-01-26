const regex = {
  BEFORE: /console\.log\(/
}

function filterLog(content) {
  if(!regex.BEFORE.test(content)) return false
  let text = ''

  function setText(content) {
    let finalText = '' // 过滤完的文本内容

    const index = content.search(regex.BEFORE)
    const before = content.slice(0, index)
    const after = content.slice(index + 12)
    const mark = after.match(/[\(\)]/)

    if (!mark || !mark[0]) return console.log('语法错误，"console.log(" 后缺失 ")"')
    if (mark[0] === ')') finalText = markSingle(after)
    if (mark[0] === '(') finalText = markMany(mark)

    text += before

    // 判断是否还存在 console
    if (finalText.search(regex.BEFORE) < 0) {
      text += finalText
      return false
    }
    setText(finalText)
  }
  
  setText(content)
  return text
}

// 内部没有嵌套括号
function markSingle(text) {
  const index = text.search(/\)/)
  const after = text.slice(index + 1)
  return after
}

// 内部存在嵌套括号
function markMany(text) {
  let number = 2
  function saveMark(text) {
    const after = text.input.slice(text.index + 1)
    const mark = after.match(/[\(\)]/)

    if (!mark || number === 0) return after
    if (mark[0] === ')') number -= 1
    if (mark[0] === '(') number += 1

    return saveMark(mark)
  }
  return saveMark(text)
}

module.exports = filterLog
