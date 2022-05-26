import React from "react"
import { Menu, Icon } from "semantic-ui-react"
import { Link } from "../routes"

const Header = () => {
  return (
    <Menu style={{ marginTop: "1%" }}>
      <Link route="/">
        <a className="item">
          <h4>EthCampaigns</h4>
        </a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Campaigns</a>
        </Link>
        <Link route="/campaigns/new">
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
