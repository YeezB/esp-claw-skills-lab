<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { highlightCode, normalizeHighlightLanguage } from '@/utils/highlight'

const props = defineProps<{ content: string }>()

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(code, language) {
    const normalized = normalizeHighlightLanguage(language)
    const className = normalized ? ` class="hljs language-${normalized}"` : ''
    return `<pre><code${className}>${highlightCode(code, language)}</code></pre>`
  },
})

const renderedHtml = computed(() => {
  const raw = md.render(props.content)
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'hr',
      'ul',
      'ol',
      'li',
      'strong',
      'em',
      'del',
      'code',
      'pre',
      'blockquote',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'span',
      'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
  })
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="md-preview" v-html="renderedHtml" />
</template>

<style scoped>
.md-preview {
  font-size: 0.92rem;
  line-height: 1.75;
  color: var(--text-secondary);
}

.md-preview :deep(h1),
.md-preview :deep(h2),
.md-preview :deep(h3) {
  color: var(--text-primary);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.md-preview :deep(h1) {
  font-size: 1.5rem;
}
.md-preview :deep(h2) {
  font-size: 1.15rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
}
.md-preview :deep(h3) {
  font-size: 1rem;
}

.md-preview :deep(p) {
  margin-bottom: 0.75rem;
}

.md-preview :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85em;
  background: var(--bg-surface);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  color: var(--accent-soft);
}

.md-preview :deep(pre) {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.md-preview :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--text-primary);
  font-size: 0.82rem;
}

.md-preview :deep(.hljs) {
  display: block;
  overflow-x: auto;
  color: inherit;
  background: transparent;
}

.md-preview :deep(ul),
.md-preview :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.md-preview :deep(li) {
  margin-bottom: 0.3rem;
}

.md-preview :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  color: var(--text-muted);
  margin: 1rem 0;
}

.md-preview :deep(a) {
  color: var(--accent-soft);
  text-decoration: underline;
  text-decoration-color: rgba(232, 54, 45, 0.3);
}

.md-preview :deep(a:hover) {
  text-decoration-color: var(--accent-soft);
}

.md-preview :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5rem 0;
}

.md-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.md-preview :deep(th),
.md-preview :deep(td) {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.85rem;
}

.md-preview :deep(th) {
  background: var(--bg-surface);
  color: var(--text-primary);
  font-weight: 600;
}
</style>
