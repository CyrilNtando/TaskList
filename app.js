//Define UI Vars
let UIcontroller = (function() {
  const UIVars = {
    form: document.querySelector("#task-form"),
    taskList: document.querySelector(".collection"),
    clearBtn: document.querySelector(".clear-tasks"),
    filter: document.querySelector("#filter"),
    taskInput: document.querySelector("#task")
  };

  //Add list Item to UI
  function addTaskToList(targetElement, taskText) {
    //create li element
    const li = document.createElement("li");
    //add class
    li.className = "collection-item";
    //create text node and append to li
    li.appendChild(document.createTextNode(taskText));
    //Create a new Link element
    const link = document.createElement("a");
    //Add Class
    link.className = "delete-item secondary-content";
    //Add icon html
    link.innerHTML = '<i class="fa fa-remove"></i>';
    //append the link to li
    li.appendChild(link);
    //append child li to ul
    targetElement.appendChild(li);
  }

  return {
    //Get UI varaibles
    getUIVars: function() {
      return UIVars;
    },
    //add task to List
    addToList: function(ele, text) {
      addTaskToList(ele, text);
    },
    deleteListItem: function(ele) {
      ele.remove();
    },
    clearList: function(ele) {
      while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
      }
    }
  };
})();

/************************************************************************************************* */
let StorageController = (function() {
  let tasks;
  function initStorage() {
    if (localStorage.getItem("tasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
  }
  return {
    setTasks: function(task) {
      initStorage();
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    },
    getTasks: function() {
      initStorage();
      return tasks;
    },
    removeTask(taskItem) {
      initStorage();
      tasks.forEach((task, index) => {
        if (taskItem.textContent === task) {
          tasks.splice(index, 1);
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    },
    clearStorage: function() {
      localStorage.clear();
    }
  };
})();

/***************************************************************************************** */

let controller = (function(UIctr, StorageCtr) {
  //get UI elements
  const UIE = UIctr.getUIVars();

  //Load All Event Listeners
  function loadEventListeners() {
    //DOM load Event
    document.addEventListener("DOMContentLoaded", getTasks);
    //Add task Event
    UIE.form.addEventListener("submit", addTask);
    //remove Task
    UIE.taskList.addEventListener("click", removeTask);
    //clear task event
    UIE.clearBtn.addEventListener("click", clearTask);
    //filter task Event
    UIE.filter.addEventListener("keyup", filterTasks);
  }
  //Get Task from LS
  function getTasks() {
    StorageCtr.getTasks().forEach(task => {
      UIctr.addToList(UIE.taskList, task);
    });
  }

  //Add Task
  function addTask(e) {
    if (UIE.taskInput.value === "") {
      alert("Please Enter Task");
    } else {
      UIctr.addToList(UIE.taskList, UIE.taskInput.value);
      StorageCtr.setTasks(UIE.taskInput.value);
      UIE.taskInput.value = "";
    }
    e.preventDefault();
  }
  //Remove Task
  function removeTask(e) {
    if (e.target.parentElement.classList.contains("delete-item")) {
      if (
        confirm(
          `are you sure you wanna delete ${
            e.target.parentElement.parentElement.textContent
          } ?`
        )
      ) {
        //traverse to li element
        let item = e.target.parentElement.parentElement;
        //remove form UI
        UIctr.deleteListItem(item);
        //remove from LS
        StorageCtr.removeTask(item);
      }
    }
  }

  //clear Tasks
  function clearTask() {
    //tasklist.innerHTML ="";
    //faster
    UIctr.clearList(UIE.taskList);
    //clearTaskfromLocalStorage
    StorageCtr.clearStorage();
  }

  //filter Tasks
  function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(".collection-item").forEach(task => {
      const item = task.firstChild.textContent;
      if (item.toLowerCase().indexOf(text) != -1) {
        task.style.display = "block";
      } else {
        task.style.display = "none";
      }
    });
  }
  return {
    startApp: function() {
      loadEventListeners();
    }
  };
})(UIcontroller, StorageController);

controller.startApp();
