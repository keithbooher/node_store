import React from 'react'

export default ({ input, label, meta: { error, touched } }) => {
  console.log(input)
  return (
    <div>
      <label>{label}</label>
      <input value={input.value} {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}