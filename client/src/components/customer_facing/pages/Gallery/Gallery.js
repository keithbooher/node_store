import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { galleryProducts } from "../../../../utils/API"
import { dispatchEnlargeImage } from "../../../../actions"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import "./gallery.scss"

class Gallery extends Component {
  constructor(props) {
    super()
    this.state = {
      products: null
    }
  }
  
async componentDidMount() {
  const { data } = await this.props.galleryProducts()
  this.setState({ products: data })
}

  render() {
    return (
      <div className="text-align-center" style={{ fontSize: "20px" }}>
        <h1 style={{ paddingTop: "30px" }}>Gallery</h1>
        <div className="flex space-evenly flex-wrap" style={{ padding: "50px 0px" }}>
          {this.state.products ? 
            this.state.products.map((product, index) => {
              let category_path_name
              if (product.categories.length > 0) {
                let cat = product.categories.find(cat => cat.deleted_at === undefined || cat.deleted_at === null)
                if (cat) {
                  category_path_name = cat.path_name
                } else {
                  category_path_name = "n_o_n_e"
                }
              } else {
                category_path_name = "n_o_n_e"
              }
              return (
                <LazyLoadImage
                  src={product.images.i1}
                  wrapperClassName={`${this.props.mobile ? "gallery_card_image_mobile" : "gallery_card_image"} margin-s-v border-radius-s`}
                  onClick={() => this.props.dispatchEnlargeImage({image: product.images.i1, path: "/shop/" + category_path_name + "/" + product.path_name })}
                />
              )
            })
          :
            <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin /> 
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ mobile, enlargeImage }) {
  return { mobile, enlargeImage }
}

const actions = { galleryProducts, dispatchEnlargeImage  }

export default connect(mapStateToProps, actions)(Gallery)