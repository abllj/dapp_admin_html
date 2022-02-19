import request from '@/utils/request'

export function add(data) {
return request({
url: 'api/EthAddress',
method: 'post',
data
})
}

export function del(ids) {
return request({
url: 'api/EthAddress/',
method: 'delete',
data: ids
})
}

export function edit(data) {
return request({
url: 'api/EthAddress',
method: 'put',
data
})
}

export default { add, edit, del }
