import React, { useEffect, useState } from 'react'
import { useEmblaCarousel } from 'embla-carousel/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'

const EmblaCarousel = ({children}) => {
  const [EmblaCarouselReact, embla] = useEmblaCarousel({ loop: false, inViewThreshold: 1.2 })
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


  return (
    <div className="flex space-between relative">
      <FontAwesomeIcon style={{ color: "#e4e3e3", top: "50%", left: "0px", transform: "translateY(-50%)" }} onClick={prev} className="absolute z-10 margin-auto-v font-size-3-0" icon={faCaretLeft} />
      <EmblaCarouselReact>
        <div style={{ display: 'flex' }}>
          {children.map((child) => {
            return child
          })}
        </div>
      </EmblaCarouselReact>
      <FontAwesomeIcon style={{ color: "#e4e3e3", top: "50%", right: "0px", transform: "translateY(-50%)" }} onClick={next} className="absolute z-10 margin-auto-v font-size-3-0" icon={faCaretRight} />
    </div>
  )
}

export default EmblaCarousel