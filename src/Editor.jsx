import React from 'react'

import FloatingActionButton from 'material-ui/lib/floating-action-button'

export default class Editor extends React.Component {
  componentDidMount() {
    this.editor = ace.edit(this.refs.editor.getDOMNode())
    this.editor.$blockScrolling = Infinity

    this.editor.setFontSize(20)
    this.editor.setTheme('ace/theme/monokai')
  }
  componentDidUpdate(prevProps) {
    let session
    this.editor.setReadOnly(!this.props.enabled)

    if (prevProps.initialValue != this.props.initialValue) {
      session = new ace.EditSession(this.props.initialValue)
      session.on('change', this.handleChange.bind(this))
      this.editor.setSession(session)
    } else {
      session = this.editor.getSession()
    }
    if (prevProps.error != this.props.error) {
      let error = this.props.error
      if (error != null) {
        session.setAnnotations([{
          row: error.line - 1,
          text: error.message,
          type: "error"
        }])
      } else {
        session.clearAnnotations()
      }
    }
  }
  componentWillUnmount() {
    this.editor.destroy()
  }
  handleChange() {
    this.props.onChange(this.editor.getValue())
  }
  render() {
    return <div style={this.props.style}>
      <div ref="editor"
        style={{
          width: "100%",
          height: "100%"
        }}/>
      <FloatingActionButton disabled={!this.props.enabled}
        onClick={this.props.onAction}
        style={{
          position: "absolute",
          right: "10%",
          bottom: "10%"
        }}>{this.props.children}</FloatingActionButton>
    </div>
  }
}

Editor.propTypes = {
  initialValue: React.PropTypes.string,
  enabled: React.PropTypes.bool,
  error: React.PropTypes.object,
  onChange: React.PropTypes.func,
  onAction: React.PropTypes.func
}

Editor.defaultProps = {
  initialValue: '',
  enabled: true,
  onChange: ()=>{},
  onAction: ()=>{}
}
