import React from 'react'

export default ({ input, field_class, label, onChange, searchButton, meta: { error, touched } }) => {
  return (
    <div className={`formField ${searchButton ? "w-90" : "" }`}>
      <label>{label}</label>
      <input className={field_class} value={input.value} {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}