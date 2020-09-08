import React from 'react'

export default ({ mobile, input, label, field_class, onChange, meta: { error, touched } }) => {
  let fieldStyle = {
    marginBottom: '5px',
    minHeight: "65px",
    padding: "5px"
  }

  if (!mobile) {
    fieldStyle.fontSize = "20px"
    fieldStyle.padding = "10px"
  }
  return (
    <div className="textArea">
      <label>{label}</label>
      <div>

        <textarea onChange={onChange} className={field_class} value={input.value} {...input} style={ fieldStyle } />
      </div>
      <div className="color-red-5" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}