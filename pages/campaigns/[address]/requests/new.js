import React, { useState } from "react"
import {
  Form,
  Button,
  Message,
  Input,
  Label,
  Segment,
  Icon,
} from "semantic-ui-react"
import Layout from "../../../../components/Layout"
import Campaign from "../../../../ethereum/campaign"
import web3 from "../../../../ethereum/web3"
import Link from "next/link"
import { useRouter } from "next/router"

const RequestNew = (props) => {
  const [state, setState] = useState({
    value: "",
    description: "",
    recipient: "",
    loading: false,
  })
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const onSubmit = async (event) => {
    event.preventDefault()

    const campaign = Campaign(props.address)
    const { description, value, recipient } = state

    setState({ ...state, loading: true })
    setErrorMessage("")

    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] })

      router.push(`/campaigns/${props.address}/requests`)
    } catch (err) {
      setErrorMessage(err.message)
    }
    setState({ ...state, loading: false })
  }

  return (
    <Layout>
      <Link href={`/campaigns/${props.address}/requests`}>
        <a>
          <Icon name="arrow circle left" />
          Back
        </a>
      </Link>
      <Segment color="blue">
        <h2>Create a Request</h2>
        <Form onSubmit={onSubmit} error={!!errorMessage}>
          <Form.Field>
            <Label size="large">Description</Label>
            <Input
              value={state.description}
              onChange={(event) =>
                setState({ ...state, description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <Label size="large">Value (Eth)</Label>
            <Input
              value={state.value}
              onChange={(event) =>
                setState({ ...state, value: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <Label size="large">Recipient Address</Label>
            <Input
              value={state.recipient}
              onChange={(event) =>
                setState({ ...state, recipient: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Error!" content={errorMessage} />
          <Button type="submit" primary loading={state.loading}>
            Create
          </Button>
        </Form>
      </Segment>
    </Layout>
  )
}

RequestNew.getInitialProps = async (ctx) => {
  const address = ctx.query.address

  return { address }
}

export default RequestNew
