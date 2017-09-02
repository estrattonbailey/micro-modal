/**
 * @param {string} className Base classname
 * @param {object} (state) Modal state
 * @param {object} (props) Config classes
 * @return {string} Full classname
 */
export const getClassName = (
  className,
  { open, afterOpen, hiding },
  { openClass, visibleClass, hidingClass }
) => {
  return className + (
    open ? ` ${openClass || 'is-open'}` : ''
  ) + (
    afterOpen ? ` ${visibleClass || 'is-visible'}` : ''
  ) + (
    hiding ? ` ${hidingClass || 'is-hiding'}` : ''
  )
}

export const getRoot = () => {
  let root = document.getElementById('micro-modal')

  if (!root) {
    root = document.body.appendChild(document.createElement('div'))
    root.id = 'micro-modal'
  }

  return root
}
