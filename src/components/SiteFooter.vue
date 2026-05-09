<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <a href="https://www.espressif.com" class="footer-brand" target="_blank" rel="noopener">
      <span class="footer-text">
        {{ t('footer.copyrightPrefix', { year }) }}
        <span class="footer-text-highlight">{{ t('footer.company') }}</span>
      </span>
    </a>
    <div class="footer-links">
      <a :href="t('footer.skillsLicenseLink')" target="_blank" rel="noopener">
        {{ t('footer.skillsLicense') }}
      </a>
      <a :href="t('footer.termsLink')" target="_blank" rel="noopener">
        {{ t('footer.terms') }}
      </a>
      <a :href="t('footer.privacyLink')" target="_blank" rel="noopener">
        {{ t('footer.privacy') }}
      </a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  border-top: 1px solid var(--border);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.015), transparent 65%), rgba(10, 11, 14, 0.82);
  backdrop-filter: blur(10px);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.footer-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: color 0.15s;
}

.footer-text-highlight {
  font-weight: 600;
}

.footer-brand:hover .footer-text {
  color: var(--text-secondary);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.footer-links a {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-links a:hover {
  color: var(--text-secondary);
}

@media (max-width: 700px) {
  .footer {
    flex-direction: column;
    gap: 0.9rem;
    text-align: center;
    padding: 1rem 1.25rem 1.25rem;
  }
}
</style>
