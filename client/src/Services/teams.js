import api from './api'

export const getProjectsByTeam = async (companyId, teamId) => {
  const response = await api.get(
    `/company/${companyId}/teams/${teamId}/projects`,
    {}
  )
  return response.data
}

export const createTeam = async (authorId, companyId, teamDto) => {
  // console.log(teamDto)

  const response = await api.post(
    `/team/${authorId}/company/${companyId}`,
    teamDto
  )

  // console.log(response.data)
  return response.data;
}

export const getTeamById = async (teamId) => {
  const response = await api.get(`/team/${teamId}`)
  return response.data
}

export const addTeamToCompany = async (companyId) => {
  const response = await api.get(`company/${companyId}/teams`)
  return response.data
}
