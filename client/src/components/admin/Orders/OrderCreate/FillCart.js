import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from "../../../shared/Form"
import { getProductbyname } from "../../../../utils/API"
class FillCart extends Component {
  constructor(props) {
    super()
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.addToLineItems = this.addToLineItems.bind(this)
    this.state = {
      line_items: [],
      result: null
    }
  }

  async handleSearchSubmit() {
    const search_for_product = this.props.form['product_order_search_form'].values
    const { data } = await getProductbyname(search_for_product.name)
    this.setState({ result: data })
  }

  addToLineItems(product) {
    console.log(product)
    console.log(this.state.line_items)
    let line_item = {
      product_name: product.name,
      image: product.image,
      _product_id: product._id,
      quantity: 1,
      product_price: product.price
    }

    let line_items = [...this.state.line_items]
    line_items.push(line_item)

    console.log(line_items)

    this.setState({ line_items })
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <div>Search For Line Items to add to the cart</div>
          <Form 
            onSubmit={this.handleSearchSubmit}
            submitButtonText={"Search For product"}
            formFields={[
              { label: 'Search For Product By Name', name: 'name', noValueError: 'You must provide an name' },
            ]}
            form='product_order_search_form'
          />

          {this.state.result &&
            <>
              <h2>Product Found</h2>
              <h3>{this.state.result.name}</h3>
              <button onClick={() => this.addToLineItems(this.state.result)}>Add to cart</button>
            </>
          }

          {this.state.line_items.length > 0 &&
            <>
              <h2>Line Items</h2>
              {this.state.line_items.map((item) => {
                return (
                    <div>{item.product_name}</div>
                  )
                })
              }
            </>
          }
      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(FillCart)
