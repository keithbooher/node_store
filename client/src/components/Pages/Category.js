import React, { Component } from 'react'
import { connect } from 'react-redux'
import API from "../../utils/API";

class Category extends Component  {
  constructor(props) {
    super()
    this.state = {}
  }
  componentWillMount() {
    API.getCategoryProducts('test_category').then((res) => {
      console.log(res.data)
    })
  }
  
  render() {
    console.log(this.props)
    return (
      <div>
        <h1>
          Category Page
        </h1>
      </div>
    )
  }
}


function mapStateToProps({ products }) {
  return { products }
}

export default connect(mapStateToProps, null)(Category)