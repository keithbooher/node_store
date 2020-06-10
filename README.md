# node_store


## this is what our form AIP looks like
  \<div>
    <br />
    \<Form
      <br />
      onSubmit={}
      <br />
      submitButtonText={}
      <br />
      formFields={} 
      <br />
      initialValues={}
      <br />
      form={}
      <br />
      formId={}
      <br />
      cancel={}
      <br />
    />
    <br />
  \</div>

### onSubmit
 the function to execute when the form is submitted

### submitButtonText
 replace the text in the submit button

### formFields
 an array of objects that represent the fields to be used in the form 

 #### formField Properties
 label: name to be shown above the field

 name: under the hood name, typically the same name as the property its associated with for dynamic uses

 typeOfComponent: set the type of component to use
   - check-box
   - multi (multi select drop down)
   - text-area
   - field-disable
   - dropdown
   - tree

 options: an object to help build non traditional form fields like dropdown, multi and tree

 noValueError: message to display to user when a  field must be provided and its not provided

### initialValues
 create an array of objects that contain a single key and property. 

 The key is the "name" property in formField (this is why "name" is often the name of the db table field that it corresponds to) and we assign the current value to that property. 

 This is accomplished easily by using updatedFormFields() in our helper functions file.

 params ex:
 updatedFormFields(formFieldsArray, document from the database)

### form
 name of the form that is referenced in redux

### cancel
 function to be called upon cancelling to get out of form if its a pop up or something.