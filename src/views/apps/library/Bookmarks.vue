<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import blogCardGrid from '@/components/apps/blog/blogCardGrid.vue';
import { useBlogStore } from '@/stores/apps/blog';

const store = useBlogStore();
onMounted(() => store.fetchPosts());
const bookmarks = computed(() => store.bookmarkedPosts);
</script>

<template>
  <BaseBreadcrumb title="บุ๊คมาร์ก" :breadcrumbs="[{ text: 'เมนูหลัก', href: '#' }, { text: 'บุ๊คมาร์ก', href: '#' }]" />
  <div class="flex w-full flex-col gap-6 pb-10">
    <section v-if="bookmarks.length" class="grid grid-cols-12 gap-6">
      <blogCardGrid v-for="bookmark in bookmarks" :key="bookmark.id || bookmark.title" :post="bookmark" />
    </section>
    <section v-else class="rounded-lg border border-dashed border-ld bg-card px-6 py-16 text-center">
      <Icon icon="solar:star-linear" class="mx-auto size-12 text-muted-foreground" />
      <h2 class="mt-4 text-lg font-semibold text-foreground">ยังไม่มีคลาสที่บันทึกไว้</h2>
      <p class="mt-2 text-sm text-muted-foreground">กดไอคอนดาวบนการ์ดคลาสเพื่อเพิ่มบุ๊คมาร์ก</p>
    </section>
  </div>
</template>
