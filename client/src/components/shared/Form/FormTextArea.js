import React from 'react'

export default ({ input, label, field_class, onChange, meta: { error, touched } }) => {
  // console.log(input)
  return (
    <div className="textArea">
      <label>{label}</label>
      <textarea onChange={onChange} className={field_class} value={input.value} {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}