import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';
import type { blogpostType } from '@/types/apps/BlogTypes';

interface blogTypeDe {
    blogposts: blogpostType[];
    recentPosts: blogpostType[];
    blogSearch: string;
    sortBy: string;
    selectedPost: blogpostType[] | any;
    bookmarkedPosts: blogpostType[];
}

const getBookmarkKey = (post: blogpostType | any) => String(post?.id ?? post?.title ?? '');
const loadBookmarkedPosts = (): blogpostType[] => {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem('bookmarked-blog-posts') || '[]');
    } catch {
        return [];
    }
};

export const useBlogStore = defineStore('blog',{


    state: (): blogTypeDe => ({
        blogposts: [],
        recentPosts: [],
        blogSearch: '',
        sortBy: 'newest',
        selectedPost: [],
        bookmarkedPosts: loadBookmarkedPosts()
    }),
    getters: {
        // Get Post from Getters
        getPosts(state) {
            return state.blogposts;
        }
    },
    actions: {
        // Fetch Blog from action
        async fetchPosts() {
            try {
                const data = await axios.get('/api/data/blog/BlogPosts');
                this.blogposts = data.data;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        },
        async fetchPost(title: string) {
            try {
                const response = await axios.post('/api/data/blog/post', { title });
                this.selectedPost = response.data.post;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        },
        isBookmarked(post: blogpostType | any) {
            const key = getBookmarkKey(post);
            return this.bookmarkedPosts.some((item) => getBookmarkKey(item) === key);
        },
        toggleBookmark(post: blogpostType | any) {
            const key = getBookmarkKey(post);
            const index = this.bookmarkedPosts.findIndex((item) => getBookmarkKey(item) === key);
            if (index >= 0) this.bookmarkedPosts.splice(index, 1);
            else this.bookmarkedPosts.push(post);
            localStorage.setItem('bookmarked-blog-posts', JSON.stringify(this.bookmarkedPosts));
        }
    }
});
