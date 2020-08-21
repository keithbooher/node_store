import _ from 'lodash'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import FormField from './FormField'
import FormTextArea from './FormTextArea'
import FormMultiSelect from './FormMultiSelect'
import FormDropdown from './FormDropdown'
import FormCheckbox from './FormCheckbox'
import FormFieldDisabled from './FormFieldDisabled'
import FormTree from "./FormTree"
import PhotoUpload from "./PhotoUpload"
import NumberField from "./NumberField"
import "./form.scss"
import FormStarChoice from './FormStarChoice';
class Form extends Component {
  constructor(props) {
    super()
    this.renderFields = this.renderFields.bind(this)
  }
  
  renderFields() {
    return _.map(this.props.formFields, ({ label, name, typeOfComponent="text", autofocus, options, display, field_class }) => {
      let component
      switch (typeOfComponent) {
        case 'check-box':
          component = FormCheckbox
          break;
        case 'multi':
          component = FormMultiSelect
          break;
        case 'text-area':
          component = FormTextArea
          break;
        case 'field-disable':
          component = FormFieldDisabled
          break;
        case 'dropdown':
          component = FormDropdown
          break;
        case 'tree':
          component = FormTree
          break;
        case 'photo-upload':
          component = PhotoUpload
          break;
        case 'star-choice':
          component = FormStarChoice
          break;
        case 'number':
          component = NumberField
          break;
        default:
          component = FormField
      }

      return <Field 
                onChange={this.props.onChange} 
                options={options} // first use case - to give array of multi select & drop down fields
                field_class={field_class} // class for css manipulation
                component={component} // component to be wrapped by field
                type={typeOfComponent}
                label={label} 
                name={name}
                change={this.props.change}
                display={display}
                searchButton={this.props.searchButton}
                autofocus={autofocus}
              />
    })
  }

  render() {
    return (
      <div>
        <form 
          style={{ marginTop: '10px' }} 
          className={`${this.props.searchButton ? "flex space-evenly" : ""}`} 
          id={!this.props.formId ? "general_form_id" : this.props.formId} 
          onSubmit={(e) => this.props.handleSubmit(e)}
        >
          {this.renderFields()}
         
          {!this.props.submitButton ?
            <button type="submit" className={`teal btn-flat right white-text ${this.props.searchButton ? "search_button" : ""}`}>
              <i className="material-icons right">{this.props.submitButtonText}</i>
            </button> 
          : this.props.submitButton}

          {this.props.cancel ?
            <button onClick={this.props.cancel} className="teal btn-flat right white-text">
              <i className="material-icons right">Cancel</i>
            </button> 
          : ""}
        </form>
      </div>
    )
  }
}

function validate(values, props) {
  if (!props.validation) {
    return
  }
  let validation = props.validation(values, props)
  return validation
}

export default reduxForm({
  validate,
  destroyOnUnmount: false,
  enableReinitialize : true
})(Form)