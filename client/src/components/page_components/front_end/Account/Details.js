import React, { Component } from 'react'
import Form from '../../shared/Form/Form'
import { detailsFields } from './formFields'

class Details extends Component {
  constructor(props) {
    super()
    this.state = {}
  }

  async componentDidMount() {
    // redux action to 
  }

  async handleSubmit() {
    // some request to update the users general info
  }


  render() {
    console.log(this.props)
    // take name key from each formFields item and use that key in a new object, 
    // that will be filled out by the appropriate users details
    let details_initial_values = {}
    detailsFields.forEach((field) => {
      console.log(details_initial_values)
      console.log(this.props.auth)
      details_initial_values[field.name] = this.props.auth[field.name]
    })

    const replacementSubmitButton = (
      <button onClick={(e) => this.handleSubmit(e)} className="teal btn-flat right white-text">
        <i className="material-icons right">Submit</i>
      </button>
    )
    return (
      <div>
        <Form 
          onSubmit={this.handleSubmit} 
          submitButtonText={"Next"}
          formFields={detailsFields} 
          replaceSubmitButton={true}
          submitButton={replacementSubmitButton}
          formId={"user_details_form"}
          form={"user_details_form"}
          initialValues={details_initial_values}
        />
      </div>
    )
  }
}


export default Details