import React from 'react'

export default ({ mobile, input, field_class, label, searchButton, meta: { error, touched } }) => {
  let fieldStyle = {
    marginBottom: '5px'
  }

  if (!mobile) {
    fieldStyle.fontSize = "20px"
  }

  return (
    <div className={`formField ${searchButton ? "w-90" : "" }`}>
      <label>{label}</label>
      <input className={field_class} value={input.value} {...input} style={ fieldStyle } />
      <div className="color-red-5" style={{marginBottom: '5px'}}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}