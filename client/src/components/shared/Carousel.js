import React, { useEffect, useState } from 'react'
import { useEmblaCarousel } from 'embla-carousel/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'

const EmblaCarousel = ({children}) => {
  const [EmblaCarouselReact, embla] = useEmblaCarousel({ loop: false })
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
    <div className="flex space-between">
      <FontAwesomeIcon onClick={prev} className="margin-auto-v font-size-3-0" icon={faCaretLeft} />
      <EmblaCarouselReact>
        <div style={{ display: 'flex' }}>
          {children.map((child) => {
            return child
          })}
        </div>
      </EmblaCarouselReact>
      <FontAwesomeIcon onClick={next} className="margin-auto-v font-size-3-0" icon={faCaretRight} />

    </div>
  )
}

export default EmblaCarousel