<script setup lang="ts">
import { ref } from "vue";
// common components
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import blogPosts from "@/components/apps/blog/blogPosts-classroom.vue";
// template breadcrumb
const page = ref({ title: "คลาสของฉัน" });
const breadcrumbs = ref([
  {
    text: "คลาสของฉัน",
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
