import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

export type Lang = 'zh-cn' | 'en'

export const SUPPORTED_LANGS: { id: Lang; label: string }[] = [
  { id: 'zh-cn', label: '中文' },
  { id: 'en', label: 'English' },
]

export const DEFAULT_LANG: Lang = 'zh-cn'

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LANG,
  fallbackLocale: 'en',
  messages: {
    'zh-cn': zh,
    en,
  },
})

export default i18n
