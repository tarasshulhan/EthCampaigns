import React, { useState } from "react"
import { Button, Segment, Icon, Table, Message } from "semantic-ui-react"
import Link from "next/link"
import Layout from "../../../../components/Layout"
import Campaign from "../../../../ethereum/campaign"
import RequestRow from "../../../../components/RequestRow"

const RequestIndex = (props) => {
  const [errorMessage, setErrorMessage] = useState("")

  const setError = (error) => {
    setErrorMessage(error)
  }

  const renderRows = () => {
    return props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={props.address}
          approversCount={props.approversCount}
          setError={setError}
        />
      )
    })
  }

  const { Header, Row, HeaderCell, Body } = Table

  return (
    <Layout>
      <Link href={`/campaigns/${props.address}/`}>
        <a>
          <Icon name="arrow circle left" />
          Back
        </a>
      </Link>
      <Segment color="blue">
        <h2>Spending Requests</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4>Total requests: {props.requestCount}</h4>
          <Link href={`/campaigns/${props.address}/requests/new`}>
            <a>
              <Button primary>Add Request</Button>
            </a>
          </Link>
        </div>
        {errorMessage === "" ? null : (
          <Message error header="Error!" content={errorMessage} />
        )}
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount (Eth)</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{renderRows()}</Body>
        </Table>
      </Segment>
    </Layout>
  )
}

RequestIndex.getInitialProps = async (ctx) => {
  const address = ctx.query.address
  const campaign = Campaign(address)
  const requestCount = await campaign.methods.getRequestsCount().call()
  const approversCount = await campaign.methods.approversCount().call()

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call()
      })
  )

  return { address, requests, requestCount, approversCount }
}

export default RequestIndex
