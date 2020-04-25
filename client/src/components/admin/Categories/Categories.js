import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTopCategories, createCategory } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import hf from "../../../utils/helperFunctions"
import { categoryFields, createField } from "./formFields"
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
    this.setState({ categories: top_categories.data })
  }

  async handleCreateCategoryCreate(e, top_or_not, parent_category) {
    e.preventDefault()
    const create_category_form_values = this.props.form['create_category_form'].values
    let new_category = {}
    new_category["name"] = create_category_form_values.name
    new_category["path_name"] = hf.productNameToPathName(create_category_form_values.name)
    new_category["top_level"] = top_or_not

    let display_order
    if (parent_category !== null) {
      display_order = parent_category.sub_categories.length + 1
    } else {
      display_order = this.state.categories.length + 1
    }
    new_category["display_order"] = display_order

    const create_category = await createCategory(new_category)

    // TO DO
    // do something if create_category.status !== 200

    if (top_or_not !== false) {
      // then add the newly created category to the parent's list of subcategories
      // addToParentCategory()
    } 

    // get all categories again
    const top_categories =  await getTopCategories()
    this.setState({ categories: top_categories.data, show_create_input: null  })
  }

  renderSubCategories(parent_category) {
    console.log(parent_category)
    return <div style={{ marginLeft: '20px' }}>Sub Categories</div>
  }

  render() {
    return (
      <div>

        <div>
          <button onClick={() => this.setState({ show_create_input: "top" })}><FontAwesomeIcon icon={faPlusCircle} /> Add a New Top Level Category</button>
          {this.state.show_create_input === "top" ? 
              <div>
                <Form 
                  onSubmit={(e) => this.handleCreateCategoryCreate(e, true, null)}
                  submitButtonText={"Create Category"}
                  formFields={createField}
                  formId='create_category_form'
                  form='create_category_form'
                />
              </div>
          : ""}
        </div>

        {this.state.categories.length !== 0 ? 
          this.state.categories.map((category) => {
            return (
              <div key={category._id}>
                <div 
                  className="clickable margin-xs-v color-white" 
                  style={{ backgroundColor: 'rgb(45, 45, 45)' }} 
                >
                  {category.name}
                </div>
                <div>{this.renderSubCategories(category)}</div>
              </div>
            )
        }) : <img className="loadingGif" src={loadingGif} /> }
      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(Categories)