import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import MenuIcon from "@mui/icons-material/Menu"
import { Link } from "react-router-dom"
import CloseIcon from "@mui/icons-material/Close"
import { userState } from "../globalstate"
import { useNavigate } from "react-router-dom"

import { useRecoilState } from "recoil"
import { AppBar, Toolbar, Typography } from "@mui/material"

const NavBar = () => {
  const history = useNavigate()
  const [user, setUser] = useRecoilState(userState)
  const [isAdmin, setIsAdmin] = React.useState(user.admin)
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const anchor = "top"
  const [toggled, setToggled] = React.useState(true)

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
    setToggled(!toggled)
  }

  const linksArray = isAdmin
    ? ["Home", "Company", "Teams", "Users"]
    : ["Home", "Teams"]

  return (
    <Box
      style={{ color: "#1ba098", background: "#051622", fontFamily: "Mulish" }}
    >
      <AppBar position="static">
        <Toolbar
          variant="dense"
          style={{
            width: "calc(100% - 5px)",
            background: "#051622",
            display: "flex",
            justifyContent: "space-between",
            border: "2px solid #DEB992",
            padding: "0",
          }}
        >
          <div style={{ width: "5%", marginLeft: "2rem" }}>
            <img src="logo.png" style={{ width: "4rem" }} />
          </div>
          <div
            style={{
              width: "15%",
              color: "#F24E1E",
              fontSize: "1.5rem",
              fontStyle: "normal",
              lineHeight: "150%",
              fontWeight: "400",
            }}
          >
            {isAdmin ? (
              <span>ACTING AS ADMIN</span>
            ) : (
              <span>
                {user?.profile?.firstName}{" "}
                {user?.profile?.lastName?.slice(0, 1)}.
              </span>
            )}
          </div>
          <List
            style={{ textAlign: "center", background: "#051622" }}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginRight: "2rem",
            }}
          >
            {linksArray.map((text, index) => (
              <ListItem key={text} style={{ flex: "0 2 auto" }}>
                <Link
                  to={
                    text.toLowerCase() === "home"
                      ? "/announcements"
                      : "/" + text.toLowerCase()
                  }
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItemButton sx={{}}>
                    <ListItemText
                      style={{ color: "#1ba098" }}
                      primaryTypographyProps={{
                        fontSize: "3rem",
                        fontFamily: "Mulish",
                        fontStyle: "normal",
                        lineHeight: "150%",
                        fontWeight: "400",
                      }}
                      primary={text}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
            <ListItem key={"logout"} sx={{}}>
              <ListItemButton
                sx={{}}
                onClick={() => {
                  setUser({})
                  localStorage.clear()
                  history("/")
                }}
              >
                <ListItemText
                  style={{ color: "#1ba098" }}
                  primaryTypographyProps={{
                    fontSize: "3em",
                    fontFamily: "Mulish",
                    fontStyle: "normal",
                    lineHeight: "150%",
                    fontWeight: "400",
                  }}
                  primary="Logout"
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar
