import React from 'react'
import {
  unstable_renderSubtreeIntoContainer as renderToPortal,
  unmountComponentAtNode
} from 'react-dom'

const getClassName = (className, { open, afterOpen, hiding }) => {
  return className + (
    open ? ' is-open' : ''
  ) + (
    afterOpen ? ' is-visible' : ''
  ) + (
    hiding ? ' is-hiding' : ''
  )
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

  getChildren () {
    const attrs = {
      className: getClassName(this.props.className, this.state),
      style: this.props.style
    }

    return (
      <section {...attrs}>
        {React.cloneElement(
          this.props.children,
          Object.assign({}, this.props.children.props, this.state)
        )}
      </section>
    )
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

  componentDidMount () {
    this.portalNode = document.body.appendChild(document.createElement('div'))
    this._portal = renderToPortal(this, this.getChildren(), this.portalNode)
  }

  componentDidUpdate () {
    this._portal = renderToPortal(this, this.getChildren(), this.portalNode)
  }

  componentWillUnmount () {
    unmountComponentAtNode(this.portalNode)
    document.body.removeChild(this.portalNode)
  }

  render () {
    return null
  }
}

Modal.defaultProps = {
  className: 'modal',
  closeTimeout: 500,
  bodyClass: 'modal-is-open'
}

export const Inner = ({
  children,
  className = 'modal__inner',
  style,
  onClick,
  ...props
}) => {
  const attrs = {
    className: getClassName(className, props),
    style: style,
    onClick: onClick
  }

  return (
    <div {...attrs}>
      {React.cloneElement(
        children,
        Object.assign({}, children.props, {
          open: props.open,
          hiding: props.hiding,
          afterOpen: props.afterOpen
        })
      )}
    </div>
  )
}

export const Content = ({
  children,
  className = 'modal__content',
  style,
  ...props
}) => {
  const attrs = {
    className: getClassName(className, props),
    style: style
  }

  return (
    <div {...attrs} onClick={e => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }}>
      {children}
    </div>
  )
}
