import request from '@/utils/request'

/*
 统计提币
 */
export function statisticalWithdraw() {
  return request({
    url: '/api/home/withdraw',
    method: 'get'
  })
}
/*
 统计会员
 */
export function statisticalMember() {
  return request({
    url: '/api/home/member',
    method: 'get'
  })
}
/*
 统计提币
 */
export function statisticalRecharge() {
  return request({
    url: '/api/Recharge/statistical',
    method: 'get'
  })
}
export function statisticalRobotRevenue() {
  return request({
    url: '/api/RobotRevenue/statistical',
    method: 'get'
  })
}
/* 统计会员等级 */
export function statisticalMemberGrade() {
  return request({
    url: '/api/home/grade',
    method: 'get'
  })
}


