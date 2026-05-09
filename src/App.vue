<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <div class="site-container">
    <SiteHeader />
    <main>
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.site-container {
  max-width: 85em;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg-base);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.5);
}

main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
</style>
