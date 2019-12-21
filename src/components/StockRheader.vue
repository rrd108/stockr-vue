<template>
    <header>
      <nav>
        <!--
          TODO responsive menu
        <div class="title-bar" data-responsive-toggle="navbar" data-hide-for="medium">
            <button class="menu-icon" type="button" data-toggle="navbar"></button>
            <div class="title-bar-title">Menu</div>
        </div>
        -->
          <div class="top-bar">
              <div class="top-bar-left">
                  <ul class="dropdown menu">
                      <li><img alt="StokR logo" src="../assets/img/logo.png"></li>
                      <li><router-link :to="`/${$i18n.locale}/`"><i class="fi-home"> Főoldal</i></router-link></li>
                      <li @mouseenter="inInvoices = true" @mouseleave="inInvoices = false" class="is-dropdown-submenu-parent">
                        <router-link :to="`/${$i18n.locale}/invoices`"><i class="fi-book"> {{$t("invoices")}}</i></router-link>
                        <ul class="nested vertical menu" v-show="inInvoices">
                          <li><router-link :to="`/${$i18n.locale}/invoices`"><i class="fi-book"> {{$t("invoices")}}</i></router-link></li>
                          <li><router-link :to="`/${$i18n.locale}/add-invoice`"><i class="fi-plus"> {{$t("new invoice")}}</i></router-link></li>
                        </ul>
                      </li>
                      <li><router-link :to="`/${$i18n.locale}/stock`"><i class="fi-list-thumbnails"> {{$t("stock")}}</i></router-link></li>
                      <li><router-link to="/todo"><i class="fi-upload"> Import</i></router-link></li>
                      <li @mouseenter="inMasterData = true" @mouseleave="inMasterData = false" class="is-dropdown-submenu-parent">
                        <router-link to="/todo"><i class="fi-widget"> Törzsadat</i></router-link>
                        <transition name="reveal-fade">
                          <ul class="nested vertical menu" v-show="inMasterData">
                            <li><router-link to="/todo"><i class="fi-torso-business"> Cégek</i></router-link></li>
                            <li><router-link to="/todo"><i class="fi-contrast"> {{$t("storages")}}</i></router-link></li>
                            <li><router-link to="/todo"><i class="fi-torsos"> {{$t("partners")}}</i></router-link></li>
                            <li><router-link to="/todo"><i class="fi-foot"> {{$t("products")}}</i></router-link></li>
                            <li><router-link to="/todo"><i class="fi-puzzle"> {{$t("groups")}}</i></router-link></li>
                            <li><router-link to="/todo"><i class="fi-shield"> {{$t("invoice types")}}</i></router-link></li>
                          </ul>
                        </transition>
                      </li>
                  </ul>
              </div>

              <div class="top-bar-right">
                  <ul class="menu">
                    <li v-if="appCompany"><a href="#" @click.prevent="$store.commit('unsetCompany')">
                      <i class="fi-torso"> {{appCompany}}</i></a>
                    </li>
                    <li><a href="/" @click.prevent="logout" title="logout">{{this.$store.state.user.email}} <i class="fi-power"></i></a></li>
                  </ul>
              </div>
          </div>
      </nav>
    </header>
</template>

<script>
export default {
  name: 'StockrHeader',

  data() {
    return {
      inMasterData : false,
      inInvoices: false,
    }
  },

  computed: {
    appCompany() {
      return this.$store.state.company.name;
    }
  },

  methods: {
    logout() {
      this.$store.commit('removeUser');
      localStorage.removeItem('user');
    }
  }
}
</script>

<style scoped>
header {
  text-align: center;
}

header a {
  font-weight: bold;
}

header a.router-link-exact-active {
  background-color: #2c83b6;
  color: #fff;
}

.top-bar ul, .top-bar {
    background-color: #fff
}

ul.dropdown li {
    margin: .2em .2em .2em 0;
}

.top-bar a:hover {
    background-color: #2c83b6;
    color: #fff;
    transition: background .5s, color .5s;
}

.nested {
  position: absolute;
  border-left: .3em solid #2c83b6;
  z-index: 10;
}
.nested li {
  white-space: nowrap;
  text-align: left;
}

.reveal-fade-enter-active {
  transition: all .3s ease;
}
.reveal-fade-leave-active {
  transition: all .2s ease;
}
.reveal-fade-enter {
  opacity: 0;
}
.reveal-fade-leave-to {
  opacity: 0;
}
</style>