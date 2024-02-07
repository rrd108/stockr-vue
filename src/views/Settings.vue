<template>
  <form @submit.prevent="changePass">
    <div class="row">
      <div class="callout alert" v-show="!$v.password.strongPassword">
        {{
          $t(
            'password should be at least 6 characters and contain numbers and letters'
          )
        }}
      </div>
      <div class="callout alert" v-show="!$v.passwordre.sameAsPassword">
        {{ $t('password mismatch') }}
      </div>
    </div>

    <div class="row">
      <label for="password"
        ><i class="fi-key"> {{ $t('new password') }}</i></label
      >
      <input
        type="password"
        id="password"
        v-model.trim.lazy="$v.password.$model"
        required
      />
      <label for="passwordre"
        ><i class="fi-key"> {{ $t('confirm password') }}</i></label
      >
      <input
        type="password"
        id="passwordre"
        v-model.trim.lazy="$v.passwordre.$model"
        required
      />

      <button class="button" type="submit">{{ $t('save') }}</button>
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
