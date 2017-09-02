import React from 'react'
import { getClassName } from './util.js'

export default function Content ({
  children,
  contentClassName = 'modal__content',
  style,
  ...props
}) {
  const attrs = {
    className: getClassName(contentClassName, props, props),
    style
  }

  return (
    <div {...attrs}>
      {children}
    </div>
  )
}
