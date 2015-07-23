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
    this.editor.setReadOnly(!this.props.enabled)
    if (prevProps.initialValue != this.props.initialValue) {
      let session = new ace.EditSession(this.props.initialValue)
      session.on('change', this.handleChange.bind(this))
      this.editor.setSession(session)
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
      {this.props.children}
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
  onChange: React.PropTypes.func,
  onAction: React.PropTypes.func
}

Editor.defaultProps = {
  initialValue: '',
  enabled: true,
  onChange: ()=>{},
  onAction: ()=>{}
}
