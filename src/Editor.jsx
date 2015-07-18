export default class Editor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: !!props.src,
      value: ''
    }
  }
  componentDidMount() {
    if (this.props.src) {
      this.load(this.props.src)
    }
    this.editor = ace.edit(this.refs.editor.getDOMNode())
    this.editor.setFontSize(20)
    this.editor.setTheme('ace/theme/monokai')
    this.editor.getSession().on('change', this.handleChange.bind(this))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.load(nextProps.src)
    }
  }
  componentDidUpdate(prevProps, prevState) {
    this.editor.setReadOnly(this.state.loading)
    if (prevState.loading)
      this.editor.setValue(this.state.value, 0)
  }
  componentWillUnmount() {
    this.editor.destroy()
  }
  load(src) {
    this.setState({ loading: true })
    superagent
      .get(this.props.src)
      .accept(this.props.type)
      .end((err, res) => {
        this.setState({
          loading: false,
          value: res.text
        })
      })
  }
  handleChange() {
    var value = this.editor.getValue()
    this.setState({ value })
    this.props.onChange(value)
  }
  render() {
    return <div style={this.props.style}>
      <div ref="editor"
        style={{
          width: "100%",
          height: "100%"
        }}/>
      <button disabled={this.state.loading}
        onClick={this.props.onAction}
        style={{
          position: "absolute",
          right: "10%",
          bottom: "10%"
        }}>{this.props.actionText}</button>
    </div>
  }
}

Editor.propTypes = {
  src: React.PropTypes.string,
  type: React.PropTypes.string,
  actionText: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  onAction: React.PropTypes.func
}

Editor.defaultProps = {
  onChange: ()=>{},
  onAction: ()=>{}
}
