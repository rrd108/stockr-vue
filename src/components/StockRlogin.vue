<script setup>
  import { ref, computed } from 'vue'
  import axios from 'axios'
  import { useStockrStore } from '@/stores'

  const store = useStockrStore()

  const email = ref('')
  const password = ref('')
  const rememberme = ref(true)
  const resetPassSuccess = false
  const emailError = false

  const hasError = computed(() => email.value && password.value && !store.user)

  // const user = JSON.parse(localStorage.getItem('user'))
  // if (user) {
  //   console.log('user set from localStorage', user)
  //   store.user = user
  // }

  const login = () =>
    axios({
      method: 'post',
      url: import.meta.env.VITE_API_URL + 'user-get-token.json',
      data: {
        email: email.value,
        password: password.value,
      },
    })
      .then(resp => {
        if (resp.data.id) {
          store.user = resp.data
          if (rememberme.value) {
            resp.data.lastLogin = Date.now()
            localStorage.setItem('user', JSON.stringify(resp.data))
          }
        }
      })
      .catch(err => console.error(err))

  const requestResetPass = () => {
    if (!email.value) {
      emailError = true
      return
    }
    axios
      .post(import.meta.env.VITE_API_URL + 'app-users/request-reset-password.json', 'reference=' + email.value)
      .then(response => {
        resetPassSuccess = response
        emailError = false
      })
      .catch(error => console.log(error))
  }
</script>

<template>
  <div class="users login form">
    <div class="row align-center">
      <img alt="StokR logo" src="../assets/img/logo.png" />
    </div>
    <div class="row align-center">
      <h1>StockR</h1>
    </div>
    <div class="callout success" v-show="resetPassSuccess">
      A jelszó emlékeztető kiküldött egy emailt a megadott email címre a jelszavad visszaállításához.
    </div>

    <form @submit.prevent="login" v-show="!resetPassSuccess">
      <fieldset>
        <div v-if="hasError" class="callout warning">
          <legend>Hibás email vagy jelszó</legend>
        </div>
        <div class="input email required">
          <label for="email">Email</label>
          <input
            type="email"
            v-model="email"
            name="email"
            required="required"
            id="email"
            :class="{ 'callout warning': emailError }"
          />
          <div class="callout warning" v-show="emailError">Add meg az email címedet</div>
        </div>
        <div class="input password required">
          <label for="password"> Jelszó </label>
          <input type="password" v-model="password" name="password" required="required" id="password" />
        </div>

        <div class="input checkbox">
          <label for="remember-me">
            <input type="checkbox" name="remember_me" value="1" :checked="rememberme" id="remember-me" />
            Emlékezz rám
          </label>
        </div>
      </fieldset>

      <div class="row align-center">
        <button class="button" type="submit">Belép</button>
      </div>

      <div class="row align-center">
        <a @click="requestResetPass">Jelszó emlékeztető</a>
      </div>
    </form>
  </div>
</template>

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
