# micro-modal
Teeny-tiny super-flexible modal for React.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Features
1. No opinions
2. Supports custom classes or inline styles
3. 1.6kb 😎

## Usage
micro-modal doesn't handle the logic of opening and closing the modal: you can handle that, right? Instead, it gives you a single access point, `open` so that you can integrate with your app as you see fit i.e. redux, mobx. Also, it gives you full access to each element to add inline styles and adjust the classnames.
```javascript
import { Modal, Inner, Content } from 'micro-modal'

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

        <Modal open={this.state.open}>
          <Inner onClick={e => this.toggle(!this.state.open)}>
            <Content>
              <h1>My Modal</h1>
            </Content>
          </Inner>
        </Modal>
      </div>
    )
  }
}
```

You'll also want some styles to start:
```css
body.modal-is-open {
  overflow: hidden;
}
.modal__inner {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0; top: 0;
  background-color: rgba(0,0,0,0.9);
  padding: 2em;
  overflow: auto;
  opacity: 0;
  transition: opacity 500ms;
}
.modal__inner.is-open {
  display: block;
}
.modal__inner.is-visible {
  opacity: 1;
}
.modal__inner.is-hiding {
  opacity: 0;
}
.modal__content {
  padding: 2em;
  background: white;
  max-width: 700px;
  margin: auto;
}
```

## TODO
1. Add configs for the statefull classes
2. Add callbacks for each lifecycle step
  - could use this to adjust inline styles too
3. Docs:
  - bodyClass, closeTimeout, onClick

## Browser Support
TODO, but should work in all evergreen browsers and IE 10+.

## Example
To run the example, clone this repo, then:
```bash
# move into example dir
cd relaze/example
# install deps
npm i
# compile JS
npm run js:build # or js:watch
# serve index.html and update with changes
live-server 
```

MIT License
