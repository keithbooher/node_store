import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAboutSetting } from "../../../../utils/API"
import MetaTags from 'react-meta-tags'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"


class About extends Component {
  constructor(props) {
    super()

    this.state = {
      about: null
    }
  }

  async componentDidMount() {
    let { data } = await this.props.getAboutSetting()

    this.setState({ about: data })
  }

  

  render() {

    return (
      <div style={{ padding: ".4em .4em 120px .4em" }} id="">
        <MetaTags>
          <title>About | Node Store</title>
          <meta name="description" content="About | Node Store" />
          <meta name="keywords" content="" />
        </MetaTags>

        <h1 className="text-align-center">Your Name Here</h1>
        {this.state.about ? 
          <div style={{ whiteSpace: "pre-line", width: this.props.mobile ? "90%" : "70%", margin: "0px auto", paddingTop: "40px" }}>{this.state.about.value.string}</div>
        :
          <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
        }

      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { getAboutSetting }

export default connect(mapStateToProps, actions)(About)