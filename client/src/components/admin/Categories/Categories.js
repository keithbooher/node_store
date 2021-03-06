import React, { useState, useEffect } from 'react'
import { getTopCategories, updateCategory, deleteCategory } from '../../../utils/API'
import { dispatchObj } from '../../../actions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faCaretUp, faCaretDown, faTrash, faEdit, faEye, faEyeSlash, faSpinner, faList, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { catFields, createSubField } from "./formFields"
import CategoryForm from "./CategoryForm"
import { validatePresenceOnAll } from "../../../utils/validations"
import { connect } from 'react-redux'
import { reset } from "redux-form"
import FormModal from "../../shared/Form/FormModal"
import Modal from "../../shared/Modal"
import { capitalizeFirsts } from "../../../utils/helpFunctions"
import ProductDisplayOrder from "./ProductDisplayOrder"
// import { useHistory } from 'react-router-dom'


const Categories = ({ form, dispatchObj, getTopCategories, deleteCategory, updateCategory, mobile }) => {
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
          await updateCategory(sub_cat)
          // ^ ^ ^check if succesful ^ ^ ^ //
        }
      })
      category.display_order = category.display_order - 1
      await updateCategory(category)
      // ^ ^ ^check if succesful ^ ^ ^ //
    } else {
      // Then cycle through the parent's sub categories 
      // to find the category that is displaced by this action
      parent_cats.map(async (sub_cat) => {
        if (sub_cat.display_order - category.display_order === 1 ) {
          sub_cat.display_order = sub_cat.display_order - 1
          await updateCategory(sub_cat)
          // ^ ^ ^check if succesful ^ ^ ^ //
        }
      })
      category.display_order = category.display_order + 1
      await updateCategory(category)   
      // ^ ^ ^check if succesful ^ ^ ^ //
    }
    const { data } =  await getTopCategories()
    setCategories(data)
  }

  const [areYouSure, setAreYouSure] = useState(false)

  const renderCategories = (parent_category) => {
    let category_set = parent_category !== null ? parent_category.sub_categories : categories
    console.log(category_set)
    return (
      category_set.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1).filter((cat) => cat.deleted_at !== null).map((category, index) => {
        let up_disable = false
        let down_disable = false
        const sorted_cats = category_set.sort((a, b) => (a.display_order > b.display_order) ? 1 : -1)
        if (sorted_cats[sorted_cats.length - 1]._id === category._id) {
          down_disable = true
        }
        if (category.display_order === 1) {
          up_disable = true
        }

        let fontSize = "17px"
        let marginTop = "5px"
        if (!mobile) {
          fontSize = "20px"
          marginTop = "10px"
        }

        return (
          <div key={index} style={parent_category === null ? { marginTop } : { marginLeft: "20px", marginTop }} key={category._id}>
            <div 
              className="margin-xs-v color-white flex space-between" 
              style={{ backgroundColor: 'rgb(45, 45, 45)', padding: '10px 5px' }} 
            >
              <div className="flex">
                <div className="flex flex_column justify-center">
                  <div className={`flex margin-s-h ${mobile && "flex_column"}`}>
                    <a className="hover-color-11" style={up_disable === true ? {color: 'lightgrey', cursor: "default"} : {}}><FontAwesomeIcon onClick={up_disable === false ? () => moveDislayRank("up", category, parent_category === null ? null : parent_category) : null} icon={faCaretUp} /></a>
                    <a className="hover-color-11" style={down_disable === true ? {color: 'lightgrey', cursor: "default"} : {}}><FontAwesomeIcon onClick={down_disable === false ? () => moveDislayRank("down", category, parent_category === null ? null : parent_category) : null} icon={faCaretDown} /></a>
                  </div>
                </div>
                <div className="flex flex_column justify-center">
                  {category.name}
                </div>
              </div>
              <div className={`flex flex-wrap ${mobile && "margin-s-h"}`}>
                <button style={{ fontSize, maxHeight: "28px", margin: "0px 2px", padding: "2px" }} onClick={() => setShowCreateInput(category._id)}><FontAwesomeIcon icon={faPlusCircle} /></button>
                <button style={{ fontSize, maxHeight: "28px", margin: "0px 2px", padding: "2px" }} onClick={() => showEditForm(category)}><FontAwesomeIcon icon={faEdit} /></button>
                <button style={{ fontSize, maxHeight: "28px", margin: "0px 2px", padding: "2px" }} onClick={() => productOrderModal(category)}><FontAwesomeIcon icon={faList} /></button>
                <button style={{ fontSize, maxHeight: "28px", margin: "0px 2px", padding: "2px" }} onClick={() => changeDisplay(category)}><FontAwesomeIcon icon={category.display ? faEye : faEyeSlash} /></button>
                <button style={{ fontSize, maxHeight: "28px", margin: "0px 2px", padding: "2px" }} onClick={() => setAreYouSure(category)}><FontAwesomeIcon icon={faTrash} /></button>
                <button className={`${mobile && "margin-s-v"}`} style={{ fontSize, maxHeight: "28px", padding: "2px", marginLeft: "10px" }} onClick={() => changeMasthead(category)}>Masthead <FontAwesomeIcon icon={category.masthead ? faCheck : faTimes} /></button>
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
      formFields: catFields,
      form: "edit_category_form",
      validation: validatePresenceOnAll,
      initialValues: {
          name: category["name"],
          meta_title: category["meta_title"],
          meta_description: category["meta_description"],
          meta_keywords: category["meta_keywords"],
        }
    }
    setEditForm(form_object)
  }

  const editCategory = async (form_data, categoryToEdit) => {
    let form_values = form_data['edit_category_form'].values

    categoryToEdit.name = form_values.name
    categoryToEdit.meta_title = form_values.meta_title
    categoryToEdit.meta_description = form_values.meta_description
    categoryToEdit.meta_keywords = form_values.meta_keywords

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

  const changeMasthead = async (category) => {
    category.masthead = !category.masthead
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
    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    cat.deleted_at = today
    const delete_cat = await deleteCategory(cat).then(res => res.data)
    console.log(delete_cat)
    setAreYouSure( false )
    setCategories( delete_cat )
  }

  const [displayOrderModal, setDisplayOrderModal] = useState(false)

  const productOrderModal = (category) => {
    setDisplayOrderModal(category)
  }

  
  let container_style = {
    fontSize: "1em",
    margin: "30px 0px 0px 0px"
  }
  
  if (!mobile) {
    container_style.fontSize = "20px"
    container_style.width = "80%"
    container_style.margin = "50px auto"
  }
  return (
    <div style={ container_style }>
      <div>
        <span className="absolute store_text_color hover hover-color-4" style={{ top: "5px", right: "5px" }} onClick={() => setShowCreateInput("top")}><FontAwesomeIcon icon={faPlusCircle} /> Parent Category</span>
        <h1 className="text-align-center">Categories</h1>
        {show_create_input === "top" ? 
            <CategoryForm
              category={null}
              field={catFields} 
              categories={categories}
              setShowCreateInput={setShowCreateInput}
              setCategories={setCategories}
            />
        : ""}
      </div>

      {categories.length !== 0 ? 
        <div>
          {renderCategories(null)}
        </div>
      : <FontAwesomeIcon className="loadingGif" icon={faSpinner} spin /> }

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

      {areYouSure &&
        <Modal cancel={() => setAreYouSure(false)}>
          <h2>Are you sure you want to delete {areYouSure.name}?</h2>
          <div>
            <button className="padding-s margin-s-h" onClick={() => deleteCat(areYouSure)}><h2 style={{ margin: "0px" }}>Yes</h2></button>
            <button className="padding-s margin-s-h" onClick={() => setAreYouSure(false)} ><h2 style={{ margin: "0px" }}>No</h2></button>
          </div>
        </Modal>
      }

      {displayOrderModal &&
        <Modal cancel={() => setDisplayOrderModal(false)}>
          <ProductDisplayOrder data={displayOrderModal} />
        </Modal>
      }
    </div>
  )

}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { updateCategory, deleteCategory, getTopCategories, dispatchObj }

export default connect(mapStateToProps, actions)(Categories)
