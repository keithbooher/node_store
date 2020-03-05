import React, { Component } from 'react'


class AddressPanel extends Component  {
  constructor(props) {
    super()

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fields = [
      'first_name', 
      'last_name', 
      'company', 
      'address', 
      'address_cont']

    this.state = {

    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  renderLabelAndInputs() {

  }
  
  render() {
    return (
      <div id="">
        <form onSubmit={this.handleSubmit}>
          <label>
            First Name:
            <input name="first_name" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
          <label>
            Last Name:
            <input name="last_name" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default AddressPanel