// находим все карточки и запонимаем данные ответов из каждой карточки
const cards = [...document.querySelectorAll(".card")];

// находим все progress-bar
const progressSegments = document.querySelectorAll(".progress");

// осуществляем вход в приложение
main();

// точка входа в приложение (отображаем первую карточку)
function main() {
  // инициализируем хранилище;
  store.init(cards);
  stepActive(1);
  progressesUpdate(store.getProgressPercent());
}

function stepActive(number) {
  // находим карточку
  const card = document.querySelector(`.card[data-step="${number}"]`);

  if (!card) {
    return;
  }

  // отображаем активную карточку
  for (const card of cards) {
    card.classList.remove("card--active");
  }

  card.classList.add("card--active");

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

  startButton.addEventListener("click", () => stepActive(2));
}

function initStep_02() {
  const card = document.querySelector(`.card[data-step="2"]`);
  const toNextButton = card.querySelector('button[data-action="toNext"]');
  const toPrevButton = card.querySelector('button[data-action="toPrev"]');
  const variants = card.querySelectorAll("[data-value]");

  toNextButton.disabled = true;

  toNextButton.addEventListener("click", () => stepActive(3));
  toPrevButton.addEventListener("click", () => stepActive(1));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    const id = cards.indexOf(card);
    const { value } = this.dataset;
    store.dataUpdate(id, value);

    for (const variant of variants) {
      const radioButton = variant.querySelector('input[type="radio"]');
      radioButton.checked = false;
    }

    const radioButton = this.querySelector('input[type="radio"]');
    radioButton.checked = true;

    toNextButton.disabled = false;

    progressesUpdate(store.getProgressPercent());
  }
}

function initStep_03() {
  const card = document.querySelector(`.card[data-step="3"]`);
  const toNextButton = card.querySelector('button[data-action="toNext"]');
  const toPrevButton = card.querySelector('button[data-action="toPrev"]');
  const variants = card.querySelectorAll("[data-value]");

  toNextButton.disabled = true;

  toNextButton.addEventListener("click", () => stepActive(4));
  toPrevButton.addEventListener("click", () => stepActive(2));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    const id = cards.indexOf(card);
    const { value } = this.dataset;
    const answers = store.dataUpdate(id, value);

    for (const variant of variants) {
      const { value } = variant.dataset;
      const checkbox = variant.querySelector('input[type="checkbox"]');
      checkbox.checked = Boolean(answers.includes(value));
    }

    toNextButton.disabled = !Boolean(answers.length);

    progressesUpdate(store.getProgressPercent());
  }
}

function initStep_04() {
  const card = document.querySelector(`.card[data-step="4"]`);
  const toNextButton = card.querySelector('button[data-action="toNext"]');
  const toPrevButton = card.querySelector('button[data-action="toPrev"]');
  const variants = card.querySelectorAll("[data-value]");

  toNextButton.disabled = true;

  toNextButton.addEventListener("click", () => stepActive(5));
  toPrevButton.addEventListener("click", () => stepActive(3));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    const id = cards.indexOf(card);
    const { value } = this.dataset;
    const answers = store.dataUpdate(id, value);

    for (const variant of variants) {
      const { value } = variant.dataset;
      if (answers.includes(value)) {
        variant.classList.add("variant-square--active");
      } else {
        variant.classList.remove("variant-square--active");
      }
    }

    toNextButton.disabled = !Boolean(answers.length);

    progressesUpdate(store.getProgressPercent());
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

  toNextButton.addEventListener("click", () => stepActive(6));
  toPrevButton.addEventListener("click", () => stepActive(4));

  nameInput.addEventListener("keyup", nameKeyupHandler);
  surnameInput.addEventListener("keyup", surnameKeyupHandler);
  emailInput.addEventListener("keyup", emailKeyupHandler);

  const id = cards.indexOf(card);

  function nameKeyupHandler() {
    const answers = store.dataUpdate(id, this.value, "name");
    nextButtonUpdate(answers);
  }

  function surnameKeyupHandler() {
    const answers = store.dataUpdate(id, this.value, "surname");
    nextButtonUpdate(answers);
  }

  function emailKeyupHandler() {
    const answers = store.dataUpdate(id, this.value, "email");
    nextButtonUpdate(answers);
  }

  function nextButtonUpdate(answers) {
    let active = true;

    if (!answers[0].name) {
      active = false;
    }

    if (!answers[1].surname) {
      active = false;
    }

    if (!answers[2].email) {
      active = false;
    }

    toNextButton.disabled = !active;

    progressesUpdate(store.getProgressPercent());
  }
}

function initStep_06() {
  const card = document.querySelector('.card[data-step="6"]');
  const emailSpan = card.querySelector('span[data-field="email"]');

  emailSpan.textContent = store.getEmail();
}

function progressesUpdate(progressPercent) {
  for (const progressSegment of progressSegments) {
    const progressElement = progressSegment.querySelector("progress");
    const progressTitle = progressSegment.querySelector(".progress-title");

    progressElement.value = progressPercent;
    progressTitle.textContent = `${Math.floor(progressPercent)}%`;
    progressTitle.style.width = `${progressPercent}%`;

    if (progressPercent) {
      progressTitle.style.display = "block";
    } else {
      progressTitle.style.display = "none";
    }
  }
}
