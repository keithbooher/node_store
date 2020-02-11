import React, { Component } from 'react'
import { connect } from 'react-redux'
import { allProducts } from '../../actions'
import { Link } from 'react-router-dom'
import '../../stylesheets/homepage.css.scss'
import API from "../../utils/API";

class Home extends Component  {
  constructor({ subject, recipients }, content) {
    super()
    this.state = {
      products: []
    }
  }
  componentWillMount() {
    this.props.allProducts()
  }

  get_category_path_name(id) {
    return API.getCategoryPathName(id).then(res => {
      console.log('res.data', res.data.path_name)
      return res.data.path_name
    })
  }

  render_products() {
    return this.props.products.reverse().map(product => {
      return (
        <div>
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">{product.name}</span>
              <p>{product.description}</p>
            </div>
            <div class="card-action">
              <Link to={`/shop/${product.category.category_path_name}/${product.path_name}`} className="">Go to this product</Link>
            </div>
          </div>
          
        </div>
      )
    })
  }

  
  render() {
    return (
      <div>
        <h1>
          Node Store
        </h1>
        <div className="product_grid">
          {this.render_products()}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, {allProducts})(Home)