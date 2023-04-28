import api from "./api"

export const getAnnouncements = async (id) => {
  const response = await api.get(`/company/${id}/announcements`)
  return response.data
}

export const saveAnnouncement = async (id, title, message, user) => {
  console.log("*********")
  console.log(user)
  console.log(title)
  console.log(message)

  const response = await api.post(`company/${id}/announcements`, {
    title: title,
    message: message,
    author: user,
  })
  return response.data
}
