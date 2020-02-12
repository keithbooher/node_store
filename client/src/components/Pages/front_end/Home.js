import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../../../stylesheets/homepage.css.scss'
import ProductCard from '../../PageComponents/front_end/ProductCard'

class Home extends Component  {
  constructor(props) {
    super()
    this.state = {
      products: []
    }
  }

  renderProducts() {
    return this.props.products.reverse().map(product => {
      return <ProductCard product={product} />
    })
  }

  
  render() {
    return (
      <div>
        <h1>
          Node Store
        </h1>
        <div className="product_grid">
          {this.renderProducts()}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, null)(Home)