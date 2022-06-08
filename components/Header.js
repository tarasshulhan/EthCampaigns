import React from "react"
import { Menu, Icon } from "semantic-ui-react"
import Link from "next/link"

const Header = () => {
  return (
    <Menu style={{ marginTop: "1%" }}>
      <Link href="/">
        <a className="item">
          <h4>EthCampaigns</h4>
        </a>
      </Link>
      <Menu.Menu position="right">
        <Link href="/">
          <a className="item">Campaigns</a>
        </Link>
        <Link href="/campaigns/new">
          <a className="item">
            {" "}
            <Icon name="add circle" />
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  )
}

export default Header
