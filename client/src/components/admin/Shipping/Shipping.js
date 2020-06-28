import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Methods from "./Methods"
import FlatRate from "./FlatRate"
import "./shipping.scss"

class Shipping extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }

  async componentDidMount() {

  }

  render() {

    return (
    <div>
      <Route exact path="/admin/shipping/methods" component={Methods} />
      <Route exact path="/admin/shipping/shipping_method/flat_rate" component={FlatRate} />
      {/* <Route exact path="/admin/shipping/shipping_method/fedex" component={Fedex} /> FUTURE DEVELOPMENT */}

    </div>
    )
  }
}

export default Shipping