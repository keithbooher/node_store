import React, { useState } from 'react'
import { connect } from 'react-redux'
import { formatMoney } from '../../../../utils/helpFunctions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import StarRatings from 'react-star-ratings'
import Form from "../../../shared/Form"
import VarietalDropdown from "../../../shared/Varietal/VarietalDropdown"

const ProductCoreDesktop = ({
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
      <div className="margin-m-v">
        <div className="flex align-items-center">
          <div className="w-40">
            <div>
              <img className="border-radius-s" style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "30em" }} src={selectedImage} />
            </div>
            <div className="flex">
              {Object.keys(product.images).map((image_key, index) => {
                return (
                  <div key={index} onClick={product.images[image_key] === null ? () => console.log("do nothing") : () => setSelectedImage(chosenVarietal && !product.use_master_images ? chosenVarietal.images[image_key] : product.images[image_key])} className={`text-align-center flex justify-center align-items-center background-color-black ${selectedImage === image_key && "opacity-3-4"}`} style={{ margin: "10px 10px 0px 10px", flexBasis: "25%" }}>
                    <img style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100px" }} src={chosenVarietal && !product.use_master_images ? chosenVarietal.images[image_key] : product.images[image_key]} />
                  </div>
                )
              })}
            </div>
          </div>
          <div className="margin-s-h theme-background-6 border-radius padding-m h-100 w-60">
            <div>
              <h2 className="margin-v-none">${formatMoney(product.price)}</h2>
              <div className="flex align-items-center" style={{ margin: "10px 0px 10px 0px" }}>
                <h1 style={{ margin: "0px" }}>{product.name}</h1>
                <div className="margin-s-h">
                  {reviews.length > 0 && averageRating &&
                    <StarRatings
                      rating={new Number(averageRating)}
                      starRatedColor="#6CB2EB"
                      numberOfStars={5}
                      name='rating'
                      starDimension="25px"
                      starSpacing="1px"
                    />
                  }
                </div>
              </div>
              <h3 className="margin-xs-v">Description</h3>
              <div>{product.description ? product.description : "No Product Description"}</div>
            </div>
            {product.availability ?
              <>
                <div className="margin-s-v">
                  {varietal_boolean && 
                    <VarietalDropdown varietals={product.varietals} setVarietal={(v) => {
                        setVarietal(v)
                        setSelectedImage(v.images.i1)
                      }} 
                      chosenVarietal={chosenVarietal} 
                    />
                  }
                  {!product.backorderable && product.inventory_count > 0 && <div>In Stock: {product.varietals.length > 0 ? chosenVarietal.inventory_count : product.inventory_count}</div>}
                  {product.inventory_count < 1 && <div className="margin-s-v">Out of stock</div>}
                  <div className="flex">
                    <div className="flex">
                      <input onKeyDown={(e) => preventAlpha(e)} onChange={(e) => onChangeInput(e)} onBlur={e => checkInventoryCountInput(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={quantity} defaultValue={1}/>
                      <div className="flex flex_column">
                        <FontAwesomeIcon className="hover hover-color-8" onClick={() => _setQuantity("up")} icon={faChevronUp} />
                        <FontAwesomeIcon className="hover hover-color-8" onClick={() => _setQuantity("down")} icon={faChevronDown} />
                      </div>
                    </div>
                    <button className="margin-s-h inline" onClick={addToCart.bind(this)}>Add To Cart</button>
                  </div>
                </div>
              </>
            : 
              <h2>Product Unavailable</h2>
            }

            <div className="flex align-items-center">
              {product.dimensions && 
                <div style={{ flexBasis: "25%" }}>
                  <h3 className="margin-bottom-none">Details</h3>
                  <div className="padding-s">
                    <div>Height: {product.dimensions.height + " in"}</div>
                    <div>Width: {product.dimensions.width + " in"}</div>
                    <div>Depth: {product.dimensions.depth + " in"}</div>
                    <div>Weight: {product.weight + " lbs"}</div>
                  </div>
                </div>
              }
              {product.gift_note &&
                <div style={{ flexBasis: "75%" }}>
                  <Form 
                    submitButton= {<div />}
                    formFields={[
                      { label: 'Gift Note', name: 'gift_note', typeOfComponent: "text-area", noValueError: 'You must provide an address', value: null },
                    ]} 
                    form={"gift_note_form"}
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}


function mapStateToProps({ form }) {
  return { form }
}

const actions = {  }

export default connect(mapStateToProps, actions)(ProductCoreDesktop)