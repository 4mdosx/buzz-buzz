import { urlParse } from '../deps.ts'
import { logger } from '../logger.ts'

function callFetch (input: RequestInfo, init: RequestInit = {}) {
  init.headers = {}
  if (init.body) init.headers['content-type'] = 'application/json; charset=utf-8'

  return fetch(input, init)
    .then(res => {
      const type: string = res.headers?.get('Content-Type') || ''
      if (type.includes('application/json')) {
        return res.json()
      } else {
        return res.text()
      }
    }).then(data => {
      if (data.ok) {
        return data.result
      } else {
        const message = data.error_code ? `${data.error_code}:${data.description}` : data
        logger.error(message)
        throw new Error(message)
      }
    })
}

interface RequestOptions {
  params?: any
  body?: object
}

export default class Client {
  private readonly baseURL: string
  constructor(token: string) {
    this.baseURL = `https://api.telegram.org/bot${token}`
  }

  private urlMaker (input: string, params: object | null) {
    const url: any= urlParse(this.baseURL)

    return urlParse({
      protocol: url.protocol,
      hostname: url.hostname,
      pathname: url.pathname + input,
      query:  params ? Object.entries(params).map(([key, value]) => ({ key, value})) : null
    }).toString()
  }


  get (input: string, params?: any, init: RequestInit = {}) {
    const url = this.urlMaker(input, params)
    return callFetch(url, init)
  }

  post (input: string, { params, body }: RequestOptions = { params: null, body: undefined } , init: RequestInit = {}) {
    const url = this.urlMaker(input, params)
    if (body) init.body = JSON.stringify(body)
    init.method = 'POST'
    return callFetch(url, init)
  }

  put (input: string, { params, body }: RequestOptions = { params: null, body: undefined }, init: RequestInit = {}) {
    const url = this.urlMaker(input, params)
    if (body) init.body = JSON.stringify(body)
    init.method = 'PUT'
    return callFetch(url, init)
  }

  del (input: string, { params, body }: RequestOptions = { params: null, body: undefined }, init: RequestInit = {}) {
    const url = this.urlMaker(input, params)
    if (body) init.body = JSON.stringify(body)
    init.method = 'DELETE'
    return callFetch(url, init)
  }
}
