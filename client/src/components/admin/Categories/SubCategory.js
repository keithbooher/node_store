import React, { Component } from 'react'
import { getCategory, createCategory, updateCategory } from '../../../utils/API'
import loadingGif from '../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import hf from "../../../utils/helperFunctions"
import { categoryFields, createField, createSubField } from "./formFields"
import Form from "../../shared/Form"
import SubSubCategories from "./SubCategory"

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

class SubCategories extends Component {
  constructor(props) {
    super()
    this.handleSubCategoryCreate = this.handleSubCategoryCreate.bind(this)
    this.topSubLevelCategories = this.topSubLevelCategories.bind(this)
    this.state = {
      current_tops: props.current_tops,
      top_sub_cats: props.categories,
      show_create_input: false,
      createInputValue: ""

    }
  }

  async handleSubCategoryCreate(e, parent_category) {
    console.log(this.props)
    e.preventDefault()


    let new_category = {}
    new_category["name"] = this.state.createInputValue
    new_category["path_name"] = hf.productNameToPathName(this.state.createInputValue)

    new_category["display_order"] = this.state.top_sub_cats.length + 1
    new_category["nest_level"] = parent_category.nest_level + 1
    new_category["sub_categories"] = []

    const create_category = await createCategory(new_category)

    console.log("created category")
    console.log(create_category)

    // TO DO
    // do something if create_category.status !== 200

    parent_category.sub_categories.push(create_category.data._id)
    const updated_parent_category = await updateCategory(parent_category)

    console.log("updated_parent_category")
    console.log(updated_parent_category)

    console.log("parent cat prop")
    console.log(this.props.parent_category)

    
    // console.log(main_sub.data)
    // this.props.refresh_master_list()

    this.setState({ show_create_input: null, createInputValue: "" })
    // this.setState({ show_create_input: null, createInputValue: "" })

  }

  topSubLevelCategories(cats) {
    console.log(`${this.props.parent_category.name}`, cats)
    return (
      cats.map((category) => {
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
                  <form onSubmit={(e) => this.handleSubCategoryCreate(e, category)}>
                    <label>Create SubCategory</label>
                    <input value={this.state.createInputValue} onChange={(e) => this.setState({ createInputValue: e.target.value })}/>
                    <button type="submit">Create A Subcategory</button>
                    <button onClick={() => this.setState({ show_create_input: null })} type="submit">Cancel</button>
                  </form>
                </div>
            : ""}

            {category.sub_categories ? category.sub_categories.length > 0 ?
              <div><SubSubCategories categories={category.sub_categories} refresh_master_list={this.props.refresh_master_list} parent_category={category} /></div>
            : "" : "" }
          </div>
        )
      })
    )
  }

  render() {
    console.log(this.props.parent_category.name, this.state.top_sub_cats)
    return (
      <div style={{ marginLeft: '20px' }}>
        {this.state.top_sub_cats.length > 0 ? 
          this.topSubLevelCategories(this.state.top_sub_cats)
        : <img className="loadingGif" src={loadingGif} /> }
      </div>
    )
  }
}


export default SubCategories