<template>
  <div>
    <!-- <div class="q-pa-md row justify-end">
      <q-btn round color="blue" icon="add" @click="popup = true" />
    </div> -->

    <!-- each cell in table -->
    <div class="q-pa-md">
      <q-table
        title="Tasks"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :pagination="pagination"
        :rows-per-page-options="[10]"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="props.row.workEffortName">
              <div>
                {{
                  props.row.workEffortName == null
                    ? "null"
                    : props.row.workEffortName
                }}
              </div>
            </q-td>
            <q-td key="props.row.priority">
              <div>
                {{ props.row.priority == null ? 0 : props.row.priority }}
              </div>
            </q-td>
            <q-td key="props.row.managerPartyId">
              <div>HiveMind PM</div>
            </q-td>
            <q-td key="props.row.statusId">
              <q-chip
                :class="'bg-' + getStatusColor(props.row.statusId.slice(2))"
              >
                {{ props.row.statusId.slice(2) }}
              </q-chip>
            </q-td>
            <q-td key="props.row.estimationCompletionDate">
              <div>
                {{ formatDate(props.row.estimatedCompletionDate) }}
              </div>
            </q-td>

            <q-td key="props.row.edit">
              <q-btn @click="editData(props.row.workEffortId)">
                <q-icon name="edit"
              /></q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- add task dialouge -->
    <q-dialog v-model="popup" presistent>
      <q-card style="width: 500px">
        <q-card-section>
          <q-form @submit="addTask" class="q-gutter-y-md">
            <q-input
              square
              filled
              clearable
              v-model="data.workEffortName"
              type="text"
              label="Title"
            />
            <q-select
              square
              filled
              clearable
              v-model="data.assignToPartyId"
              :options="['EX_JOHN_DOE']"
              type="text"
              label="Manager"
            />
            <q-input
              square
              filled
              clearable
              v-model="data.description"
              type="text"
              label="Description"
            />
            <q-select
              square
              filled
              clearable
              v-model="data.priority"
              type="text"
              :options="[1, 2, 3, 4, 5]"
              label="Priority"
            />
            <q-date mask="YYYY-MM-DD" v-model="data.estimatedCompletionDate" />
            <q-card-actions class="q-gutter-q-md">
              <q-btn flat label="Create" color="primary" type="submit" />
              <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- add task btn -->
    <q-item-section>
      <div class="row justify-between q-pa-md">
        <q-btn
          style="width: 125px"
          class="custom_btn_dropdown q-my-xs q-ml-sm"
          dense
          split
          @click="popup = true"
          color="primary"
          no-caps
          icon="add"
          label="Add Task"
        >
        </q-btn>
        <q-btn
          style="width: 125px"
          class="custom_btn_dropdown q-my-xs q-ml-sm"
          dense
          split
          color="primary"
          no-caps
          icon="get_app"
          label="Get task"
          @click="gettask(pagination)"
        >
        </q-btn>
      </div>
    </q-item-section>

    <!-- // get extra task -->

    <!-- edit task dialog box -->
    <q-dialog v-model="popupEdit">
      <q-card style="width: 500px">
        <q-card-section>
          <q-form @submit="updateTask" class="q-gutter-y-md">
            <div>Edit</div>
            <q-input
              square
              filled
              clearable
              v-model="userData.workEffortName"
              type="text"
              label="Task Name"
            />
            <q-select
              square
              filled
              clearable
              :options="[1, 2, 3, 4, 5]"
              v-model="userData.priority"
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
              mask="YYYY-MM-DD"
              v-model="userData.estimatedCompletionDate"
            />

            <q-card-actions class="q-gutter-q-md">
              <q-btn flat label="Update" color="primary" type="submit" />
              <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { onMounted, ref } from "vue";

//our list are show here

export default {
  name: "task_page",

  setup() {
    const key = JSON.parse(localStorage.getItem("userInfo")).apiKey;

    const columns = [
      {
        name: "title-text",
        field: "workEffortName",
        required: true,
        label: "Title",
        align: "left",
        sortable: true,
        style: "min-width: 300px",
      },
      {
        name: "priority",
        align: "left",
        label: "Priority",
        style: "width: 100px",
        field: "priority",
        sortable: true,
      },

      {
        name: "person",
        align: "left",
        label: "Project",
        style: "width: 210px",
        field: "assignToPartyId",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        style: "width: 210px",
        field: "statusId",
        sortable: true,
      },
      {
        name: "duedate",
        align: "left",
        label: "Due",
        style: "width: 210px",
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

    const rows = ref([]);

    const popup = ref(false);
    const popupEdit = ref(false);

    const data = ref({
      workEffortName: "",
      assignToPartyId: "",
      description: "",
      priority: "",
      rootWorkEffortId: "",
      statusId: "",
      estimatedCompletionDate: "",
    });

    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
    });

    function gettask(prop) {
      const offset = (prop.page - 1) * prop.rowsPerPage;

      const url_tasks = "http://localhost:8080/rest/s1/wm/tasks";
      const key = JSON.parse(localStorage.getItem("userInfo")).apiKey;

      axios({
        url: url_tasks,
        method: "GET",
        headers: {
          api_key: key,
        },
        params: {
          pageOffset: offset,
          pageLimit: prop.rowsPerPage,
        },
      }).then((res) => {
        const item = res.data.taskList;

        item.map((n) => {
          rows.value.push(n);
        });
        prop.page++;
      });
    }

    //Add task
    function addTask(e) {
      e.preventDefault();

      const key = JSON.parse(localStorage.getItem("userInfo")).apiKey;

      axios({
        url: "http://localhost:8080/rest/s1/wm/tasks/addTask",
        method: "POST",
        params: data.value,

        headers: {
          api_key: key,
        },
      }).then((res) => {
        console.log(res);
        popup.value = false;
        gettask();
      });
    }

    // user data for edit qDialog box
    const userData = ref({
      workEffortId: "",
      rootWorkEffortId: "",
      workEffortName: "",
      estimatedCompletionDate: "",
      description: "",
      statusId: "",
      priority: "",
      assignToPartyId: "",
    });

    // popup the edit box and get data and feed to the box
    function editData(i) {
      popupEdit.value = true;

      const key = JSON.parse(localStorage.getItem("userInfo")).apiKey;

      axios({
        url: "http://localhost:8080/rest/s1/wm/tasks/task",
        method: "GET",
        headers: {
          api_key: key,
        },
        params: {
          workEffortId: i,
        },
      }).then((res) => {
        userData.value = res.data.task;
      });
    }

    function updateTask() {
      axios({
        method: "POST",
        url: "http://localhost:8080/rest/s1/wm/tasks/updateTask",
        headers: {
          api_key: key,
        },
        params: userData.value,
      }).then((res) => {
        console.log(res);
        popupEdit.value = false;
        rows.value = [];
        const pagination = ref({
          page: 1,
          rowsPerPage: 10,
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
      } else if (!dt) {
        return "Date Not Mentioned";
      }
    }

    const getStatusColor = (n) => {
      if (n === "InPlanning") {
        return "green";
      } else if (n === "Approved") {
        return "yellow";
      } else {
        return "red";
      }
    };

    onMounted(() => {
      gettask(pagination.value);
    });

    return {
      columns,
      rows,
      popup,
      data,
      addTask,
      formatDate,
      editData,
      popupEdit,
      userData,
      updateTask,
      pagination,
      gettask,
      getStatusColor,
    };
  },
};
</script>
