import axios from 'axios'
import { getToken } from '@/utils/auth'

export function upload(api, file) {
  var data = new FormData()
  data.append('upfile', file)
  const config = {
    headers: { 'Authorization': getToken() }
  }
  return axios.post(api, data, config)
}
