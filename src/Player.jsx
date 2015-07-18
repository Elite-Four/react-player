import Editor from './Editor.jsx'
import Previewer from './Previewer.jsx'

export default class Player extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      previewer: {}
    }
  }
  handleChange(type, value) {
    this.setState({
      [type]: value
    })
  }
  handleSave() {
    ;['component', 'preview'].forEach(type =>
      superagent.post(this.props[type])
        .type('text/jsx')
        .send(this.state[type])
        .end())
  }
  handlePreview() {
    this.setState({
      previewer: {
        component: this.state.component,
        preview: this.state.preview
      }
    })
  }
  render() {
    return <div>
      <Editor src={this.props.component}
        type="text/jsx"
        actionText="Save"
        onChange={this.handleChange.bind(this, 'component')}
        onAction={this.handleSave.bind(this)}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "40%", height: "60%"
        }}/>
      <Editor src={this.props.preview}
        type="text/jsx"
        actionText="Preview"
        onChange={this.handleChange.bind(this, 'preview')}
        onAction={this.handlePreview.bind(this)}
        style={{
          position: "absolute",
          bottom: 0, left: 0,
          width: "40%", height: "40%"
        }}/>
      <Previewer src={this.props.previewer}
        component={this.state.previewer.component}
        preview={this.state.previewer.preview}
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "60%", height: "100%"
        }}/>
    </div>
  }
}

Player.propTypes = {
  component: React.PropTypes.string.isRequired,
  preview: React.PropTypes.string.isRequired,
  previewer: React.PropTypes.string.isRequired
}
