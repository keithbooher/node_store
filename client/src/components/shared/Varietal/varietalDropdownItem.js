
import React from "react"
const varietalDropdownItem = ({ item }) => {
  console.log(item)
  if (!item) {
    return <div></div>
  } else {
    return (
      <div className="flex align-items-center margin-s-v">
        {item.value.color && <div className="hover hover-color-12" style={{ height: "25px", width: "25px", backgroundColor: item.value.color.value }}></div>}
        <div className="hover hover-color-12 margin-s-h" >{item.value.size.value}</div>
      </div>
    )
  }
}

export default varietalDropdownItem