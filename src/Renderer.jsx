export default class Renderer extends React.Component {
  componentDidMount() {
    this.renderFrame()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps == null
      || this.props.component != prevProps.component
      || this.props.preview != prevProps.preview)
    this.renderFrame()
  }
  renderFrame() {
    let frame = this.refs.frame.getDOMNode()
    let loadHandler = () => {
      frame.contentWindow.removeEventListener('load', loadHandler, false)
      this.bind = false
      render()
    }
    let render = () => frame.contentWindow.render(this.props.component, this.props.preview)

    if (frame.contentDocument.readyState != 'complete'
      || !('render' in frame.contentWindow)) {
      if (!this.bind) {
        frame.contentWindow.addEventListener('load', loadHandler, false)
        this.bind = true
      }
    } else {
      render()
    }
  }
  render() {
    return <div style={this.props.style}>
      <iframe ref="frame"
        src={this.props.src}
        style={{
          width: "100%",
          height: "100%",
          border: "none"
        }}/>
    </div>
  }
}

Renderer.propTypes = {
  src: React.PropTypes.string.isRequired,
  component: React.PropTypes.string,
  preview: React.PropTypes.string
}

Renderer.defaultProps = {
  component: '',
  preview: ''
}
