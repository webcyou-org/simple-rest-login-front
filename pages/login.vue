<template>
    <div>
        <h2 class="text-center">
            Login
        </h2>
        <hr>
        <b-alert v-if="errorMessage" show variant="danger">
            {{ errorMessage }}
        </b-alert>
        <b-alert v-if="$auth.$state.redirect" show>
            You have to login before accessing to
            <strong>{{ $auth.$state.redirect }}</strong>
        </b-alert>
        <b-row align-h="center" class="pt-4">
            <b-col md="4">
                <b-card bg-variant="light">
                    <busy-overlay/>
                    <form @keydown.enter="login">
                        <b-form-group label="Email">
                            <b-input ref="email" v-model="email"/>
                        </b-form-group>

                        <b-form-group label="Password">
                            <b-input v-model="password" type="password"/>
                        </b-form-group>

                        <div class="text-center">
                            <b-btn variant="primary" block @click="login">
                                Login
                            </b-btn>
                        </div>
                    </form>
                </b-card>
            </b-col>
            <b-col md="1" align-self="center">
                <div class="text-center">
                    <b-badge pill>
                        OR
                    </b-badge>
                </div>
            </b-col>
            <b-col md="4" class="text-center">
                <b-card title="Social Login" bg-variant="light">
                    <div v-for="s in strategies" :key="s.key" class="mb-2">
                        <b-btn
                            block
                            :style="{background: s.color}"
                            class="login-button"
                            @click="$auth.loginWith(s.key)"
                        >
                            Login with {{ s.name }}
                        </b-btn>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<style scoped>
    .login-button {
        border: 0;
    }
</style>

<script>
import busyOverlay from '~/components/busy-overlay'

export default {
    middleware: ['auth'],
    components: {busyOverlay},
    data () {
        return {
            email: '',
            password: '',
            error: null
        }
    },
    computed: {
        strategies: () => [
            { key: 'google', name: 'Google', color: '#4284f4' }
        ],
        redirect () {
            return (
                this.$route.query.redirect &&
                decodeURIComponent(this.$route.query.redirect)
            )
        },
        isCallback () {
            return Boolean(this.$route.query.callback)
        },
        errorMessage () {
            const {error} = this
            if (!error || typeof error === 'string') {
                return error
            }
            let msg = ''
            if (error.message) {
                msg += error.message
            }
            if (error.errors) {
                msg += `(${JSON.stringify(error.errors)
                    .replace(/[{}"[\]]/g, '')
                    .replace(/:/g, ': ')
                    .replace(/,/g, ' ')})`
            }
            return msg
        }
    },
    methods: {
        async login () {
            this.error = null

            return this.$auth
                .loginWith('local', {
                    data: {
                        email: this.email,
                        password: this.password
                    }
                })
                .then(() => {
                    this.$router.push('/secure')
                })
                .catch((e) => {
                    this.error = e.response.data
                })
        }
    }
}
</script>
