import React, { Component } from 'react'
import { getTopCategories, createCategory, updateCategory } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import hf from "../../../utils/helperFunctions"
import { categoryFields, createField, createSubField } from "./formFields"
import SubCategories from "./SubCategory"

import {SortableContainer, SortableElement} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class Categories extends Component {
  constructor(props) {
    super()
    this.topLevelCategories = this.topLevelCategories.bind(this)
    this.refresh_master_list = this.refresh_master_list.bind(this)
    this.state = {
      categories: [],
      show_create_input: false,
      createInputValue: ""
    }
  }
  
  async componentDidMount() {
    const top_categories =  await getTopCategories()
    console.log("DID MOUNT")
    this.setState({ categories: top_categories.data })
  }

  async handleCreateCategoryCreate(e, parent_category) {
    e.preventDefault()

    let new_category = {}
    new_category["name"] = this.state.createInputValue
    new_category["path_name"] = hf.productNameToPathName(this.state.createInputValue)

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
    this.setState({ categories: top_categories.data, show_create_input: null, createInputValue: ""  })
  }

  async refresh_master_list() {
    console.log("REFERSH")
    const top_categories =  await getTopCategories()
    console.log(top_categories)
    this.setState({ categories: top_categories.data, show_create_input: null, createInputValue: "" })
  }

  topLevelCategories() {
    return (
      this.state.categories.map((category) => {
        console.log(category)
        return (
          <div key={category._id}>
            <div 
              className="margin-xs-v color-white flex justify-content-space-between" 
              style={{ backgroundColor: 'rgb(45, 45, 45)', padding: '10px 5px' }} 
            >
              <div>{category.name}</div>
              <button onClick={() => this.setState({ show_create_input: category._id })}><FontAwesomeIcon icon={faPlusCircle} /></button>
            </div>
                      
            {this.state.show_create_input === category._id ? 
                <div style={{ marginLeft: '20px' }}>
                  <form onSubmit={(e) => this.handleCreateCategoryCreate(e, category)}>
                    <label>Create SubCategory</label>
                    <input value={this.state.createInputValue} onChange={(e) => this.setState({ createInputValue: e.target.value })}/>
                    <button type="submit">Create A Subcategory</button>
                    <button onClick={() => this.setState({ show_create_input: null })} type="submit">Cancel</button>
                  </form>
                </div>
            : ""}

            {category.sub_categories.length > 0 ?
              <div><SubCategories categories={category.sub_categories} refresh_master_list={this.refresh_master_list} parent_category={category} /></div>
            : "" }
          </div>
        )
      })
    )
  }

  render() {
    console.log("LOOK")
    console.log(this.state)
    return (
      <div>

        <div>
          <button onClick={() => this.setState({ show_create_input: "top" })}><FontAwesomeIcon icon={faPlusCircle} /> Add a New Top Level Category</button>
          {this.state.show_create_input === "top" ? 
              <div>
                <div style={{ marginLeft: '20px' }}>
                  <form onSubmit={(e) => this.handleCreateCategoryCreate(e, null)}>
                    <label>Create Category</label>
                    <input value={this.state.createInputValue} onChange={(e) => this.setState({ createInputValue: e.target.value })}/>
                    <button type="submit">Create A Subcategory</button>
                    <button onClick={() => this.setState({ show_create_input: null })} type="submit">Cancel</button>
                  </form>
                </div>
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


export default Categories