import React from 'react'

import ThemeManager from 'material-ui/lib/styles/theme-manager'
import ContentSave from 'material-ui/lib/svg-icons/content/save'
import ActionPageview from 'material-ui/lib/svg-icons/action/pageview'

import Editor from './Editor.jsx'
import Renderer from './Renderer.jsx'

const TYPE = 'text/jsx'
const RENDERER_SRC = 'renderer.html'

export default class Player extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      component: {
        busy: false,
        initial: '',
        value: '',
        renderer: '',
        error: null
      },
      preview: {
        busy: false,
        initial: '',
        value: '',
        renderer: '',
        error: null
      }
    }
  }
  getChildContext() {
    return {
      muiTheme: new ThemeManager().getCurrentTheme()
    }
  }
  componentDidMount() {
    for (let type of ['component', 'preview']) {
      let state = this.state[type]
      state.busy = true
      this.setState({ [type]: state })
      superagent.get(this.props[`${type}Source`])
        .set('Accept', TYPE)
        .end((err, res) => {
          let state = this.state[type]
          state.busy = false
          state.initial = res.text
          state.value = res.text
          state.renderer = res.text
          this.setState({ [type]: state })
        })
    }
  }
  handleChange(type, value) {
    let state = this.state[type]
    state.value = value
    this.setState({ [type]: state })
  }
  handleSave() {
    for (let type of ['component', 'preview']) {
      let state = this.state[type]
      state.busy = true
      this.setState({ [type]: state })
      superagent.post(this.props[type])
        .type(TYPE)
        .send(this.state[type].value)
        .end((err, res) => {
          let state = this.state[type]
          state.busy = false
          this.setState({ [type]: state })
        })
    }
  }
  handlePreview() {
    for (let type of ['component', 'preview']) {
      let state = this.state[type]
      state.renderer = state.value
      state.error = null
      this.setState({ [type]: state })
    }
  }
  handleError(type, error) {
    let state = this.state[type]
    state.error = error
    this.setState({ [type]: state })
  }
  render() {
    return <div>
      <Editor enabled={!this.state.component.busy}
        initialValue={this.state.component.initial}
        error={this.state.component.error}
        onChange={this.handleChange.bind(this, 'component')}
        onAction={this.handleSave.bind(this)}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "80%", height: "60%"
        }}><ContentSave/></Editor>
      <Editor enabled={!this.state.preview.busy}
        initialValue={this.state.preview.initial}
        error={this.state.preview.error}
        onChange={this.handleChange.bind(this, 'preview')}
        onAction={this.handlePreview.bind(this)}
        style={{
          position: "absolute",
          bottom: 0, left: 0,
          width: "80%", height: "40%"
        }}><ActionPageview/></Editor>
      <Renderer src={RENDERER_SRC}
        component={this.state.component.renderer}
        preview={this.state.preview.renderer}
        onComponentError={this.handleError.bind(this, 'component')}
        onPreviewError={this.handleError.bind(this, 'preview')}
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "20%", height: "100%"
        }}/>
    </div>
  }
}

Player.childContextTypes = {
  muiTheme: React.PropTypes.object
}

Player.propTypes = {
  componentSource: React.PropTypes.string.isRequired,
  previewSource: React.PropTypes.string.isRequired
}
