import { createRouter, createWebHistory } from "vue-router";
import ProjectList from "../views/ProjectList.vue";
import ProjectForm from "../views/ProjectForm.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: ProjectList },
    { path: "/new", name: "new", component: ProjectForm },
    { path: "/edit/:slug", name: "edit", component: ProjectForm, props: true },
  ],
});

export default router;
