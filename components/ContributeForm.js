import React, { useState } from "react"
import { Form, Button, Input, Message, Label } from "semantic-ui-react"
import Campaign from "../ethereum/campaign"
import web3 from "../ethereum/web3"
import { useRouter } from "next/router"

const ContributeForm = (props) => {
  const [value, setValue] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (event) => {
    event.preventDefault()

    const campaign = Campaign(props.address)

    setLoading(true)
    setErrorMessage("")

    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      })
      router.replace(`/campaigns/${props.address}`)
    } catch (err) {
      setErrorMessage(err.message)
    }

    setLoading(false)
    setValue("")
  }

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <Label size="large">Contribution Amount</Label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </Form.Field>
      <Message error header="Error!" content={errorMessage} />
      <Button type="submit" primary loading={loading}>
        Contribute
      </Button>
    </Form>
  )
}

export default ContributeForm
