<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search } from '@lucide/vue'
import { useSkillsStore } from '@/stores/skills'

const { t } = useI18n()
const emit = defineEmits<{ search: [query: string] }>()
const store = useSkillsStore()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function onInput() {
  emit('search', query.value)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === '/' && document.activeElement !== inputRef.value) {
    e.preventDefault()
    inputRef.value?.focus()
  }
  if (e.key === 'Escape') {
    inputRef.value?.blur()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})

watch(
  () => store.searchQuery,
  (value) => {
    query.value = value
  },
  { immediate: true },
)
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrap">
      <Search :size="16" class="search-icon" />
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="t('hero.searchPlaceholder')"
        class="search-input"
        @input="onInput"
      />
      <span class="search-shortcut">/</span>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 540px;
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 2.75rem;
  font-size: 0.95rem;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(232, 54, 45, 0.1);
}

.search-shortcut {
  position: absolute;
  right: 1rem;
  font-size: 0.75rem;
  font-family: 'IBM Plex Mono', monospace;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
  pointer-events: none;
}

.search-input:focus ~ .search-shortcut {
  opacity: 0;
}
</style>
