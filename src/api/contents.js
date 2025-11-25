import request from '@/utils/request'

const api = {
  // banner
  bannerlist: '/cmsapi/banner_list_v2',
  banneredit: '/cmsapi/editbanner_v2',
  banneradd: '/cmsapi/addbanner_v2',
  bannerdel: '/cmsapi/removebanner_v2',
  // articles
  questlist: '/cmsapi/quest_list_v2',
  questedit: '/cmsapi/editquest',
  questdel: '/cmsapi/removequest',
  questadd: '/cmsapi/addquest',
  //news
  pageListNews: '/cmsapi/news/page',
  delNews: '/cmsapi/news/del',
  addNews: '/cmsapi/news/add',
  editNews: '/cmsapi/news/update'
}

export default api

export function getNewsList(params) {
  return request({
    url: api.pageListNews,
    method: 'get',
    params
  })
}
export function delNews(params) {
  return request({
    url: api.delNews,
    method: 'get',
    params
  })
}
export function addNews(data) {
  return request({
    url: api.addNews,
    method: 'post',
    data
  })
}
export function editNews(data) {

  return request({
    url: api.editNews,
        method: 'post',
        data
  })
}

// banners api
export function getBannerList(params) {

  return request({
    url: api.bannerlist ,
    method: 'get',
params
  })
}
export function addBanner(data) {
  return request({
    url: api.banneradd,
    method: 'post',
    data
  })
}
export function editBanner(data) {
  return request({
    url: api.banneredit,
    method: 'post',
    data
  })
}
export function delBanner(data) {
  return request({
    url: api.bannerdel,
    method: 'post',
    data
  })
}

// articles
export function getQuestList(params) {
  return request({
    url: api.questlist ,
    method: 'get',
   params
  })
}
export function addQuest(data) {
  return request({
    url: api.questadd,
    method: 'post',
    data
  })
}
export function editQuest(data) {
  return request({
    url: api.questedit,
    method: 'post',
    data
  })
}
export function delQuest(parameter) {
  const params = `param=${JSON.stringify(parameter)}`
  return request({
    url: api.questdel,
    method: 'post',
    data: params
  })
}
