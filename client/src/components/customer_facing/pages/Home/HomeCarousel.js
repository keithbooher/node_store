import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {Carousel} from '3d-react-carousal';
import { galleryProducts } from "../../../../utils/API"
import { LazyLoadImage } from 'react-lazy-load-image-component'


const HomeCarousel = ({ galleryProducts, mobile }) => {
  const [galleryImages, setImages] = useState(false)

  useEffect(() => {
    getData()
  }, []);

  const getData = async ()  => {
    const { data } = await galleryProducts()
    let slides = data.map((item, i) => {
      return (
        <div style={mobile ? { minHeight: "400px", maxHeight: "400px" } : { minHeight: "600px", maxHeight: "600px" }} key={i}>
          <LazyLoadImage
            style={mobile ? { maxHeight: "400px" } : { maxHeight: "600px" }}
            src={item.images.i1}
          />
        </div>
      )
    })
    setImages(slides)
  }
  return (
    <div className="" style={mobile ? { paddingTop: "10px" } : { paddingTop: "30px" }}>
      {galleryImages &&
        <Carousel
          slides={galleryImages} 
          autoplay={true} 
          interval={2000}
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
