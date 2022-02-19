import request from '@/utils/request'

export function add(data) {
return request({
url: 'api/RobotConfig',
method: 'post',
data
})
}

export function del(ids) {
return request({
url: 'api/RobotConfig/',
method: 'delete',
data: ids
})
}

export function edit(data) {
return request({
url: 'api/RobotConfig',
method: 'put',
data
})
}
export function queryAll() {
return request({
url: 'api/RobotConfig/queryAll',
method: 'get'
})
}


export default { add, edit, del,queryAll }
