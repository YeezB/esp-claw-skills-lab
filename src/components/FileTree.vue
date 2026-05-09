<script setup lang="ts">
import { computed } from 'vue'
import { File, Folder } from '@lucide/vue'

const props = defineProps<{ files: string[] }>()
const emit = defineEmits<{ preview: [path: string] }>()

interface TreeNode {
  name: string
  path: string
  isDir: boolean
  children: TreeNode[]
}

const tree = computed(() => {
  const root: TreeNode[] = []
  const sorted = [...props.files].sort()

  for (const filePath of sorted) {
    const parts = filePath.split('/')
    let current = root
    let accPath = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!
      accPath = accPath ? `${accPath}/${part}` : part
      const isLast = i === parts.length - 1

      let existing = current.find((n) => n.name === part)
      if (!existing) {
        existing = {
          name: part,
          path: accPath,
          isDir: !isLast,
          children: [],
        }
        current.push(existing)
      }
      current = existing.children
    }
  }

  return root
})

function handleClick(node: TreeNode) {
  if (!node.isDir) {
    emit('preview', node.path)
  }
}
</script>

<template>
  <div class="file-tree">
    <template v-for="node in tree" :key="node.path">
      <div
        class="tree-item"
        :class="{ dir: node.isDir, file: !node.isDir }"
        @click="handleClick(node)"
      >
        <component :is="node.isDir ? Folder : File" :size="14" class="tree-icon" />
        <span>{{ node.name }}</span>
      </div>
      <div v-if="node.isDir && node.children.length" class="tree-children">
        <div
          v-for="child in node.children"
          :key="child.path"
          class="tree-item file child-item"
          @click="handleClick(child)"
        >
          <component :is="child.isDir ? Folder : File" :size="14" class="tree-icon" />
          <span>{{ child.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.file-tree {
  font-size: 0.85rem;
  font-family: 'IBM Plex Mono', monospace;
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition:
    background 0.15s,
    color 0.15s;
}

.tree-item.file {
  cursor: pointer;
}

.tree-item.file:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.tree-icon {
  flex-shrink: 0;
  opacity: 0.6;
}

.tree-item.dir .tree-icon {
  color: var(--accent-soft);
  opacity: 0.8;
}

.tree-children {
  padding-left: 1.25rem;
  border-left: 1px solid var(--border);
  margin-left: 0.5rem;
}

.child-item {
  font-size: 0.82rem;
}
</style>
