<template>
  <div class="container d-flex align-items-center justify-content-center flex-column">
    <img src="~/assets/loading.svg" alt="Loading..." width="80px">
    Logging in...
  </div>
</template>

<style scoped>
.container {
  min-height: 70vh;
}
</style>

<script>
import queryString from 'query-string'

export default {
    created() {
        const provider = this.$auth.$state.strategy
        const callbackParams = queryString.parse(this.$auth.ctx.from.hash)

        this.$axios.post(`/server/rest-auth/${provider}/`, {
                access_token: callbackParams.access_token,
                code: callbackParams.code
            })
            .then((response) => {
                const data = response.data
                this.$auth.setToken(provider, data.token)
                this.$auth.setUser(data.user)
                this.$auth.setUserToken(`JWT ${data.token}`)
                this.$router.push('/secure')
            })
            .catch(() => {
                this.$auth.logout()
                this.$router.push('/')
            })
    }
}
</script>