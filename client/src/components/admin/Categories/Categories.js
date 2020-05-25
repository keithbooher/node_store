import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form";
import { getTopCategories, createCategory, updateCategory } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faCaretUp, faCaretDown, faTrash } from "@fortawesome/free-solid-svg-icons"
import hf from "../../../utils/helperFunctions"
import { categoryFields, createField, createSubField } from "./formFields"
import Form from "../../shared/Form"


class Categories extends Component {
  constructor(props) {
    super()
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
    let categories
    if (parent_category !== null) {
      categories = parent_category.sub_categories
    } else {
      categories = this.state.categories
    }

    if (direction === "up") {
      // Then cycle through the parent's sub categories 
      // to find the category that is displaced by this action
      categories.map(async (sub_cat) => {
        if (sub_cat.display_order - category.display_order === -1 ) {
          sub_cat.display_order = sub_cat.display_order + 1
          const updated_displaced_category = await updateCategory(sub_cat)
          // ^ ^ ^check if succesful ^ ^ ^ //
        }
      })
      category.display_order = category.display_order - 1
      const updated_category = await updateCategory(category)
      // ^ ^ ^check if succesful ^ ^ ^ //
    } else {
      // Then cycle through the parent's sub categories 
      // to find the category that is displaced by this action
      categories.map(async (sub_cat) => {
        if (sub_cat.display_order - category.display_order === 1 ) {
          sub_cat.display_order = sub_cat.display_order - 1
          const updated_displaced_category = await updateCategory(sub_cat)
          // ^ ^ ^check if succesful ^ ^ ^ //
        }
      })
      category.display_order = category.display_order + 1
      const updated_category = await updateCategory(category)   
      // ^ ^ ^check if succesful ^ ^ ^ //
    }
    const top_categories =  await getTopCategories()
    this.setState({ categories: top_categories.data })
  }

  categories(parent_category) {
    let categories = parent_category !== null ? parent_category.sub_categories : this.state.categories
    return (
      categories.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1).map((category) => {
        let up_disable = false
        let down_disable = false
        const sorted_cats = categories.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1)
        if (sorted_cats[sorted_cats.length - 1]._id === category._id) {
          down_disable = true
        }
        if (category.display_order === 1) {
          up_disable = true
        }

        return (
          <div style={parent_category === null ? {} : { marginLeft: "20px" }} key={category._id}>
            <div 
              className="margin-xs-v color-white flex space-between" 
              style={{ backgroundColor: 'rgb(45, 45, 45)', padding: '10px 5px' }} 
            >
              <div>{category.name}</div>
              <div className="flex">
                <div className="flex margin-s-h">
                  <a style={up_disable === true ? {color: 'lightgrey', cursor: "default"} : {}}><FontAwesomeIcon onClick={up_disable === false ? () => this.moveDislayRank("up", category, parent_category === null ? null : parent_category) : null} icon={faCaretUp} /></a>
                  <a style={down_disable === true ? {color: 'lightgrey', cursor: "default"} : {}}><FontAwesomeIcon onClick={down_disable === false ? () => this.moveDislayRank("down", category, parent_category === null ? null : parent_category) : null} icon={faCaretDown} /></a>
                </div>
                <button onClick={() => this.setState({ show_create_input: category._id })}><FontAwesomeIcon icon={faPlusCircle} /></button>
                <button onClick={() => this.deleteCategory(category)}><FontAwesomeIcon icon={faTrash} /></button>
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

            {/* Sub Categories */}
            {/* calling its self to infinitely render subcategories */}
            <div>{this.categories(this.sortByDisplayOrder(category))}</div>
          </div>
        )
      })
    )
  }

  sortByDisplayOrder(category) {
    category.sub_categories = category.sub_categories.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1)
    return category
  }

  async deleteCategory(category) {
    let cat = category
    cat.deleted_at = Date.now()
    const delete_cat = await updateCategory(cat)
    const top_categories =  await getTopCategories()
    this.setState({ categories: top_categories.data })
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
          this.categories(null)
        : <img className="loadingGif" src={loadingGif} /> }
      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(Categories)