import React, { Component } from "react"
import { Card, Button, Segment } from "semantic-ui-react"
import Layout from "../components/Layout"
import factory from "../ethereum/factory"
import Link from "next/link"

const CampaignIndex = (props) => {
  const renderCampaigns = () => {
    const items = props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View</a>
          </Link>
        ),
        fluid: true,
      }
    })
    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <Segment color="blue">
        <h2>Active Campaigns</h2>
        <Link href="/campaigns/new">
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
        {renderCampaigns()}
      </Segment>
    </Layout>
  )
}

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call()
  return { campaigns: campaigns }
}
export default CampaignIndex
