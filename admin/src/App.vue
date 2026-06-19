<script setup lang="ts">
</script>

<template>
  <div class="app">
    <nav class="topbar">
      <span class="logo">Portfolio Admin</span>
      <a href="http://localhost:3000" target="_blank" class="view-site">View Site →</a>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; background: #f5f5f7; color: #1d1d1f; }
.app { min-height: 100vh; }
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; height: 3rem; background: rgba(255,255,255,0.72); backdrop-filter: saturate(180%) blur(20px); border-bottom: 1px solid rgba(0,0,0,0.06); }
.logo { font-weight: 600; font-size: 0.9rem; }
.view-site { font-size: 0.8rem; color: #0071e3; text-decoration: none; }
.view-site:hover { text-decoration: underline; }
</style>
