
import React from "react"
const colorDropDownItem = ({ item }) => {
  return (
    <div className="flex align-items-center margin-s-v">
      <div className="hover hover-color-12" style={{ height: "25px", width: "25px", backgroundColor: item.value.value }}></div>
      <div className="hover hover-color-12 margins-s-h" >{item.name}</div>
    </div>
  )
}

export default colorDropDownItem