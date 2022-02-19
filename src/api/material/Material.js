import request from '@/utils/request'

export function add(data) {
return request({
url: 'api/Material',
method: 'post',
data
})
}

export function del(ids) {
return request({
url: 'api/Material/',
method: 'delete',
data: ids
})
}

export function edit(data) {
return request({
url: 'api/Material',
method: 'put',
data
})
}

export function queryAll() {
return request({
url: 'api/MaterialGroup/queryAll',
method: 'get'
})
}


export default { add, edit, del ,queryAll}
