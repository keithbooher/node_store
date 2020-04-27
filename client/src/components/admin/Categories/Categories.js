import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form";
import { getTopCategories, createCategory, updateCategory } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons"
import hf from "../../../utils/helperFunctions"
import { categoryFields, createField, createSubField } from "./formFields"
import Form from "../../shared/Form"

import {SortableContainer, SortableElement} from 'react-sortable-hoc';

class Categories extends Component {
  constructor(props) {
    super()
    this.renderSubCategories = this.renderSubCategories.bind(this)
    this.state = {
      categories: [],
      page_number: 1,
      show_create_input: false
    }
  }
  
  async componentDidMount() {
    const top_categories =  await getTopCategories()
    console.log(top_categories)
    this.setState({ categories: top_categories.data })
  }

  async handleCreateCategoryCreate(e, parent_category) {
    e.preventDefault()
    const create_category_form_values = this.props.form['create_category_form'].values
    let new_category = {}
    new_category["name"] = create_category_form_values.name
    new_category["path_name"] = hf.productNameToPathName(create_category_form_values.name)

    let display_order
    if (parent_category !== null) {
      display_order = parent_category.sub_categories.length + 1
      new_category["nest_level"] = parent_category.nest_level + 1
    } else {
      display_order = this.state.categories.length + 1
      new_category["nest_level"] = 0
    }
    new_category["display_order"] = display_order

    const create_category = await createCategory(new_category)

    // TO DO
    // do something if create_category.status !== 200

    if (parent_category !== null) {
      // if not a top category
      // then add the newly created category to the parent's list of subcategories
      parent_category.sub_categories.push(create_category.data._id)
      const updated_parent_category = await updateCategory(parent_category)
      // TO DO
      // if updated_parent_category.status !== 200 flag error
    } 

    // get all categories again
    const top_categories =  await getTopCategories()
    this.setState({ categories: top_categories.data, show_create_input: null  })
    this.props.dispatch(reset("create_category_form"))
  }

  async moveDislayRank(direction, category, parent_category) {
    console.log(direction)
    console.log(category)
    console.log(parent_category)
    if (direction === "up") {
      // Then cycle through the parent's sub categories 
      // to find the category that is displaced by this action
      parent_category.sub_categories.map(async (sub_cat) => {
        console.log(sub_cat.display_order - category.display_order === -1)
        if (sub_cat.display_order - category.display_order === -1 ) {
          sub_cat.display_order = sub_cat.display_order + 1
          console.log("displaced")
          console.log(sub_cat)
          const updated_displaced_category = await updateCategory(sub_cat)
        }
      })
      category.display_order = category.display_order - 1
      const updated_category = await updateCategory(category)
      console.log("add")
      console.log(updated_category)
      // ^ ^ ^check if succesful ^ ^ ^ //
    } else {
      // Then cycle through the parent's sub categories 
      // to find the category that is displaced by this action
      parent_category.sub_categories.map(async (sub_cat) => {
        if (sub_cat.display_order - category.display_order === 1 ) {
          sub_cat.display_order = sub_cat.display_order - 1
          console.log("displaced")
          console.log(sub_cat)
          const updated_displaced_category = await updateCategory(sub_cat)
        }
      })
      category.display_order = category.display_order + 1
      const updated_category = await updateCategory(category)
      console.log("subtract")    
      console.log(updated_category)      
      // ^ ^ ^check if succesful ^ ^ ^ //
    }
    const top_categories =  await getTopCategories()
    console.log(top_categories)
    this.setState({ categories: top_categories.data })
  }

  renderSubCategories(parent_category) {
    console.log("sub categories")
    console.log(parent_category.sub_categories)
    return ( parent_category.sub_categories.map((category) => {
      return (
        <div style={{ marginLeft: '20px' }}key={category._id}>
          <div 
            className="margin-xs-v color-white flex justify-content-space-between" 
            style={{ backgroundColor: 'rgb(45, 45, 45)', padding: '10px 5px' }} 
          >
            <div>{category.name}</div>
            <div className="flex">
              <div className="flex margin-s-h">
                <a><FontAwesomeIcon onClick={() => this.moveDislayRank("up", category, parent_category)} icon={faCaretUp} /></a>
                <a><FontAwesomeIcon onClick={() => this.moveDislayRank("down", category, parent_category)} icon={faCaretDown} /></a>
              </div>
              {category.nest_level === 5 ? "" : 
                <button onClick={() => this.setState({ show_create_input: category._id })}><FontAwesomeIcon icon={faPlusCircle} /></button>
              }
            </div>
          </div>
          
          {this.state.show_create_input === category._id ? 
              <div style={{ marginLeft: '20px' }}>
                <Form 
                  onSubmit={(e) => this.handleCreateCategoryCreate(e, category)}
                  submitButtonText={"Create A Subcategory"}
                  formFields={createSubField}
                  formId='create_category_form'
                  form='create_category_form'
                  cancel={() => this.setState({ show_create_input: null })}
                  />
              </div>
          : ""}
          
          {category.sub_categories.length > 0 ? 
            <div>{this.renderSubCategories(this.sortByDisplayOrder(category))}</div>            
          : "" }
        </div>
      )
    }))
  }

  topLevelCategories() {
    return (
      this.state.categories.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1).map((category) => {
        return (
          <div key={category._id}>
            <div 
              className="margin-xs-v color-white flex justify-content-space-between" 
              style={{ backgroundColor: 'rgb(45, 45, 45)', padding: '10px 5px' }} 
            >
              <div>{category.name}</div>
              <div className="flex">
                <div className="flex margin-s-h">
                  <a><FontAwesomeIcon onClick={() => this.moveDislayRank("up", category, null)} icon={faCaretUp} /></a>
                  <a><FontAwesomeIcon onClick={() => this.moveDislayRank("down", category, null)} icon={faCaretDown} /></a>
                </div>
                <button onClick={() => this.setState({ show_create_input: category._id })}><FontAwesomeIcon icon={faPlusCircle} /></button>
              </div>
            </div>
                      
            {this.state.show_create_input === category._id ? 
                <div style={{ marginLeft: '20px' }}>
                  <Form 
                    onSubmit={(e) => this.handleCreateCategoryCreate(e, category)}
                    submitButtonText={"Create A Subcategory"}
                    formFields={createSubField}
                    formId='create_category_form'
                    form='create_category_form'
                    cancel={() => this.setState({ show_create_input: null })}
                  />
                </div>
            : ""}

            <div>{this.renderSubCategories(this.sortByDisplayOrder(category))}</div>
          </div>
        )
      })
    )
  }

  sortByDisplayOrder(category) {
    category.sub_categories = category.sub_categories.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1)
    return category
  }

  render() {
    console.log(this.state)
    return (
      <div>

        <div>
          <button onClick={() => this.setState({ show_create_input: "top" })}><FontAwesomeIcon icon={faPlusCircle} /> Add a New Top Level Category</button>
          {this.state.show_create_input === "top" ? 
              <div>
                <Form 
                  onSubmit={(e) => this.handleCreateCategoryCreate(e, null)}
                  submitButtonText={"Create Category"}
                  formFields={createField}
                  formId='create_category_form'
                  form='create_category_form'
                  cancel={() => this.setState({ show_create_input: null })}
                />
              </div>
          : ""}
        </div>

        {this.state.categories.length !== 0 ? 
          this.topLevelCategories()
        : <img className="loadingGif" src={loadingGif} /> }
      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(Categories)