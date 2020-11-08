import React from 'react'

export default ({ mobile, input, field_class, label, searchButton, autofocus, meta: { error, touched } }) => {

  const preventAlpha = (e) => {
    if (!isNumber(e)) {
      e.preventDefault()
    }
  }

  const isNumber = (e) => {
    var charCode = e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false
    }
    return true
  }


  return (
    <div className={`formField numberField ${searchButton ? "w-90" : "" }`}>
      <label>{label}</label>
      <input autoFocus={autofocus} onKeyDown={(e) => preventAlpha(e)} className={field_class} value={input.value} {...input} style={{ marginBottom: '5px' }} />
      <div className="color-red-5" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
      {/* THIS IS THE SAME AS ABOVE {!touched ? "" : error} */}
    </div>
  )
}