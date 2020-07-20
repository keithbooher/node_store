import React from 'react'

const AddressDisplayEdit = ({ address }) => {
  // logic stuff up here

  // TO DO
  // MAP THROUGH ADDRESS OBJECT TO CLEAN UP
  return (
    <div>
      <div>
        First Name: <div className="inline" >{address.first_name}</div>
      </div>
      <div>
        Last Name: <div className="inline" >{address.last_name}</div>
      </div>
      <div>
        Company: <div className="inline" >{address.company}</div>
      </div>
      <div>
        Address One: <div className="inline" >{address.street_address_1}</div>
      </div>
      <div>
        Address Two: <div className="inline" >{address.street_address_2}</div>
      </div>
      <div>
        City: <div className="inline" >{address.city}</div>
      </div>
      <div>
        State: <div className="inline" >{address.state}</div>
      </div>
      <div>
        Zip Code: <div className="inline" >{address.zip_code}</div>
      </div>
      <div>
        Phone Number: <div className="inline" >{address.phone_number}</div>
      </div>
      <div>
        Country: <div className="inline" >{address.country}</div>
      </div>
    </div>
  )
}

export default AddressDisplayEdit