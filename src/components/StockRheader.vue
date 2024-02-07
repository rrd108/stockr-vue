<script setup>
  import { ref } from 'vue'
  import { useStockrStore } from '@/stores'
  import { useRouter } from 'vue-router'

  const store = useStockrStore()
  const router = useRouter()

  const inMasterDataMenu = ref(false)
  const inInvoicesMenu = ref(false)
  const inStockMenu = ref(false)
  const inUserMenu = ref(false)

  const logout = () => {
    store.user = {}
    localStorage.removeItem('user')
    router.push('/')
  }
</script>

<template>
  <header>
    <nav>
      <div class="top-bar">
        <div class="top-bar-left" id="top-bar-left">
          <ul class="dropdown menu">
            <li><img alt="StokR logo" src="../assets/img/logo.png" /></li>
            <li>
              <router-link to="/">
                <i class="fi-home"><span> Főoldal</span></i>
              </router-link>
            </li>
            <li @mouseenter="inInvoicesMenu = true" @mouseleave="inInvoicesMenu = false" class="is-dropdown-submenu-parent">
              <router-link to="/invoices">
                <i class="fi-book"><span> Számlák</span></i>
              </router-link>
              <ul class="nested vertical menu" v-show="inInvoicesMenu">
                <li>
                  <router-link to="/invoices"><i class="fi-book"> Számlák</i></router-link>
                </li>
                <li>
                  <router-link to="/add-invoice"><i class="fi-plus"> Új számla</i></router-link>
                </li>
              </ul>
            </li>
            <li @mouseenter="inStockMenu = true" @mouseleave="inStockMenu = false" class="is-dropdown-submenu-parent">
              <router-link to="/stock"
                ><i class="fi-list-thumbnails"> <span>Készlet</span></i></router-link
              >
              <ul v-show="inStockMenu" class="nested menu">
                <li>
                  <router-link to="/stock"><i class="fi-list-thumbnails"> Készlet</i></router-link>
                </li>
                <li>
                  <router-link to="/stock@date"><i class="fi-list-thumbnails"> Készlet adott napon</i></router-link>
                </li>
                <li>
                  <router-link to="/stock-rotation"><i class="fi-list-thumbnails"> Készlet forgás</i></router-link>
                </li>
              </ul>
            </li>
            <li
              @mouseenter="inMasterDataMenu = true"
              @mouseleave="inMasterDataMenu = false"
              class="is-dropdown-submenu-parent"
            >
              <a href="#"
                ><i class="fi-widget"> <span>Törzsadat</span></i></a
              >
              <transition name="reveal-fade">
                <ul class="nested vertical menu" v-show="inMasterDataMenu">
                  <li>
                    <router-link to="/add-product"><i class="fi-foot"> Új termék</i></router-link>
                  </li>
                  <li>
                    <router-link to="/add-partner"><i class="fi-torsos"> Új partner</i></router-link>
                  </li>
                  <li>
                    <router-link to="/partners"><i class="fi-torsos"> Partnerek</i></router-link>
                  </li>
                </ul>
              </transition>
            </li>
            <li>
              <router-link to="/help"
                ><i class="fi-info"><span> Súgó</span></i></router-link
              >
            </li>
          </ul>
        </div>

        <div class="top-bar-right" id="top-bar-right">
          <ul class="menu">
            <li v-if="store.company.name">
              <a href="#" @click.prevent="store.company = {}">
                <i class="fi-torso"
                  ><span> {{ store.company.name }}</span></i
                ></a
              >
            </li>
            <li @mouseenter="inUserMenu = true" @mouseleave="inUserMenu = false">
              <a href="/" @click.prevent="logout" title="logout"
                ><span>{{ store.user.email }} </span><i class="fi-power"></i
              ></a>
              <ul v-show="inUserMenu" class="nested menu">
                <li>
                  <a href="/" @click.prevent="logout" title="logout">Kilép <i class="fi-power"></i></a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

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

  .top-bar ul,
  .top-bar {
    background-color: #fff;
  }

  ul.dropdown li {
    margin: 0.2em 0.2em 0.2em 0;
  }

  .top-bar a:hover {
    background-color: #2c83b6;
    color: #fff;
    transition: background 0.5s, color 0.5s;
  }

  .nested {
    position: absolute;
    border-left: 0.3em solid #2c83b6;
    z-index: 10;
  }
  .nested li {
    white-space: nowrap;
    text-align: left;
  }

  .reveal-fade-enter-active {
    transition: all 0.3s ease;
  }
  .reveal-fade-leave-active {
    transition: all 0.2s ease;
  }
  .reveal-fade-enter-from {
    opacity: 0;
  }
  .reveal-fade-leave-active {
    opacity: 0;
  }
  @media screen and (max-width: 40em) {
    header span {
      display: none;
    }
    nav div > ul a,
    .dropdown.menu > li > a {
      padding: 0.5rem;
    }
    #top-bar-left {
      flex: 1 1 auto;
    }
    #top-bar-right {
      flex: 0 1 auto;
    }
    .router-link-exact-active span {
      display: inline;
      font-size: 0.75rem;
    }
  }
</style>
