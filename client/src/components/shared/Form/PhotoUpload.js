import React, { Component } from 'react'
import ReactFilestack from "filestack-react"

class PhotoUpload extends Component {
  constructor(props) {
    super()
    this.finishUploading = this.finishUploading.bind(this)
    let src
    if (props.input.value) {
      src = props.input.value
    } else {
      src = null
    }
    this.state = {
      src
    }
  }

  finishUploading(data) {
    if (data.filesUploaded[0]) {
      console.log(data.filesUploaded[0].url)
      const src = data.filesUploaded[0].url
      this.props.change("image", src)
      this.setState({ src })
    }
  }

  render() {
    return (
      <div>
        <ReactFilestack
          apikey={process.env.REACT_APP_FILESTACK_API}
          customRender={({ onPick }) => (
            <div>
              <button onClick={onPick}>Upload image</button>
            </div>
          )}
          onSuccess={this.finishUploading}
        />

        {/* Show uploaded image here */}
        {this.state.src && <img style={{ maxHeight: "300px", maxWidth: "300px" }} src={this.state.src} />}
      </div>
    )
  }
}

export default PhotoUpload
