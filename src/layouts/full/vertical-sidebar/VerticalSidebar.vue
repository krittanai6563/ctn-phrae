<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,

  SidebarMenu,
} from "@/components/ui/sidebar";
import sidebarItems from "./sidebarItems";

import simplebar from "simplebar-vue";

import LayoutVerticalSidebarNavGroup from "./NavGroup/NavGroup.vue";
import LayoutVerticalSidebarNavCollapse from "./NavCollapse/NavCollapse.vue";
import LayoutVerticalSidebarNavItems from "./NavItems/NavItems.vue";

import LayoutLogo from "../logo/Logo.vue";



const isHovered = ref(false);
onMounted(() => {
  const wrapper = document.querySelector(".sidebar-wrapper");
  const sidebar = document.querySelector('[data-slot="sidebar"]');

  if (!wrapper || !sidebar) return;

  let wasExpandedByHover = false;

  wrapper.addEventListener("mouseenter", () => {
    if (sidebar.getAttribute("data-state") === "collapsed") {
      sidebar.setAttribute("data-state", "expanded");
      sidebar.removeAttribute("data-collapsible");
      wasExpandedByHover = true;
      isHovered.value = true;
    }
  });

  wrapper.addEventListener("mouseleave", () => {
    if (wasExpandedByHover) {
      sidebar.setAttribute("data-state", "collapsed");
      sidebar.setAttribute("data-collapsible", "icon");
      wasExpandedByHover = false;
      isHovered.value = false;
    }
  });


});





</script>

<template>
  <Sidebar data-slot="sidebar" collapsible="icon" class="sidebar  bg-card pb-6"
    :class="{ 'shadow-sm z-[41] fixed': isHovered }" side="left">
    <!-- Brand Logo -->
    <SidebarHeader class="pt-4 pb-3 relative whitespace-nowrap h-fit">
      <LayoutLogo />
    </SidebarHeader>

    <!-- Sidebar Content -->
    <SidebarContent class="overflow-hidden">
      <simplebar class="h-[calc(100vh_-_100px)]">
        <SidebarMenu>
          <!---Menu Loop -->
          <template v-for="item in sidebarItems" :key="item.title">
            <!--If Has Caption-->
            <LayoutVerticalSidebarNavGroup v-if="item.header" :item="item" />
            <!---If Has Child -->
            <LayoutVerticalSidebarNavCollapse :item="item" :level="0" v-else-if="item.children" />

            <LayoutVerticalSidebarNavItems v-else :item="item" />
          </template>
          <!---Menu Loop End-->
        </SidebarMenu>
      </simplebar>
    </SidebarContent>
  </Sidebar>
</template>
