import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"

class Footer extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }

  render() {
    return (
      <div className="flex space-between padding-s align-items-center">
        <div className="flex margin-s-h">
          <Link className='hover-color-11' to="/about" className="">About</Link>
          <Link className='hover-color-11' to="/faq" className="margin-m-h">FAQ</Link>
          <Link className='hover-color-11' to="/contact" className="">Contact</Link>
        </div>
        <div className="flex margin-s-h">
          <a style={{ fontSize: "20px" }} target="_blank" href="https://www.facebook.com/damnitjanetart" className="margin-m-h hover-color-11"><FontAwesomeIcon icon={faFacebook} /></a>
          <a style={{ fontSize: "20px" }} target="_blank" href="https://instagram.com/damnitjanetart?igshid=olie788fbt87" className="hover-color-11"><FontAwesomeIcon icon={faInstagram} /></a>
        </div>
      </div>
    )
  }
}

export default Footer