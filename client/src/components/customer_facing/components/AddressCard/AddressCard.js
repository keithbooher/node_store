import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { updateUser } from '../../../../actions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faTrash, faPlusCircle, faCaretRight, faCaretLeft} from "@fortawesome/free-solid-svg-icons"
import { reset } from 'redux-form'
import { capitalizeFirsts } from "../../../../utils/helperFunctions"
import { useEmblaCarousel } from 'embla-carousel/react'

const AddressCard = ({ auth, actionBox, reset, bill_or_ship, hideCreate, showForm }) => {
  const [checked_box, set_checked_box] = useState(null)
  const [EmblaCarouselReact, embla] = useEmblaCarousel({ loop: false, inViewThreshold: 1 })
  const [refresh, setRefresh] = useState(false)


  useEffect(() => {
    if (!embla) return

    embla.on('select', () => {
      console.log(`Index is ${embla.selectedScrollSnap()}`)
    })
  }, [embla])

  const checkBox = (address) => {
    actionBox(address)
    if (address.bill_or_ship === "billing") {
      reset("billing_checkout_form")
    } else {
      reset("shipping_checkout_form")
    }
    if (checked_box === address._id) {
      set_checked_box(null)
    } else {
      set_checked_box(address._id)
    }
  }

  const title = () => {
    let title
    if (bill_or_ship.indexOf('billing') > -1) {
      title = "Billing"
    } else {
      title = "Shipping"
    }
    return (
      <h5>
        <span style={{ marginRight: "5px" }}>{capitalizeFirsts(title)} Addresses</span>
        {hideCreate ? "" : 
          <FontAwesomeIcon 
            className="hover"
            onClick={() => showForm(bill_or_ship)} 
            icon={faPlusCircle} 
          />
        }
      </h5>
    )
  }
  
  const check_highlight = (address) => {
    if (checked_box === address._id) {
      return true
    } else {
      return false
    }
  }

  const deleteAddress = (address) => {
    let user = auth
    let address_to_be_deleted = address
    let new_bill = user.billing_address.filter(address => address_to_be_deleted._id !== address._id)
    let new_ship = user.shipping_address.filter(address => address_to_be_deleted._id !== address._id)
    user.billing_address = new_bill
    user.shipping_address = new_ship
    updateUser(user)
  }

  const prev = () => {
    if (!embla) {
      return
    }
    if (embla.selectedScrollSnap() === -1) {
      embla.reInit()
    }
    embla.scrollPrev()
  }

  const next = () => {
    if (!embla) {
      setRefresh(!refresh)
      return
    }
    if (embla.selectedScrollSnap() === -1) {
      embla.reInit()
    }
    embla.scrollNext()
  }

  console.log(embla)

  return (
    <div style={{ position: 'relative' }}>
      {/* delete icon */}
      <div className="flex">
        {title()}
        
      </div>

      <div className="flex space-evenly">
        <FontAwesomeIcon onClick={prev} className="margin-auto-v font-size-3-0" icon={faCaretLeft} />
        <div className="w-80 relative">

            <EmblaCarouselReact>
              <div className="flex">
                {auth && auth[bill_or_ship] && auth[bill_or_ship].map((address) => {
                return <div data-address-id={address._id} style={ check_highlight(address) ? { backgroundColor: "rgba(1,1,1,0.5)" } :  {}} className="address_card_container">
                        <div>first name: {address.first_name ? address.first_name : "" }</div>
                        <div>last name: {address.last_name ? address.first_name : "" }</div>
                        <div>company: {address.company ? address.company : "" }</div>
                        <div>street address 1: {address.street_address_1 ? address.street_address_1 : "" }</div>
                        <div>street address 2: {address.street_address_2 ? address.street_address_2 : "" }</div>
                        <div>city: {address.city ? address.city : "" }</div>
                        <div>state: {address.state ? address.state : "" }</div>
                        <div>zip code: {address.zip_code ? address.zip_code : "" }</div>
                        <div>phone number: {address.phone_number ? address.phone_number : "" }</div>
                        <div>bill_or_ship: {address.bill_or_ship ? address.bill_or_ship : "" }</div>
                        <button onClick={() => deleteAddress(address)}><FontAwesomeIcon icon={faTrash} /></button>
                        { actionBox ? <button onClick={() => checkBox(address)}>Use this address </button> : "" }
                      </div>
                })}
              </div>
            </EmblaCarouselReact>

        </div>
        <FontAwesomeIcon onClick={next} className="margin-auto-v font-size-3-0" icon={faCaretRight} />
      </div>



    </div>
  )
}

function mapStateToProps({ auth }) {
  return { auth }
}

const actions = { updateUser, reset }

export default connect(mapStateToProps, actions)(AddressCard)