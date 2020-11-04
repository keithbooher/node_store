import React, { useState } from 'react'
import Form from "../Form"
import varietalDropdownItem from "./varietalDropdownItem"

const VarietalDropdown = ({
  chosenVarietal,
  setVarietal,
  varietals
}) => {

  // need to sort available varietals by size
  varietals = varietals.sort((a,b) => a.size.value - b.size.value )

  return (
    <div>
      <Form
        onChange={(e) => {
          setVarietal(e.varietal.value)
        }}
        submitButton={<div/>}
        dropDownCustomItemComponent={varietalDropdownItem}
        dropDownCustomValueComponent={varietalDropdownItem}
        formFields={[
          { label: 'Choose Variety', name: 'variety', typeOfComponent: "dropdown", noValueError: 'You must provide an email', 
            options: varietals.map(v => {
              return (
                {
                  default: v._id === chosenVarietal._id ? true : false,
                  value: v,
                  name: v.size.value,
                  redux_field: "varietal"
                }
              )
            })
          },
        ]}
        form={"customer_varietals_dropdown"}
      />
    </div>
  )
}

export default VarietalDropdown