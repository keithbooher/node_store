import React, { Component }  from 'react'
import 'react-widgets/dist/css/react-widgets.css'

// Right now this is only for categories. 
// IF something else pops up that requires this tree Ill try and generalize
class FormTree extends Component {
  constructor(props) {
    super()
    this.submitInput = React.createRef();
    let top_cats = []
    props.options.forEach((cat) => {
      if (cat.nest_level === 0) {
        top_cats.push(cat)
      }
    })    

    let defaulted_cats = []
    props.options.forEach((cat) => {
      if (cat.default === true) {
        defaulted_cats.push(cat)
      }
    })    

    this.state = {
      all_cats: props.options,
      top_cats: top_cats,
      defaulted_cats: defaulted_cats // also doubles as the selected values field
    }
  }

  selectCat(category) {
    let already_in_defaulted = [false, null]
    let cats = this.state.defaulted_cats
    for (let i = 0; i < cats.length; i++) {
      if(category._id === cats[i]._id) {
        already_in_defaulted = [true, i]
      }
    }

    if(already_in_defaulted[0] === true) {
      cats.splice(already_in_defaulted[1], 1)
    } else {
      cats.push(category)
    }
    this.props.change("categories", cats)
    this.setState({ defaulted_cats: cats })
  }

  topCat(category) {
    let defaulted = false
    this.state.defaulted_cats.forEach((cat) => {
      if (cat._id === category._id) {
        defaulted = true
      }
    })
    return (
      <div>
        <div className={`hover hover-color-10 ${defaulted ? "store_text_color" : "color-black"}`} onClick={() => this.selectCat(category)}>{category.name}</div>
        {category.sub_categories.filter((cat) => cat.deleted_at !== null).map((sub_cat, index) => {
          return <div key={index} style={{ marginLeft: '20px' }}>{this.subCat(sub_cat)}</div>
        })}
      </div>
    )
  }

  subCat(category) {
    let defaulted = false
    this.state.defaulted_cats.forEach((cat) => {
      if (cat._id === category._id) {
        defaulted = true
      }
    })
    return (
      <div>
        <div className={`hover hover-color-10 ${defaulted ? "store_text_color" : "color-black"}`} onClick={() => this.selectCat(category)}>{category.name}</div>
        {category.sub_categories.filter((cat) => cat.deleted_at !== null).map((sub_cat, index) => {
          return <div key={index} style={{ marginLeft: '20px' }}>{this.subCat(sub_cat)}</div>
        })}
      </div>
    )
  }

  render() {
    // THIS IS HOW TO COMBINE TWO ARRAYS WITH DUPLICATE VALUES
    // (unrelated now... just thought it was cool)
    // let values = thing.map((cat) => cat._id )
    // let other_values = other.map((cat) => cat._id )
    // let combined = Array.from(new Set([...other_values, ...values]))
    return (
      <div>
        <h3>{this.props.label}</h3>
        <div style={{ margin: "10px 0px 10px 10px" }}>
          {this.state.top_cats.map((top_cat, index) => {
              return (
                <div key={index}>{this.topCat(top_cat)}</div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default FormTree
