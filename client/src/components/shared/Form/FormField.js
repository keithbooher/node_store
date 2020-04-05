import React from 'react'

export default ({ input, field_class, label, onChange, meta: { error, touched } }) => {
  console.log(field_class)
  return (
    <div>
      <label>{label}</label>
      <input className={field_class} onChange={onChange} value={input.value} {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}