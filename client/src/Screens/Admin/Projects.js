import { Link, Navigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import NavBar from '../../Components/NavBar'
import { companyState, currentTeamState, userState } from '../../globalstate'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  createTheme,
  ThemeProvider,
  Alert,
  AlertTitle,
} from '@mui/material'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import {
  createProject,
  getProjectById,
  getProjects,
  saveProject,
} from '../../Services/projects'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #051622;
  color: #1ba098;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100vh;
  fontsize: 35px;
`

const BackButton = styled.div`
  position: fixed;
  top: 150px;
  left: 0;
  width: 200px;
  height: 100%;
  a {
    color: #1ba098;
    text-decoration: none;
  }
`

const theme = createTheme({
  palette: {
    myCustomColor: {
      main: '#DEB992',
    },
  },
})

const Projects = () => {
  const [user, setUser] = useRecoilState(userState)
  const [teamState, setTeamState] = useRecoilState(currentTeamState)
  const [company, setCompany] = useRecoilState(companyState)
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [projects, setProjects] = useState([{}])
  const [projectListUpdate, setProjectsListUpdate] = useState(0)
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [isActiveProject, setIsActiveProject] = useState(null)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    async function fetchData() {
      let data
      if (user.admin) {
        data = await getProjects(company.id, teamState.id)
      } else {
        data = await getProjects(user.companies[0].id, teamState.id)
      }

      setProjects(data)
    }
    fetchData()
  }, [projectListUpdate, company, teamState, user.admin, user.companies])

  const validateEntries = () => {
    if (projectName === '' || description === '') {
      setShowAlert(true)
      return true
    }
  }

  const handleNewOpen = () => {
    //Empty text fields
    setProjectName('')
    setDescription('')
    setNewOpen(true)
  }

  const handleNewClose = () => {
    //Empty text fields
    setProjectName('')
    setDescription('')
    setNewOpen(false)
  }

  const handleNewSubmit = async () => {
    if (validateEntries()) {
      setNewOpen(false)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    await createProject(
      {
        name: projectName,
        description: description,
        active: true,
        team: teamState,
      },
      {
        id: user.id,
        profile: user.profile,
        admin: user.admin,
        active: user.active,
        status: user.status,
      }
    )
    setProjectName('')
    setDescription('')
    setProjectsListUpdate(projectListUpdate + 1)
    setNewOpen(false)
  }

  const handleEditOpen = async (projectId) => {
    //Populate text with correct values and current project
    const currentProject = await getProjectById(projectId)
    setCurrentProjectId(projectId)
    setProjectName(currentProject.name)
    setDescription(currentProject.description)
    setIsActiveProject(currentProject.active)
    setEditOpen(true)
  }

  const handleEditClose = () => {
    //Reset current project and text fields
    setCurrentProjectId(null)
    setProjectName('')
    setDescription('')
    setEditOpen(false)
  }

  const handleEditSave = async () => {
    //Edit project with correct id and send to database
    const currentProject = await getProjectById(currentProjectId)

    if (validateEntries()) {
      setEditOpen(false)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    await saveProject({
      ...currentProject,
      name: projectName,
      description: description,
      active: isActiveProject,
    })

    setCurrentProjectId(null)
    setProjectName('')
    setDescription('')
    setProjectsListUpdate(projectListUpdate + 1)
    setEditOpen(false)
  }

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleActiveChange = (event) => {
    setIsActiveProject(event.target.value)
  }

  if (!user.isLoggedIn) {
    return <Navigate replace to='/' />
  } else if (teamState === {}) {
    return <Navigate replace to='/teams' />
  } else {
    return (
      <>
        <div>
          <NavBar />
        </div>
        <Container>
          <BackButton>
            <Button>
              <Link to='/teams'>
                <ArrowBackIosIcon />
                Back
              </Link>
            </Button>
          </BackButton>

          <Box
            display='flex'
            alignItems='center'
            flexDirection='column'
            width='968px'
            marginBottom='14px'
          >
            <h1>Projects For {teamState.name}</h1>
            {user.admin && (
              <Button
                variant='contained'
                onClick={handleNewOpen}
                style={{
                  backgroundColor: '#1ba098',
                  color: 'white',
                  width: '80px',
                  height: '30px',
                  fontSize: '12px',
                }}
                sx={{ ml: 'auto' }}
              >
                New
              </Button>
            )}
          </Box>
          <div>
            <List dense={false}>
              {projects.map((project) => (
                <>
                  <Divider style={{ backgroundColor: '#DEB992' }} />
                  <ListItem
                    style={{ width: '1000px' }}
                    key={project.id}
                    secondaryAction={
                      <Button
                        value={project.id}
                        onClick={() => handleEditOpen(project.id)}
                        edge='end'
                        aria-label='edit'
                        variant='contained'
                        style={{
                          backgroundColor: '#DEB992',
                          color: 'black',
                          width: '80px',
                          height: '30px',
                          fontSize: '12px',
                        }}
                      >
                        Edit
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <>
                          {project.name}
                          {project.active ? (
                            <Button
                              variant='outlined'
                              style={{
                                marginLeft: 50,
                                fontSize: 10,
                                color: 'green',
                                borderColor: 'green',
                                padding: '2px 12px',
                              }}
                            >
                              Active
                            </Button>
                          ) : (
                            <Button
                              variant='outlined'
                              style={{
                                marginLeft: 50,
                                fontSize: 10,
                                color: 'red',
                                borderColor: 'red',
                                padding: '2px 12px',
                              }}
                            >
                              Inactive
                            </Button>
                          )}
                        </>
                      }
                      secondary={project.description}
                      primaryTypographyProps={{
                        style: { color: 'white', maxWidth: '800px' },
                        sx: { mb: 1 },
                        noWrap: false,
                      }}
                      secondaryTypographyProps={{
                        style: { color: 'white', maxWidth: '800px' },
                        sx: { mt: 1 },
                        noWrap: false,
                      }}
                    />
                  </ListItem>
                </>
              ))}
            </List>
          </div>
          <ThemeProvider theme={theme}>
            <Dialog
              open={newOpen}
              onClose={handleNewClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#0b2d45',
                  height: '400px',
                  width: '500px',
                },
              }}
            >
              <DialogActions>
                <IconButton onClick={handleNewClose} style={{ color: 'red' }}>
                  <HighlightOffIcon />
                </IconButton>
              </DialogActions>
              <DialogContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <TextField
                  autoFocus
                  margin='dense'
                  id='Project-Name'
                  label='Project Name'
                  type='text'
                  fullWidth
                  variant='standard'
                  value={projectName}
                  onChange={handleProjectNameChange}
                  color='myCustomColor'
                  focused
                  InputProps={{
                    style: {
                      color: 'white',
                    },
                  }}
                  sx={{ mt: 2, mb: 1 }}
                />

                <TextField
                  autoFocus
                  margin='dense'
                  id='Description'
                  label='Description'
                  type='text'
                  fullWidth
                  variant='standard'
                  value={description}
                  onChange={handleDescriptionChange}
                  color='myCustomColor'
                  focused
                  InputProps={{
                    style: {
                      color: 'white',
                    },
                  }}
                  sx={{ mt: 2, mb: 1 }}
                />
              </DialogContent>
              <DialogActions
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <center>
                  <Button
                    variant='contained'
                    onClick={handleNewSubmit}
                    style={{
                      backgroundColor: '#1ba098',
                      color: 'white',
                      width: '120px',
                      height: '30px',
                      fontSize: '12px',
                    }}
                    sx={{ ml: 'auto' }}
                  >
                    Submit
                  </Button>
                </center>
              </DialogActions>
            </Dialog>
            <Dialog
              open={editOpen}
              onClose={handleEditClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#0b2d45',
                  height: '500px',
                  width: '500px',
                },
              }}
            >
              <DialogActions>
                <IconButton onClick={handleEditClose} style={{ color: 'red' }}>
                  <HighlightOffIcon />
                </IconButton>
              </DialogActions>
              <DialogContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <TextField
                  autoFocus
                  margin='dense'
                  id='name'
                  label='Project Name'
                  type='text'
                  fullWidth
                  variant='standard'
                  value={projectName}
                  onChange={handleProjectNameChange}
                  defaultValue={projectName}
                  color='myCustomColor'
                  focused
                  InputProps={{
                    style: {
                      color: 'white',
                    },
                  }}
                  sx={{ mt: 2, mb: 1 }}
                />
                <TextField
                  autoFocus
                  margin='dense'
                  id='name'
                  label='Description'
                  type='text'
                  fullWidth
                  variant='standard'
                  value={description}
                  onChange={handleDescriptionChange}
                  defaultValue={description}
                  color='myCustomColor'
                  focused
                  InputProps={{
                    style: {
                      color: 'white',
                    },
                  }}
                  sx={{ mt: 2, mb: 1 }}
                />
                <DialogTitle
                  sx={{
                    color: '#DEB992',
                  }}
                >
                  Active?
                </DialogTitle>
                <Select
                  value={isActiveProject === null ? '' : isActiveProject}
                  onChange={handleActiveChange}
                  width='600px'
                  sx={{
                    backgroundColor: 'white',
                  }}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </DialogContent>
              <DialogActions
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <center>
                  <Button
                    variant='contained'
                    onClick={handleEditSave}
                    style={{
                      backgroundColor: '#1ba098',
                      color: 'white',
                      width: '120px',
                      height: '30px',
                      fontSize: '12px',
                    }}
                    sx={{ ml: 'auto' }}
                  >
                    Save
                  </Button>
                </center>
              </DialogActions>
            </Dialog>
          </ThemeProvider>
          {showAlert && (
            <Alert severity='warning'>
              <AlertTitle>Warning</AlertTitle>
              Invalid Entry!
            </Alert>
          )}
        </Container>
      </>
    )
  }
}

export default Projects
