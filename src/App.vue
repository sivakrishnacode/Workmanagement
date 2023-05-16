<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

// axios.defaults.headers.common["token"] = JSON.parse(
//   localStorage.getItem("userInfo")
// ).apiKey;

export default defineComponent({
  name: "App",
});
</script>
