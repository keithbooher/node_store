import React, { Component } from 'react'
import { connect } from 'react-redux'
import { todaysOrders, openOrders } from "../../utils/API"
import { Link } from "react-router-dom"

class AdminDashboard extends Component {
  constructor(props) {
    super()
    this.state = {
      todays_orders: null,
      open_orders: null
    }
  }

  async componentDidMount() {
    const { data } = await this.props.todaysOrders()
    const open_orders = await this.props.openOrders()

    if (data.length < 5) {
      for (let i = 0; i < 5; i++) {
        if (!data[i]) {
          data.push(null)
        }
      }
    }

    console.log(open_orders)

    this.setState({ todays_orders: data, open_orders: open_orders.data })
  }

  render() {
    console.log(this.state)
    return (
      <div style={{ marginTop: "30px" }}>
        <h1 className="text-align-center" >Admin Dash</h1>
        {this.state.todays_orders !== null && 
          <>
            <div><Link to={"/admin/orders"} className="inline">{this.state.todays_orders.filter(o => o !== null).length}</Link> orders have been placed with your store today</div>
            <h2>Today's last 5 orders</h2>
            {this.state.todays_orders.map((o, i) => {
              if (o === null) {
                return <div key={i}>-</div>
              } else {                
                return (
                  <div key={i} className="flex flex_column">
                    <div><Link to={`/admin/orders/${o._id}`} >{o.email} - ${o.total}</Link></div>
                  </div>
                )
              }
            })}
          </>
        }
        {this.state.todays_orders !== null && 
          <div>
            <hr />
            <h2><Link to={"/admin/orders"} className="inline">{this.state.open_orders.pending.length} pending orders</Link></h2>
            <h2><Link to={"/admin/orders"} className="inline">{this.state.open_orders.processing.length} orders in processing</Link></h2>
          </div>
        }
      </div>
    )
  }
}


function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { todaysOrders, openOrders }

export default connect(mapStateToProps, actions)(AdminDashboard)