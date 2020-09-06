import React from 'react'

export default ({ mobile, input, field_class, label, searchButton, meta: { error, touched } }) => {
  let fieldStyle = {
    marginBottom: '5px'
  }

  let width_class = ""

  if (!mobile) {
    fieldStyle.fontSize = "20px"
    if (searchButton) {
      width_class = "w-40"
    }
  } else {
    if (searchButton) {
      width_class = "w-90"
    }
  }

  return (
    <div className={`formField ${width_class}`}>
      <label>{label}</label>
      <input className={field_class} value={input.value} {...input} style={ fieldStyle } />
      <div className="color-red-5" style={{marginBottom: '5px'}}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}