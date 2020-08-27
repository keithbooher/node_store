import React, { Component } from 'react'
import { connect } from 'react-redux'
import StarRatings from 'react-star-ratings'

class FormStarChoice extends Component {
  constructor(props) {
    super()
    this.changeRating = this.changeRating.bind(this)
  }
  changeRating( newRating, name ) {
    this.props.change("rating", newRating)
  }

  render() {
    return (
      <div className="margin-s-v">
        <StarRatings
          rating={this.props.input.value ? this.props.input.value : 0}
          starRatedColor="#6CB2EB"
          changeRating={this.changeRating}
          numberOfStars={5}
          name='rating'
          starDimension="25px"
          starSpacing="1px"
        />
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(FormStarChoice)