import React from 'react'
import {
  unstable_renderSubtreeIntoContainer as renderToPortal,
  unmountComponentAtNode
} from 'react-dom'

/**
 * @param {string} className Base classname
 * @param {object} (state) Modal state
 * @param {object} (props) Config classes
 * @return {string} Full classname
 */
const getClassName = (
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

/**
 * @param {string} className
 * @param {object} style
 */
export class Portal extends React.Component {
  getChildren () {
    const attrs = {
      className: this.props.className,
      style: this.props.style
    }

    return (
      <section {...attrs}>
        {this.props.children}
      </section>
    )
  }

  componentDidMount () {
    this.portalNode = document.body.appendChild(document.createElement('div'))
    this.portal = renderToPortal(this, this.getChildren(), this.portalNode)
  }

  componentDidUpdate () {
    this.portal = renderToPortal(this, this.getChildren(), this.portalNode)
  }

  componentWillUnmount () {
    unmountComponentAtNode(this.portalNode)
    document.body.removeChild(this.portalNode)
  }

  render () {
    return null
  }
}

export class Modal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hiding: false,
      open: this.props.open,
      afterOpen: false
    }
  }

  componentWillReceiveProps (props) {
    const {
      open,
      onOpen,
      onClose
    } = props

    if (open && !this.state.open) {
      onOpen && onOpen()

      document.body.classList.add(this.props.bodyClass)

      this.setState({
        open: true
      }, () => setTimeout(() => this.setState({
        afterOpen: true
      }), 0))
    } else if (!open && this.state.open) {
      onClose && onClose()

      this.setState({
        hiding: true
      }, () => {
        setTimeout(() => {
          document.body.classList.remove(this.props.bodyClass)

          this.setState({
            open: false,
            hiding: false,
            afterOpen: false
          })
        }, this.props.closeTimeout)
      })
    }
  }

  render () {
    const {
      className,
      style,
      onClick,
      portalClassName,
      portalStyle
    } = this.props

    const modal = {
      className: getClassName(className, this.state, this.props),
      style
    }

    const portal = {
      className: portalClassName,
      style: portalStyle
    }

    const overlay = {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0
      },
      onClick
    }

    return (
      <Portal {...portal}>
        <div {...modal}>
          <div {...overlay} />
          {React.cloneElement(
            this.props.children,
            Object.assign({}, this.props.children.props, this.state)
          )}
        </div>
      </Portal>
    )
  }
}

Modal.defaultProps = {
  className: 'modal',
  closeTimeout: 500,
  bodyClass: 'modal-is-open',
  portalClassName: 'modal-portal'
}

export const Content = ({
  children,
  className = 'modal__content',
  style,
  ...props
}) => {
  const attrs = {
    className: getClassName(className, props, props),
    style
  }

  return (
    <div {...attrs}>
      {children}
    </div>
  )
}
