import React, { Component } from 'react'
import { getAllFAQs } from "../../../../utils/API"

class FAQ extends Component {
  constructor(props) {
    super()
    this.state = {
      faqs: []
    }
  }

  async componentDidMount() {
    const { data } = await getAllFAQs()
    this.setState({ faqs: data })
  }

  render() {
    return (
      <div className="flex flex_column">
        <h1 className="margin-s-v">FAQ's</h1>
        {this.state.faqs.map((faq) => {
          return (
            <div className="margin-s-v">
              <h2>Q: {faq.question}</h2>
              <div>A: {faq.answer}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default FAQ