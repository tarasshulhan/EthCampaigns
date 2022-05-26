import React, { Component } from "react"
import { Button, Segment, Icon, Table, Message } from "semantic-ui-react"
import { Link } from "../../../routes"
import Layout from "../../../components/Layout"
import Campaign from "../../../ethereum/campaign"
import RequestRow from "../../../components/RequestRow"

class RequestIndex extends Component {
  state = {
    errorMessage: "",
  }

  static async getInitialProps(props) {
    const { address } = props.query
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

  getError = (error) => {
    this.setState({ errorMessage: error })
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
          getError={this.getError}
        />
      )
    })
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/`}>
          <a>
            <Icon name="arrow circle left" />
            Back
          </a>
        </Link>
        <Segment color="blue">
          <h2>Spending Requests</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Total requests: {this.props.requestCount}</h4>
            <Link route={`/campaigns/${this.props.address}/requests/new`}>
              <a>
                <Button primary>Add Request</Button>
              </a>
            </Link>
          </div>
          {this.state.errorMessage === "" ? null : (
            <Message error header="Error!" content={this.state.errorMessage} />
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
            <Body>{this.renderRows()}</Body>
          </Table>
        </Segment>
      </Layout>
    )
  }
}

export default RequestIndex
