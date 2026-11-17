<template>
  <footer class="deck-footer">
    <span class="brand">strands<span class="brand-separator">/</span><span class="brand-product">box</span></span>
    <span class="deck-description">AI agent sandboxes</span>
    <span class="page-number">{{ String($slidev.nav.currentPage).padStart(2, '0') }} <span>/ {{ String($slidev.nav.total).padStart(2, '0') }}</span></span>
  </footer>
</template>
