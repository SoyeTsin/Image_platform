import axios from 'axios';
import {Message} from 'element-ui';
import router from '../router'
import Vue from 'vue'

axios.defaults.timeout = 10000;
axios.defaults.baseURL = 'https://generic-stg1.yingxiang.pingan.com:8080';
// axios.defaults.baseURL = '';

//http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');//注意使用的时候需要引入cookie方法，推荐js-cookie
    const userId = localStorage.getItem('userId');//注意使用的时候需要引入cookie方法，推荐js-cookie
    const phoneNum = localStorage.getItem('phoneNum');//注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
    }
    if (token) {
      config.headers.token = token
      config.headers.userId = userId
      config.headers.phoneNum = phoneNum
    }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code == '000100' || response.data.code == '000099' || response.data.code == '001099' || response.data.code == '001100') {
      let routerPath = decodeURIComponent(localStorage.getItem('routerPath') || '/login')
      router.push({
        path: routerPath,
        querry: {redirect: router.currentRoute.fullPath}//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 *
 *
 *
 *
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

