// находим все карточки и запонимаем данные ответов из каждой карточки
const cards = document.querySelectorAll('.card');


// создаем шаблон для проверки ввода email и находим все progress-bar
const mailRe =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const progressSegments = document.querySelectorAll('.progress');

// создаем объект для хранения данных;
const data = {
	q1: null,
	q2: [],
	q3: [],
	q4: {
		name: '',
		surname: '',
		email: '',
	},
};


// осуществляем вход в приложение
main();

// точка входа в приложение (отображаем первую карточку)
function main() {
	stepActive(1);
	progressesUpdate();
}

function stepActive(number) {
	// находим карточку
	const card = document.querySelector(`.card[data-step="${number}"]`);

	if (!card) {
		return;
	}

	// отображаем активную карточку
	for (const card of cards) {
		card.classList.remove('card--active');
	}

	card.classList.add('card--active');

	// проверяем инициализацию карточки и инициализируем ее при необходимости
	if (card.dataset.inited) {
		return;
	}

	card.dataset.inited = true;

	if (number === 1) {
		initStep_01();
	} else if (number === 2) {
		initStep_02();
	} else if (number === 3) {
		initStep_03();
	} else if (number === 4) {
		initStep_04();
	} else if (number === 5) {
		initStep_05();
	} else if (number === 6) {
		initStep_06();
	}
}

// инициализация каждой отдельной карточки и логика ее работы
function initStep_01() {
	const card = document.querySelector(`.card[data-step="1"]`);
	const startButton = card.querySelector('button[data-action="start"]');

	startButton.addEventListener('click', () => stepActive(2));
}

function initStep_02() {
	const card = document.querySelector(`.card[data-step="2"]`);
	const toNextButton = card.querySelector('button[data-action="toNext"]');
	const toPrevButton = card.querySelector('button[data-action="toPrev"]');
	const variants = card.querySelectorAll('[data-value]');

	toNextButton.disabled = true;

	toNextButton.addEventListener('click', () => stepActive(3));
	toPrevButton.addEventListener('click', () => stepActive(1));

	for (const variant of variants) {
		variant.addEventListener('click', variantClickHandler);
	}

	function variantClickHandler() {
		data.q1 = this.dataset.value;

		for (const variant of variants) {
			const radioButton = variant.querySelector('input[type="radio"]');
			radioButton.checked = false;
		}

		const radioButton = this.querySelector('input[type="radio"]');
		radioButton.checked = true;

		toNextButton.disabled = false;

		progressesUpdate();
	}
}

function initStep_03() {
	const card = document.querySelector(`.card[data-step="3"]`);
	const toNextButton = card.querySelector('button[data-action="toNext"]');
	const toPrevButton = card.querySelector('button[data-action="toPrev"]');
	const variants = card.querySelectorAll('[data-value]');

	toNextButton.disabled = true;

	toNextButton.addEventListener('click', () => stepActive(4));
	toPrevButton.addEventListener('click', () => stepActive(2));

	for (const variant of variants) {
		variant.addEventListener('click', variantClickHandler);
	}

	function variantClickHandler() {
		const { value } = this.dataset;
		toggleItem(data.q2, value);

		for (const variant of variants) {
			const { value } = variant.dataset;
			const checkbox = variant.querySelector('input[type="checkbox"]');
			checkbox.checked = data.q2.includes(value);
		}
		
		toNextButton.disabled = !Boolean(data.q2.length);

		progressesUpdate();
	}
}

function initStep_04() {
	const card = document.querySelector(`.card[data-step="4"]`);
	const toNextButton = card.querySelector('button[data-action="toNext"]');
	const toPrevButton = card.querySelector('button[data-action="toPrev"]');
	const variants = card.querySelectorAll('[data-value]');

	toNextButton.disabled = true;

	toNextButton.addEventListener('click', () => stepActive(5));
	toPrevButton.addEventListener('click', () => stepActive(3));

	for (const variant of variants) {
		variant.addEventListener('click', variantClickHandler);
	}

	function variantClickHandler() {
		const { value } = this.dataset;
		toggleItem(data.q3, value);

		for (const variant of variants) {
			if (data.q3.includes(variant.dataset.value)) {
				variant.classList.add('variant-square--active');
			} else {
				variant.classList.remove('variant-square--active');
			}
		}
		
		toNextButton.disabled = !Boolean(data.q3.length);

		progressesUpdate();
	}
}

function initStep_05() {
	const card = document.querySelector('.card[data-step="5"]');
	const toNextButton = card.querySelector('button[data-action="toNext"]');
	const toPrevButton = card.querySelector('button[data-action="toPrev"]');

	const nameInput = card.querySelector('input[data-field="name"]');
	const surnameInput = card.querySelector('input[data-field="surname"]');
	const emailInput = card.querySelector('input[data-field="email"]');


	toNextButton.disabled = true;

	toNextButton.addEventListener('click', () => stepActive(6));
	toPrevButton.addEventListener('click', () => stepActive(4));

	nameInput.addEventListener('keyup', nameKeyupHandler);
	surnameInput.addEventListener('keyup', surnameKeyupHandler);
	emailInput.addEventListener('keyup', emailKeyupHandler);

	function nameKeyupHandler() {
		data.q4.name = this.value;
		nextButtonUpdate();
	}
	
	function surnameKeyupHandler() {
		data.q4.surname = this.value;
		nextButtonUpdate();
	}
	
	function emailKeyupHandler() {
		data.q4.email = this.value;
		nextButtonUpdate();
	}

	function nextButtonUpdate() {
		let active = true;

		if (!data.q4.name) {
			active = false;
		}

		if (!data.q4.surname) {
			active = false;
		}

		if (!mailRe.test(data.q4.email)) {
			active = false;
		}

		toNextButton.disabled = !active;

		progressesUpdate();
	}
}

function initStep_06() {
	const card = document.querySelector('.card[data-step="6"]');
	const emailSpan = card.querySelector('span[data-field="email"]');

	emailSpan.textContent = data.q4.email;
}



function toggleItem(array, item) {
	const index = array.indexOf(item);

	if (index === -1) {
		array.push(item);
	} else {
		array.splice(index, 1);
	}
}

function progressesUpdate() {
	let progressValue = 0;

	if (data.q1) {
		progressValue += 1;
	}

	if (data.q2.length) {
		progressValue += 1;
	}

	if (data.q3.length) {
		progressValue += 1;
	}

	if (data.q4.name) {
		progressValue += 1;
	}

	if (data.q4.surname) {
		progressValue += 1;
	}

	if (mailRe.test(data.q4.email)) {
		progressValue += 1;
	}

	const progressPercent = progressValue / 6 * 100;

	for (const progressSegment of progressSegments) {
		const progressElement = progressSegment.querySelector('progress');
		const progressTitle = progressSegment.querySelector('.progress-title');

		progressElement.value = progressPercent;
		progressTitle.textContent = `${Math.floor(progressPercent)}%`;
		progressTitle.style.width = `${progressPercent}%`;

		if (progressPercent) {
			progressTitle.style.display = 'block';
		}else {
			progressTitle.style.display = 'none';
		}
	}
}