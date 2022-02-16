// находим все карточки и запонимаем данные ответов из каждой карточки
const cards = [...document.querySelectorAll(".card")];

// создаем шаблон для проверки ввода email и находим все progress-bar
const mailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const progressSegments = document.querySelectorAll(".progress");

// осуществляем вход в приложение
main();

// точка входа в приложение (отображаем первую карточку)
function main() {
  // Записываем в localStorage основу для хранения данных / делаем рендеринг если в localStorage есть данные;
  if (!localStorage.length) {
    populateStorage();
  } else {
    renderUpdate();
  }

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

  toNextButton.addEventListener("click", () => stepActive(3));
  toPrevButton.addEventListener("click", () => stepActive(1));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    localStorage.q1 = this.dataset.value;

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
  const variants = card.querySelectorAll("[data-value]");

  toNextButton.addEventListener("click", () => stepActive(4));
  toPrevButton.addEventListener("click", () => stepActive(2));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    const { value } = this.dataset;
    const answers = toggleItem(localStorage.getItem("q2"), value);

    localStorage.q2 = answers.join();

    for (const variant of variants) {
      const { value } = variant.dataset;
      const checkbox = variant.querySelector('input[type="checkbox"]');
      checkbox.checked = answers.includes(value);
    }

    toNextButton.disabled = !Boolean(localStorage.q2.length);

    progressesUpdate();
  }
}

function initStep_04() {
  const card = document.querySelector(`.card[data-step="4"]`);
  const toNextButton = card.querySelector('button[data-action="toNext"]');
  const toPrevButton = card.querySelector('button[data-action="toPrev"]');
  const variants = card.querySelectorAll("[data-value]");

  toNextButton.addEventListener("click", () => stepActive(5));
  toPrevButton.addEventListener("click", () => stepActive(3));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    const { value } = this.dataset;
    const answers = toggleItem(localStorage.getItem("q3"), value);

    localStorage.q3 = answers.join();

    for (const variant of variants) {
      if (answers.includes(variant.dataset.value)) {
        variant.classList.add("variant-square--active");
      } else {
        variant.classList.remove("variant-square--active");
      }
    }

    toNextButton.disabled = !Boolean(localStorage.q3.length);

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

  toNextButton.addEventListener("click", () => stepActive(6));
  toPrevButton.addEventListener("click", () => stepActive(4));

  nameInput.addEventListener("keyup", nameKeyupHandler);
  surnameInput.addEventListener("keyup", surnameKeyupHandler);
  emailInput.addEventListener("keyup", emailKeyupHandler);

  function nameKeyupHandler() {
    localStorage.name = this.value;
    nextButtonUpdate();
  }

  function surnameKeyupHandler() {
    localStorage.surname = this.value;
    nextButtonUpdate();
  }

  function emailKeyupHandler() {
    if (mailRe.test(this.value)) {
      localStorage.email = this.value;
    } else {
      localStorage.email = "";
    }
    nextButtonUpdate();
  }

  function nextButtonUpdate() {
    let active = true;

    if (!localStorage.name) {
      active = false;
    }

    if (!localStorage.surname) {
      active = false;
    }

    if (!localStorage.email) {
      active = false;
    }

    toNextButton.disabled = !active;

    progressesUpdate();
  }
}

function initStep_06() {
  const card = document.querySelector('.card[data-step="6"]');
  const emailSpan = card.querySelector('span[data-field="email"]');

  emailSpan.textContent = localStorage.email;
}

function populateStorage() {
  localStorage.setItem("q1", "");
  localStorage.setItem("q2", "");
  localStorage.setItem("q3", "");
  localStorage.setItem("name", "");
  localStorage.setItem("surname", "");
  localStorage.setItem("email", "");
  localStorage.setItem("progressValue", "");
}

function renderUpdate() {
  for (let i = 1; i < cards.length - 1; i++) {
    if (i === 1) {
      const variants = cards[i].querySelectorAll("[data-value]");
      const toNextButton = cards[i].querySelector(
        'button[data-action="toNext"]'
      );

      for (const variant of variants) {
        if (variant.dataset.value === localStorage.q1) {
          const radioButton = variant.querySelector('input[type="radio"]');
          radioButton.checked = true;
        }
      }

      toNextButton.disabled = !Boolean(localStorage.q1.length);
    } else if (i === 2) {
      const variants = cards[i].querySelectorAll("[data-value]");
      const toNextButton = cards[i].querySelector(
        'button[data-action="toNext"]'
      );
      const answers = localStorage.q2.split(",");

      for (const variant of variants) {
        if (answers.includes(variant.dataset.value)) {
          const checkbox = variant.querySelector('input[type="checkbox"]');
          checkbox.checked = true;
        }
      }

      toNextButton.disabled = !Boolean(localStorage.q2.length);
    } else if (i === 3) {
      const variants = cards[i].querySelectorAll("[data-value]");
      const toNextButton = cards[i].querySelector(
        'button[data-action="toNext"]'
      );
      const answers = localStorage.q3.split(",");

      for (const variant of variants) {
        if (answers.includes(variant.dataset.value)) {
          variant.classList.add("variant-square--active");
        } else {
          variant.classList.remove("variant-square--active");
        }
      }

      toNextButton.disabled = !Boolean(localStorage.q3.length);
    } else {
      const nameInput = cards[i].querySelector('input[data-field="name"]');
      const surnameInput = cards[i].querySelector(
        'input[data-field="surname"]'
      );
      const emailInput = cards[i].querySelector('input[data-field="email"]');
      const toNextButton = cards[i].querySelector(
        'button[data-action="toNext"]'
      );

      nameInput.value = localStorage.name;
      surnameInput.value = localStorage.surname;
      emailInput.value = localStorage.email;

      if (
        localStorage.name.length &&
        localStorage.surname.length &&
        localStorage.email.length
      ) {
        toNextButton.disabled = false;
      }
    }
  }

  progressesUpdate();
}

function toggleItem(str, value) {
  const answers = str.split(",");

  if (!answers.includes(value)) {
    answers.push(value);
  } else {
    const index = answers.indexOf(value);
    answers.splice(index, 1);
  }

  return answers;
}

function progressesUpdate() {
  localStorage.progressValue = "0";

  for (let key of Object.keys(localStorage)) {
    if (key === "progressValue") {
      continue;
    }

    if (localStorage[key].length) {
      localStorage.progressValue =
        parseInt(localStorage.getItem("progressValue"), 10) + 1;
    }
  }

  const progressPercent =
    (parseInt(localStorage.getItem("progressValue"), 10) / 6) * 100;

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
