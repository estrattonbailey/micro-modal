import React from 'react'
import {
  unstable_renderSubtreeIntoContainer as createPortal,
  unmountComponentAtNode
} from 'react-dom'
import { tarry, queue } from 'tarry.js'
import { getRoot, getClassName } from './util.js'

export default class Modal extends React.Component {
  static defaultProps = {
    modalClassName: 'modal',
    transitionSpeed: 500,
    openBodyClass: 'modal-is-open',
    portalClassName: 'modal-portal',
    overlayClassName: 'modal-overlay'
  }

  constructor (props) {
    super(props)

    this.root = getRoot()

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
      onClose,
      transitionSpeed,
      openBodyClass
    } = props

    const update = tarry(() => this.mount(), 0)

    if (open && !this.state.open) {
      const init = tarry(() => {
        this.focusNode = document.activeElement
        document.body.classList.add(openBodyClass)
      }, 0)
      const open = tarry(() => {
        onOpen && onOpen()
        this.setState({ open: true })
        this.modalPortal.setAttribute('tabindex', '0')
        this.modalPortal.setAttribute('aria-hidden', 'false')
      }, 0)
      const focus = tarry(() => this.modalPortal.focus(), 0)
      const finish = tarry(() => this.setState({ afterOpen: true }), 0)

      queue(init, update, open, update, focus, finish, update)()
    } else if (!open && this.state.open) {
      const hide = tarry(() => this.setState({ hiding: true }))
      const close = tarry(() => {
        document.body.classList.remove(openBodyClass)

        this.setState({
          open: false,
          hiding: false,
          afterOpen: false
        })

        this.modalPortal.setAttribute('tabindex', '')
        this.modalPortal.setAttribute('aria-hidden', 'true')

        onClose && onClose()
      }, transitionSpeed)
      const focus = tarry(() => this.focusNode.focus(), 0)
      const unmount = tarry(() => this.unmount(), 0)

      queue(hide, update, close, update, focus, unmount)()
    }
  }

  componentDidUpdate () {
    this.mount()
  }

  componentWillUnmount () {
    this.unmount()
  }

  mount () {
    const {
      modalClassName,
      style,
      onOverlayClick,
      portalClassName,
      portalStyle,
      overlayClassName,
      overlayStyle
    } = this.props

    const modal = {
      className: getClassName(modalClassName, this.state, this.props),
      style
    }

    const portal = {
      className: portalClassName,
      style: portalStyle
    }

    const overlay = {
      style: overlayStyle,
      className: overlayClassName,
      onClick: onOverlayClick
    }

    this.portal = createPortal(this, (
      <section ref={c => { this.modalPortal = c }} {...portal}>
        <div {...modal}>
          <div {...overlay} />
          {React.cloneElement(
            this.props.children,
            Object.assign({}, this.props.children.props, this.state)
          )}
        </div>
      </section>
    ), this.root)
  }

  unmount () {
    unmountComponentAtNode(this.root)
  }

  render () { return null }
}
