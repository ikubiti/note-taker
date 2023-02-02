// Get the elements to control the app
let noteTitle = document.querySelector('.note-title');
let noteText = document.querySelector('.note-textarea');
let saveNoteBtn = document.querySelector('.save-note');
let newNoteBtn = document.querySelector('.new-note');
let noteList = document.querySelectorAll('.list-container .list-group');
const myModalEl = document.getElementById("myModal");
const confirmEl = document.getElementById("confirmMsg");
const removeNoteEl = document.getElementById("rm-note");
const cancelNoteEl = document.getElementById("cl-note");


// activeNote is used to keep track of the note in the textarea
let activeNote = {};
let noteId = 0;

// Ask user to confirm delete
const confirmDelete = (title) => {
	confirmEl.textContent = `Do you really want to delete the "${title}" note?`;
	myModalEl.style.display = 'block';
};


// Confirm deletion of a note
removeNoteEl.onclick = () => {
	if (activeNote.note_id === noteId) {
		activeNote = {};
	}

	closeModal();
	deleteNote(noteId).then(() => {
		getAndRenderNotes();
		renderActiveNote();
	});
};

// Cancel deletion of a note
cancelNoteEl.onclick = () => {
	closeModal();
};

// close the modal
const closeModal = () => {
	confirmEl.textContent = '';
	myModalEl.style.display = "none";
};


// Show an element
const show = (elem) => {
	elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
	elem.style.display = 'none';
};



const getNotes = () =>
	fetch('/api/notes', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

const saveNote = (note) =>
	fetch('/api/notes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(note),
	});

const deleteNote = (id) =>
	fetch(`/api/notes/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});

const renderActiveNote = () => {
	hide(saveNoteBtn);

	if (activeNote.note_id) {
		noteTitle.setAttribute('readonly', true);
		noteText.setAttribute('readonly', true);
		noteTitle.value = activeNote.title;
		noteText.value = activeNote.text;
	} else {
		noteTitle.removeAttribute('readonly');
		noteText.removeAttribute('readonly');
		noteTitle.value = '';
		noteText.value = '';
	}
};

const handleNoteSave = () => {
	const newNote = {
		title: noteTitle.value,
		text: noteText.value,
	};
	saveNote(newNote).then(() => {
		getAndRenderNotes();
		renderActiveNote();
	});
};

// Delete the clicked note
const handleNoteDelete = (e) => {
	// Prevents the click listener for the list from being called when the button inside of it is clicked
	e.stopPropagation();

	const note = JSON.parse(e.target.parentElement.getAttribute('data-note'));
	noteId = note.note_id;

	// Confirm note deletion
	confirmDelete(note.title);
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
	e.preventDefault();
	activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));

	renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
	activeNote = {};
	renderActiveNote();
};

const handleRenderSaveBtn = () => {
	if (!noteTitle.value.trim() || !noteText.value.trim()) {
		hide(saveNoteBtn);
	} else {
		show(saveNoteBtn);
	}
};

// Render the list of note titles
const renderNoteList = async (notes) => {
	let jsonNotes = await notes.json();
	noteList.forEach((el) => (el.innerHTML = ''));
	let noteListItems = [];

	// Returns HTML element with or without a delete button
	const createLi = (text, delBtn = true) => {
		const liEl = document.createElement('li');
		liEl.classList.add('list-group-item');

		const spanEl = document.createElement('span');
		spanEl.classList.add('list-item-title');
		spanEl.innerText = text;
		spanEl.addEventListener('click', handleNoteView);

		liEl.append(spanEl);

		if (delBtn) {
			const delBtnEl = document.createElement('i');
			delBtnEl.classList.add(
				'fas',
				'fa-trash-alt',
				'float-right',
				'text-danger',
				'delete-note'
			);
			delBtnEl.addEventListener('click', handleNoteDelete);

			liEl.append(delBtnEl);
		}

		return liEl;
	};

	if (jsonNotes.length === 0) {
		noteListItems.push(createLi('No saved Notes', false));
	}

	jsonNotes.forEach((note) => {
		const li = createLi(note.title);
		li.dataset.note = JSON.stringify(note);

		noteListItems.push(li);
	});

	noteListItems.forEach((note) => noteList[0].append(note));
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

saveNoteBtn.addEventListener('click', handleNoteSave);
newNoteBtn.addEventListener('click', handleNewNoteView);
noteTitle.addEventListener('keyup', handleRenderSaveBtn);
noteText.addEventListener('keyup', handleRenderSaveBtn);

getAndRenderNotes();