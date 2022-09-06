/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */

// const domain="https://luck.catli.net";
const domain = "http://luckdraw.com";
export default {
  dev: {
    // localhost:8000/v1/api/** -> https://luck.catli.net/v1/api/**
    '/v1/api/': {
      // 要代理的地址
      target: domain,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
    '/static/': {
      // 要代理的地址
      target: domain,
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
  },
  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    '/v1/api/': {
      target: domain,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/v1/api/': {
      target: domain,
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
