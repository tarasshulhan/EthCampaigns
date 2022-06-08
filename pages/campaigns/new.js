import React, { useState } from "react"
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
import Link from "next/link"
import { useRouter } from "next/router"

const CampaignNew = (props) => {
  const [minimumContribution, setMinimumContribution] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage("")

    try {
      const accounts = await web3.eth.getAccounts()
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      })
      router.push("/")
    } catch (err) {
      setErrorMessage(err.message)
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Link href="/">
        <a>
          <Icon name="arrow circle left" />
          Back
        </a>
      </Link>
      <Segment color="blue">
        <h2>Create a Campaign</h2>
        <Form onSubmit={onSubmit} error={!!errorMessage}>
          <Form.Field>
            <Label size="large">Minimum Contribution</Label>
            <Input
              label="wei"
              labelPosition="right"
              placeholder="100"
              value={minimumContribution}
              onChange={(event) => setMinimumContribution(event.target.value)}
            />
          </Form.Field>
          <Message error header="Error!" content={errorMessage} />
          <Button loading={loading} type="submit" primary>
            Create
          </Button>
        </Form>
      </Segment>
    </Layout>
  )
}

export default CampaignNew
