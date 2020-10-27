import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
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
import FormStarChoice from './FormStarChoice';
import FormSelectStates from './FormSelectStates';
import FormSelectCountries from './FormSelectCountries';
import "./form.scss"
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
        case 'states':
          component = FormSelectStates
          break;
        case 'countries':
          component = FormSelectCountries
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
                mobile={this.props.mobile}
                dropDownCustomItemComponent={this.props.dropDownCustomItemComponent}
              />
    })
  }

  render() {
    return (
      <div>
        <form 
          style={{ marginTop: '10px' }} 
          className={`${this.props.searchButton ? this.props.mobile ? "flex space-evenly" : "flex" : ""}`} 
          id={!this.props.formId ? "general_form_id" : this.props.formId} 
          onSubmit={(e) => this.props.handleSubmit(e)}
        >
          {this.renderFields()}
         
          {!this.props.submitButton ?
            <button type="submit" style={{ padding: "6px", maxHeight: "50px", marginTop: "10px" }} className={`${this.props.searchButton ? "search_button" : ""}`}>
              <i className="material-icons right">{this.props.submitButtonText}</i>
            </button> 
          : this.props.submitButton}

          {this.props.cancel ?
            <button onClick={this.props.cancel} style={{ padding: "6px", maxHeight: "50px", marginTop: "10px" }} className="">
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


function mapStateToProps({ mobile }) {
  return { mobile }
}

export default reduxForm({
  validate,
  destroyOnUnmount: false,
  enableReinitialize : true
})(connect(mapStateToProps, null)(Form))