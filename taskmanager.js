const taskmodal=document.getElementById("taskmodal");
const addBtn=document.querySelectorAll(".addTask");
const cancelBtn=document.getElementById("cancel");
let tasks=[];
let nextId=1;

function createTaskCard(taskObj){
	const li = document.createElement("li");
	li.setAttribute("data-id",taskObj.id);
	li.classList.add("task-card");

	const title=document.createElement("h3");
	title.textContent=taskObj.title;

	const desc=document.createElement("p");
	desc.textContent=taskObj.description;

	const priolabel=document.createElement("span");
	priolabel.classList.add("priolabel",taskObj.priority);
	priolabel.textContent=taskObj.priority.toUpperCase();

	const date = document.createElement("small");
	date.textContent=`Due:${taskObj.dueDate}`;

	const edit=document.createElement("button");
	edit.textContent="Edit";
	edit.addEventListener("click",()=>editTask(taskObj.id));

	const del=document.createElement("button");
	del.textContent="Delete";
	del.addEventListener("click",()=>deleteTask(taskObj.id));

	li.appendChild(title);
	li.appendChild(desc);
	li.appendChild(priolabel);
	li.appendChild(date);
	li.appendChild(edit);
	li.appendChild(del);

	return li;
}

function addTask(columnId, taskObj){
	const column = document.getElementById(columnId);
	const list = column.querySelector("ul");

	const card = createTaskCard(taskObj);
	list.appendChild(card);

	updateTaskCounter();
}

function deleteTask(taskId){
	const card=document.querySelector(`[data-id="${taskId}"]`);

	card.classList.add("fade-out");

	card.addEventListener("animationend",()=>{
		card.remove();
		updateTaskCounter();
	});

	
}

function editTask(taskId){
	const task=tasks.find(t=>t.id===taskId);
	if(!task) return;

	document.getElementById("taskTitle").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("levelpriority").value = task.priority;
    document.getElementById("duedate").value = task.dueDate;

    const modal = document.getElementById("taskmodal");
    modal.setAttribute("data-editing-id", taskId);
    modal.style.display="block";
}

function updateTask(taskId, updatedData){
	const index = tasks.findIndex(t=>t.id===taskId);
	if(index!==-1){
		tasks[index]={...tasks[index], ...updatedData};
	}

	const card = document.querySelector(`[data-id="${taskId}"]`);

	card.querySelector("h3").textContent = updatedData.title;
	card.querySelector("p").textContent = updatedData.description;
	card.querySelector("small").textContent=`Due:${updatedData.dueDate}`;

	const priolabel = card.querySelector(".priolabel");
	priolabel.className="priolabel";
	priolabel.classList.add(updatedData.priority);
	priolabel.textContent=updatedData.priority.toUpperCase();
}