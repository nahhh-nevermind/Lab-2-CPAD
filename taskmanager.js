const taskmodal = document.getElementById("taskmodal");
const addBtn = document.querySelectorAll(".addTask");
const cancelBtn = document.getElementById("cancel");
const saveBtn = document.getElementById("save");
const filterPrio = document.getElementById("filterpriority");
let tasks = [];
let nextId = 1;
let currentColumn = "";

function createTaskCard(taskObj) {
	const li = document.createElement("li");
	li.setAttribute("data-id", taskObj.id);
	li.classList.add("task-card");

	const title = document.createElement("h3");
	title.classList.add("task-title");
	title.textContent = taskObj.title;

	const desc = document.createElement("p");
	desc.textContent = taskObj.description;

	const prioritylabelling = {
		p1: "Critical",
		p2: "High",
		p3: "Medium",
		p4: "Low"
	}

	const priolabel = document.createElement("span");
	priolabel.classList.add("priolabel", taskObj.priority);
	priolabel.textContent = prioritylabelling[taskObj.priority];

	const date = document.createElement("small");
	date.textContent = `Due:${taskObj.dueDate}`;

	const control = document.createElement("div");
	control.classList.add("control");

	const editBtn = document.createElement("button");
	editBtn.textContent = "Edit";
	editBtn.setAttribute("data-action", "edit");
	editBtn.setAttribute("data-id", taskObj.id);

	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.setAttribute("data-action", "delete");
	deleteBtn.setAttribute("data-id", taskObj.id);

	control.append(editBtn, deleteBtn);
	li.appendChild(title);
	li.appendChild(desc);
	li.appendChild(priolabel);
	li.appendChild(date);
	li.appendChild(control);

	return li;
}

function addTask(columnId, taskObj) {
	const column = document.getElementById(columnId);
	const list = column.querySelector("ul");

	const card = createTaskCard(taskObj);
	list.appendChild(card);

	updateTaskCounter();
}

function deleteTask(taskId) {
	const card = document.querySelector(`[data-id="${taskId}"]`);

	card.classList.add("fade-out");

	setTimeout(() => {
		card.remove();
		tasks = tasks.filter(t => t.id !== taskId);
		updateTaskCounter();
	}, 500);
}

function editTask(taskId) {
	const task = tasks.find(t => t.id === taskId);
	if (!task) return;

	document.getElementById("taskTitle").value = task.title;
	document.getElementById("description").value = task.description;
	document.getElementById("levelpriority").value = task.priority;
	document.getElementById("duedate").value = task.dueDate;

	taskmodal.setAttribute("data-editing-id", taskId);
	taskmodal.style.display = "block";
}

function updateTask(taskId, updatedData) {
	const index = tasks.findIndex(t => t.id === taskId);
	if (index !== -1) {
		tasks[index] = { ...tasks[index], ...updatedData };
	}

	const card = document.querySelector(`[data-id="${taskId}"]`);

	card.querySelector("h3").textContent = updatedData.title;
	card.querySelector("p").textContent = updatedData.description;
	card.querySelector("small").textContent = `Due:${updatedData.dueDate}`;

	const prio = card.querySelector(".priolabel");
	prio.className = `priolabel ${updatedData.priority}`;
	const prioritylabelling = {
		p1: "Critical",
		p2: "High",
		p3: "Medium",
		p4: "Low"
	}

	prio.textContent = priorityMap[updatedData.priority];
}

function updateTaskCounter() {
	document.querySelector(".counter").textContent = `${tasks.length} task(s)`;
}

document.querySelectorAll('.layout section ul').forEach(ul => {
	ul.addEventListener('click', (e) => {
		const action = e.target.getAttribute('data-action');
		const id = parseInt(e.target.getAttribute('data-id'));
		if (!action || isNaN(id)) return;

		if (action === 'delete') deleteTask(id);
		if (action === 'edit') editTask(id);
	})
})

document.querySelector(".layout").addEventListener("dblclick", (e) => {
	if (e.target.classList.contains("task-title")) {
		const titleElement = e.target;
		const originalText = titleElement.textContent;
		const card = titleElement.closest(".task-card");
		const taskId = parseInt(card.getAttribute("data-id"));
		const input = document.createElement("input");
		input.type = "text";
		input.value = originalText;
		input.classList.add("inline-edit-input");

		const saveInlineChange = () => {
			const newTitle = input.value.trim() || originalText;
			titleElement.textContent = newTitle;
			input.replaceWith(titleElement);

			const task = tasks.find(t => t.id === taskId);
			if (task) task.title = newTitle;
		};

		input.addEventListener("blur", saveInlineChange);
		input.addEventListener("keydown", (event) => {
			if (event.key === "Enter") saveInlineChange();
		});

		titleElement.replaceWith(input);
		input.focus();
	}
});

filterPrio.addEventListener("change", (e) => {
	const selectedValue = e.target.value;
	const card = document.querySelectorAll(".task-card");

	card.forEach(card => {
		const cardPrioLabel = card.querySelector(".priolabel");
		const match = cardPrioLabel.classList.contains(selectedValue);

		card.classList.toggle("is-hidden", selectedValue !== "all" && !match);
	});
});

const clearDoneBtn = document.getElementById("clearDone");
if (clearDoneBtn) {
	clearDoneBtn.addEventListener("click", () => {
		const doneCard = document.querySelectorAll("#done ul li");

		doneCard.forEach((card, index) => {
			setTimeout(() => {
				const taskId = parseInt(card.getAttribute("data-id"));
				card.classList.add("fade-out");

				setTimeout(() => {
					card.remove();
					tasks = tasks.filter(t => t.id !== taskId);
					updateTaskCounter();
				}, 500);
			}, index * 100);
		});
	});
};

addBtn.forEach(btn => {
	btn.addEventListener("click", () => {
		currentColumn = btn.parentElement.id;
		taskmodal.style.display = "block";
	});
});

cancelBtn.addEventListener("click", () => {
	taskmodal.style.display = "none";
	taskmodal.removeAttribute("data-editing-id");
});

saveBtn.addEventListener("click", () => {
	const title = document.getElementById("taskTitle").value;
	const description = document.getElementById("description").value;
	const priority = document.getElementById("levelpriority").value;
	const dueDate = document.getElementById("duedate").value;

	if (!title) return alert("Please enter a title");

	const editingId = taskmodal.getAttribute("data-editing-id");

	if (editingId) {
		updateTask(parseInt(editingId), {
			title, description, priority, dueDate
		})
	}
	else {
		const newTask = { id: nextId++, title, description, priority, dueDate };
		tasks.push(newTask);
		addTask(currentColumn, newTask);
	}

	taskmodal.style.display = "none";
	taskmodal.removeAttribute("data-editing-id");
	document.getElementById("taskTitle").value = "";
	document.getElementById("description").value = "";
});