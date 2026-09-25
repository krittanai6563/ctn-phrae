<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useBlogStore } from "@/stores/apps/blog";
import blogCardGrid from "./blogCardGrid.vue";

const store = useBlogStore();

onMounted(() => {
  store.fetchPosts();
});

const getPosts = computed(() => {
  return store.blogposts;
});
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- All Classroom Cards -->
    <template v-for="(post) in getPosts" :key="post.id">
      <blogCardGrid :post="post" />
    </template>
  </div>
</template>
