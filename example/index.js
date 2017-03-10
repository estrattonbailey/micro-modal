import React from 'react'
import { render } from 'react-dom'
import { Portal, Modal, Content } from '../package/dist/index.js'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
  }

  toggle (open) {
    if (open && !this.state.open) {
      this.setState({
        open: true
      })
    } else if (!open && this.state.open) {
      this.setState({
        open: false
      })
    }
  }

  render () {
    return (
      <div>
        <button onClick={e => this.toggle(!this.state.open)}>Open</button>

        <Modal
          onClick={e => this.toggle(!this.state.open)}
          open={this.state.open}>
          <Content>
            <div style={{ height: '150vh'}}>
              <h1>Hello world!</h1>
            </div>
          </Content>
        </Modal>
      </div>
    )
  }
}

render(
  <App/>,
  document.getElementById('root')
)
