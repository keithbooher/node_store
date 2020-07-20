import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

const AddressDisplayEdit = ({ address, showEditIndicator, propertyToEdit, showEditModal, bill_or_ship }) => {
  // logic stuff up here

  // TO DO
  // MAP THROUGH ADDRESS OBJECT TO CLEAN UP
  return (
    <div>
      <div>
        First Name: <a className="inline" onClick={() => showEditIndicator("first_name", bill_or_ship)} >{address.first_name}</a>
        {propertyToEdit && propertyToEdit.property === "first_name" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("first_name", address)} 
          />
        }
      </div>
      <div>
        Last Name: <a className="inline" onClick={() => showEditIndicator("last_name", bill_or_ship)} >{address.last_name}</a>
        {propertyToEdit && propertyToEdit.property === "last_name" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("last_name", address)} 
          />
        }
      </div>
      <div>
        Company: <a className="inline" onClick={() => showEditIndicator("company", bill_or_ship)} >{address.company}</a>
        {propertyToEdit && propertyToEdit.property === "company" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("company", address)} 
          />
        }
      </div>
      <div>
        Address One: <a className="inline" onClick={() => showEditIndicator("street_address_1", bill_or_ship)} >{address.street_address_1}</a>
        {propertyToEdit && propertyToEdit.property === "street_address_1" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("street_address_1", address)} 
          />
        }
      </div>
      <div>
        Address Two: <a className="inline" onClick={() => showEditIndicator("street_address_2", bill_or_ship)} >{address.street_address_2}</a>
        {propertyToEdit && propertyToEdit.property === "street_address_2" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("street_address_2", address)} 
          />
        }
      </div>
      <div>
        City: <a className="inline" onClick={() => showEditIndicator("city", bill_or_ship)} >{address.city}</a>
        {propertyToEdit && propertyToEdit.property === "city" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("city", address)} 
          />
        }
      </div>
      <div>
        State: <a className="inline" onClick={() => showEditIndicator("state", bill_or_ship)} >{address.state}</a>
        {propertyToEdit && propertyToEdit.property === "state" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("state", address)} 
          />
        }
      </div>
      <div>
        Zip Code: <a className="inline" onClick={() => showEditIndicator("zip_code", bill_or_ship)} >{address.zip_code}</a>
        {propertyToEdit && propertyToEdit.property === "zip_code" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("zip_code", address)} 
          />
        }
      </div>
      <div>
        Phone Number: <a className="inline" onClick={() => showEditIndicator("phone_number", bill_or_ship)} >{address.phone_number}</a>
        {propertyToEdit && propertyToEdit.property === "phone_number" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("phone_number", address)} 
          />
        }
      </div>
      <div>
        Country: <a className="inline" onClick={() => showEditIndicator("country", bill_or_ship)} >{address.country}</a>
        {propertyToEdit && propertyToEdit.property === "country" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("country", address)} 
          />
        }
      </div>
    </div>
  )
}

export default AddressDisplayEdit