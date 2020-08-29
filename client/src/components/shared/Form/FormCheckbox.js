import React, { Component }  from 'react'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormCheckbox extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }
  render() {
    return (
      <div className="flex align-items-center margin-s-v">
        <label className="inline">{this.props.label}</label>
        {this.props.input.value === true ? 
        <input type="checkbox" className={this.props.field_class} checked {...this.props.input} style={{ marginBottom: '5px', marginLeft: "10px", display: "inline", width: "20px", height: "20px" }} />
        : <input type="checkbox" className={this.props.field_class} {...this.props.input} style={{ marginBottom: '5px', marginLeft: "10px", display: "inline", width: "20px", height: "20px" }} />}
      </div>
    )
  }
}

export default FormCheckbox