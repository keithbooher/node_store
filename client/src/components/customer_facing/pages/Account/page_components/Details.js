import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from '../../../../shared/Form/Form'
import { detailsFields } from './formFields'
import hf from "../../../../../utils/helperFunctions"
import loadingGif from '../../../../../images/pizzaLoading.gif'

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

    const replacementSubmitButton = (
      <button onClick={(e) => this.handleSubmit(e)} className="teal btn-flat right white-text">
        <i className="material-icons right">Submit</i>
      </button>
    )
    return (
      <div>
        { this.props.auth ?
          <>
            <h4 style={{ color: 'darkblue' }}>Email: {this.props.auth.email}</h4>
            <Form 
              onSubmit={this.handleSubmit} 
              submitButtonText={"Next"}
              formFields={detailsFields} 
              replaceSubmitButton={true}
              submitButton={replacementSubmitButton}
              formId={"user_details_form"}
              form={"user_details_form"}
              // take name key from each formFields item and use that key in a new object, 
              // that will be filled out by the appropriate users details
              initialValues={hf.updatedFormFields(detailsFields, this.props.auth)}
            />
          </>
          : <img className="loadingGif loadingGifCenterScreen" src={loadingGif} />
        }
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Details)