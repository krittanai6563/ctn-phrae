<script setup lang="ts">
import { ref } from "vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import BlogPostsClassroom from "@/components/apps/blog/blogPosts-classroom.vue";

const page = ref({ title: "สร้างคลาสใหม่" });
const breadcrumbs = ref([
  { text: "คลาสของฉัน", disabled: false, href: "/apps/blog/post" },
  { text: "สร้างคลาสใหม่", disabled: true, href: "#" },
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <BlogPostsClassroom :as-page="true" />
    </div>
  </div>
</template>
