import React, { Component } from "react"
import { Form, Button, Input, Message, Label } from "semantic-ui-react"
import Campaign from "../ethereum/campaign"
import web3 from "../ethereum/web3"
import { Router } from "../routes"

class ContributeForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const campaign = Campaign(this.props.address)

    this.setState({ loading: true, errorMessage: "" })

    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      })
      Router.replaceRoute(`/campaigns/${this.props.address}`)
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }

    this.setState({ loading: false, value: "" })
  }
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <Label size="large">Contribution Amount</Label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        <Message error header="Error!" content={this.state.errorMessage} />
        <Button type="submit" primary loading={this.state.loading}>
          Contribute
        </Button>
      </Form>
    )
  }
}

export default ContributeForm
