import * as React from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useRecoilState } from "recoil"
import { companyState, userState } from "../globalstate"
import { display, width } from "@mui/system"
import api from "../Services/api"
import { createTeam, addTeamToCompany } from "../Services/teams"

const CreateTeamOverlay = () => {
  const [company, setCompany] = useRecoilState(companyState)
  const [user, setUser] = useRecoilState(userState)
  const [open, setOpen] = React.useState(false)
  const [teamName, setTeamName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selectedMembers, setSelectedMembers] = React.useState([])
  const [selectValue, setSelectValue] = React.useState("Pick an option")

  const [newTeam, setNewTeam] = React.useState(null)
  const [teamAdded, setTeamAdded] = React.useState(false)

  React.useEffect(() => {
    // console.log("start set company")

    if (newTeam) {
      // console.log("new team true")

      setCompany({ ...company, teams: [...company.teams, newTeam] })
      setNewTeam(null)
      setTeamAdded(true)
      // console.log("teamadded in set company: ", teamAdded)
    }
    // console.log("end set company")
  }, [newTeam])

  React.useEffect(() => {
    // console.log("start set user")
    // console.log("teamadded in set user: ", teamAdded)
    if (teamAdded) {
      // console.log("team added true")

      setUser({
        ...user,
        companies: [
          ...user.companies.map((currentCompany) =>
            currentCompany.id === company.id ? company : currentCompany
          ),
        ],
      })
      setTeamAdded(false)
    }
    // console.log('end set user')
  }, [company, teamAdded])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const submitTeam = async (event) => {
    console.log("info: ", teamName, description, selectedMembers)
    if (teamName && description && selectedMembers.length > 0) {
      const teamDto = {
        name: teamName,
        description: description,
        teammates: selectedMembers,
      }
      console.log(teamDto)
      setNewTeam(await createTeam(user.id, company.id, teamDto))
      console.log(newTeam)
      setTeamName("")
      setDescription("")
      setSelectedMembers([])
    }
    handleClose()
  }

  const handleChange = (event) => {
    console.log(event)
    const {
      target: { value },
    } = event
    console.log(Object.entries(value))
    console.log(value.id)
    !selectedMembers.map((user) => user.id).includes(value.id) &&
      setSelectedMembers([...selectedMembers, value])
  }

  const handleMemberSelected = (event) => {
    console.log(JSON.parse(event.target.value))
    const value = JSON.parse(event.target.value)
    console.log(value.id)
    !selectedMembers.map((user) => user.id).includes(value.id) &&
      setSelectedMembers([...selectedMembers, value])
    // setSelectValue(event.target.value)
  }

  // React.useEffect(() => {
  //   !selectedMembers.map((user) => user.id).includes(selectValue.id) &&
  //     setSelectedMembers([...selectedMembers, selectValue])
  // }, [selectValue])

  const handleRemoveMember = (event) => {
    // console.log(event.target.dataset.id)
    setSelectedMembers(
      selectedMembers.filter((member) => member.id != event.target.dataset.id)
    )
  }

  // const StyledTextField = styled(TextField)({
  //   color: "#DEB992",
  // })

  return (
    <>
      <Button
        variant='text'
        onClick={handleClickOpen}
        style={{
          display: "flex",
          flexDirection: "column",
          color: "#DEB992",
          width: "100%",
          height: "100%",
        }}
      >
        <span
          style={{
            fontSize: "8rem",
            position: "absolute",
            width: "100px",
            height: "0",
            left: "32%",
            top: "46%",
            border: "4px solid #DEB992",
            transform: "rotate(90deg)",
          }}
        ></span>
        <span
          style={{
            fontSize: "8rem",
            position: "absolute",
            width: "100px",
            height: "0",
            left: "32%",
            top: "46%",
            border: "4px solid #DEB992",
          }}
        ></span>
        <span
          style={{
            position: "absolute",
            width: "100px",
            height: "0",
            left: "33%",
            top: "80%",
            textTransform: "none",
          }}
        >
          New Team
        </span>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        {/* sx={{
        background: "#0B2D45",
        borderRadius: '20px',
        color: '#DEB992',
      }} */}
        
        <div
          style={{
            background: "#0B2D45",
            padding: "100px 100px 0 100px",
            // borderRadius: '20px',
            // marginTop: '75px'
          }}
        >
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: "55px",
            height: "50px",
            color: "#F24E1E",
            border: "4px solid #F24E1E",
            borderRadius: "50%",
            background: "none",
            fontWeight: "bolder",
            fontSize: '2rem',
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          X
        </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#DEB992",
            }}
          >
            <label>Team Name</label>
            <input
              id='team-name'
              label='Team Name'
              type='text'
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              style={{ background: "#0B2D45", color: "#DEB992" }}
            />
            <label>Description</label>
            <input
              autoFocus
              margin='dense'
              id='description'
              label='Description'
              type='text'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              style={{ background: "#0B2D45", color: "#DEB992" }}
            />
          </div>
          <p style={{ color: "#DEB992", textAlign: "center" }}>
            Select Members
          </p>
          <FormControl fullWidth>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <select
                style={{
                  width: "80%",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
                value={selectValue}
                labelId='select-label'
                id='members-select'
                label='Pick an option'
                onChange={handleMemberSelected}
              >
                <option
                  value='Pick an option'
                  disabled
                  style={{ color: "#5533FF", background: "#FFF" }}
                >
                  Pick an option
                </option>
                {company?.employees?.map((employee) => (
                  <option key={employee.id} value={JSON.stringify(employee)}>
                    {employee.profile.firstName}{" "}
                    {employee.profile.lastName?.slice(0, 1)}.
                  </option>
                ))}
              </select>
            </div>
          </FormControl>
          <div>
            {selectedMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    background: "#1ba098",
                    borderRadius: "10.2875px",
                    border: "1px",
                    width: "130px",

                    // text-transform: uppercase;
                    // letter-spacing: 1px;
                    padding: "12px 2px",
                    margin: "10px",
                    // font-weight: bold;
                    cursor: "pointer",
                    color: "rgba(255, 255, 255, 0.75)",
                  }}
                >
                  {member.profile.firstName}{" "}
                  {member.profile.lastName.slice(0, 1)}.
                </button>
                <button
                  style={{
                    width: "25px",
                    height: "25px",
                    color: "#F24E1E",
                    border: "2px solid #F24E1E",
                    borderRadius: "50%",
                    background: "none",
                    fontWeight: "bolder",
                    cursor: "pointer",
                  }}
                  data-id={member.id}
                  onClick={handleRemoveMember}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#0B2D45",
          }}
        >
          <button
            style={{
              background: "#1ba098",
              borderRadius: "10.2875px",
              border: "1px",
              // text-transform: uppercase;
              // letter-spacing: 1px;
              padding: "12px 45px",
              margin: "30px 0",
              // font-weight: bold;
              cursor: "pointer",
              color: "rgba(255, 255, 255, 0.75)",
            }}
            onClick={submitTeam}
          >
            Submit
          </button>
        </div>
      </Dialog>
    </>
  )
}

export default CreateTeamOverlay
