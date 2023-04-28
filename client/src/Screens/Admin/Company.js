import { Navigate, redirect } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { companyState, userState } from '../../globalstate'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #051622;
`

const FormContainer = styled(FormControl)`
  width: 300px;
  background-color: white;
`
const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  margin-top: 0;
  color: #1ba098;
`

const CompanyScreen = () => {
  const [user, setUser] = useRecoilState(userState)
  const [company, setCompany] = useRecoilState(companyState)
  const [companySelected, setCompanySelected] = useState(false)

  useEffect(() => {
    setCompany(null)
  }, [])

  const handleChange = (event) => {
    setCompany(event.target.value)
    setCompanySelected(true)
  }

  if (!user.isLoggedIn) {
    return <Navigate replace to='/' />
  } else if (!user.isAdmin) {
    return <Navigate replace to='/announcements' />
  } else {
    return companySelected ? (
      <Navigate replace to='/announcements' />
    ) : (
      <Container>
        <Title>Select Company</Title>
        <FormContainer>
          <InputLabel>Pick a company</InputLabel>
          <Select
            value={company === null ? '' : company}
            label='Pick a company'
            onChange={handleChange}
          >
            {user.companies.map((companyDto) => (
              <MenuItem key={companyDto.id} value={companyDto}>
                {companyDto.name}
              </MenuItem>
            ))}
          </Select>
        </FormContainer>
      </Container>
    )
  }
}

export default CompanyScreen
