<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api, type Project } from "../api";

const router = useRouter();
const projects = ref<Project[]>([]);

async function load() {
  projects.value = await api.listProjects();
}

async function remove(slug: string) {
  if (!confirm(`Delete "${slug}"?`)) return;
  await api.deleteProject(slug);
  await load();
}

onMounted(load);
</script>

<template>
  <div class="admin">
    <header class="admin-header">
      <h1>Projects</h1>
      <button class="btn btn-primary" @click="router.push('/new')">+ New Project</button>
    </header>

    <table v-if="projects.length" class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Category</th>
          <th>Media</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in projects" :key="p.slug">
          <td>{{ i + 1 }}</td>
          <td>
            <strong>{{ p.title }}</strong>
            <br />
            <small>{{ p.subtitle }}</small>
          </td>
          <td>{{ p.category }}</td>
          <td><span class="badge">{{ p.media_type }}</span></td>
          <td>
            <button class="btn btn-sm" @click="router.push(`/edit/${p.slug}`)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="remove(p.slug!)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">No projects yet.</p>
  </div>
</template>

<style scoped>
.admin { max-width: 960px; margin: 0 auto; padding: 2rem; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.admin-header h1 { font-size: 1.5rem; font-weight: 600; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e5e5e5; }
.table th { font-size: 0.75rem; text-transform: uppercase; color: #86868b; }
.table small { color: #86868b; }
.btn { padding: 0.4rem 0.85rem; border: 1px solid #d2d2d7; border-radius: 0.5rem; background: #fff; cursor: pointer; font-size: 0.8rem; }
.btn:hover { background: #f5f5f7; }
.btn-primary { background: #0071e3; color: #fff; border-color: #0071e3; }
.btn-primary:hover { background: #0066cc; }
.btn-danger { color: #e33; border-color: #e33; }
.btn-sm { padding: 0.25rem 0.6rem; font-size: 0.75rem; }
.badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; background: #f5f5f7; font-size: 0.7rem; color: #86868b; }
.empty { color: #86868b; text-align: center; padding: 4rem; }
</style>
