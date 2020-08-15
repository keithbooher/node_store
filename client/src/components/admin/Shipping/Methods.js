import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { getShippingMethods, updateShippingMethod } from "../../../utils/API"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

class Carriers extends Component {
  constructor(props) {
    super()
    this.state = {
      shippingMethods: []
    }
  }

  async componentDidMount() {
    const { data } = await this.props.getShippingMethods()
    this.setState({ shippingMethods: data })
  }

  async changeDisplay(method) {
    let shippingMethod = method
    shippingMethod.display = !shippingMethod.display
    await this.props.updateShippingMethod(shippingMethod)
    const { data } = await this.props.getShippingMethods()
    this.setState({ shippingMethods: data })
  }

  render() {
    const not_available = ['fedex', 'by_weight']

    return (
    <div>
      <div className="flex flex_column">
        {this.state.shippingMethods.map((method) => {
          let url
          if (method.display) {
            url = `/admin/shipping/shipping_method/${method.internal_name}`
          } else {
            url= '/admin/shipping/methods'
          }
          return (
            <div className="" key={method.internal_name}>
              <div className="background-color-grey-2">
                <Link to={url} className={` ${method.display && "hover"}`}>
                  <h2 className="padding-s">{method.name}</h2>
                  {not_available.indexOf(method.internal_name) > -1 && <div className="padding-s-h">Not available</div>}
                  {!method.display && 
                    <>
                      <div className="padding-s-h">Hidden in checkout</div>
                    </>
                  }
                </Link>
                <div className="padding-s">
                  {not_available.indexOf(method.internal_name) < 0 ? 
                    <div className="flex clickable" onClick={() => this.changeDisplay(method)}>
                      <FontAwesomeIcon icon={method.display ? faEye : faEyeSlash} />
                      {method.display ? <div className="margin-s-h">This shipping method is used in checkout</div> : <div className="margin-s-h">use this shipping method in checkout</div>}
                    </div>
                  : "Not available"}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
    )
  }
}

const actions = { getShippingMethods, updateShippingMethod }

export default connect(null, actions)(Carriers)