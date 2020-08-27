import React from 'react'

const AddressDisplayEdit = ({ address }) => {
  // logic stuff up here

  // TO DO
  // MAP THROUGH ADDRESS OBJECT TO CLEAN UP
  return (
    <div>
      <div>
        <span className="store_text_color">First Name:</span> <div className="inline" >{address.first_name}</div>
      </div>
      <div>
        <span className="store_text_color">Last Name:</span> <div className="inline" >{address.last_name}</div>
      </div>
      <div>
        <span className="store_text_color">Company:</span> <div className="inline" >{address.company}</div>
      </div>
      <div>
        <span className="store_text_color">Address One:</span> <div className="inline" >{address.street_address_1}</div>
      </div>
      <div>
        <span className="store_text_color">Address Two:</span> <div className="inline" >{address.street_address_2}</div>
      </div>
      <div>
        <span className="store_text_color">City:</span> <div className="inline" >{address.city}</div>
      </div>
      <div>
        <span className="store_text_color">State</span> <div className="inline" >{address.state}</div>
      </div>
      <div>
        <span className="store_text_color">Zip Code:</span> <div className="inline" >{address.zip_code}</div>
      </div>
      <div>
        <span className="store_text_color">Phone Number:</span> <div className="inline" >{address.phone_number}</div>
      </div>
      <div>
        <span className="store_text_color">Country:</span> <div className="inline" >{address.country}</div>
      </div>
    </div>
  )
}

export default AddressDisplayEdit