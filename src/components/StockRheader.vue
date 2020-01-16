<template>
    <header>
      <nav>
          <div class="top-bar">
              <div class="top-bar-left" id="top-bar-left">
                  <ul class="dropdown menu">
                      <li><img alt="StokR logo" src="../assets/img/logo.png"></li>
                      <li><router-link :to="`/${$i18n.locale}/`"><i class="fi-home"><span> Főoldal</span></i></router-link></li>
                      <li @mouseenter="inInvoicesMenu = true" @mouseleave="inInvoicesMenu = false" class="is-dropdown-submenu-parent">
                        <router-link :to="`/${$i18n.locale}/invoices`"><i class="fi-book"><span> {{$t("invoices")}}</span></i></router-link>
                        <ul class="nested vertical menu" v-show="inInvoicesMenu">
                          <li><router-link :to="`/${$i18n.locale}/invoices`"><i class="fi-book"> {{$t("invoices")}}</i></router-link></li>
                          <li><router-link :to="`/${$i18n.locale}/add-invoice`"><i class="fi-plus"> {{$t("new invoice")}}</i></router-link></li>
                        </ul>
                      </li>
                      <li @mouseenter="inStockMenu = true" @mouseleave="inStockMenu = false" class="is-dropdown-submenu-parent">
                        <router-link :to="`/${$i18n.locale}/stock`"><i class="fi-list-thumbnails"> <span>{{$t("stock")}}</span></i></router-link>
                        <ul v-show="inStockMenu" class="nested menu">
                          <li><router-link :to="`/${$i18n.locale}/stock`"><i class="fi-list-thumbnails"> {{$t("stock")}}</i></router-link></li>
                          <li><router-link :to="`/${$i18n.locale}/stock@date`"><i class="fi-list-thumbnails"> {{$t("stock at date")}}</i></router-link></li>
                        </ul>
                      </li>
                      <li @mouseenter="inMasterDataMenu = true" @mouseleave="inMasterDataMenu = false" class="is-dropdown-submenu-parent">
                        <a href="#"><i class="fi-widget"> <span>{{$t("master data")}}</span></i></a>
                        <transition name="reveal-fade">
                          <ul class="nested vertical menu" v-show="inMasterDataMenu">
                            <li><router-link :to="`/${$i18n.locale}/add-product`"><i class="fi-foot"> {{$t("add product")}}</i></router-link></li>
                            <li><router-link :to="`/${$i18n.locale}/add-partner`"><i class="fi-torsos"> {{$t("add partner")}}</i></router-link></li>
                          </ul>
                        </transition>
                      </li>
                      <li><router-link :to="`/${$i18n.locale}/help`"><i class="fi-info"><span> {{$t("help")}}</span></i></router-link></li>
                  </ul>
              </div>

              <div class="top-bar-right" id="top-bar-right">
                  <ul class="menu">
                    <li v-if="appCompany"><a href="#" @click.prevent="$store.commit('unsetCompany')">
                      <i class="fi-torso"><span> {{appCompany}}</span></i></a>
                    </li>
                    <li @mouseenter="inUserMenu = true" @mouseleave="inUserMenu = false">
                      <a href="/" @click.prevent="logout" title="logout"><span>{{this.$store.state.user.email}} </span><i class="fi-power"></i></a>
                      <ul v-show="inUserMenu" class="nested menu">
                        <li><a href="/" @click.prevent="logout" title="logout">{{$t("logout")}} <i class="fi-power"></i></a></li>
                        <!--<li><router-link :to="`/${$i18n.locale}/settings`">{{$t("settings")}} <i class="fi-widget"></i></router-link></li>-->
                      </ul>
                    </li>
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
      inMasterDataMenu : false,
      inInvoicesMenu: false,
      inStockMenu: false,
      inUserMenu: false,
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
       this.$router.push('/')
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
@media screen and (max-width: 40em) {
  header span {
    display: none;
  }
  nav div > ul a, .dropdown.menu > li > a {
    padding: .5rem;
  }
  #top-bar-left {
    flex: 1 1 auto;
  }
  #top-bar-right {
    flex: 0 1 auto;
  }
  .router-link-exact-active span {
    display: inline;
    font-size: .75rem;
  }
}
</style>