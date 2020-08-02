import React, { Component } from 'react'
import {updateStoreSetting, getAllStoreSettings} from "../../../utils/API"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
class StoreSettings extends Component {
  constructor(props) {
    super()

    this.state = {
      settings: null
    }
  }

  async componentDidMount() {
    const { data } = await getAllStoreSettings()
    this.setState({ settings: data })
  }

  async updateSettingBolean(setting) {
    setting.boolean = !setting.boolean
    await updateStoreSetting(setting)
    const { data } = await getAllStoreSettings()
    this.setState({ settings: data })
  }

  render() {
    return (
      <div style={{ marginTop: "30px" }}>
        {this.state.settings && 
          <div>
            {this.state.settings.map((setting) => {
              return (
                <div>
                  <div>{setting.name}</div>
                  <div>{setting.description}</div>
                  <div>{setting.boolean ? <FontAwesomeIcon onClick={() => this.updateSettingBolean(setting)} icon={faCheck} /> : <FontAwesomeIcon onClick={() => this.updateSettingBolean(setting)} icon={faTimes} />  }</div>
                </div>
              )
            })}
          </div>
        }
      </div>
    )
  }
}

export default StoreSettings