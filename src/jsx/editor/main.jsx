import {component as Component} from './component.jsx'
import {element as Element} from './element.jsx'
import {preview as Preview} from './preview.jsx'

React.render(<div>
    <Component />
    <Element />
    <Preview />
  </div>
  ,document.getElementById('editor'))