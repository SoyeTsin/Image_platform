module.exports = {
  proxy: {
    '/api': {    //将www.exaple.com印射为/apis
      target: 'https://121.12.84.99:8080',  // 接口域名
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/apis': ''   //需要rewrite的,
      }
    }
  }
}
