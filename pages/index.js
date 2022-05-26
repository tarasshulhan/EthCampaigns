import React, { Component } from "react"
import { Card, Button, Segment } from "semantic-ui-react"
import Layout from "../components/Layout"
import factory from "../ethereum/factory"
import { Link } from "../routes"

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    return { campaigns: campaigns }
  }
  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View</a>
          </Link>
        ),
        fluid: true,
      }
    })
    return <Card.Group items={items} />
  }
  render() {
    return (
      <Layout>
        <Segment color="blue">
          <h2>Active Campaigns</h2>
          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Add Campaign"
                icon="add circle"
                labelPosition="left"
                primary
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </Segment>
      </Layout>
    )
  }
}

export default CampaignIndex
