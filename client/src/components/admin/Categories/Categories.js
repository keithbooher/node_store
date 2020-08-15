import React, { useState, useEffect } from 'react'
import { getTopCategories, updateCategory, deleteCategory } from '../../../utils/API'
import { dispatchObj } from '../../../actions'
import loadingGif from '../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faCaretUp, faCaretDown, faTrash, faEdit, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { createField, createSubField } from "./formFields"
import CategoryForm from "./CategoryForm"
import { validatePresenceOnAll } from "../../../utils/validations"
import { connect } from 'react-redux'
import { reset } from "redux-form"
import FormModal from "../../shared/Form/FormModal"
import { capitalizeFirsts } from "../../../utils/helperFunctions"

// import { useHistory } from 'react-router-dom'


const Categories = ({ form, dispatch, getTopCategories, deleteCategory, updateCategory }) => {
  const [ categories, setCategories ] = useState([])
  const [ show_create_input, setShowCreateInput ] = useState([])
  const [ editForm, setEditForm ] = useState(null)

  useEffect(() => {
    async function mount() {
      const categories =  await getTopCategories().then(res => res.data)
      setCategories(categories)
    }
    mount()
    return () => {}
  }, [])


  const moveDislayRank = async (direction, category, parent_category) => {
    let parent_cats
    if (parent_category !== null) {
      parent_cats = parent_category.sub_categories
    } else {
      parent_cats = categories
    }

    if (direction === "up") {
      // Then cycle through the parent's sub categories 
      // to find the category that is displaced by this action
      parent_cats.map(async (sub_cat) => {
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
      parent_cats.map(async (sub_cat) => {
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
    const { data } =  await getTopCategories()
    setCategories(data)
  }

  const renderCategories = (parent_category) => {
    let category_set = parent_category !== null ? parent_category.sub_categories : categories
    return (
      category_set.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1).map((category, index) => {
        let up_disable = false
        let down_disable = false
        const sorted_cats = category_set.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1)
        if (sorted_cats[sorted_cats.length - 1]._id === category._id) {
          down_disable = true
        }
        if (category.display_order === 1) {
          up_disable = true
        }

        return (
          <div key={index} style={parent_category === null ? {} : { marginLeft: "20px" }} key={category._id}>
            <div 
              className="margin-xs-v color-white flex space-between" 
              style={{ backgroundColor: 'rgb(45, 45, 45)', padding: '10px 5px' }} 
            >
              <div className="flex">
                <div className="flex margin-s-h">
                  <a style={up_disable === true ? {color: 'lightgrey', cursor: "default"} : {}}><FontAwesomeIcon onClick={up_disable === false ? () => moveDislayRank("up", category, parent_category === null ? null : parent_category) : null} icon={faCaretUp} /></a>
                  <a style={down_disable === true ? {color: 'lightgrey', cursor: "default"} : {}}><FontAwesomeIcon onClick={down_disable === false ? () => moveDislayRank("down", category, parent_category === null ? null : parent_category) : null} icon={faCaretDown} /></a>
                </div>
                <div>
                  {category.name}
                </div>
              </div>
              <div className="flex">
                <button onClick={() => setShowCreateInput(category._id)}><FontAwesomeIcon icon={faPlusCircle} /></button>
                <button onClick={() => showEditForm(category)}><FontAwesomeIcon icon={faEdit} /></button>
                <button onClick={() => changeDisplay(category)}><FontAwesomeIcon icon={category.display ? faEye : faEyeSlash} /></button>
                <button onClick={() => deleteCat(category)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </div>
                      
            {show_create_input === category._id ? 
                <CategoryForm 
                  category={category} 
                  field={createSubField}
                  categories={categories}
                  setShowCreateInput={setShowCreateInput}
                  setCategories={setCategories}
                  />
            : ""}

            {/* Sub Categories */}
            {/* calling its self to infinitely render subcategories */}
            <div>{renderCategories(sortByDisplayOrder(category))}</div>
          </div>
        )
      })
    )
  }

  const sortByDisplayOrder = (category) => {
    category.sub_categories = category.sub_categories.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1)
    return category
  }

  const showEditForm = (category) => {
    // for now all we need to edit is category name
    const form_object = {
      category,
      onSubmit: editCategory,
      cancel: () => {
        dispatchObj(reset("edit_category_form"))
        setEditForm(null)
      },
      submitButtonText: "Update Category",
      formFields: [
        { label: "Name", name: "name", noValueError: `You must provide a value` },
      ],
      form: "edit_category_form",
      validation: validatePresenceOnAll,
      initialValues: {
          name: category["name"]
        }
    }
    setEditForm(form_object)
  }

  const editCategory = async (form_data, categoryToEdit) => {
    categoryToEdit.name = form_data['edit_category_form'].values.name
    await updateCategory(categoryToEdit)
    const { data } =  await getTopCategories()
    setCategories(data)
    setEditForm(null)
  }

  const changeDisplay = async (category) => {
    category.display = !category.display
    await updateCategory(category)
    const { data } =  await getTopCategories()
    setCategories(data)
  }

  // Can use this later to direct to a category edit page 
  // if we have more things to edit in the future
  // const history = useHistory()
  // const goToEditCategory = (category) => {
  //   history.push(`/admin/categories/edit/${category._id}`)
  // }

  const deleteCat = async (category) => {
    let cat = category
    cat.deleted_at = Date.now()
    const delete_cat = await deleteCategory(cat).then(res => res.data)
    setCategories( delete_cat )
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <div>
        <button onClick={() => setShowCreateInput("top")}><FontAwesomeIcon icon={faPlusCircle} /> Add a New Top Level Category</button>
        {show_create_input === "top" ? 
            <CategoryForm
              category={null}
              field={createField} 
              categories={categories}
              setShowCreateInput={setShowCreateInput}
              setCategories={setCategories}
            />
        : ""}
      </div>

      {categories.length !== 0 ? 
        renderCategories(null)
      : <img className="loadingGif" src={loadingGif} /> }

      {editForm &&
        <div>
          <FormModal
            onSubmit={() => editForm.onSubmit(form, editForm.category)}
            cancel={editForm.cancel}
            submitButtonText={editForm.submitButtonText}
            formFields={editForm.formFields}
            form={editForm.form}
            validation={editForm.validation}
            title={capitalizeFirsts(editForm.category.name)}
            initialValues={editForm.initialValues}
          />
        </div>
      }
    </div>
  )

}

function mapStateToProps({ form }) {
  return { form }
}

const actions = { updateCategory, deleteCategory, getTopCategories, dispatchObj }

export default connect(mapStateToProps, actions)(Categories)
