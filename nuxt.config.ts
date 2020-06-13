import { Configuration } from '@nuxt/types'

const config: Configuration = {
    mode: 'spa',
    build: {
        extractCSS: true
    },
    buildModules: [
        '@nuxt/typescript-build'
    ],
    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/auth'
    ],
    axios: {
        proxy: true
    },
    proxy: {
        '/server/': {
            target: 'http://localhost:8000/',
            pathRewrite: { '^/server/': '' }
        }
    },
    auth: {
        cookie: false,
        redirect: {
            callback: '/callback',
            logout: '/signed-out',
            home: false
        },
        strategies: {
            local: {
                tokenType: 'JWT',
                endpoints: {
                    login: { url: '/server/rest-auth/login/', method: 'post', propertyName: 'token' },
                    user: { url: '/server/rest-auth/user/', method: 'get', propertyName: '' }
                }
            },
            google: {
                client_id: 'YOUR_GOOGLE_CLIENT_ID',
                response_type: 'code token',
                scope: ['email', 'profile'],
                userinfo_endpoint: '/server/rest-auth/user/'
            }
        }
    }
}

export default config
