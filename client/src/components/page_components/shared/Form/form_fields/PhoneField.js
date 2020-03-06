import React from "react"
import { useField } from "react-form"

function validatePhoneNumber(value) {
  if (!value) {
    return "A phone number is required";
  }
  return false;
}

const PhoneField = () => {
  const {
    meta: { error, isTouched, isValidating },
    getInputProps
  } = useField("address.phone", {
    validate: validatePhoneNumber
  });

  return (
    <div>
      <input {...getInputProps()} />{" "}
      {isValidating ? (
        <em>Validating...</em>
      ) : isTouched && error ? (
        <em>{error}</em>
      ) : null}
    </div>
  );
}

export default PhoneField