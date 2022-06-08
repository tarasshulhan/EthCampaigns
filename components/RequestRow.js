import React, { useState } from "react"
import { Table, Button } from "semantic-ui-react"
import web3 from "../ethereum/web3"
import Campaign from "../ethereum/campaign"
import { useRouter } from "next/router"

const RequestRow = (props) => {
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingFinalize, setLoadingFinalize] = useState(false)
  const router = useRouter()

  const onApprove = async (event) => {
    event.preventDefault()

    setLoadingApprove(true)

    //sets error message in parent component
    props.setError("")

    try {
      const campaign = Campaign(props.address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.approveRequest(props.id).send({
        from: accounts[0],
      })
      router.replace(`/campaigns/${props.address}/requests`)
    } catch (err) {
      props.setError(err.message)
    }
    setLoadingApprove(false)
  }

  const onFinalize = async (event) => {
    event.preventDefault()

    setLoadingFinalize(true)
    props.setError("")

    try {
      const campaign = Campaign(props.address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.finalizeRequest(props.id).send({
        from: accounts[0],
      })
      router.replace(`/campaigns/${props.address}/requests`)
    } catch (err) {
      props.setError(err.message)
    }
    setLoadingFinalize(false)
  }

  const { Row, Cell } = Table
  const { id, request, approversCount } = props
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
            loading={loadingApprove}
            color="green"
            basic
            onClick={onApprove}
          >
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button
            loading={loadingFinalize}
            color="blue"
            basic
            onClick={onFinalize}
          >
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  )
}

export default RequestRow
