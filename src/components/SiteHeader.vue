<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Languages, ChevronDown, Menu, X, Upload } from '@lucide/vue'
import { SUPPORTED_LANGS, type Lang } from '@/i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const currentLang = computed(() => (route.params.lang as Lang) || 'zh-cn')
const currentLangLabel = computed(
  () => SUPPORTED_LANGS.find((l) => l.id === currentLang.value)?.label ?? currentLang.value,
)

const espClawHomeUrl = computed(() => `https://esp-claw.com/${currentLang.value}/`)
const espClawDocUrl = computed(
  () => `https://esp-claw.com/${currentLang.value}/tutorial/skills-lab`,
)
const skillsLabGithubUrl = 'https://github.com/espressif/esp-claw-skills-lab'

function switchLang(lang: Lang) {
  const currentPath = route.path
  const newPath = currentPath.replace(/^\/(zh-cn|en)/, `/${lang}`)
  router.push(newPath)
}
</script>

<template>
  <nav class="nav">
    <RouterLink to="/" class="nav-brand">
      <span class="nav-logo-text">
        <span class="nav-logo-icon">
          <img src="@/assets/logo.svg" alt="ESP-Claw" class="nav-logo-icon-img" />
        </span>
        <span class="nav-logo-divider nav-brand-suffix">|</span>
        <span class="nav-brand-suffix">{{ t('nav.skillsLab') }}</span>
      </span>
    </RouterLink>

    <div class="nav-links">
      <a :href="espClawHomeUrl" target="_blank" rel="noopener">
        {{ t('nav.home') }}
      </a>
      <a :href="espClawDocUrl" target="_blank" rel="noopener">
        {{ t('nav.doc') }}
      </a>
      <RouterLink to="/" class="is-nav-active">
        {{ t('nav.skillsLab') }}
      </RouterLink>
      <a :href="skillsLabGithubUrl" target="_blank" rel="noopener">
        {{ t('nav.github') }}
      </a>
    </div>

    <div class="nav-right">
      <details class="lang-switcher">
        <summary>
          <Languages :size="14" />
          <span>{{ currentLangLabel }}</span>
          <ChevronDown :size="10" class="lang-chevron" />
        </summary>
        <ul class="lang-menu">
          <li v-for="loc in SUPPORTED_LANGS" :key="loc.id">
            <a
              :class="{ 'is-current': loc.id === currentLang }"
              href="#"
              @click.prevent="switchLang(loc.id)"
            >
              {{ loc.label }}
            </a>
          </li>
        </ul>
      </details>

      <a :href="`https://esp-claw.com/${currentLang}/tutorial/skills-lab#upload`" target="_blank" rel="noopener" class="btn-upload">
        <Upload :size="14" />
        {{ t('nav.upload') }}
      </a>
    </div>

    <details class="mobile-nav">
      <summary class="mobile-toggle" aria-label="Open menu">
        <Menu :size="18" class="icon-open" />
        <X :size="18" class="icon-close" />
      </summary>
      <div class="mobile-panel">
        <a :href="espClawHomeUrl" target="_blank" rel="noopener">
          {{ t('nav.home') }}
        </a>
        <a :href="espClawDocUrl" target="_blank" rel="noopener">
          {{ t('nav.doc') }}
        </a>
        <RouterLink to="/" class="is-nav-active">
          {{ t('nav.skillsLab') }}
        </RouterLink>
        <a :href="skillsLabGithubUrl" target="_blank" rel="noopener">
          {{ t('nav.github') }}
        </a>
        <details class="mobile-locale">
          <summary>
            <span class="mobile-locale-label">
              <Languages :size="14" />
              {{ currentLangLabel }}
            </span>
            <ChevronDown :size="14" class="mobile-locale-chevron" />
          </summary>
          <div class="mobile-locale-links">
            <a
              v-for="loc in SUPPORTED_LANGS"
              :key="loc.id"
              :class="{ 'is-current': loc.id === currentLang }"
              href="#"
              @click.prevent="switchLang(loc.id)"
            >
              {{ loc.label }}
            </a>
          </div>
        </details>
        <a :href="`https://esp-claw.com/${currentLang}/tutorial/skills-lab#upload`" target="_blank" rel="noopener" class="mobile-upload">
          <Upload :size="14" />
          {{ t('nav.upload') }}
        </a>
      </div>
    </details>
  </nav>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 1rem;
  padding: 0 2rem;
  height: 56px;
  background: rgba(10, 11, 14, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-brand {
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
  text-decoration: none;
}

.nav-logo-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.nav-logo-icon {
  font-size: 1.3rem;
}

.nav-logo-icon-img {
  width: 7rem;
  height: auto;
  justify-self: center;
  align-self: center;
  display: flex;
}

.nav-logo-divider {
  color: var(--text-muted);
  font-weight: 300;
}

.nav-brand-suffix {
  display: none;
}

.nav-links {
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-links a {
  color: var(--text-secondary);
  font-size: 0.875rem;
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-sm);
  transition:
    color 0.15s,
    background 0.15s;
}

.nav-links a:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-links a.is-nav-active {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
  font-weight: 500;
  text-decoration: none;
}

.nav-right {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lang-switcher {
  position: relative;
}

.lang-switcher > summary {
  list-style: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.3rem 0.55rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: transparent;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.lang-switcher > summary::-webkit-details-marker {
  display: none;
}

.lang-switcher > summary:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

.lang-chevron {
  opacity: 0.75;
}

.lang-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 9rem;
  padding: 0.35rem 0;
  margin: 0;
  list-style: none;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  z-index: 200;
}

.lang-menu a {
  display: block;
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition:
    background 0.12s,
    color 0.12s;
}

.lang-menu a:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
}

.lang-menu a.is-current {
  color: var(--accent-soft);
  font-weight: 600;
  pointer-events: none;
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-on-accent);
  background: var(--accent);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-sm);
  transition: opacity 0.15s;
}

.btn-upload:hover {
  opacity: 0.88;
}

.mobile-nav {
  display: none;
}

.mobile-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.mobile-toggle::-webkit-details-marker {
  display: none;
}

.mobile-nav[open] .icon-open {
  display: none;
}

.mobile-nav:not([open]) .icon-close {
  display: none;
}

.mobile-panel {
  display: none;
}

.mobile-panel a {
  display: flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 0.9rem;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition:
    color 0.15s,
    background 0.15s;
}

.mobile-panel a:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.mobile-panel a.is-nav-active {
  color: var(--accent-soft);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
}

.mobile-locale > summary {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 2.75rem;
  padding: 0 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.mobile-locale > summary::-webkit-details-marker {
  display: none;
}

.mobile-locale-label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.mobile-locale-chevron {
  opacity: 0.75;
  transition: transform 0.15s ease;
}

.mobile-locale[open] .mobile-locale-chevron {
  transform: rotate(180deg);
}

.mobile-locale-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.35rem 0.9rem 0.1rem;
}

.mobile-locale-links a {
  min-height: auto;
  padding: 0.35rem 0.7rem;
  font-size: 0.82rem;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.mobile-locale-links a.is-current {
  color: var(--accent-soft);
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.mobile-upload {
  justify-content: center;
  gap: 0.45rem;
  margin-top: 0.2rem;
  font-weight: 600;
  color: var(--text-on-accent) !important;
  background: var(--accent);
}

@media (max-width: 700px) {
  .nav {
    grid-template-columns: 1fr auto;
    padding: 0 1rem;
  }

  .nav-brand-suffix {
    display: inline;
  }

  .nav-links,
  .nav-right {
    display: none;
  }

  .mobile-nav {
    display: block;
    justify-self: end;
    position: relative;
  }

  .mobile-nav[open] .mobile-panel {
    position: absolute;
    top: calc(100% + 0.75rem);
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: min(18rem, calc(100vw - 2rem));
    padding: 0.8rem;
    background: rgba(18, 20, 24, 0.97);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(14px);
    z-index: 200;
  }
}
</style>
