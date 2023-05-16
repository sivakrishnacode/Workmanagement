<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      key="workEffortId"
      :pagination="pagination"
      :rows-per-page-options="[10]"
    >
      <!-- // each cell -->
      <template #body="props">
        <q-tr :props="props">
          <q-td key="props.row.workEffortName">
            <div>
              {{ props.row.workEffortName }}
            </div>
          </q-td>
          <q-td key="props.row.managerPartyId">
            <div>
              {{ props.row.managerFirstName + " " + props.row.managerLastName }}
            </div>
          </q-td>
          <q-td key="props.row.statusId">
            <q-chip
              :class="'bg-' + getStatusColor(props.row.statusId.slice(2))"
            >
              {{ props.row.statusId.slice(2) }}
            </q-chip>
          </q-td>
          <q-td key="props.row.estimatedCompletionDate">
            <div>
              {{ formatDate(props.row.estimatedCompletionDate) }}
            </div>
          </q-td>
          <q-td key="props.row.workEffortId">
            <q-btn @click="editPopup(props.row.workEffortId)">
              <q-icon name="edit"
            /></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- // project add button -->
    <q-item-section>
      <div class="row justify-between q-pa-sm">
        <q-btn
          style="width: 125px"
          class="custom_btn_dropdown"
          dense
          split
          @click="popup = true"
          color="primary"
          no-caps
          icon="add"
          label="Add Project"
        >
        </q-btn>

        <!-- // get extra projects -->
        <q-btn
          style="width: 125px"
          class="custom_btn_dropdown"
          dense
          split
          color="primary"
          no-caps
          icon="get_app"
          label="Get Project"
          @click="getproject(pagination)"
        >
        </q-btn>
      </div>
    </q-item-section>

    <!-- // add project dialog box -->
    <q-dialog v-model="popup">
      <q-card style="width: 500px">
        <q-card-section>
          <q-form @submit="addProject" class="q-gutter-y-md">
            <q-input
              square
              filled
              clearable
              v-model="allParams.workEffortName"
              type="text"
              label="Project"
            />
            <q-select
              square
              filled
              clearable
              option-label="userFullName"
              option-value="partyId"
              :options="managerList"
              v-model="allParams.assignToPartyId"
              type="text"
              label="Manager"
              map-options
              emit-value
            />

            <q-input
              square
              filled
              clearable
              v-model="allParams.description"
              type="text"
              label="Description"
            />
            <q-date
              mask="YYYY-MM-DD"
              v-model="allParams.estimatedCompletionDate"
            />

            <q-card-actions class="q-gutter-q-md">
              <q-btn flat label="Create" color="primary" type="submit" />
              <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- // edit project dialog box -->

    <q-dialog v-model="popupEdit">
      <q-card style="width: 500px">
        <q-card-section>
          <q-form @submit="updateProject" class="q-gutter-y-md">
            <div
              style="border-radius: 15px"
              class="text-white bg-primary shadow-3 text-center text-bold q-pa-md"
            >
              EDIT
            </div>

            <q-input
              square
              filled
              clearable
              v-model="userData.workEffortName"
              type="text"
              label="Project Name"
            />
            <q-select
              square
              filled
              clearable
              option-label="userFullName"
              option-value="partyId"
              map-options
              emit-value
              :options="managerList"
              v-model="userData.managerPartyId"
              type="text"
              label="Manager"
            />
            <q-select
              square
              filled
              clearable
              :options="[
                'WeInPlanning',
                'WeApproved',
                'WeInProgress',
                'WeComplete',
                'WeOnHold',
                'WeClosed',
                'WeCancelled',
              ]"
              v-model="userData.statusId"
              type="text"
              label="Status"
            />
            <q-date
              class="shadow-16"
              mask="YYYY-MM-DD"
              v-model="userData.estimatedCompletionDate"
            />

            <q-card-actions class="q-gutter-q-md">
              <div class="row">
                <q-btn flat label="Update" color="primary" type="submit" />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
              </div>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";

import { onMounted, ref, computed } from "vue";

const url = "http://localhost:8080/rest/s1/wm/";
const key = JSON.parse(localStorage.getItem("userInfo")).apiKey;

export default {
  name: "projests_page",
  setup() {
    const columns = [
      {
        name: "name",
        align: "left",
        style: "min-width: 300px",
        label: "Project Name",
        field: "workEffortName",
        sortable: true,
      },
      {
        name: "manager",
        align: "left",
        label: "Manager",
        style: "width: 220px",
        field: "managerPartyId",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        style: "width: 220px",
        field: "statusId",
        sortable: true,
      },
      {
        name: "duedate",
        align: "left",
        label: "Due",
        style: "width: 220px",
        field: "estimatedCompletionDate",
        sortable: true,
      },
      {
        name: "Edit",
        align: "left",
        label: "Edit",
        style: "width: 220px",
      },
    ];

    var allParams = ref({
      workEffortName: "",
      assignToPartyId: "",

      description: "",
      estimatedCompletionDate: "",
    });

    const popup = ref(false);
    const popupEdit = ref(false);
    const rows = ref([]);
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
    });

    function getproject(prop) {
      const offset = (prop.page - 1) * prop.rowsPerPage;

      axios({
        url: url + "projects",
        method: "GET",
        params: {
          pageOffset: offset,
          pageLimit: prop.rowsPerPage,
        },
        headers: {
          api_key: key,
        },
      }).then((res) => {
        const list = res.data.projectList;
        list.map((n) => {
          rows.value.push(n);
        });
      });
      prop.page++;
    }

    //add project manualy
    function addProject() {
      popup.value = false;

      axios({
        method: "POST",
        url: url + "projects/addProject",
        headers: {
          api_key: key,
        },
        params: {
          workEffortName: allParams.value.workEffortName,
          assignToPartyId: allParams.value.assignToPartyId.partyId,
          description: allParams.value.description,
          estimatedCompletionDate: formatDate(
            allParams.value.estimatedCompletionDate
          ),
        },
      })
        .then((res) => {
          getproject();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const managerList = ref([]);

    function getManager() {
      axios({
        url: url + "users",
        method: "GET",
        headers: {
          api_key: key,
        },
      }).then((res) => {
        const data = res.data.userList;

        data.map((n) => {
          managerList.value.push(n);
        });
      });
    }

    function formatDate(dt) {
      if (dt) {
        dt = new Date(dt);
        return (
          dt.getFullYear() +
          "-" +
          String(dt.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(dt.getDate()).padStart(2, "0")
        );
      }
    }

    const userData = ref({
      workEffortId: "",
      workEffortName: "",
      estimatedCompletionDate: "",
      statusId: "",
      managerPartyId: "",
    });

    function editPopup(i) {
      popupEdit.value = true;

      axios({
        url: url + "projects/project",
        method: "GET",
        headers: {
          api_key: key,
        },
        params: {
          workEffortId: i,
        },
      }).then((res) => {
        userData.value = res.data.project;
        console.log(userData.value);
      });
    }

    const updatedData = ref({
      workEffortId: "",
      workEffortName: "",
      estimatedCompletionDate: "",
      description: "",
      statusId: "",
      managerPartyId: "",
    });

    function updateProject() {
      console.log(userData.value);
      axios({
        method: "POST",
        url: url + "projects/updateProject",
        headers: {
          api_key: key,
        },
        params: userData.value,
      }).then((res) => {
        console.log(res);
        popupEdit.value = false;
        rows.value = [];
        getproject();
      });
    }

    const getStatusColor = (n) => {
      if (n === "InPlanning") {
        return "green";
      } else if (n === "Complete") {
        return "yellow";
      } else {
        return "red";
      }
    };

    // pagination task

    // End
    onMounted(() => {
      getproject(pagination.value);
      getManager();
    });

    const test = () => {
      alert(1);
    };

    return {
      columns,
      rows,
      popup,
      allParams,
      addProject,
      formatDate,
      editPopup,
      popupEdit,
      userData,
      updateProject,
      updatedData,
      managerList,
      getManager,
      getproject,
      getStatusColor,
      test,
      pagination,
    };
  },
};
</script>
