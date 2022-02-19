import request from '@/utils/request'

export function add(data) {
return request({
url: 'api/SpotMarket',
method: 'post',
data
})
}

export function del(ids) {
return request({
url: 'api/SpotMarket/',
method: 'delete',
data: ids
})
}

export function edit(data) {
return request({
url: 'api/SpotMarket',
method: 'put',
data
})
}
export function queryMarketAll() {
return request({
url: 'api/SpotMarket/queryMarketAll',
method: 'Get'
})
}


export default { add, edit, del,queryMarketAll}
