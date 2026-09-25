<script setup lang="ts">
import { ref } from "vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import joinedBlogPosts from "@/components/apps/blog/joinedBlogPosts.vue";

const page = ref({ title: "เข้าร่วมคลาส" });
const breadcrumbs = ref([
  {
    text: "คลาสที่เข้าร่วม",
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
      <joinedBlogPosts/>
    </div>
  </div>
</template>
