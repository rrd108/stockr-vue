<template>
  <div class="small-12 large-6 columns content">
    <h3>
      <i class="fi-torsos"> Partners</i>
      <router-link :to="`/${$i18n.locale}/add-partner`"><i class="fi-plus"></i></router-link>
    </h3>
    <section v-for="partner in this.$store.state.partners" :key="partner.id">
      <router-link :to="`/${$i18n.locale}/partners/${partner.id}`">
        <h4>{{ partner.name }}</h4>
        <ul>
          <li>{{ partner.taxnumber }}</li>
          <li>{{ partner.zip }} {{ partner.city }} {{ partner.address }}</li>
          <li>{{ partner.email }} {{ partner.phone }}</li>
          <li>{{ partner.group.name }}</li>
        </ul>
      </router-link>
    </section>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
h3 {
  display: flex;
  justify-content: space-between;
}
section a {color: #fff;}
h4 {
  font-size: 1.5rem;
}
section {
  background-color: #0192a5;
  color: #fff;
  padding: 1em;
  margin: 1em;
  border-radius: 0.5em;
}
ul {
  list-style: none;
}
</style>