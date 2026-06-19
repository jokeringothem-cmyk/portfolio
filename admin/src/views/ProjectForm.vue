<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api, type Project } from "../api";

const router = useRouter();
const route = useRoute();
const slug = route.params.slug as string | undefined;
const isEdit = !!slug;
const saving = ref(false);

const form = ref<Project>({
  slug: "",
  title: "",
  subtitle: "",
  category: "",
  brief: "",
  media_type: "none",
  video_path: "",
  video_left_path: "",
  video_left_label: "",
  video_right_path: "",
  video_right_label: "",
  poster_path: "",
  code_path: "",
  code_label: "",
  results_path: "",
  results_label: "",
  gallery: "",
  bg_color: "bg-white",
  sort_order: 0,
  highlights: [],
  tags: [],
});

const highlightText = ref("");

function addHighlight() {
  if (highlightText.value.trim()) {
    form.value.highlights.push({ content: highlightText.value.trim() });
    highlightText.value = "";
  }
}

function removeHighlight(i: number) {
  form.value.highlights.splice(i, 1);
}

onMounted(async () => {
  if (isEdit) {
    const p = await api.getProject(slug);
    form.value = { ...p };
    highlightText.value = "";
  }
});

async function save() {
  saving.value = true;
  try {
    if (isEdit) {
      await api.updateProject(slug, form.value);
    } else {
      await api.createProject(form.value);
    }
    router.push("/");
  } catch (e: any) {
    alert("Error: " + e.message);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="admin">
    <header class="admin-header">
      <h1>{{ isEdit ? "Edit" : "New" }} Project</h1>
      <button class="btn" @click="router.push('/')">← Back</button>
    </header>

    <form @submit.prevent="save" class="form">
      <div class="row">
        <label>
          Slug
          <input v-model="form.slug" required :disabled="isEdit" />
        </label>
        <label>
          Title
          <input v-model="form.title" required />
        </label>
      </div>

      <label>
        Subtitle
        <input v-model="form.subtitle" required />
      </label>

      <div class="row">
        <label>
          Category
          <input v-model="form.category" />
        </label>
        <label>
          Media Type
          <select v-model="form.media_type">
            <option value="none">None</option>
            <option value="video">Video</option>
            <option value="dual-video">Dual Video</option>
            <option value="image">Image</option>
          </select>
        </label>
      </div>

      <label>
        Brief
        <textarea v-model="form.brief" rows="3" required />
      </label>

      <!-- Media fields -->
      <div class="row">
        <label>
          Video Path
          <input v-model="form.video_path" placeholder="/media/xxx.mp4" />
        </label>
        <label>
          Poster/Image Path
          <input v-model="form.poster_path" placeholder="/media/xxx.jpg" />
        </label>
      </div>

      <template v-if="form.media_type === 'dual-video'">
        <div class="row">
          <label>
            Left Video Path
            <input v-model="form.video_left_path" />
          </label>
          <label>
            Left Label
            <input v-model="form.video_left_label" />
          </label>
        </div>
        <div class="row">
          <label>
            Right Video Path
            <input v-model="form.video_right_path" />
          </label>
          <label>
            Right Label
            <input v-model="form.video_right_label" />
          </label>
        </div>
      </template>

      <div class="row">
        <label>
          Code Path
          <input v-model="form.code_path" />
        </label>
        <label>
          Code Label
          <input v-model="form.code_label" />
        </label>
      </div>

      <div class="row">
        <label>
          Results Path
          <input v-model="form.results_path" />
        </label>
        <label>
          Results Label
          <input v-model="form.results_label" />
        </label>
      </div>

      <label>
        Gallery (JSON)
        <textarea v-model="form.gallery" rows="4" placeholder='[{"type":"video","path":"/media/x.mp4","label":"..."}]' />
      </label>

      <!-- Highlights -->
      <div>
        <label>Highlights</label>
        <div class="highlight-input">
          <input v-model="highlightText" @keydown.enter.prevent="addHighlight" placeholder="Add highlight..." />
          <button type="button" class="btn btn-sm" @click="addHighlight">Add</button>
        </div>
        <ul class="highlight-list">
          <li v-for="(h, i) in form.highlights" :key="i">
            {{ "content" in h ? h.content : h }}
            <button type="button" class="btn-remove" @click="removeHighlight(i)">×</button>
          </li>
        </ul>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? "Saving..." : "Save" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.admin { max-width: 720px; margin: 0 auto; padding: 2rem; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.admin-header h1 { font-size: 1.5rem; font-weight: 600; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8rem; color: #666; }
input, select, textarea { padding: 0.5rem 0.75rem; border: 1px solid #d2d2d7; border-radius: 0.5rem; font-size: 0.875rem; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #0071e3; box-shadow: 0 0 0 3px rgba(0,113,227,0.1); }
.btn { padding: 0.4rem 0.85rem; border: 1px solid #d2d2d7; border-radius: 0.5rem; background: #fff; cursor: pointer; font-size: 0.8rem; }
.btn:hover { background: #f5f5f7; }
.btn-primary { background: #0071e3; color: #fff; border-color: #0071e3; }
.btn-primary:hover { background: #0066cc; }
.btn-sm { padding: 0.25rem 0.6rem; font-size: 0.75rem; }
.highlight-input { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
.highlight-input input { flex: 1; }
.highlight-list { list-style: none; padding: 0; margin: 0.5rem 0 0; display: flex; flex-direction: column; gap: 0.35rem; }
.highlight-list li { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; padding: 0.35rem 0.5rem; background: #f5f5f7; border-radius: 0.35rem; font-size: 0.8rem; }
.btn-remove { background: none; border: none; color: #e33; cursor: pointer; font-size: 1rem; line-height: 1; }
.form-actions { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e5e5; }
</style>
