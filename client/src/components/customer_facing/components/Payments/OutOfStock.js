import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateCart } from "../../../../actions"

class OutOfStock extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }

  componentDidMount() {
    let cart = this.props.cart
    console.log(cart.line_items)

    console.log(this.props.out_of_stock_items)

    let out_of_stock_items = this.props.out_of_stock_items.filter((item) => item !== null)
    console.log(out_of_stock_items)

    out_of_stock_items = out_of_stock_items.map((item) => {
      return item._id
    })
    console.log(out_of_stock_items)

    cart.line_items = cart.line_items.map((item) => {
      let remove

      out_of_stock_items.forEach(oos_item => {
        if (oos_item === item._id) {
          remove = true
        } else {
          remove = false
        }
      })

      if (remove) {
        return null
      } else {
        return item
      }
    })
    
    cart.line_items = cart.line_items.filter((item) => item !== null)
    
    console.log(cart.line_items)

    this.props.updateCart(cart)
  }

  render() {

    return (
      <div>

      </div>
    )
  }
}

const merge_arrays_remove_dupes = (line_items, out_of_stock_items, compare_values) => {
  return line_items.filter(function(o1){
    // filter out (!) items in result2
    return !out_of_stock_items.some(function(o2){
        return o1.id === o2.id;          // assumes unique id
    });
  }).map(function(o){
      // use reduce to make objects with only the required properties
      // and map to apply this to the filtered array as a whole
      return compare_values.reduce(function(newo, name){
          newo[name] = o[name];
          return newo;
      }, {});
  });
}


const actions = { updateCart }

export default connect(null, actions)(OutOfStock)