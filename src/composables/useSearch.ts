import { ref, watch } from 'vue'
import MiniSearch from 'minisearch'
import { useSkillsStore } from '@/stores/skills'
import type { SkillData } from '@/types/skill'

interface ParsedSearchQuery {
  text: string
  tags: string[]
  peripherals: string[]
}

const FILTER_PATTERN = /\b(tag|t|peripheral|peripherals):(?:"([^"]+)"|([^\s]+))/gi

function normalizeFilterValue(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function parseSearchQuery(query: string): ParsedSearchQuery {
  const tags: string[] = []
  const peripherals: string[] = []

  const text = query
    .replace(
      FILTER_PATTERN,
      (_, filterType: string, quoted: string | undefined, bare: string | undefined) => {
        const rawValue = (quoted ?? bare ?? '').trim()
        if (!rawValue) return ' '

        if (['tag', 't'].includes(filterType.toLocaleLowerCase())) {
          tags.push(rawValue)
        } else {
          peripherals.push(rawValue)
        }
        return ' '
      },
    )
    .replace(/\s+/g, ' ')
    .trim()

  return { text, tags, peripherals }
}

function getTagValues(skill: SkillData): Set<string> {
  return new Set(
    [
      ...(skill.metadata.tags ?? []),
      ...(skill.metadata.category ?? []),
      ...(skill.metadata.peripherals ?? []),
    ].map(normalizeFilterValue),
  )
}

function getPeripheralValues(skill: SkillData): Set<string> {
  return new Set((skill.metadata.peripherals ?? []).map(normalizeFilterValue))
}

function matchesFilters(skill: SkillData, parsedQuery: ParsedSearchQuery): boolean {
  const tagValues = getTagValues(skill)
  const peripheralValues = getPeripheralValues(skill)

  return (
    parsedQuery.tags.every((tag) => tagValues.has(normalizeFilterValue(tag))) &&
    parsedQuery.peripherals.every((peripheral) =>
      peripheralValues.has(normalizeFilterValue(peripheral)),
    )
  )
}

export function useSearch() {
  const store = useSkillsStore()
  const results = ref<SkillData[]>([])
  const miniSearch = ref<MiniSearch<SkillData> | null>(null)

  function buildIndex() {
    const ms = new MiniSearch<SkillData>({
      fields: ['name', 'description', 'title'],
      storeFields: ['id'],
      idField: 'id',
      searchOptions: {
        boost: { name: 2, title: 1.5 },
        fuzzy: 0.2,
        prefix: true,
      },
    })
    ms.addAll(store.skills)
    miniSearch.value = ms
  }

  watch(
    () => store.loaded,
    (loaded) => {
      if (loaded) buildIndex()
    },
    { immediate: true },
  )

  function search(query: string) {
    store.searchQuery = query
    if (!query.trim()) {
      results.value = []
      return
    }
    if (!miniSearch.value) {
      results.value = []
      return
    }

    store.activeCategory = 'all'
    const parsedQuery = parseSearchQuery(query)
    const searchBase = parsedQuery.text
      ? miniSearch.value
          .search(parsedQuery.text)
          .map((hit) => store.skills.find((s) => s.id === hit.id))
          .filter((s): s is SkillData => s !== undefined)
      : store.skills

    results.value = searchBase.filter((skill) => matchesFilters(skill, parsedQuery))
  }

  return { results, search }
}
