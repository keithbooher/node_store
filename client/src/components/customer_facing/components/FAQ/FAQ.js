import React, { Component } from 'react'
import { getAllFAQs } from "../../../../utils/API"
import { connect } from 'react-redux'

class FAQ extends Component {
  constructor(props) {
    super()
    this.state = {
      faqs: []
    }
  }

  async componentDidMount() {
    let { data } = await this.props.getAllFAQs()
    this.setState({ faqs: data })
  }

  render() {
    return (
      <div style={{ padding: ".4em .4em 80px .4em" }} className={`flex flex_column ${!this.props.mobile && "w-80 margin-auto-h"}`}>
        <h1 className="margin-s-v">FAQ's</h1>
        {this.state.faqs && this.state.faqs.map((faq, index) => {
          return (
            <div key={index} className="margin-s-v">
              <h2>Q: {faq.question}</h2>
              <div>A: {faq.answer}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

const actions = { getAllFAQs }

export default connect(null, actions)(FAQ)