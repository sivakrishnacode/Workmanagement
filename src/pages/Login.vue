<template>
  <div
    class="bg-light-green window-height window-width row justify-center items-center"
  >
    <div class="column">
      <div class="row justify-center">
        <h5 class="text-h5 text-white q-my-md text-center">Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md" @submit="formSubmit">
              <q-input square filled clearable v-model="email" label="email" />
              <q-input
                square
                filled
                clearable
                v-model="password"
                type="password"
                label="password"
              />
              <q-btn
                type="submit"
                unelevated
                color="light-green-7"
                size="lg"
                class="full-width"
                label="Login"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md"> </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const loginApi = "http://localhost:8080/rest/s1/finzApp/login";

export default {
  name: "login_page",
  data() {
    const email = "";
    const password = "";
    return {
      email,
      password,
    };
  },
  methods: {
    formSubmit() {
      axios({
        url: loginApi,
        method: "POST",
        params: {
          username: this.email,
          password: this.password,
        },
      })
        .then((res) => {
          const data = JSON.stringify(res.data);
          localStorage.setItem("userInfo", data);
          localStorage.setItem("auth", true);
          this.$router.push({ name: "home_page" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
