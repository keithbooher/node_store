import React from 'react'

export default ({ input, field_class, label, searchButton, meta: { error, touched } }) => {
  return (
    <div className={`formField ${searchButton ? "w-90" : "" }`}>
      <label>{label}</label>
      <input className={field_class} value={input.value} {...input} style={{ marginBottom: '5px' }} />
      <div className="color-red-5" style={{marginBottom: '5px'}}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}