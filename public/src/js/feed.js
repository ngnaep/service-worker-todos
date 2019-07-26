var deferredPrompt;

var form = document.querySelector('form');
var addToDOButton = document.querySelector('#addtodo-button');
var createTodoArea = document.querySelector('#create-todo');
var closeCreateTodoModalButton = document.querySelector('#close-create-todo-modal-btn');
var todosArea = document.querySelector('#show-todos');
var taskId = document.querySelector('#taskId');
var taskName = document.querySelector('#taskName');
const db = new Dexie('TODO');
db.version(1).stores({
 response: '++id, taskId, task'
})
db.open();
function openCreateToDOModal() {
  createTodoArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }

  
}

function closeCreateTodoModal() {
  createTodoArea.style.display = 'none';
}

addToDOButton.addEventListener('click', openCreateToDOModal);

closeCreateTodoModalButton.addEventListener('click', closeCreateTodoModal);



function clearTodos() {
  while(todosArea.hasChildNodes()) {
    todosArea.removeChild(todosArea.lastChild);
  }
}

function createTodos(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'todo-card mdl-shadow--2dp';
   var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  
  cardTitle.style.height = '50px';
   cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'black';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.id + '. ' +  data.task;
  cardTitle.appendChild(cardTitleTextElement);
  
  componentHandler.upgradeElement(cardWrapper);
  todosArea.appendChild(cardWrapper);
}

function updateUI(data) {
  clearTodos();;
  if(data){
    console.log("Length", data.length);
  for (var i = 0; i < data.length; i++) {
    createTodos(data[i]);
  }
  }
  
}

var url = 'https://todolist-f7963.firebaseio.com/todoList.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    
     updateUI(dataArray);
  });

if ('caches' in window) {
  caches.match(url)
    .then(function(response) {
      if (response) {
        return response.json();
      }
    })
    .then(function(data) {
      console.log('From cache', data);
      if (!networkDataReceived) {
        var dataArray = [];
        for (var key in data) {
          dataArray.push(data[key]);
        }
        updateUI(dataArray)
      }
    });
}
form.addEventListener('submit', function(){
  event.preventDefault();
  if (taskId.value.trim() === '' || taskName.value.trim() === '') {
      alert('Please enter Task details!');
    return;
  }
  console.log("Task and task name are", taskId.value.trim(), taskName.value.trim());  
  
  if(navigator.onLine){
    console.log("I am online")
    fetch('https://us-central1-todolist-f7963.cloudfunctions.net/addTodo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                id: taskId.value.trim(),
                task: taskName.value.trim()
              })
            })
            .then(function(res) {
              console.log('Sent data', res);
              if (res.ok) {
                res.json()
                  .then(function(resData) {
                        fetch(url)
                        .then(function(res) {
                        return res.json();
                      })
                      .then(function(data) {
                        networkDataReceived = true;
                        console.log('From web', data);
                        var dataArray = [];
                        for (var key in data) {
                          dataArray.push(data[key]);
                        }
                        
                        updateUI(dataArray);
                      });
                  });
              }
            })
            .catch(function(err) {
              console.log('Error while sending data', err);
            });
    
  }
  else{
    console.log("I am not online");
    db.response.put({ 'taskId': taskId.value.trim(),
    'task': taskName.value.trim()}).then(function(){
      console.log("Updated in Indexed DB")
    })
    navigator.serviceWorker.ready.then(function(swRegistration){
      swRegistration.sync.register('add-todos');
    });
    
  }
  closeCreateTodoModal();
})
