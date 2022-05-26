import React, { Component } from "react"
import { Table, Button, Message } from "semantic-ui-react"
import web3 from "../ethereum/web3"
import Campaign from "../ethereum/campaign"
import { Router } from "../routes"

class RequestRow extends Component {
  state = {
    loadingApprove: false,
    loadingFinalize: false,
  }

  onApprove = async (event) => {
    event.preventDefault()

    this.setState({ loadingApprove: true })

    //sets error message in parent component
    this.props.getError("")

    try {
      const campaign = Campaign(this.props.address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      })
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
    } catch (err) {
      this.props.getError(err.message)
    }
    this.setState({ loadingApprove: false })
  }

  onFinalize = async (event) => {
    event.preventDefault()

    this.setState({ loadingFinalize: true })
    this.props.getError("")

    try {
      const campaign = Campaign(this.props.address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
      })
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
    } catch (err) {
      this.props.getError(err.message)
    }
    this.setState({ loadingFinalize: false })
  }

  render() {
    const { Row, Cell } = Table
    const { id, request, approversCount } = this.props
    const readyToFinalize = request.approvalCount > approversCount / 2

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingApprove}
              color="green"
              basic
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingFinalize}
              color="blue"
              basic
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    )
  }
}

export default RequestRow
