(() => {
  const store = {};

  let data = [];

  const mailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  store.init = (cards) => {
    data = cards.map((card, id) => ({
      id,
      card,
      answers: [],
      progressValue: 0
    }));
  };

  store.dataUpdate = (id, value, field = null) => {
    // store.dataUpdate = (id, value, isEmail = false) => {
    const item = data.find((item) => item.id === id);

    if (id === 1) {
      item.answers.splice(0);
      item.answers.push(value);
      item.progressValue = 1;
    } else if (id === 2 || id === 3) {
      if (!item.answers.includes(value)) {
        item.answers.push(value);
        item.progressValue = 1;
      } else {
        const index = item.answers.indexOf(value);
        item.answers.splice(index, 1);
        item.progressValue = item.answers.length ? 1 : 0;
      }
    } else if (id === 4) {
      if (!item.answers.length) {
        item.answers.push({ name: "" }, { surname: "" }, { email: "" });
      }

      for (const elem of item.answers) {
        if (elem.hasOwnProperty(field)) {
          if (field === "email") {
            elem[field] = mailRe.test(value) ? value : "";
          } else {
            elem[field] = value;
          }
          break;
        }
      }

      item.progressValue = 0;
      for (const elem of item.answers) {
        const value = elem[Object.keys(elem)[0]];
        if (value.length) {
          item.progressValue += 1;
        }
      }
    }

    return getCopy(item.answers);
  };

  store.getProgressPercent = () => {
    const sumProgressValues = data
      .map((item) => item.progressValue)
      .reduce((a, b) => a + b);
    const progressPercent = (sumProgressValues / 6) * 100;

    return progressPercent;
  };

  store.getEmail = () => {
    const email = data[4].answers[2].email;
    return email;
  };

  window.store = store;

  function getCopy(x) {
    return JSON.parse(JSON.stringify(x));
  }
})();
