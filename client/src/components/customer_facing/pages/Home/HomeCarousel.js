import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import ThreeDimCarousel from "../../../shared/ThreeDimCarousel"
import { galleryProducts } from "../../../../utils/API"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from "react-router-dom"

const HomeCarousel = ({ galleryProducts, mobile }) => {
  const [galleryImages, setImages] = useState(false)

  useEffect(() => {
    getData()
  }, []);

  const getData = async ()  => {
    const { data } = await galleryProducts()
    let slides = data.map((item, i) => {
      let category_path_name = item.categories.length > 0 ? item.categories[0].path_name : "general"
      return (
        <div className="flex flex_column justify-center" style={mobile ? { minHeight: "400px", maxHeight: "400px" } : { minHeight: "500px", maxHeight: "500px" }} key={i}>
          <Link to={`/shop/${category_path_name}/${item.path_name}`}>
            <LazyLoadImage
              style={mobile ? { maxHeight: "400px" } : { maxHeight: "500px" }}
              src={item.images.i1}
            />
          </Link>
        </div>
      )
    })
    if (slides.length > 10 ) {
      slides = slides.slice(0, 10)
    }
    setImages(slides)
  }
  return (
    <div className="" style={mobile ? { paddingTop: "10px" } : { paddingTop: "30px" }}>
      {galleryImages &&
        <ThreeDimCarousel
          slides={galleryImages} 
          autoplay={true} 
          interval={4000}
        />
      }
    </div>
  );
};



function mapStateToProps({ mobile, galleryProducts }) {
  return { mobile, galleryProducts }
}

const actions = { galleryProducts }

export default connect(mapStateToProps, actions)(HomeCarousel)
