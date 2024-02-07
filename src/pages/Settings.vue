<template>
  <form @submit.prevent="changePass">
    <div class="row">
      <div class="callout alert" v-show="!$v.password.strongPassword">
        A jelszónak legalább 6 karakternek kell lenni és tartalmaznia kell betűt
        és számot
      </div>
      <div class="callout alert" v-show="!$v.passwordre.sameAsPassword">
        A megadott jelszavak nem egyeznek meg egymással
      </div>
    </div>

    <div class="row">
      <label for="password"><i class="fi-key"> Új jelszó </i></label>
      <input
        type="password"
        id="password"
        v-model.trim.lazy="$v.password.$model"
        required
      />
      <label for="passwordre"
        ><i class="fi-key"> Jelszó megerősítése </i></label
      >
      <input
        type="password"
        id="passwordre"
        v-model.trim.lazy="$v.passwordre.$model"
        required
      />

      <button class="button" type="submit">Ment</button>
    </div>
  </form>
</template>

<script>
//import axios from 'axios'

export default {
  name: 'settings',
  data() {
    return {
      password: '',
      passwordre: '',
    }
  },
  // validations: {
  //   password: {
  //     required,
  //     strongPassword(password) {
  //       return (
  //         /[a-z]/.test(password) && // checks for a-z
  //         /[0-9]/.test(password) && // checks for 0-9
  //         ///\W|_/.test(password) && // checks for special char
  //         password.length >= 6
  //       )
  //     },
  //   },
  //   passwordre: {
  //     required,
  //     sameAsPassword: sameAs('password'),
  //   },
  // },
  methods: {
    changePass() {},
  },
}
</script>

<style></style>
