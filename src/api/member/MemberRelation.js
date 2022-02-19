import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/MemberRelation',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/MemberRelation/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/MemberRelation',
    method: 'put',
    data
  })
}
export function ownGet(params) {
  return request({
    url: 'api/MemberRelation/selectUserSon',
    params
  })
}

export default { add, edit, del }
