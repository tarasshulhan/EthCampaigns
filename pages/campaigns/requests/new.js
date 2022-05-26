import React, { Component } from "react"
import {
  Form,
  Button,
  Message,
  Input,
  Label,
  Segment,
  Icon,
} from "semantic-ui-react"
import Layout from "../../../components/Layout"
import Campaign from "../../../ethereum/campaign"
import web3 from "../../../ethereum/web3"
import { Link, Router } from "../../../routes"

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    loading: false,
    errorMessage: "",
  }

  static async getInitialProps(props) {
    const { address } = props.query

    return { address: address }
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const campaign = Campaign(this.props.address)
    const { description, value, recipient } = this.state

    this.setState({ loading: true, errorMessage: "" })

    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] })

      Router.pushRoute(`/campaigns/${this.props.address}/requests`)
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }
    this.setState({ loading: false })
  }

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>
            <Icon name="arrow circle left" />
            Back
          </a>
        </Link>
        <Segment color="blue">
          <h2>Create a Request</h2>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <Label size="large">Description</Label>
              <Input
                value={this.state.description}
                onChange={(event) =>
                  this.setState({ description: event.target.value })
                }
              />
            </Form.Field>

            <Form.Field>
              <Label size="large">Value (Eth)</Label>
              <Input
                value={this.state.value}
                onChange={(event) =>
                  this.setState({ value: event.target.value })
                }
              />
            </Form.Field>

            <Form.Field>
              <Label size="large">Recipient Address</Label>
              <Input
                value={this.state.recipient}
                onChange={(event) =>
                  this.setState({ recipient: event.target.value })
                }
              />
            </Form.Field>

            <Message error header="Error!" content={this.state.errorMessage} />
            <Button type="submit" primary loading={this.state.loading}>
              Create
            </Button>
          </Form>
        </Segment>
      </Layout>
    )
  }
}

export default RequestNew
