import React, { useRef } from 'react'
import { connect } from 'react-redux'

const colors = [
  "#000000",
  "#63563B",
  "#92949B",
  "#BABBBD",
  "#F4E4C1",
  "#FFFFFF",
  "#A2242F",
  "#DC793E",
  "#FFD300",
  "#74AA50",
  "#006B54",
  "#263056",
  "#7781A4",
  "#7BAFD4",
  "#6C244C",
  "#E6AF91"
]

const ColorPicker = (onChange) => {



  return (
    <div />
  )

}

function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(ColorPicker)