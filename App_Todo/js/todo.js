// Todo manager
// 1. создать задачу
//      а. обработка формы
//          - проверить данные перед добавлением (валидация)
//      б. добавить задачу в массив
//      в. добавить данные в таблицу
//      г. очистить форму
// 2. удалить задачу
//      а. подтверждение
//      б. удаление данных из таблицы
//      в. удаление данных из массива 
// 3. редактировать задачу 
//      а. взять данные из массива
//      б. поместить в форму 
//      в. обработать форму на редактирование
//          - валидация
//      г. обновить данные в массиве
//      д. обновить данные в таблице
//      е. очистить форму


// UI Elements
const formCol = document.querySelector('.form-col');
const form = document.forms['addTodoForm'];
const table = document.querySelector('.table tbody');
const title = form.elements['title'];
const text = form.elements['text'];
const button = form.elements['form-main-btn'];

let editedTask;

/**
 * todosStorage - is an object for storaging all tasks
 * return {{}};
 */
const todosStorage = {
	todos: []	
};

//If there is a need to clean local storage:
//localStorage.clear();

//check if there something is in local storage
if (localStorage.length !== 0) {
	let values = Object.values(localStorage);

	for (let i = 0; i < localStorage.length; i++) {
		todosStorage.todos.push(JSON.parse(values[i]));
		addNewTodoToView(todosStorage.todos[i]);
	}
}


// event handling
form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (!title.value || !text.value) return alertMessage('alert-danger', 'Please, enter both the title and the text!');
	
	if (form.hasAttribute('data-task-id')) {
		editTaskStorage(form.dataset.taskId, title.value, text.value);
		alertMessage('alert-info', 'The task was edited successfully ;)');
		form.removeAttribute('data-task-id');
    	form.reset();
		return;
	}
	// если есть аттр data-task-id
    // вызываем функцию editTaskStorage
    // очистка формы и удалить аттр data-task-id
    
    addNewTodoToStorage(title.value, text.value);
    alertMessage('alert-info', 'The task was added successfully :)');
    form.reset();
});


table.addEventListener('click', (e) => {
	if (e.target.classList.contains('remove-todo')) {
		const id = e.target.closest('[data-id]').dataset.id;
		deleteTodoFromStorage(id);
		alertMessage('alert-info', 'The task was deleted successfully.')
		return;
	}

	if(e.target.classList.contains('edit-todo')) {
		const id = e.target.closest('[data-id]').dataset.id;
		setFormtoEdit(id);
	}
});

/**
 * alertMessage - выводит сообщение
 * @param  {String} className [description]
 * @param  {String} message   [description]
 * @return {[type]}           [description]
 */
function alertMessage(className, message) {
	removeAlert();

	const template = alertTemplate(className, message);
	formCol.insertAdjacentHTML('afterbegin', template);

	setTimeout(removeAlert, 2000);
}

/**
 * removeAlert - удаляет сообщение
 * @return {[type]} [description]
 */
function removeAlert() {
	const currentAlert = document.querySelector('.alert');
	if (currentAlert) formCol.removeChild(currentAlert);
}

/**
 * generateId - создает произвольную строку
 * @return {String} - новый id
 */
const generateId = () => {
	const uniqueValues = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
	let id = '';

	for (let char of uniqueValues) {
		let index = Math.floor( Math.random() * uniqueValues.length );
		id += uniqueValues[index];
	}

	return id;
}

/**
 * [description]
 * @param  {String} title [description]
 * @param  {String} text  [description]
 * @return {[]} currentTodos
 */
function addNewTodoToStorage(title, text) {
	if (!title) return console.log('Please provide todo title');
	if (!text) return console.log('Please provide todo text');

	const newTodo = {title, text, id: generateId()};
	todosStorage.todos.push(newTodo);

	//Update LocalStorage:
	addNewTodoToLocalStorage(newTodo)

	// Добавим в разметку
	addNewTodoToView(newTodo);

	return todosStorage.todos;
};

/**
 * [addNewTodoToLocalStorage description]
 * @param {Object} todo [description]
 * @return {[type]}    [description]
 */
function addNewTodoToLocalStorage(todo) {
	let newTodo = JSON.stringify(todo);
	localStorage.setItem(todo.id, newTodo);
}

/**
 * [description]
 * @param  {String} id [description]
 * @return {[]} currentTodos
 */
function deleteTodoFromStorage(id) {
    const checkIdRes = checkId(id);
    if (checkIdRes.error) return console.log(checkIdRes.msg);
    
    let removedTask;

    for (let i = 0; i < todosStorage.todos.length; i++) {
        if (todosStorage.todos[i].id === id) {
            removedTask = todosStorage.todos.splice(i, 1);
            break;
        }
    }

    //Update LocalStorage:
	deleteTodoFromLocalStorage(removedTask[0].id)

    // удаляем с разметки
    deleteTodoFromView(id);
    
    return removedTask;
 }

/**
 * [deleteTodoFromLocalStorage description]
 * @param  {String} id [description]
 * @return {[type]}    [description]
 */
 function deleteTodoFromLocalStorage(id) {
 	localStorage.removeItem(id);
 }


/**
 * [checkId description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function checkId(id) {
    if (!id) return { error: true, msg: 'Передайте id удаляемой задачи.' };

    const idIsPresent = todosStorage.todos.some((todo) => todo.id === id );
    if (!idIsPresent) return { error: true, msg: 'Задачи с таким id несуществует' };

    return { error: false, msg: '' };
}



// VIEW FUNCTIONS:
/**
 * 
 * @param {String} id 
 */
function deleteTodoFromView(id) {
    const target = document.querySelector(`[data-id="${id}"]`);
    target.parentElement.removeChild(target);
}

/**
 * 
 * @param {*} task 
 */
function addNewTodoToView(todo) {
    const template = todoTemplate(todo);
    table.insertAdjacentHTML('afterbegin', template);
}

/**
 * 
 * @param {*} todo 
 * todo {
 *  id: string;
 *  title: string;
 *  text: string;
 * }
 */
function todoTemplate(todo) {
    return `
        <tr data-id="${todo.id}"> 
            <td>${todo.title}</td>
            <td>${todo.text}</td>
            <td>
                <i class="fas fa-trash remove-todo"></i>
                <i class="fas fa-edit edit-todo"></i>
            </td>
        </tr>
    `;
}

/**
 * 
 * @param {String} className 
 * @param {String} message 
 */
function alertTemplate(className, message) {
    return `
        <div class="alert ${className}">${message}</div>
    `;
}

//addNewTodoToStorage('My title 1', 'My text 1');


// MAKE EDIT WORK:
/**
 * editTaskStorage - обновляет значения свойст обьекта todo (title & text) в todosStorage
 * и вызывает функцию для обновления UI
 * @param  {String} id    [description]
 * @param  {String} title [description]
 * @param  {String} text  [description]
 * @return {       [description]
 */
function editTaskStorage(id, title, text) {
	editedTask.title = title;
	editedTask.text = text;

	//Update LocalStorage:
	updateTodoInLocalStorage(editedTask);

	editTaskView(id, title, text);  

	button.classList.replace('btn-secondary', 'btn-info'); 
	button.textContent = "Add Task";
}

/**
 * [updateTodoInLocalStorage description]
 * @param  {Object} todo [description]
 * @return {[type]}      [description]
 */
	function updateTodoInLocalStorage(todo) {
		let newTodo = JSON.stringify(todo);
		localStorage.setItem(todo.id, newTodo);
	}


/**
 * editTaskView - меняет title & text для отредактированной таски в UI;
 * зависит от todoTemplate
 * @param  {String} id    [description]
 * @param  {String} title [description]
 * @param  {String} text  [description]
 * @return {[type]}       [description]
 */
function editTaskView(id, title, text) {
	let task = document.querySelector(`[data-id=${id}]`);
	//привязка к структуре todoTemplate(todo)
	task.children[0].textContent = title;
	task.children[1].textContent = text;
}

/**
 * setFormtoEdit - таску выбранную для редактирования "помещает" в форму
 * @param {String} id [description]
 * @return {{}}       [description]
 */
function setFormtoEdit(id) {
	for (let i = 0; i < todosStorage.todos.length; i++) {
		if (todosStorage.todos[i].id === id) {	
			editedTask = todosStorage.todos[i];

			title.value = editedTask.title;
			text.value = editedTask.text;

			form.setAttribute('data-task-id', id);

			button.textContent = "Save Task";
			button.classList.replace('btn-info', 'btn-secondary');

			alertMessage('alert-info', 'You can edit selected task!');

			break;
		}
	}
	return editedTask;

    // 1. найти нужную задачу в нашем storage
    // 2. в поле title и text записываем значение title, text с todo котору мы получили из strogae
    // добавить форме атр data-task-id=id;
    // получить доступ к submit кнопке и перезаписать ее на save
}

