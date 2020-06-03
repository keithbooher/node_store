import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from '../../../../shared/Form/Form'
import hf from "../../../../../utils/helperFunctions"
import loadingGif from '../../../../../images/pizzaLoading.gif'
import notAvailable from '../../../../../images/no-image-available.jpg'
import { updateUser } from "../../../../../actions"
import ReactFilestack from "filestack-react"
class Details extends Component {
  constructor(props) {
    super()
    this.renderAttributeForms = this.renderAttributeForms.bind(this)
    this.finishUploading = this.finishUploading.bind(this)
    this.state = {}
  }

  async handleSubmit(e, key) {
    // takes in the user attribute that was tied to the form field that submitted this request
    // and dynamically pulls the value from that redux-form field value
    e.preventDefault()
    let user = this.props.auth
    user[key] = this.props.form[`${key}_form`].values[`${key}`]
    this.props.updateUser(user)
  }

  renderAttributeForms() {
    let user = this.props.auth
    let do_not_use = ['billing_address', 'shipping_address', 'email', 'googleId', '__v', '_id', 'joined_on', 'role', 'credits', 'photo']
    let self = this

    const replacementSubmitButton = (key) => {
      return (<button onClick={(e) => this.handleSubmit(e, key)} className="teal btn-flat right white-text">
        <i className="material-icons right">Submit</i>
      </button>)
    }

    return Object.keys(user).filter((property) => do_not_use.includes(property) ? false : true ).map(function(key, index) {
      return (
        <Form 
          onSubmit={self.handleSubmit}
          submitButtonText={"Next"}
          formFields={[{ label: hf.capitalizeFirsts(key.replace(/_/g, " ")), name: key, noValueError: `You must provide a ${key}`, value: null }]} 
          submitButton={(replacementSubmitButton(key))}
          formId={`${key}_form`}
          form={`${key}_form`}
          initialValues={{[key]: user[key]}}
        />
      )
    });
  }

  async finishUploading(data) {
    let user = this.props.auth
    const src = data.filesUploaded[0].url
    user.photo = src
    const updated_user = await this.props.updateUser(user)
  }


  render() {
    return (
      <div>
        { this.props.auth ?
          <>
            <h4>Email: {this.props.auth.email}</h4>
            <div>
              <img style={{ height: "200px", width: "auto" }} src={this.props.auth.photo === null ? notAvailable : this.props.auth.photo} />
              <ReactFilestack
                apikey={process.env.REACT_APP_FILESTACK_API}
                customRender={({ onPick }) => (
                  <div>
                    <button onClick={onPick}>Upload image</button>
                  </div>
                )}
                onSuccess={this.finishUploading}
              />
            </div>
            <div className="INSERT RFAMEWORK FLEX BOX NAME">
              { this.renderAttributeForms() }
            </div>
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