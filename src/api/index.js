import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export const getBanners = () => api.get('/banners')
export const getHotNovels = () => api.get('/novels?type=hot')
export const getNovelsByCategory = (category) => api.get(`/novels?category=${category}`)
export const getNovelDetail = (id) => api.get(`/novels/${id}`)
export const getRanks = (type) => api.get(`/ranks?type=${type}`)
export const getRecommendList = () => api.get('/recommends')
export const getCategories = () => api.get('/categories')
export const getAllNovels = () => api.get('/novels')
export const login = (data) => api.post('/login', data)
export const register = (data) => api.post('/register', data)

export const searchNovels = async (keyword) => {
  const response = await getAllNovels()
  const novels = response.data
  const lowerKeyword = keyword.toLowerCase()
  return novels.filter(novel => {
    return (
      novel.title.toLowerCase().includes(lowerKeyword) ||
      novel.author.toLowerCase().includes(lowerKeyword) ||
      novel.category.toLowerCase().includes(lowerKeyword) ||
      novel.description.toLowerCase().includes(lowerKeyword)
    )
  })
}

export default api
