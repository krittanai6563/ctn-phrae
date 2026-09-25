<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useBlogStore } from "@/stores/apps/blog";
import blogCardGrid from "./blogCardGrid.vue";
import Card from "@/components/ui/card/Card.vue";
import { Icon } from "@iconify/vue";

const store = useBlogStore();
const showJoinModal = ref(false);
const classCode = ref("");

onMounted(() => {
  store.fetchPosts();
});

const getPosts = computed(() => {
  return store.blogposts;
});

// แสดงเฉพาะ 50% ของโพสต์เป็นคลาสที่เข้าร่วม
const getJoinedPosts = computed(() => {
  return getPosts.value.slice(0, Math.ceil(getPosts.value.length / 2));
});

const handleJoinClass = () => {
  if (classCode.value.trim()) {
    alert(`เข้าร่วมคลาสด้วย code: ${classCode.value}`);
    classCode.value = "";
    showJoinModal.value = false;
  }
};
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Join Class Card -->
    <div class="col-span-12 lg:col-span-3 md:col-span-4 sm:col-span-6">
      <Card class="p-0 rounded-md overflow-hidden h-full flex items-center justify-center cursor-pointer group border-2 border-dashed border-primary hover:bg-lightprimary transition-all"
        @click="showJoinModal = true" padding="px-0">
        <div class="text-center py-12 px-6">
          <Icon icon="tabler:door-enter" class="size-12 mx-auto text-primary mb-3 group-hover:scale-110 transition-transform"></Icon>
          <h5 class="text-lg font-semibold text-primary">เข้าร่วมคลาส</h5>
          <p class="text-sm text-muted mt-2">ใส่ code ของคลาส</p>
        </div>
      </Card>
    </div>

    <!-- Joined Classroom Cards -->
    <template v-for="(post) in getJoinedPosts" :key="post.id">
      <blogCardGrid :post="post" />
    </template>

    <!-- Empty State -->
    <div v-if="getJoinedPosts.length === 0" class="col-span-12 text-center py-12">
      <p class="text-muted text-lg">ยังไม่มีคลาสที่เข้าร่วม</p>
    </div>
  </div>

  <!-- Join Class Modal -->
  <div v-if="showJoinModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="showJoinModal = false">
    <Card class="w-full max-w-md">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold">เข้าร่วมคลาส</h3>
        <button @click="showJoinModal = false" class="text-muted hover:text-foreground">
          <Icon icon="tabler:x" class="size-5"></Icon>
        </button>
      </div>
      
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">รหัสประจำคลาส</label>
        <input 
          v-model="classCode"
          type="text" 
          placeholder="กรอกรหัสประจำคลาสที่ได้รับจากอาจารย์"
          class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
          @keyup.enter="handleJoinClass"
        />
      </div>

      <div class="flex gap-3">
        <button @click="showJoinModal = false" class="flex-1 py-2 border border-border rounded-md hover:bg-muted transition">
          ยกเลิก
        </button>
        <button @click="handleJoinClass" class="flex-1 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition font-semibold">
          ยืนยัน
        </button>
      </div>
    </Card>
  </div>
</template>
