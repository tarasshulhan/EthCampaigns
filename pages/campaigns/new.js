import React, { Component } from "react"
import {
  Form,
  Button,
  Input,
  Message,
  Label,
  Segment,
  Icon,
} from "semantic-ui-react"
import Layout from "../../components/Layout"
import factory from "../../ethereum/factory"
import web3 from "../../ethereum/web3"
import { Link, Router } from "../../routes"

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  }

  onSubmit = async (event) => {
    event.preventDefault()
    this.setState({ loading: true, errorMessage: "" })
    try {
      const accounts = await web3.eth.getAccounts()
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        })
      Router.pushRoute("/")
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }
    this.setState({ loading: false })
  }

  render() {
    return (
      <Layout>
        <Link route={`/`}>
          <a>
            <Icon name="arrow circle left" />
            Back
          </a>
        </Link>
        <Segment color="blue">
          <h2>Create a Campaign</h2>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <Label size="large">Minimum Contribution</Label>
              <Input
                label="wei"
                labelPosition="right"
                placeholder="100"
                value={this.state.minimumContribution}
                onChange={(event) =>
                  this.setState({ minimumContribution: event.target.value })
                }
              />
            </Form.Field>
            <Message error header="Error!" content={this.state.errorMessage} />
            <Button loading={this.state.loading} type="submit" primary>
              Create
            </Button>
          </Form>
        </Segment>
      </Layout>
    )
  }
}

export default CampaignNew
