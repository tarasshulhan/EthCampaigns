import React from "react"
import { Card, Grid, Button, Segment, Icon } from "semantic-ui-react"
import Layout from "../../../components/Layout"
import Campaign from "../../../ethereum/campaign"
import web3 from "../../../ethereum/web3"
import ContributeForm from "../../../components/ContributeForm"
import Link from "next/link"

const CampaignShow = (props) => {
  const renderCards = () => {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
    } = props

    const items = [
      {
        header: manager,
        meta: "Manager Address",
        description:
          "The manager is the creator of this campaign and can initiate spending requests.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Condribution (wei)",
        description:
          "The minimum contribution required to participate in the campaign.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsCount,
        meta: "Number of Spending Requests",
        description:
          "A request allows the manager to withdraw money if approved by campaign contributors.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of Approvers (Contributors)",
        description:
          "Approvers are people who have contributed to this campaign.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (eth)",
        description: "The total balance of the campaign in ether.",
        style: { overflowWrap: "break-word" },
      },
    ]

    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <Link href={`/`}>
        <a>
          <Icon name="arrow circle left" />
          Back
        </a>
      </Link>
      <Segment color="blue">
        <h3>Campaign Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link href={`/campaigns/${props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Layout>
  )
}

CampaignShow.getInitialProps = async (ctx) => {
  const address = await ctx.query.address

  const campaign = Campaign(address)
  const summary = await campaign.methods.getSummary().call()

  return {
    address: address,
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  }
}

export default CampaignShow
