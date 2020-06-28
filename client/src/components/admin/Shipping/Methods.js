import React, { Component } from 'react'
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
    const { data } = await getShippingMethods()
    this.setState({ shippingMethods: data })
  }

  async changeDisplay(method) {
    let shippingMethod = method
    shippingMethod.display = !shippingMethod.display
    await updateShippingMethod(shippingMethod)
    const { data } = await getShippingMethods()
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
            <div key={method.internal_name}>
              <Link to={url} className={`carrier_card background-color-grey-3 ${method.display && "clickable"}`}>
                <div>{method.name}</div>
                {not_available.indexOf(method.internal_name) > -1 && "Not available"}
                {!method.display && 
                  <>
                    <div>Hidden in checkout</div>
                  </>
                }
              </Link>
              <div>
                {not_available.indexOf(method.internal_name) < 0 ? 
                  <div className="flex clickable" onClick={() => this.changeDisplay(method)}>
                    <FontAwesomeIcon icon={method.display ? faEye : faEyeSlash} />
                    {method.display ? <div className="margin-s-h">This shipping method is used in checkout</div> : <div className="margin-s-h">use this shipping method in checkout</div>}
                  </div>
                : "Not available"}
              </div>
            </div>
          )
        })}
      </div>
    </div>
    )
  }
}

export default Carriers