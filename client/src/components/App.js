import React, { Component } from 'react'
import { BrowserRouter , Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import '../stylesheets/all.css.scss'

import Header from './Header'
import Home from './Pages/Home'
import Product from './Pages/Product'
const Dashboard = () => <h2>Dashboard</h2>
const SurveyNew = () => <h2>SurveyNew</h2>


class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }

  render() {
    return (
      <div className="">
        <BrowserRouter>
          <div>
            <Header />
            <div id="body_content_container">
              <Route exact path="/" component={Home} />
              <Route exact path="/product/:id" component={Product} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default connect(null, actions)(App)