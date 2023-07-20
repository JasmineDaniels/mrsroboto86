import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import NavBar from "../../Components/NavBar"
import { userState, companyState, errorState } from "../../globalstate"
import { Button, Box, TextField } from "@mui/material"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  getAnnouncements,
  saveAnnouncement,
} from "../../Services/announcements"
import styled from "styled-components"

const Announcements = () => {
  const [user, setUser] = useRecoilState(userState)
  const [company] = useRecoilState(companyState)
  const [compAnnouncements, setCompAnnouncements] = useState([])
  const [announcementUpdate, setAnnouncementUpdate] = useState(false)
  const [openNewDialog, setOpenNewDialog] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [formError, setFormError] = useRecoilState(errorState)

  const resetError = () => setFormError(errorState)

  const btnstyle = {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    margin: "2px 0",
    background: "#1BA098",
    color: "rgba(255, 255, 255, 0.75)",
    borderRadius: "10.2875px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    width: "103px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  }

  const h1Style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    fontSize: "3rem",
    marginTop: "1%",
    width: "80%",
    fontWeight: "400",
  }

  const Container = styled.div`
    background-color: #0b2d45;
    border-radius: 10px;
    padding: 20px;
  `

  const Paragraph = styled.p`
    margin-bottom: 10px;
    font-size: 1rem;
    line-height: 1.5;
    color: white;
  `
  const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 5fr);
    grid-gap: 30px;
    justify-content: center;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  `

  const GridItem = styled.div`
    display: flex;
    justify-content: center;
  `

  const formStyle = {
    background: "#051622",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "0 50px",
    height: "100%",
    textAlign: "center",
    color: "#deb992",
  }

  const Title = {
    color: "#deb992",
    fontWeight: "bold",
    margin: 0,
    fontSize: "25px",
    padding: "10px",
    marginBottom: "15px",
  }

  const textfieldStyle = {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid #deb992",
    padding: "7px 15px",
    margin: "5px auto",
    width: "70%",

    color: "#deb992",
    "&::placeholder": {
      color: "#deb992",
    },
    "&:focus": {
      outline: "none",
    },
  }

  const Button = styled.button`
    background: #1ba098;
    font-size: 0.8em;
    border-radius: 10.2875px;
    // border: 1px;
    text-transform: uppercase;
    letter-spacing: 1px;
    // padding: 12px 45px;
    font-weight: bold;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 25px;
  `

  const StyledModal = {
    background: "rgb(2, 9, 13, 0.5)",

    // position: "absolute",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
    // transition: "transform 0.6s ease-in-out",
    // textAlign: "center",
    // zIndex: 100,
    // width: "45%",
    // height: "25%",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    // flexDirection: "column",
    // padding: "0 50px",
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getAnnouncements(user.companies[0].id)
      setCompAnnouncements(data)
    }
    fetchData()
  }, [announcementUpdate])

  const handleNewAnnoucement = () => {
    setAnnouncementUpdate(false)
    setOpenNewDialog(true)
  }

  const formIsValid = () => {
    if (!title || !message) {
      setFormError({
        ...formError,
        isError: true,
        message: "All fields are required",
      })
      return false
    }
    return true
  }

  const saveAnnoucement = async () => {
    console.log(user)
    if (formIsValid()) {
      setOpenNewDialog(false)
      const savedData = await saveAnnouncement(company.id, title, message, user)
      console.log("Saving announcements...")

      setTitle("")
      setMessage("")
      resetError()
      setAnnouncementUpdate(true)
    }
  }

  if (!user.isLoggedIn) {
    return <Navigate replace to='/' />
  } else {
    return (
      <>
        <NavBar />
        <div
          style={{
            backgroundColor: "#051622",
            width: "100vw",
            minHeight: "100%",
            
          }}
        >
          <Box
            style={{
              color: "#1ba098",
              background: "#051622",
              display: "flex",
              justifyContent: "center",
              alignItems: "top",
              textAlign: "center",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                position: "relative",
                width: "70%",
                marginTop: "2%",
                marginBottom: "40px",
                borderBottom: "1px solid #DEB992",
              }}
            >
              {user.isAdmin && (
                <button
                  type='submit'
                  style={btnstyle}
                  onClick={() => handleNewAnnoucement()}
                >
                  New
                </button>
              )}
              <h1 style={h1Style}> Announcements</h1>
            </div>
          </Box>
          <GridContainer style={{ paddingBottom: '100px'}}>
            {compAnnouncements.map((announcement) => (
              <GridItem key={announcement.id}>
                <Container style={{ width: "50%" }}>
                  <Paragraph>
                    {announcement.author.profile.firstName}{" "}
                    {announcement.author.profile.lastName}
                  </Paragraph>
                  <Paragraph>
                    {new Date(announcement.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Paragraph>
                  <Paragraph>{announcement.message}</Paragraph>
                </Container>
              </GridItem>
            ))}
          </GridContainer>
          <Dialog
            PaperProps={{
              sx: {
                width: "45%",
                backgroundColor: "#0B2D45",
              },
            }}
            sx={StyledModal}
            open={openNewDialog}
            onClose={() => setOpenNewDialog(false)}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "30px",
                height: "30px",
                color: "#F24E1E",
                border: "4px solid #F24E1E",
                borderRadius: "50%",
                background: "none",
                fontWeight: "bolder",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              // onClick={}
            >
              X
            </button>
            <DialogTitle style={Title}>Create new announcement</DialogTitle>
            <TextField
              style={textfieldStyle}
              label='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              InputLabelProps={{
                style: { color: "#DEB992" },
              }}
              InputProps={{
                style: { color: "#DEB992" },
              }}
            />
            <TextField
              style={textfieldStyle}
              label='Message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              InputLabelProps={{
                style: { color: "#DEB992" },
              }}
              InputProps={{
                style: { color: "#DEB992" },
              }}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => saveAnnoucement()}
                style={{
                  background: "#1ba098",
                  borderRadius: "10.2875px",
                  border: "1px",
                  padding: "12px 45px",
                  margin: "30px 0",
                  cursor: "pointer",
                  color: "rgba(255, 255, 255, 0.75)",
                }}
              >
                Submit
              </button>
            </div>
            {formError.isError && !formError.field ? (
              <p
                style={{
                  color: "red",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {formError.message}
              </p>
            ) : formError.isError && formError.field ? (
              <p
                style={{
                  color: "red",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {formError.message}
              </p>
            ) : (
              ""
            )}
          </Dialog>
        </div>
      </>
    )
  }
}

export default Announcements
