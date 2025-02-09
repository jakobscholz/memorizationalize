up.compiler('[position]', (element, data) => {
  let container = element.parentElement
  let flippable = element.querySelector('[flippable]')
  let form = element.querySelector('form')
  let drag = element.querySelector('[drag]')
  let deleteLink = element.querySelector('[delete]')

  let flip = data.flipped === true ? -1 : 1
  let widthRange = (container.scrollWidth - element.scrollWidth)
  let divisorX = widthRange / container.scrollWidth
  let heightRange = (container.scrollHeight - element.scrollHeight)
  let divisorY = heightRange / container.scrollHeight

  let elementRect = element.getBoundingClientRect()
  let dragShiftX = 0
  let dragShiftY = 0
  let elementHeight = elementRect.height
  let elementWidth = elementRect.width

  function setPosition(notSmooth = false) {
      widthRange = (container.scrollWidth - element.scrollWidth)
      divisorX = widthRange / container.scrollWidth
      heightRange = (container.scrollHeight - element.scrollHeight)
      divisorY = heightRange / container.scrollHeight

      let percentX = data.x * divisorX
      let percentY = data.y * divisorY

      element.style.left = percentX + '%'
      element.style.top = percentY + '%'

      elementRect = element.getBoundingClientRect()
  }

  function arrange() {
    element.style.left = (elementWidth * parseInt(element.getAttribute('position'))) + 'px'
    element.style.top = '100px'
  }

  function init() {
    element.style.transform = 'rotateZ(' + data.angle + 'deg)'
    flippable.style.transform = 'scaleX(' + flip + ')'
    if (data.flipped === true) {
      deleteLink.classList.add('-flipped')
    }

    element.classList.add('-moving')
    setPosition()
    element.classList.remove('-uninitialized')
  }

  up.on(drag, 'dragstart', (event) => {
    let rotationOffsetX = (elementWidth - elementRect.width) / 2
    let rotationOffsetY = (elementHeight - elementRect.height) / 2
    dragShiftX = event.clientX - elementRect.left + rotationOffsetX
    dragShiftY = event.clientY - elementRect.top + rotationOffsetY

    parentElement = element.parentElement
    parentElement.insertBefore(element, parentElement.lastChild)
  })

  up.on(drag, 'drag', (event) => {
    if (event.clientX === 0 && event.clientY === 0) {
      return
    }

    const containerRect = container.getBoundingClientRect()
    element.style.left = event.clientX - containerRect.left - dragShiftX + 'px'
    element.style.top = event.clientY - containerRect.top - dragShiftY + 'px'
  })

  up.on(drag, 'dragend', (event) => {
    event.preventDefault()
    const containerRect = container.getBoundingClientRect()
    element.style.left = event.clientX - containerRect.left - dragShiftX + 'px'
    element.style.top = event.clientY - containerRect.top - dragShiftY + 'px'

    newDataX = (element.offsetLeft / widthRange) * 100
    newDataY = (element.offsetTop / heightRange) * 100
    data.x = newDataX
    data.y = newDataY

    form.querySelector('[position-x]').value = data.x
    form.querySelector('[position-y]').value = data.y
    up.submit(form)

    elementRect = element.getBoundingClientRect()
  })

  up.on(window, 'resize', () => {
    setPosition(true)
  })

  let unbindScroll = up.on(window, 'scroll', () => {
    elementRect = element.getBoundingClientRect()
  })

  up.on('homeHero:contentToggle', (event) => {
    element.classList.add('-moving')
    if (event.visible) {
      drag.classList.add('-hidden')
      deleteLink.classList.add('-hidden')
      setPosition()
    } else {
      drag.classList.remove('-hidden')
      deleteLink.classList.remove('-hidden')
      arrange()
    }
  })

  up.on(deleteLink, 'click', () => {
    element.remove()
  })

  up.on(element, 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', (event) => {
    element.classList.remove('-moving')
    elementRect = element.getBoundingClientRect()
  })

  init()

  return () => {
    unbindScroll()
  }
})
