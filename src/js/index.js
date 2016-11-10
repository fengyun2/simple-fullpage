/**
 * 参考文档: http://www.w3cmark.com/2016/fullpage.html
 * 思路:
 * 设置一个外层 container, 用户的可见区域, 也就是全屏
 * conatiner 内有 3 个层次, 每个层次大小都跟 container 一样(超出范围, hidden)
 * 每次滚动时通过 transform 属性进行偏移, 并结合 transition 过渡一下
 *·(注: scrollContainer 设置主要是为了默认的时候, 轮播层次没高度, 当初始化再有高度而出现突兀情况而设计的)
 * Bug:
 * Firefox下, 现在只能滚动, 位置不会偏移, 可能我写的位移方法在火狐下有BUG
 */

function $(ele) {
  if (!ele) {
    return []
  }
  return document.querySelectorAll(ele)
}
function $$(ele) {
  if (!ele) {
    return null
  }
  return document.querySelector(ele)
}

let $container = $$('.container')
let $scroll = $container.querySelector('.scrollContainer')
let $slide = $container.querySelectorAll('.slide')
let height = $container.offsetHeight

let len = $slide.length
let current = 1

// 设置滚动元素的高度;;
;[]
  .forEach
  .call($slide, item => {
    console.log('item: ', item)
    // 记得要加单位
    item.style.height = height + 'px'
  })
$scroll.style.display = 'block'

// 动画逻辑部分 为防止多次滚动, 需要通过一个变量来控制是否滚动,这里动画是1s执行完毕, 使用 setTimout 延迟1s后解锁 page 控制
let page = {
  isScrolling: false,
  start: 0,
  prev() {
    if ((current - 1) > 0) {
      current -= 1
      page.move(current)
    }
  },
  next() {
    if ((current + 1) <= len) {
      current += 1
      page.move(current)
    }
  },
  move(index) {
    page.isScrolling = true
    let di = -(index - 1) * height + 'px'
    page.start = +new Date()
    $scroll.style.transform = `translateY(${di})`
    // setTimeout(() => {
    //   page.isScrolling = false
    // }, 1010)
  },
  moveEnd() {
    page.end = +new Date()
    console.log('end', (page.end - page.start) / 1000)
    page.isScrolling = false
  }
}

// 鼠标滚动事件绑定
const mouseWheelHandle = event => {
  console.log('mouseWheelHandle')
  let deltaY = 0
  if (page.isScrolling) { // 加锁部分
    return false
  }
  let e = event.originalEvent || event
  deltaY = e.deltaY
  if (deltaY > 0) {
    page.next()
  } else if (deltaY < 0) {
    page.prev()
  }
}

let eventBind = () => {
  $scroll.addEventListener('webkitTransitionEnd', page.moveEnd)
  document.addEventListener('mousewheel', mouseWheelHandle) // Chrome/IE/Safari
  document.addEventListener('DOMMouseScroll', mouseWheelHandle) // Firefox
}
eventBind()