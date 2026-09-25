<script setup lang="ts">
import Card from "@/components/ui/card/Card.vue";
import { Icon } from "@iconify/vue";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import Badge from "@/components/ui/badge/Badge.vue";
import AspectRatio from "@/components/ui/aspect-ratio/AspectRatio.vue";
import { useBlogStore } from "@/stores/apps/blog";
const props = defineProps({ post: Object });
const store = useBlogStore();
const linkTo = props.post?.route || props.post?.slug || props.post?.title
  ?.toLowerCase()
  .replace(/ /g, "-")
  .replace(/[^\w-]+/g, "");
const toggleBookmark = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  store.toggleBookmark(props.post);
};
</script>

<template>
  <div class="col-span-12 lg:col-span-3 md:col-span-4 sm:col-span-6">
    <Card class="p-0 rounded-md overflow-hidden group gap-0 h-full flex flex-col" padding="px-0">
      <RouterLink :to="linkTo">
        <AspectRatio :ratio="16 / 9" class="relative overflow-hidden">
          <img :src="post?.coverImg" alt="Image"
            class="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-105" />
          <Badge variant="white" class="absolute bottom-3 end-3 rounded-md text-xs">
            {{ post?.category }}
          </Badge>
          <button type="button" class="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:scale-105 hover:text-amber-500" :class="store.isBookmarked(post) ? 'text-amber-500' : ''" :aria-label="store.isBookmarked(post) ? 'ยกเลิกบุ๊คมาร์ก' : 'เพิ่มบุ๊คมาร์ก'" @click="toggleBookmark"><Icon :icon="store.isBookmarked(post) ? 'solar:star-bold' : 'solar:star-linear'" class="size-5" /></button>
          <!-- Author Info Overlay -->
          <div class="absolute top-3 start-3 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
            <Avatar class="h-8 w-8">
              <AvatarImage :src="post?.author?.avatar" alt="teacher" />
              <AvatarFallback>{{ post?.author?.name?.charAt(0) }}</AvatarFallback>
            </Avatar>
            <p class="text-xs font-semibold text-white truncate max-w-[80px]">{{ post?.author?.name }}</p>
          </div>
        </AspectRatio>
      </RouterLink>
      <div class="p-4 flex flex-col gap-3 flex-grow">
        <h5 class="text-base font-semibold group-hover:text-primary leading-tight line-clamp-2">
          <RouterLink :to="linkTo">
            {{ post?.title }}
          </RouterLink>
        </h5>
        <p class="text-sm text-muted line-clamp-2">
          {{ post?.content }}
        </p>
        <div class="flex justify-between text-xs mt-auto pt-2 border-t border-border">
          <div class="flex items-center gap-1 text-darklink">
            <Icon icon="tabler:briefcase" class="size-4"></Icon>
            <span>{{ post?.view || 0 }} งาน</span>
          </div>
          <div class="flex items-center gap-1 text-darklink">
            <Icon icon="tabler:users" class="size-4"></Icon>
            <span>{{ post?.share || 0 }} คน</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
