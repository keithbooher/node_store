import React from 'react'
import { connect } from 'react-redux'
import { productNameToPathName } from "../../../utils/helperFunctions"
import Form from "../../shared/Form"
import { reset } from "redux-form"
import { getTopCategories, createCategory, updateCategory } from '../../../utils/API'


const CategoryForm = ({ 
  category,
  field,
  form,
  dispatch,
  categories,
  setShowCreateInput,
  setCategories }) => {

  const handleCreateCategoryCreate = async (e, parent_category) => {
    e.preventDefault()
    const create_category_form_values = form['create_category_form'].values
    let new_category = {}
    new_category["name"] = create_category_form_values.name
    new_category["path_name"] = productNameToPathName(create_category_form_values.name)

    let display_order
    if (parent_category !== null) {
      display_order = parent_category.sub_categories.length + 1
      new_category["nest_level"] = parent_category.nest_level + 1
    } else {
      display_order = categories.length + 1
      new_category["nest_level"] = 0
    }
    new_category["display_order"] = display_order

    const create_category = await createCategory(new_category).then(res => res.data)

    // TO DO
    // do something if create_category.status !== 200

    if (parent_category !== null) {
      // if not a top category
      // then add the newly created category to the parent's list of subcategories
      parent_category.sub_categories.push(create_category._id)
      const updated_parent_category = await updateCategory(parent_category)
      // TO DO
      // if updated_parent_category.status !== 200 flag error
    } 

    // get all categories again
    const topLevelCategories =  await getTopCategories().then(res => res.data)
    setCategories(topLevelCategories) // this has to happen first because the rerender causes bad data
    setShowCreateInput(null)
    dispatch(reset("create_category_form"))
  }

  return (
    <div style={{ marginLeft: '20px' }}>
      <Form 
        onSubmit={(e) => handleCreateCategoryCreate(e, category)}
        submitButtonText={"Create A Subcategory"}
        formFields={field}
        form='create_category_form'
        cancel={() => setShowCreateInput(null)}
      />
  </div>
  )
}


function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(CategoryForm)