import React from "react"
import { useForm } from "react-form"
import PhoneField from "../../shared/Form/form_fields/PhoneField"

// FOR NOW MAKE THE FORM HOW IT NEEDS TO BE
// THEN COME BACK AND REFACTOR SO THAT WE CAN FEED IN THE NEEDED FIELDS
const MyForm = () => {
  // Use the useForm hook to create a form instance
  // Straight from documentation
  const {
    Form,
    meta: { isSubmitting, canSubmit }
  } = useForm({
      onSubmit: async (values, instance) => {
        // onSubmit (and everything else in React Form)
        // has async support out-of-the-box
        // await sendToFakeServer(values);
        console.log("Huzzah!");
        console.log(values);
      }, debugForm: true
    });

  return (
    <Form>
      <div>
        <label>
          phone: <PhoneField />
        </label>
      </div>
      <div>
        <button type="submit" disabled={!canSubmit}>
          Submit
        </button>
      </div>

      <div>
        <em>{isSubmitting ? "Submitting..." : null}</em>
      </div>
    </Form>
  );
}
export default MyForm