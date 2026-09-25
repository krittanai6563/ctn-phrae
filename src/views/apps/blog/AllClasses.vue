<script setup lang="ts">
import { ref } from "vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import blogPosts from "@/components/apps/blog/blogPostsAll.vue";

const page = ref({ title: "คลาสทั่วไป" });
const breadcrumbs = ref([
  {
    text: "คลาสทั้งหมด",
    disabled: true,
    href: "#",
  },
]);
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>

  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <blogPosts/>
    </div>
  </div>
</template>
