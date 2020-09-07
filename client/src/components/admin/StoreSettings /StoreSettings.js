import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllFAQs, updateFAQ, createFAQ, updateStoreSetting, getAllStoreSettings } from "../../../utils/API"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faPlusCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import ReactFilestack from "filestack-react"
import { validatePresenceOnAll } from '../../../utils/validations'
import FormModal from "../../shared/Form/FormModal"
class StoreSettings extends Component {
  constructor(props) {
    super()
    this.finishUploadingDesktop = this.finishUploadingDesktop.bind(this)
    this.finishUploadingMobile = this.finishUploadingMobile.bind(this)
    this.editFaqModal = this.editFaqModal.bind(this)
    this.editFaq = this.editFaq.bind(this)
    this.createFaq = this.createFaq.bind(this)
    this.createFAQModal = this.createFAQModal.bind(this)
    this.state = {
      settings: null,
      faqs: [],
      createFAQ: null,
      editFAQ: null
    }
  }

  async componentDidMount() {
    const { data } = await this.props.getAllStoreSettings()
    const allFaqs = await this.props.getAllFAQs()
    this.setState({ settings: data, faqs: allFaqs.data })
  }

  async updateSettingBoolean(setting) {
    setting.value.boolean = !setting.value.boolean
    await this.props.updateStoreSetting(setting)
    const { data } = await this.props.getAllStoreSettings()
    this.setState({ settings: data })
  }

  async finishUploadingDesktop(d) {
    let desktop_banner_setting = this.state.settings && this.state.settings.filter((setting) => setting.internal_name === "desktop_banner_photo")[0]
    const src = d.filesUploaded[0].url
    desktop_banner_setting.value.image = src
    await this.props.updateStoreSetting(desktop_banner_setting)
    const { data } = await this.props.getAllStoreSettings()
    this.setState({ settings: data })
  }

  async finishUploadingMobile(d) {
    let mobile_banner_setting = this.state.settings && this.state.settings.filter((setting) => setting.internal_name === "mobile_banner_photo")[0]
    const src = d.filesUploaded[0].url
    mobile_banner_setting.value.image = src
    await this.props.updateStoreSetting(mobile_banner_setting)
    const { data } = await this.props.getAllStoreSettings()
    this.setState({ settings: data })
  }

  editFaqModal(faq) {
    this.setState({ editFAQ: faq })
  }

  async editFaq() {
    const faq_values = this.props.form['faq_update_form'].values
    let update_faq = this.state.editFAQ
    update_faq.answer = faq_values.answer
    update_faq.question = faq_values.question
    await this.props.updateFAQ(update_faq)
    const { data } = await this.props.getAllFAQs()
    this.setState({ faqs: data, editFAQ: null })
  }

  async createFaq() {
    const faq_values = this.props.form['faq_create_form'].values
    await this.props.createFAQ(faq_values)
    const { data } = await this.props.getAllFAQs()
    this.setState({ faqs: data, createFAQ: null })
  }

  createFAQModal() {
    let faq = {
      question: "",
      answer: ""
    }
    this.setState({ createFAQ: faq })
  }

  async deleteFaq(faq) {
    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
    faq.deleted_at = today
    await this.props.updateFAQ(faq)
    const { data } = await this.props.getAllFAQs()
    this.setState({ faqs: data })

  }

  render() {
    let hide_zero_setting = this.state.settings && this.state.settings.filter((setting) => setting.internal_name === "hide_zero")[0]
    let desktop_banner_setting = this.state.settings && this.state.settings.filter((setting) => setting.internal_name === "desktop_banner_photo")[0]
    let mobile_banner_setting = this.state.settings && this.state.settings.filter((setting) => setting.internal_name === "mobile_banner_photo")[0]

    let containerStyle = {
      marginTop: "30px"
    }
    if (!this.props.mobile) {
      containerStyle.fontSize = "20px"
    }
    return (
      <div style={ containerStyle }>

        <h2 className="underline">Home Content</h2>

        <div className={`${!this.props.mobile && "flex"}`}>
          <div className={`${!this.props.mobile && "w-50"}`}>
            <h3>Desktop Banner Image</h3>
            {desktop_banner_setting && <img className="w-auto h-auto" style={{ maxHeight: "200px", maxWidth: "90%" }} src={desktop_banner_setting.value.image} />}
            <ReactFilestack
              apikey={process.env.REACT_APP_FILESTACK_API}
              actionOptions={{
                imageDim: [1600, 560],
                transformations: {
                  circle: false,
                  rotate: false,
                  crop: {
                    aspectRatio: 1600 / 560,
                    force: true
                  }
                }
              }}
              customRender={({ onPick }) => (
                <div>
                  <button onClick={onPick}>Upload Desktop Banner Image</button>
                </div>
              )}
              onSuccess={this.finishUploadingDesktop}
            />
          </div>

          <div className={`${!this.props.mobile && "w-50"}`}>
            <h3>Mobile Banner Image</h3>
            {mobile_banner_setting && <img className="w-auto h-auto" style={{ maxHeight: "200px", maxWidth: "90%" }} src={mobile_banner_setting.value.image} />}
            <ReactFilestack
              apikey={process.env.REACT_APP_FILESTACK_API}
              actionOptions={{
                imageDim: [600, 800],
                transformations: {
                  circle: false,
                  rotate: false,
                  crop: {
                    aspectRatio: 600 / 800,
                    force: true
                  }
                }
              }}
              customRender={({ onPick }) => (
                <div>
                  <button onClick={onPick}>Upload Mobile Banner Image</button>
                </div>
              )}
              onSuccess={this.finishUploadingMobile}
            />
          </div>
        </div>




        <hr />

        {hide_zero_setting && 
          <div>
            <div>
              <h3>{hide_zero_setting.name}</h3>
              <div className="flex">
                <div>{hide_zero_setting.description}</div>
                <div>{hide_zero_setting.value.boolean ? <a><FontAwesomeIcon onClick={() => this.updateSettingBoolean(hide_zero_setting)} icon={faCheck} /></a> : <a><FontAwesomeIcon onClick={() => this.updateSettingBoolean(hide_zero_setting)} icon={faTimes} /></a>  }</div>
              </div>
            </div>
          </div>
        }

        <hr />

        <h2>FAQ's <FontAwesomeIcon className="hover hover-color-2" onClick={this.createFAQModal} icon={faPlusCircle} /></h2>
        {this.state.faqs && this.state.faqs.map((faq, index) => {
          return (
            <div key={index} className="relative">
              <h3>{faq.question}</h3>
              <div>{faq.answer}</div>
              <FontAwesomeIcon className="absolute hover hover-color-2" style={{ top: "0px", right: "20px" }} icon={faEdit} onClick={() => this.editFaqModal(faq)} />
              <FontAwesomeIcon className="absolute hover hover-color-2" style={{ top: "0px", right: "0px" }} icon={faTrash} onClick={() => this.deleteFaq(faq)} />
            </div>
          )
        })}

        {this.state.editFAQ && 
          <FormModal
            onSubmit={this.editFaq}
            cancel={() => this.setState({ editFAQ: null })}
            submitButtonText={"Edit FAQ"}
            formFields={[
              { label: "Question", name: "question", noValueError: `You must provide a value` },
              { label: "Answer", name: "answer", noValueError: `You must provide a value` },
            ]}
            form={"faq_update_form"}
            validation={validatePresenceOnAll}
            title={"Updating an FAQ"}
            initialValues={{
              question: this.state.editFAQ.question,
              answer: this.state.editFAQ.answer
            }}
          />
        }

        {this.state.createFAQ && 
          <FormModal
            onSubmit={this.createFaq}
            cancel={() => this.setState({ createFAQ: null })}
            submitButtonText={"Create FAQ"}
            formFields={[
              { label: "Question", name: "question", noValueError: `You must provide a value` },
              { label: "Answer", name: "answer", noValueError: `You must provide a value` },
            ]}
            form={"faq_create_form"}
            validation={validatePresenceOnAll}
            title={"Create a FAQ"}
            initialValues={{
              question: this.state.createFAQ.question,
              answer: this.state.createFAQ.answer
            }}
          />
        }
      </div>
    )
  }
}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { getAllFAQs, updateFAQ, createFAQ, updateStoreSetting, getAllStoreSettings }

export default connect(mapStateToProps, actions)(StoreSettings)