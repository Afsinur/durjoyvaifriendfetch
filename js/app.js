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

  return `
    <div class="app-card">
        <img src="${itm.image}" alt="img" />
        <h3>Features</h3>
        <ul class="features-ul">${featuresList.join("")}</ul>

        <hr>

        <h2>${itm.name}</h2>
        <div class="date-container">
          <div>
            <i class="fa fa-calendar"></i>
            <p>${itm.published_in}</p>
          </div>

          <div><i class="fa fa-arrow-right" data-id="${itm.id}"></i></div>
        </div>  
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
  console.log(tools);

  initShowCard(tools);
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

on(qs(".fa-window-close")[0], "click", () => {
  css(qs(".modal")[0], {
    display: "none",
  });

  css(qs(".sub-details")[0], {
    display: "none",
  });
});

on(qs(".sort-by-date")[0], "click", () => {
  sortByDate();
});

function initShowCard(arr) {
  arr.forEach((itm, i) => {
    if (i < showMax) {
      qs(".data-div")[0].innerHTML += cardTemplate(itm);
    }
  });

  if (arr.length > showMax) {
    css(qs(".show-more")[0], { display: "inherit" });
  }

  setupPagination();
}

function setupPagination() {
  showFrom += incBy;
  showMax += incBy;

  setupModals();
}

function willBtnRemain() {
  if (showFrom >= localDb.length) {
    css(qs(".show-more")[0], { display: "none" });
  }
}

function setupModals() {
  qs(".fa-arrow-right").forEach((itm) => {
    on(itm, "click", async () => {
      css(qs(".modal")[0], {
        display: "flex",
      });

      css(qs(".details-loading")[0], {
        display: "flex",
      });

      let link_ = `https://openapi.programming-hero.com/api/ai/tool/${itm.dataset.id}`;

      let { data } = await fetchMe(link_);
      console.log(data);
      let {
        description,
        pricing,
        features,
        integrations,
        image_link,
        accuracy,
        input_output_examples,
      } = data;

      qs(".top-left-h4")[0].innerHTML = description;

      if (pricing) {
        qs(".plan-left .plan-span")[0].innerHTML = pricing[0].plan;
        qs(".plan-left .price-span")[0].innerHTML = pricing[0].price;

        qs(".plan-middle .plan-span")[0].innerHTML = pricing[1].plan;
        qs(".plan-middle .price-span")[0].innerHTML = pricing[1].price;

        qs(".plan-right .plan-span")[0].innerHTML = pricing[2].plan;
        qs(".plan-right .price-span")[0].innerHTML = pricing[2].price;
      } else {
        qs(".plan-left .plan-span")[0].innerHTML = "Free of Cost/";
        qs(".plan-left .price-span")[0].innerHTML = "Basic";

        qs(".plan-middle .plan-span")[0].innerHTML = "Free Of Cost/";
        qs(".plan-middle .price-span")[0].innerHTML = "Pro";

        qs(".plan-right .plan-span")[0].innerHTML = "Free of Cost /";
        qs(".plan-right .price-span")[0].innerHTML = "Enterprise";
      }

      let featuresArr = Object.values(features);
      let featuresArrLi = featuresArr
        .map(({ feature_name }) => `<li>${feature_name}</li>`)
        .join("");
      qs(".modal-features-ul")[0].innerHTML = featuresArrLi;

      if (integrations) {
        let integrationsArrLi = integrations
          .map((itm) => `<li>${itm}</li>`)
          .join("");
        qs(".modal-integrations-ul")[0].innerHTML = integrationsArrLi;
      } else {
        qs(
          ".modal-integrations-ul"
        )[0].innerHTML = `<li class="integration-empty-li">No data Found</li>`;
      }

      qs(".right-img-container img")[0].src = image_link[0];

      qs(".accuracy-span span")[0].innerHTML = accuracy.score * 100;

      if (input_output_examples) {
        let [inpOutObj] = input_output_examples;
        let { input, output } = inpOutObj;

        qs(".bottom-img-details-container h4")[0].innerHTML = input;
        qs(".bottom-img-details-container p")[0].innerHTML = output;
      } else {
        qs(
          ".bottom-img-details-container h4"
        )[0].innerHTML = `Can you give any example?`;
        qs(
          ".bottom-img-details-container p"
        )[0].innerHTML = `No! Not Yet! Take a break!!!`;
      }

      css(qs(".sub-details")[0], {
        display: "flex",
      });

      css(qs(".details-loading")[0], {
        display: "none",
      });
    });
  });
}

function resetPagination() {
  qs(".data-div")[0].innerHTML = ``;
  showFrom = 0;
  showMax = incBy;
  initShowCard(localDb);
}

function sortByDate() {
  let localDbCopy = localDb.map((itm) => itm);

  let sortByDayArr = localDbCopy.sort((a, b) => {
    let aCom = a.published_in.split("/")[0];
    let bCom = b.published_in.split("/")[0];

    if (Number(bCom) > Number(aCom)) {
      return 1;
    } else {
      return -1;
    }
  });

  let sortByMonthArr = sortByDayArr.sort((a, b) => {
    let aCom = a.published_in.split("/")[1];
    let bCom = b.published_in.split("/")[1];

    if (Number(bCom) > Number(aCom)) {
      return 1;
    } else {
      return -1;
    }
  });

  let sortByYearArr = sortByMonthArr.sort((a, b) => {
    let aCom = a.published_in.split("/")[2];
    let bCom = b.published_in.split("/")[2];

    if (Number(bCom) > Number(aCom)) {
      return 1;
    } else {
      return -1;
    }
  });

  localDb = sortByYearArr;

  resetPagination();
}
