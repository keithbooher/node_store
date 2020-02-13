import React, { Component } from 'react'
import { connect } from 'react-redux'
import API from "../../../utils/API";
import ProductCard from '../../PageComponents/front_end/ProductCard'

class Category extends Component  {
  constructor(props) {
    super()
    this.routeParam = props.match.params.category
    this.state = {products: [], category_data: {}}
  }
  componentWillMount() {
    console.log(this.routeParam)
    API.getCategoryData(this.routeParam).then((res) => {
      this.setState({category_data: res.data})
    })
    API.getCategoryProducts(this.routeParam).then((res) => {
      this.setState({products: res.data})
    })

    // How can I resolve the promise by the time we set state?
    // let category_data = API.getCategoryData('test_category').then(res => res.data)
    // let category_products = API.getCategoryProducts('test_category').then(res => res.data)
    // this.setState({ products: category_products, category_data: category_data })
  }

  renderProductCards() {
    return this.state.products.reverse().map(product => {
      return <ProductCard product={product} category_path_name={this.routeParam}/>
    })
  }
  
  render() {
    console.log(this.state)
    return (
      <div>
        <h1>
          {this.state.category_data.name}
        </h1>
        <div style={{display: 'flex'}}>
          {this.renderProductCards()}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, null)(Category)