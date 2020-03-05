import React from "react"
import { useField } from "react-form"

export default PhoneField = () => {
  const {
    meta: { error, isTouched, isValidating },
    getInputProps
  } = useField("address.phone", {
    validate: validateAddressStreet
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