import React, { Component } from 'react'
import { SwatchesPicker } from 'react-color';

class ColorPicker extends Component {

  handleChange(color, e) {
    console.log(color)
    // this.props.handleChange()
  }

  render() {
    return <SwatchesPicker height={"150px"} onChange={ (color, e) => this.props.onChange(color) } />;
  }
}

export default ColorPicker