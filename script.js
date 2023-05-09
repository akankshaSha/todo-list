const addTaskButton = document.querySelector('#addTaskButton');
const cancelButton = document.querySelector('.cancel-button');
const submitTaskButton = document.querySelector('#submit-task');
const taskList = document.querySelector('#taskList');
const modal = document.querySelector('.modal');
const modalBackdrop = document.querySelector('.modalBackdrop');
const date = document.querySelector('header>h1');
const day = document.querySelector('header>p');
const taskTitle = modal.querySelector('#task-title');
const taskDescription = modal.querySelector('#task-description');
const taskLocation = modal.querySelector('#location');
const formatter = Intl.DateTimeFormat('en-US');
const prevTaskAction = document.querySelector('.load-prev-modal');
const loadPrevTask = document.querySelector('#load-prev-task-button');
const discardPrevTask = document.querySelector('#discard-prev-tasks');

const dateTime = new Date();
const tasks = [];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const addTask = () => {
    const task = document.createElement('li');
    task.id = tasks.length - 1;
    const displayDiv = document.createElement('div');
    displayDiv.classList.add('display');
    const taskCompletedCheckBox = document.createElement('input')
    taskCompletedCheckBox.type = 'checkbox';
    taskCompletedCheckBox.name = 'task completed';
    taskCompletedCheckBox.id = 'task-completed';
    const taskTitleH2 = document.createElement('h2');
    taskTitleH2.innerText = tasks.at(-1).title;
    const editButton = document.createElement('button');
    editButton.id = 'edit-task';
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-task';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description', 'hidden');
    const locationP = document.createElement('p');
    locationP.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${tasks.at(-1).location}`;
    const descriptionP = document.createElement('p');
    descriptionP.innerText = tasks.at(-1).description;
    displayDiv.append(taskCompletedCheckBox, taskTitleH2, editButton, deleteButton);
    descriptionDiv.append(locationP, descriptionP);
    task.append(displayDiv, descriptionDiv);
    taskList.prepend(task);

    const handelDelete = ()=>{
        task.remove();
        tasks[task.id] = null;
    };
    const handelTitlteClick =  ()=>{
        descriptionDiv.classList.toggle('hidden');
    };
    const handleEdit = ()=>{
        taskDescription.value = tasks[task.id].description;
        taskLocation.value = tasks[task.id].location;
        taskTitle.value = tasks[task.id].title;
        const editSubmission = document.createElement('button');
        editSubmission.innerText = 'Edit Task';
        submitTaskButton.replaceWith(editSubmission);
        modal.classList.toggle('hidden');
        modalBackdrop.classList.toggle('hidden');
        editSubmission?.addEventListener('click', ()=>{
            descriptionP.innerText = tasks[task.id].description = taskDescription.value;
            tasks[task.id].location = taskLocation.value;
            locationP.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${tasks[task.id].location}`;
            taskTitleH2.innerText = tasks[task.id].title = taskTitle.value;
            editSubmission.replaceWith(submitTaskButton);
            modal.classList.toggle('hidden');
            modalBackdrop.classList.toggle('hidden');
        });
    };
    const handleCompleted = (event)=>{
        if(event.target.checked)
        {
            tasks[task.id].completed = true;
            deleteButton.removeEventListener('click', handelDelete);
            taskTitleH2.removeEventListener('click', handelTitlteClick);
            editButton.removeEventListener('click', handleEdit);
            task.classList.toggle('completed-task');
            descriptionDiv.classList.add('hidden');
            task.remove();
            taskList.appendChild(task);
        } else {
            tasks[task.id].completed = false;
            deleteButton.addEventListener('click', handelDelete);
            taskTitleH2.addEventListener('click', handelTitlteClick);
            editButton.addEventListener('click', handleEdit);
            task.classList.toggle('completed-task');
        }
    };

    deleteButton.addEventListener('click', handelDelete);
    taskTitleH2.addEventListener('click', handelTitlteClick);
    editButton.addEventListener('click', handleEdit);
    taskCompletedCheckBox.addEventListener('change', handleCompleted);

    if(tasks[task.id].completed)
    {
        taskCompletedCheckBox.checked = true;
        deleteButton.removeEventListener('click', handelDelete);
        taskTitleH2.removeEventListener('click', handelTitlteClick);
        editButton.removeEventListener('click', handleEdit);
        task.classList.toggle('completed-task');
        descriptionDiv.classList.add('hidden');
    }
};

const saveTask = ()=>{
    if(tasks.length == 0) return;
    const taskString = JSON.stringify(tasks);
    localStorage.setItem(formatter.format(dateTime), taskString);
};

date.textContent = months[dateTime.getMonth()] + ' ' +dateTime.getDate() + ', ' + dateTime.getFullYear();
day.textContent = daysOfWeek[dateTime.getDay()];

addTaskButton.addEventListener('click', () => {
    //1. open modal, take input
    taskDescription.value = '';
    taskLocation.value = '';
    taskTitle.value = '';
    modal.classList.toggle('hidden');
    modalBackdrop.classList.toggle('hidden');  
});

cancelButton.addEventListener('click', ()=>{
    modal.classList.toggle('hidden');
    modalBackdrop.classList.toggle('hidden');
});

taskTitle.addEventListener('focusout', () => {
    if(taskTitle.value.length > 0) submitTaskButton.disabled = false;
    else submitTaskButton.disabled = true;
});  

submitTaskButton.addEventListener('click', () => {
    tasks.push({title : taskTitle.value, 
        description : taskDescription.value,
        location : taskLocation.value,
        completed : false
    });
    modal.classList.toggle('hidden');
    modalBackdrop.classList.toggle('hidden');
    
    addTask();
});

window.addEventListener('beforeunload', saveTask);

loadPrevTask.addEventListener('click', ()=>{
    for (let key of Object.keys(localStorage)) {
        const prevtasks = JSON.parse(localStorage.getItem(key));
        for(let prevtask of prevtasks)
        {
            if(prevtask == null || prevtask.completed) continue;
            tasks.push(prevtask);
            addTask();
        }
      }
    localStorage.clear();    
    prevTaskAction.classList.toggle('hidden');
});

discardPrevTask.addEventListener('click', ()=>{
    localStorage.clear();
    prevTaskAction.classList.toggle('hidden');
});

window.addEventListener('DOMContentLoaded', ()=>{
    if(localStorage.length == 0) return;
    else if(localStorage.getItem(formatter.format(dateTime)) == null)
    {
        prevTaskAction.classList.toggle('hidden');
        return;
    }
    const previousTasks = JSON.parse(localStorage.getItem(formatter.format(dateTime)));
    const incompleteTasks = [];
    for(let previousTask of previousTasks)
    {
        //1. filter for null
        if(previousTask == null) continue;
        //2. create taskList
        if(!previousTask.completed)
        {
            incompleteTasks.push(previousTask);
            continue;
        }
        tasks.push(previousTask);
        addTask();
    }

    for(let incompleteTask of incompleteTasks)
    {
        tasks.push(incompleteTask);
        addTask();
    }
});