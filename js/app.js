const fetchMe = async (url) => {
  let res = await fetch(url);
  let data = res.json();

  return data;
};

const qs = (sl) => document.querySelectorAll(sl);
const css = (sl, obj) => Object.assign(sl.style, obj);
const on = (sl, e, f) => sl.addEventListener(e, f);

let incBy = 2; //edit this to show this number of card data at a time.
let showFrom = 0;
let showMax = incBy;
let localDb = [];

const cardTemplate = (itm) => {
  let featuresList = itm.features.map((str) => `<li>${str}</li>`);
  let linksList = itm.links.map(
    ({ name, url }) => `<li> <a href="${url}">${name}</a> </li>`
  );

  return `
    <div class="app-card">
        <img src="${itm.image}" alt="img" />
        <h3>Features</h3>
        <ul class="features-ul">${featuresList.join("")}</ul>

        <hr>

        <h2>${itm.name}</h2>
        <ul class="links-ul">${linksList.join("")}</ul>
    </div>
    `;
};

//-----------------------
(async () => {
  let { data } = await fetchMe(
    "https://openapi.programming-hero.com/api/ai/tools"
  );
  let { tools } = data;
  localDb = tools;

  tools.forEach((itm, i) => {
    if (i < showMax) {
      qs(".data-div")[0].innerHTML += cardTemplate(itm);
    }
  });

  if (tools.length > showMax) {
    css(qs(".show-more")[0], { display: "inherit" });
  }

  setupPagination();
})();

on(qs(".show-more")[0], "click", () => {
  localDb.forEach((itm, i) => {
    if (i >= showFrom && i < showMax) {
      qs(".data-div")[0].innerHTML += cardTemplate(itm);
    }
  });

  setupPagination();
  willBtnRemain();
});

function setupPagination() {
  showFrom += incBy;
  showMax += incBy;
}

function willBtnRemain() {
  if (showMax == localDb.length) {
    css(qs(".show-more")[0], { display: "none" });
  }
}
