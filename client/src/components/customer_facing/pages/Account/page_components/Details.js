import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from '../../../../shared/Form/Form'
import { detailsFields } from './formFields'
import hf from "../../../../../utils/helperFunctions"
import loadingGif from '../../../../../images/pizzaLoading.gif'
import { updateUser } from "../../../../../actions"

class Details extends Component {
  constructor(props) {
    super()
    this.renderAttributeForms = this.renderAttributeForms.bind(this)
    this.state = {}
  }

  async componentDidMount() {
    // redux action to 
  }

  async handleSubmit(e, key) {
    e.preventDefault()
    // some request to update the users general info
    let user = this.props.auth
    user[key] = this.props.form[`${key}_form`].values[`${key}`]
    this.props.updateUser(user)
  }

  renderAttributeForms() {
    let user = this.props.auth
    let do_not_use = ['billing_address', 'shipping_address', 'email', 'googleId', '__v', '_id', 'joined_on', 'admin', 'credits']
    let self = this

    const replacementSubmitButton = (key) => {
      return (<button onClick={(e) => this.handleSubmit(e, key)} className="teal btn-flat right white-text">
        <i className="material-icons right">Submit</i>
      </button>)
    }

    return Object.keys(user).filter((property) => do_not_use.includes(property) ? false : true ).map(function(key, index) {
      console.log(user[key])
      return (
        <Form 
          onSubmit={self.handleSubmit}
          submitButtonText={"Next"}
          formFields={[{ label: key, name: key, noValueError: 'You must provide an address', value: null }]} 
          replaceSubmitButton={true}
          submitButton={(replacementSubmitButton(key))}
          formId={`${key}_form`}
          form={`${key}_form`}
          initialValues={{[key]: user[key]}}
        />
      )
    });
  }


  render() {
    console.log(this.props)

    return (
      <div>
        { this.props.auth ?
          <>
            <h4 style={{ color: 'darkblue' }}>Email: {this.props.auth.email}</h4>
            { this.renderAttributeForms() }
          </>
          : <img className="loadingGif loadingGifCenterScreen" src={loadingGif} />
        }
      </div>
    )
  }
}

function mapStateToProps({ auth, form }) {
  return { auth, form }
}

const actions = { updateUser }

export default connect(mapStateToProps, actions)(Details)