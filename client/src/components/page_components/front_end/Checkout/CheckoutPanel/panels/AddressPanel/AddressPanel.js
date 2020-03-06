import React, { Component } from 'react'
import Form from '../../../../../shared/Form/Form'
import formFields from './formFields'

class AddressPanel extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  handleSubmit() {
    console.log('thing')
  }


  render() {
    return (
      <div id="">
        <Form handleSubmit={this.handleSubmit} formFields={formFields} />
      </div>
    )
  }
}

export default AddressPanel