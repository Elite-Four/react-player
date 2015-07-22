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
        renderer: ''
      },
      preview: {
        busy: false,
        initial: '',
        value: '',
        renderer: ''
      }
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
      this.setState({ [type]: state })
    }
  }
  render() {
    return <div>
      <Editor actionText="Save" enabled={!this.state.component.busy}
        initialValue={this.state.component.initial}
        onChange={this.handleChange.bind(this, 'component')}
        onAction={this.handleSave.bind(this)}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "80%", height: "60%"
        }}/>
      <Editor actionText="Preview" enabled={!this.state.preview.busy}
        initialValue={this.state.preview.initial}
        onChange={this.handleChange.bind(this, 'preview')}
        onAction={this.handlePreview.bind(this)}
        style={{
          position: "absolute",
          bottom: 0, left: 0,
          width: "80%", height: "40%"
        }}/>
      <Renderer src={RENDERER_SRC}
        component={this.state.component.renderer}
        preview={this.state.preview.renderer}
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "20%", height: "100%"
        }}/>
    </div>
  }
}

Player.propTypes = {
  componentSource: React.PropTypes.string.isRequired,
  previewSource: React.PropTypes.string.isRequired
}
