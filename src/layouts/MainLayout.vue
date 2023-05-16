<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div class="q-gutter-y-md" style="max-width: 600px">
          <q-tabs dense class="bg-blue-8 text-white">
            <q-route-tab name="home" icon="home" label="Home" to="/home" />
            <q-route-tab name="tasks" icon="task" label="Tasks" to="/task" />
            <q-route-tab
              name="projects"
              icon="work"
              label="Projects"
              to="/project"
            />
            <q-btn round color="primary" icon="logout" @click="logout" />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const router = useRouter();

    function logout() {
      localStorage.removeItem("auth");
      localStorage.removeItem("userInfo");
      router.push({
        name: "login",
      });
    }
    return {
      logout,
    };
  },
});
</script>
