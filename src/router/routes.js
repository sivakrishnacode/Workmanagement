const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "home",
        name: "home_page",
        component: () => import("../pages/Home.vue"),
      },
      {
        path: "task",
        name: "task_page",
        component: () => import("../pages/Task.vue"),
      },
      {
        path: "project",
        name: "project_page",
        component: () => import("../pages/Project.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/Login.vue"),
  },
];

export default routes;
