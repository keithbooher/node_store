import React, { Component } from 'react'
import { getAllCategories } from "../../utils/API"
import LineItem from "../shared/LineItem"
import loadingGif from '../../images/pizzaLoading.gif'

class Categories extends Component {
  constructor(props) {
    super()
    this.state = {
      categories: null,
      page_number: 1,
      chosen_order: null
    }
  }
  
  async componentDidMount() {
    // const categories = await getAllCategories("none", "none")
    // console.log(categories)
    // this.setState({ categories: categories.data })
  }


  render() {
    return (
      <div>
        derp
      </div>
    )
  }
}


export default Categories