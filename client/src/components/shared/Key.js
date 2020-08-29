import React from 'react'


const Key = ({ children, store_color }) => {

  return (
    <span className={`bold ${store_color && "store_text_color"}`}>{children}</span>
  )

}

export default Key