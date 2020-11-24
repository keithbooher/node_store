import React, { useState } from 'react'
import { connect } from 'react-redux'
import { formatMoney } from '../../../../utils/helpFunctions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import StarRatings from 'react-star-ratings'
import Form from "../../../shared/Form"
import VarietalDropdown from "../../../shared/Varietal/VarietalDropdown"

const ProductCoreMobile = ({
  setSelectedImage,
  product,
  preventAlpha,
  addToCart,
  _setQuantity,
  checkInventoryCountInput,
  onChangeInput,
  reviews,
  averageRating,
  selectedImage,
  quantity,
  chosenVarietal,
  setVarietal
}) => {

  let varietal_boolean = product.varietals.length > 0 ? true : false

  return (
    <div>
      <h1 style={{ marginTop: "10px", marginBottom: "0px" }}>{product.name}</h1>
      <div style={{ marginBottom: "20px" }}>
        {reviews.length > 0 && averageRating &&
          <StarRatings
            rating={new Number(averageRating)}
            starRatedColor="#6CB2EB"
            numberOfStars={5}
            name='rating'
            starDimension="15px"
            starSpacing="1px"
          />
        }
      </div>
      <div className="text-align-center">
        <img style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "25em" }} src={selectedImage} />
      </div>
      <div className="flex" style={{ margin: "10px 10px 0px 10px" }}>
        {Object.keys(product.images).map((image_key, index) => {
          return (
            <div key={index} onClick={product.images[image_key] === null ? () => console.log("do nothing") : () => setSelectedImage(chosenVarietal && !product.use_master_images ? chosenVarietal.images[image_key] : product.images[image_key])} className={`text-align-center flex justify-center align-items-center background-color-black ${selectedImage === image_key && "opacity-3-4"}`} style={{ margin: "10px 10px 0px 10px", flexBasis: "20%" }}>
              <img style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100px" }} src={chosenVarietal && !product.use_master_images ? chosenVarietal.images[image_key] : product.images[image_key]} />
            </div>
          )
        })}
      </div>
      {product.availability ?
        <>
          <div className="flex flex_column margin-l-v">
            {varietal_boolean && 
              <VarietalDropdown varietals={product.varietals} setVarietal={(v) => {
                  setVarietal(v)
                  setSelectedImage(v.images.i1)
                }} 
                chosenVarietal={chosenVarietal} 
              />
            }

            <h2 className="margin-s-v">${formatMoney(product.price)}</h2>

            {!product.backorderable && product.inventory_count > 0 && <div>In Stock: {product.varietals.length > 0 ? chosenVarietal.inventory_count : product.inventory_count}</div>}
            {product.inventory_count < 1 && <div>Out of stock</div>}
          </div>
          <div className="flex margin-s-v">
            <div className="flex">
              <input onKeyDown={(e) => preventAlpha(e)} onChange={(e) => onChangeInput(e)} onBlur={e => checkInventoryCountInput(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={quantity} defaultValue={1}/>
              <div className="flex flex_column">
                <FontAwesomeIcon onClick={() => _setQuantity("up")} icon={faChevronUp} />
                <FontAwesomeIcon onClick={() => _setQuantity("down")} icon={faChevronDown} />
              </div>
            </div>
            <button className="margin-s-h inline" onClick={addToCart.bind(this)}>Add To Cart</button>
          </div>
        </>
      : <h2>Product Unavailable</h2>}
      <hr/>

      <p>{product.description ? product.description : "No Product Description"}</p>
      {product.gift_note &&
        <Form 
          submitButton= {<div />}
          formFields={[
            { label: 'Gift Note', name: 'gift_note', typeOfComponent: "text-area", noValueError: 'You must provide an address', value: null },
          ]} 
          form={"gift_note_form"}
        />
      }
    </div>
  )
}


function mapStateToProps({ form }) {
  return { form }
}

const actions = {  }

export default connect(mapStateToProps, actions)(ProductCoreMobile)