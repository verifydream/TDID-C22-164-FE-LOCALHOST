// Set up DatePicker
$("#todoDate").datetimepicker({
  format: "DD/MM/YYYY HH:mm:ss",
});
$("#editTodoDate").datetimepicker({
  format: "DD/MM/YYYY HH:mm:ss",
});

// Front End Elements
const todoContainer = document.getElementById("thingsToDo");
const doneContainer = document.getElementById("thingsDone");
const missedContainer = document.getElementById("thingsMissed");
const todoBox = document.getElementById("todoBox");
const doneBox = document.getElementById("doneBox");
const missedBox = document.getElementById("missedBox");
const filter = document.getElementById("filter");
const editId = document.getElementById("editTodoId");
const editTitle = document.getElementById("editTodoTitle");
const editDate = document.getElementById("editTodoDate");

checkLocalItem();
reminder();

// Check Local Todos
function checkLocalItem() {
  let localTodos = JSON.parse(localStorage.getItem("todos"));

  if (localTodos != null && localTodos != undefined && localTodos.length > 0) {
    // Set Todos to Backend
    setTodos(localTodos);
  }

  getAllTodoList();
}

// Set todos from LocalStorage to Backend
function setTodos(localTodo) {
  fetch(
    `http://localhost:3001/set-todo`,
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        localTodo: localTodo,
      }),
    }
  );
}

// Check if Notification Permission is Granted if not Request Permission
if (
  Notification.permission != "denied" &&
  Notification.permission != "granted"
) {
  Notification.requestPermission().then((permission) => { });
}

// Function to Show Notification
function showNotification(title, message) {
  new Notification(title, {
    body: message,
  });
}

// Function to Get All Todo List
function getAllTodoList() {
  fetch(
    `http://localhost:3001/list?filter=All`, { cache: "no-store" }
  )
    .then((response) => response.json())
    .then((data) => {
      displayTaskProgression(data);
      localStorage.setItem("todos", JSON.stringify(data));
    });
}

// Function to Display List of Todos in Frontend
function displayTaskProgression(data) {
  todoBox.innerHTML = "";
  doneBox.innerHTML = "";
  missedBox.innerHTML = "";

  data.forEach(function (value, index) {
    let items = ``;

    items += `
              <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                  <div class="form-check">
                      <input class="form-check-input me-0" type="checkbox" value="" aria-label="..." ${value.status == "Complete" ? "checked" : ""
      } disabled />
                  </div>
              </li>
              <li
                  class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent mw-25" style="word-break: break-word;">
                  <p class="lead fw-normal mb-0"><b>${value.title}</b></p>
              </li>`;

    const dates = value.date.split(" ");

    const date = dates[0].split("/");
    const time = dates[1].split(":");

    // Get Task's Date
    const todoDate = new Date(
      date[2],
      date[1] - 1,
      date[0],
      time[0],
      time[1],
      time[2],
      0
    );

    if (value.status == "Complete") {
      // Done Box
      items += `
               <li onClick="btnDeleteClick(${value.id})" class="list-group-item p-0 d-flex align-items-center border-0 bg-transparent">
                   <div class="btn btn-danger rounded-3 d-flex align-items-center hidden-sm hidden-xs visible-md-block visible-lg-block">
                       <p class="small mb-0">
                        <i class="fa fa-solid fa-trash"></i>&nbsp&nbspDelete
                       </p>
                   </div>
                   <div class="hidden-md hidden-lg visible-sm-block visible-xs-block">
                       <i class="fa fa-solid fa-trash"></i>
                   </div>
               </li>
               `;

      doneBox.innerHTML += `<ul class="list-group list-group-horizontal rounded-0 py-3">${items}</ul>`;
    } else if (
      (todoDate.getTime() - new Date().getTime()) / 1000 <= 0 &&
      value.status != "Complete"
    ) {
      // Missed Box
      items += `
                 <li class="list-group-item rounded-0 border-0 bg-transparent">
                     <div class="text-end text-muted">
                         <a href="#!" class="text-muted" data-mdb-toggle="tooltip m-auto" title="Start Date">
                             <p class="small mb-0"><i class="fas fa-info-circle me-2"></i>${value.date}</p>
                         </a>
                     </div>
                 </li>
                 <li onClick="btnEditClick(${value.id})" class="list-group-item p-0 d-flex align-items-center border-0 bg-transparent mx-3">
                      <div class="btn btn-warning rounded-3 d-flex align-items-center hidden-sm hidden-xs visible-md-block visible-lg-block" data-bs-toggle="modal" data-bs-target="#editModal">
                         <p class="small mb-0">
                          <i class="fa fa-solid fa-edit"></i>&nbsp&nbspEdit
                         </p>
                      </div>
                      <div class="hidden-md hidden-lg visible-sm-block visible-xs-block" data-bs-toggle="modal" data-bs-target="#editModal">
                        <i class="fa fa-solid fa-edit"></i>
                      </div>
                 </li>
                 <li onClick="btnCompleteClick(${value.id})" class="list-group-item p-0 d-flex align-items-center border-0 bg-transparent">
                     <div class="btn btn-primary rounded-3 d-flex align-items-center hidden-sm hidden-xs visible-md-block visible-lg-block">
                         <p class="small mb-0">
                          <i class="fa fa-solid fa-check"></i>&nbsp&nbspComplete
                         </p>
                     </div>
                     <div class="hidden-md hidden-lg visible-sm-block visible-xs-block">
                        <i class="fa fa-solid fa-check"></i>
                      </div>
                 </li>`;

      missedBox.innerHTML += `<ul class="list-group list-group-horizontal rounded-0 py-3">${items}</ul>`;
    } else {
      // Todo Box
      items += `
               <li class="list-group-item rounded-0 border-0 bg-transparent">
                   <div class="text-end text-muted">
                       <a href="#!" class="text-muted" data-mdb-toggle="tooltip m-auto" title="Start Date">
                           <p class="small mb-0"><i class="fas fa-info-circle me-2"></i>${value.date}</p>
                       </a>
                   </div>
               </li>
               <li onClick="btnEditClick(${value.id})" class="list-group-item p-0 d-flex align-items-center border-0 bg-transparent mx-3">
                   <div class="btn btn-warning rounded-3 d-flex align-items-center hidden-sm hidden-xs visible-md-block visible-lg-block" data-bs-toggle="modal" data-bs-target="#editModal">
                       <p class="small mb-0">
                        <i class="fa fa-solid fa-edit"></i>&nbsp&nbspEdit
                       </p>
                   </div>
                   <div class="hidden-md hidden-lg visible-sm-block visible-xs-block" data-bs-toggle="modal" data-bs-target="#editModal">
                    <i class="fa fa-solid fa-edit"></i>
                  </div>
               </li>
               <li onClick="btnCompleteClick(${value.id})" class="list-group-item p-0 d-flex align-items-center border-0 bg-transparent">
                   <div class="btn btn-primary rounded-3 d-flex align-items-center hidden-sm hidden-xs visible-md-block visible-lg-block">
                       <p class="small mb-0">
                        <i class="fa fa-solid fa-check"></i>&nbsp&nbspComplete
                       </p>
                   </div>
                   <div class="hidden-md hidden-lg visible-sm-block visible-xs-block">
                      <i class="fa fa-solid fa-check"></i>
                    </div>
               </li>`;

      todoBox.innerHTML += `<ul class="list-group list-group-horizontal rounded-0 py-3">${items}</ul>`;
    }
  });
}

// Function to Add Todo
function btnAddClick() {
  let todoTitle = document.getElementById("todoTitle");
  let todoDate = document.getElementById("todoDate");

  const dates = todoDate.value.split(" ");

  if (todoTitle.value == "") {
    alert("Please Input Title!");
    return;
  } else if (
    dates.length != 2 ||
    dates[0].split("/").length != 3 ||
    dates[1].split(":").length != 3
  ) {
    alert("Please Follow the Date Format!");
    return;
  }

  fetch(
    "http://localhost:3001/list",
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: todoTitle.value,
        date: todoDate.value,
      }),
    }
  ).then((response) => {
    todoTitle.value = "";
    todoDate.value = "";

    getAllTodoList();
  });
}

// Function to Complete Todo
function btnCompleteClick(id) {
  fetch(
    `http://localhost:3001/list/${id}`,
    {
      method: "PUT",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
    }
  ).then((response) => {
    getAllTodoList();
  });
}

// Function to Delete Todo by ID
function btnDeleteClick(id) {
  fetch(
    `http://localhost:3001/list/${id}`,
    {
      method: "DELETE",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
    }
  ).then((response) => {
    getAllTodoList();
  });
}

// Function to Retrieve Todo Detail
function btnEditClick(id) {
  fetch(
    `http://localhost:3001/list/${id}`
  )
    .then((response) => response.json())
    .then((data) => {
      editId.value = data.id;
      editTitle.value = data.title;
      editDate.value = data.date;
    });
}

// Function to Update Todo By ID
function updateTodo() {
  fetch(
    `http://localhost:3001/list/${editId.value}`,
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: editId.value,
        title: editTitle.value,
        date: editDate.value,
      }),
    }
  ).then((response) => {
    getAllTodoList();

    document.getElementById("modalClose").click();
  });
}

// When User change The Filter
function filterChange() {
  const filterVal = filter.value;

  if (filterVal == "All") {
    todoContainer.style.display = "block";
    doneContainer.style.display = "block";
    missedContainer.style.display = "block";
  } else if (filterVal == "Pending") {
    todoContainer.style.display = "block";
    doneContainer.style.display = "none";
    missedContainer.style.display = "block";
  } else if (filterVal == "Complete") {
    todoContainer.style.display = "none";
    doneContainer.style.display = "block";
    missedContainer.style.display = "none";
  }
}

// Function to Check if a Todo is Missed or Will Start Soon
function reminder() {
  fetch(
    `http://localhost:3001/list?filter=Pending`
  )
    .then((response) => response.json())
    .then((data) => {
      const today = new Date();

      data.forEach(function (value, index) {
        const dates = value.date.split(" ");

        if (dates.length > 1) {
          const date = dates[0].split("/");
          const time = dates[1].split(":");

          const todoDate = new Date(
            date[2],
            date[1] - 1,
            date[0],
            time[0],
            time[1],
            time[2],
            0
          );

          const dif = (todoDate.getTime() - today.getTime()) / 1000;

          if (dif <= 300 && today < todoDate && value.status != "Complete") {
            showNotification(
              "Reminder",
              `Task Due Date is In 5 Minutes or Less! Please Complete Task ${value.title}`
            );
          } else if (
            dif <= 0 &&
            value.status != "Complete" &&
            !value.notified
          ) {
            showNotification("Task Missed", `You Missed Task ${value.title}`);

            fetch(
              `http://localhost:3001/notif/${value.id}`,
              {
                method: "PUT",
                headers: {
                  accept: "*/*",
                  "content-type": "application/json",
                },
              }
            );
          }
        }
      });
    });

  setInterval(function () {
    fetch(
      `http://localhost:3001/list?filter=Pending`
    )
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();

        data.forEach(function (value, index) {
          const dates = value.date.split(" ");

          if (dates.length > 1) {
            const date = dates[0].split("/");
            const time = dates[1].split(":");

            const todoDate = new Date(
              date[2],
              date[1] - 1,
              date[0],
              time[0],
              time[1],
              time[2],
              0
            );

            const dif = (todoDate.getTime() - today.getTime()) / 1000;

            if (dif <= 300 && today < todoDate && value.status != "Complete") {
              showNotification(
                "Reminder",
                `Task Due Date is In 5 Minutes or Less! Please Complete Task ${value.title}`
              );
            } else if (
              dif <= 0 &&
              value.status != "Complete" &&
              !value.notified
            ) {
              showNotification("Task Missed", `You Missed Task ${value.title}`);

              fetch(
                `http://localhost:3001/notif/${value.id}`,
                {
                  method: "PUT",
                  headers: {
                    accept: "*/*",
                    "content-type": "application/json",
                  },
                }
              );
            }
          }
        });
      });
  }, 300000);
}

// Export Functions
window.btnAddClick = btnAddClick;
window.btnCompleteClick = btnCompleteClick;
window.btnDeleteClick = btnDeleteClick;
window.btnEditClick = btnEditClick;
window.filterChange = filterChange;
window.updateTodo = updateTodo;
