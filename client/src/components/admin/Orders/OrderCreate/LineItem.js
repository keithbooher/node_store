import React, { Component } from 'react'

class LineItem extends Component {
  constructor(props) {
    super()

    this.state = {
      quantity: this.props.item.quantity
    }
  }

  onChangeInput(e) {
    let value = parseInt(e.target.value)

    if (e.target.value === "") {
      value = ""
    }
    this.setState({ quantity: value })
  }


  render() {
    return (
      <div className="relative padding-m background-color-grey-2" style={{ flexBasis: "100%", marginTop: "10px" }}>
        <FontAwesomeIcon onClick={() => this.removeLineItem(item)} className="absolute" style={{ right: "0px", top: "0px" }} icon={faTrash} />
        <div><img style={{ height: "auto", width: "98%" }} src={item.image}/></div>
        <div>{item.product_name}</div>
        <div>Price: ${item.product_price}</div>
        <div>
          Quantity: <input onKeyDown={(e) => this.preventAlpha(e)} onChange={(e) => this.onChangeInput(e)} onBlur={e => this.checkInventoryCount(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={item.quantity} defaultValue={1}/>
          <FontAwesomeIcon 
            onClick={() => this.adjustLineItemQuantity(item, "up")} 
            icon={faCaretUp} 
          />
          <FontAwesomeIcon 
            onClick={() => this.adjustLineItemQuantity(item, "down")} 
            icon={faCaretDown} 
          />
        </div>
      </div>
    )
  }
}

export default LineItem