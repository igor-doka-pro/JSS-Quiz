// находим все карточки и запонимаем данные ответов из каждой карточки
const cards = document.querySelectorAll('.card');

// создаем шаблон для проверки ввода email и находим все progress-bar
const mailRe =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const progressSegments = document.querySelectorAll('.progress');

// создаем DOM-хранилище для будущих ответов;
for (let i = 1; i <= 4; i++) {
	if (i === 1) {
		cards[i].dataset.answer = '';
		cards[i].dataset.progressValue = '0';
	} else if (1 < i && i < 4) {
		cards[i].dataset.answers = '';
		cards[i].dataset.progressValue = '0';
	} else {
		cards[i].dataset.name = '';
		cards[i].dataset.surname = '';
		cards[i].dataset.email = '';
		cards[i].dataset.progressValue = '0';

		let inputs = cards[i].querySelectorAll('input[data-field]');
		for (let j = 0; j < inputs.length; j++) {
			inputs[j].dataset.progressV = '0';
		}
	}
}


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
		const data = card.dataset;
		data.answer = this.dataset.value;

		for (const variant of variants) {
			const radioButton = variant.querySelector('input[type="radio"]');
			radioButton.checked = false;
		}

		const radioButton = this.querySelector('input[type="radio"]');
		radioButton.checked = true;

		data.progressValue = data.answer.length ? '1' : '0';
		progressesUpdate();

		toNextButton.disabled = false;
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
		const data = card.dataset;
		const checkbox = this.querySelector('input[type="checkbox"]');
		
		checkbox.checked = toggleItem(data, value);

		data.progressValue = data.answers.length ? '1' : '0';
		progressesUpdate();

		toNextButton.disabled = !Boolean(data.answers.length);
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
		const data = card.dataset;
		toggleItem(data, value);

		const answers = data.answers.split(',');
		for (const variant of variants) {
			if (answers.includes(variant.dataset.value)) {
				variant.classList.add('variant-square--active');
			} else {
				variant.classList.remove('variant-square--active');
			}
		}
		
		data.progressValue = data.answers.length ? '1' : '0';
		progressesUpdate();

		toNextButton.disabled = !Boolean(data.answers.length);
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
		const data = card.dataset;
		data.name = this.value;
		
		this.dataset.progressV = data.name ? '1' : '0';
		data.progressValue = [...document.querySelectorAll('input[data-progress-v]')]
												.map(input => parseInt(input.dataset.progressV, 10))
												.reduce((a, b) => a + b);
		
		toNextButton.disabled = !nextButtonUpdate(data);
	}
	
	function surnameKeyupHandler() {
		const data = card.dataset;
		data.surname = this.value;

		this.dataset.progressV = data.surname ? '1' : '0';
		data.progressValue = [...document.querySelectorAll('input[data-progress-v]')]
												.map(input => parseInt(input.dataset.progressV, 10))
												.reduce((a, b) => a + b);

		toNextButton.disabled = !nextButtonUpdate(data);
	}
	
	function emailKeyupHandler() {
		const data = card.dataset;

		if (mailRe.test(this.value)) {
			data.email = this.value;
		} else {
			data.email = '';
		}

		this.dataset.progressV = data.email ? '1' : '0';
		data.progressValue = [...document.querySelectorAll('input[data-progress-v]')]
												.map(input => parseInt(input.dataset.progressV, 10))
												.reduce((a, b) => a + b);

		toNextButton.disabled = !nextButtonUpdate(data);
	}

	function nextButtonUpdate(data) {
		let active = true;

		if (!data.name) {
			active = false;
		}

		if (!data.surname) {
			active = false;
		}

		if (!mailRe.test(data.email)) {
			active = false;
		}

		progressesUpdate();

		return active;
	}
}

function initStep_06() {
	const card = document.querySelector('.card[data-step="6"]');
	const prevCard = document.querySelector('.card[data-step="5"]');
	const emailSpan = card.querySelector('span[data-field="email"]');

	emailSpan.textContent = prevCard.dataset.email;
}


function toggleItem(data, item) {
	const answers = data.answers.split(',');
	let flag = false;

	if (!answers.includes(item)) {
		answers.push(item);
		flag = true;
	} else {
		const index = answers.indexOf(item);
		answers.splice(index, 1);
	}
	data.answers = answers.join(',');

	return flag;
}

function progressesUpdate() {
	const sumProgressValues = [...document.querySelectorAll('[data-progress-value]')]
														.map(card => parseInt(card.dataset.progressValue, 10))
														.reduce((a, b) => a + b);

	const progressPercent = sumProgressValues / 6 * 100;

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