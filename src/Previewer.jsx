export default class Previewer extends React.Component {
  componentDidUpdate() {
    if (typeof this.props.component == 'string'
      && typeof this.props.preview == 'string')
      this.run()
  }
  run() {
    this.refs.preview.getDOMNode().contentWindow.run(
      this.props.component,
      this.props.preview)
  }
  render() {
    return <div style={this.props.style}>
      <iframe ref="preview"
        src={this.props.src}
        style={{
          width: "100%",
          height: "100%",
          border: "none"
        }}/>
    </div>
  }
}

Previewer.propTypes = {
  src: React.PropTypes.string.isRequired,
  component: React.PropTypes.string,
  preview: React.PropTypes.string
}
