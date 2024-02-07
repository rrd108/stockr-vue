<template>
  <div class="users login form">
    <div class="row align-center">
      <img alt="StokR logo" src="../assets/img/logo.png" />
    </div>
    <div class="row align-center">
      <h1>StockR</h1>
    </div>
    <div class="callout success" v-show="this.resetPassSuccess">
      A jelszó emlékeztető kiküldött egy emailt a megadott email címre a
      jelszavad visszaállításához.
    </div>

    <form @submit.prevent="login" v-show="!this.resetPassSuccess">
      <fieldset>
        <div v-if="hasError" class="callout warning">
          <legend>{{ $t('login.error') }}</legend>
        </div>
        <div class="input email required">
          <label for="email">Email</label>
          <input
            type="email"
            v-model="email"
            name="email"
            required="required"
            id="email"
            :class="{ 'callout warning': this.emailError }"
          />
          <div class="callout warning" v-show="this.emailError">
            Add meg az email címedet
          </div>
        </div>
        <div class="input password required">
          <label for="password">{{ $t('login.password') }}</label>
          <input
            type="password"
            v-model="password"
            name="password"
            required="required"
            id="password"
          />
        </div>

        <div class="input checkbox">
          <label for="remember-me">
            <input
              type="checkbox"
              name="remember_me"
              value="1"
              :checked="rememberme"
              id="remember-me"
            />{{ $t('login.rememberme') }}
          </label>
        </div>
      </fieldset>

      <div class="row align-center">
        <button class="button" type="submit">{{ $t('login.enter') }}</button>
      </div>

      <div class="row align-center">
        <div class="locale-changer">
          <select v-model="$i18n.locale">
            <option
              v-for="(lang, i) in $i18n.availableLocales"
              :key="`Lang${i}`"
              :value="lang"
            >
              {{ lang }}
            </option>
          </select>
        </div>
      </div>

      <div class="row align-center">
        <a @click="requestResetPass">Jelszó emlékeztető</a>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'StockRlogin',

  data() {
    return {
      email: '',
      emailError: false,
      password: '',
      rememberme: true,
      resetPassSuccess: false,
    }
  },

  // validations: {
  //   email: { required },
  //   password: { required },
  // },

  computed: {
    hasError() {
      return this.email && this.password && !this.$store.state.user
    },
  },

  created() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      this.$store.commit('saveUser', user)
      if (this.$router.history.current.query.redirect) {
        this.$router.push({ path: this.$router.history.current.query.redirect })
      }
    }
  },

  methods: {
    async login() {
      //      this.$v.$touch()
      //      if (!this.$v.$invalid) {
      axios({
        method: 'post',
        url: import.meta.env.VITE_API_URL + 'user-get-token.json',
        data: {
          email: this.email,
          password: this.password,
        },
      })
        .then((resp) => {
          this.$store.commit('saveUser', resp.data)
          if (this.rememberme) {
            resp.data.lastLogin = Date.now()
            localStorage.setItem('user', JSON.stringify(resp.data))
          }
        })
        .catch((err) => console.error(err))
      //      }
    },

    requestResetPass() {
      if (!this.email) {
        this.emailError = true
        return
      }
      axios
        .post(
          import.meta.env.VITE_API_URL +
            'app-users/request-reset-password.json',
          'reference=' + this.email
        )
        .then((response) => {
          this.resetPassSuccess = response
          this.emailError = false
        })
        .catch((error) => console.log(error))
    },
  },
}
</script>

<style scoped>
.login {
  margin: 3rem auto;
  width: 20rem;
  border: thin solid #aaa;
  padding: 2rem;
  box-shadow: 5px 10px 8px #aaa;
}
.login img {
  height: 5em;
  margin-bottom: 1rem;
}
</style>
