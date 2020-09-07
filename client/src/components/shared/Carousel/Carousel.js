import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useEmblaCarousel } from 'embla-carousel/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import "./carousel.scss"
const EmblaCarousel = ({children, mobile}) => {
  console.log(children)
  const [EmblaCarouselReact, embla] = useEmblaCarousel({ loop: false, inViewThreshold: 1, startIndex: 0 })
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (embla) {
      // Embla API is ready
    }
  }, [embla])

  const prev = () => {
    if (!embla) {
      return
    }
    if (embla.selectedScrollSnap() === -1) {
      embla.reInit()
    }
    embla.scrollPrev()
  }

  const next = () => {
    if (!embla) {
      setRefresh(!refresh)
      return
    }
    if (embla.selectedScrollSnap() === -1) {
      embla.reInit()
    }
    embla.scrollNext()
  }

  let horizantle = "0px"
  if (!mobile) {
    horizantle = "-35px"
  }

  return (
    <div className="flex space-between relative">
      <FontAwesomeIcon style={{ top: "50%", left: horizantle, transform: "translateY(-50%)" }} onClick={prev} className="absolute z-10 margin-auto-v font-size-3-0 hover hover-color-10" icon={faCaretLeft} />
      <EmblaCarouselReact>
        <div style={{ display: 'flex' }}>
          {children.map((child) => {
            return child
          })}
        </div>
      </EmblaCarouselReact>
      <FontAwesomeIcon style={{ top: "50%", right: horizantle, transform: "translateY(-50%)" }} onClick={next} className="absolute z-10 margin-auto-v font-size-3-0 hover hover-color-10" icon={faCaretRight} />
    </div>
  )
}


function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(EmblaCarousel)