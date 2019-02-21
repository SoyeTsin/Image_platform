import axios from 'axios';
import {Message} from 'element-ui';
import router from '../router'
import Vue from 'vue'

axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'https://121.12.84.99:8080';


//http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = getCookie('token');//注意使用的时候需要引入cookie方法，推荐js-cookie
    const userId = getCookie('userId');//注意使用的时候需要引入cookie方法，推荐js-cookie
    const phoneNum = getCookie('phoneNum');//注意使用的时候需要引入cookie方法，推荐js-cookie
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
    if (response.data.code == '000100') {
      router.push({
        path: "/login",
        querry: {redirect: router.currentRoute.fullPath}//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)

function getCookie(name) {
  let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

/**
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


