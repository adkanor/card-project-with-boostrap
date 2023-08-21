import * as classes from "./classes.js";
import * as functions from "./functions.js";
import dragAndDrop from "./drag-and-drop.js";
import { Modal } from "./classes.js";
import { getUserCards } from "./functions.js";
import { publishCards } from "./functions.js";

export const headerBtnOne = document.querySelector(".header__btn-one");
export const headerBtnTwo = document.querySelector(".header__btn-two");
export const formEnter = document.getElementById("enterForm");
export const modalEnter = document.getElementById("exampleModal");
export const noItemsBlock = document.querySelector(".no-cards-text");
export let currentCardId;
export let cardsMap = new Map();
export const filterForCards = document.querySelector(".filter-for-cards");
export const modal = new bootstrap.Modal(
  document.querySelector("#modalForCards")
);
export const f_btn = document.querySelector(".rtn");
export const filter_input = document.querySelector(".input_filter");
export const filter_input_btn = document.querySelector(".btn_filter");
export const filter_status = document.querySelector(".filter_status");
export const form = document.querySelector("#newVisitForm");
export const allDoctorsBlock = form.querySelector("#forAllDoctors");
export const additionalBlock = form.querySelector("#additional");
export const saveBtn = form.querySelector("#create-btn");
export const submitChanges = form.querySelector("#submit-changes-btn");
export let TOKEN = localStorage.getItem("my token");
console.log(TOKEN);

// Checking the token in the local storage, displaying the functional buttons and the inscription No items have been added

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("my token")) {
    headerBtnOne.style.display = "none";
    headerBtnTwo.style.display = "block";
    document.body.style.background = "#bbe1f8";
    let cardsList = getUserCards(TOKEN);
    cardsList.then((result) => {
      console.log(result);
      publishCards(result);
    });
    filterForCards.style.display = "block";
  } else {
    headerBtnOne.style.display = "block";
    headerBtnTwo.style.display = "none";
    filterForCards.style.display = "none";
  }
});

// Verification of user data, obtaining a token, writing to local storage

formEnter.addEventListener("submit", (e) => {
  e.preventDefault();
  let userEmail = formEnter.querySelector('[name = "email"]').value;
  let userPassword = formEnter.querySelector('[name = "password"]').value;
  let user = new Modal(userEmail, userPassword);
  let token = user.getToken();

  token.then((result) => {
    if (result === "Incorrect username or password") {
      alert("Incorrect email or password!!");
    } else {
      localStorage.setItem("my token", result);
      TOKEN = result;
      modalEnter.style.display = "none";
      let displayFon = document.querySelector(".modal-backdrop");
      let parent = displayFon.parentElement;
      parent.removeChild(displayFon);
      headerBtnOne.style.display = "none";
      headerBtnTwo.style.display = "block";
      filterForCards.style.display = "block";
      document.body.style.background = "#bbe1f8";

      let cardsList = getUserCards(result);
      cardsList.then((result) => {
        publishCards(result);
      });
    }
  });
});

// Generic event handler

document.addEventListener("click", (e) => {
  // Click handler for the 'Show more' button on the visit card, calls the showHide function.

  let hasClass = e.target.classList.contains("btn-outline-info");
  if (hasClass) {
    let element_id = e.target.parentElement.parentElement.id;
    console.log(element_id);
    functions.showHide(element_id);
  }

  //  Click handler for the "Close" button on the visit card, calling the deleteCard function.

  let hasDeleteButton = e.target.classList.contains("closing-button");
  if (hasDeleteButton) {
    let card = e.target.parentElement.parentElement.parentElement.parentElement;
    let element_id = e.target.id;
    functions.deleteRequest(element_id, card, TOKEN);
    cardsMap.delete(Number(card.id));
    if (cardsMap.size === 0) {
      noItemsBlock.style.display = "block";
    }
  }

  // Event handler for the "Edit" button,opens a modal window for editing the card

  let buttonToEdit = e.target.classList.contains("edit-button");
  if (buttonToEdit) {
    const card =
      e.target.parentElement.parentElement.parentElement.parentElement;
    currentCardId = card.id;

    async function getObj() {
      let Obj = await functions.getOneCard(card.id, TOKEN);

      modal.show();

      renderAdditionalInformationForModal(Obj.doctor, submitChanges);

      new Map(Object.entries(JSON.parse(JSON.stringify(Obj)))).forEach(
        fillElement
      );
    }
    getObj();
  }
});

// Filling the modal window with data from the object for which the "edit" button was pressed
function fillElement(value, key, map) {
  let tag = form.querySelector("#" + key);
  if (tag == null) {
    return;
  }

  if (tag.tagName == "INPUT") {
    form.querySelector("#" + key).setAttribute("value", value);
  } else if (tag.tagName == "TEXTAREA") {
    form.querySelector("#" + key).textContent = value;
  } else if (tag.tagName == "SELECT") {
    Array.from(tag.children).forEach((option) => {
      option.removeAttribute("selected", "selected");
    });
    tag.querySelector("#" + value).setAttribute("selected", "selected");
  }
}

// Сall a modal window and closing additional information

document.addEventListener("DOMContentLoaded", function () {
  const buttonforModal = document.querySelector("#buttonforModal");
  buttonforModal.addEventListener("click", function () {
    modal.show();
    saveBtn.classList.remove("hidden");
    submitChanges.classList.add("hidden");
    allDoctorsBlock.classList.add("hidden");
    let tag = document.querySelector("#doctor");
    Array.from(tag.children).forEach((option) => {
      option.removeAttribute("selected", "selected");
    });
    tag.children[0].setAttribute("selected", "selected");
    additionalBlock.classList.add("hidden");
  });
});

// Pulling data from the modal window and re-rendering the card to HTML with updated data

submitChanges.addEventListener("click", async function (e) {
  e.preventDefault();
  let data = new FormData(form);
  let object = {};
  data.forEach((value, key) => (object[key] = value));
  let card;
  if (object.doctor === "Cardiologist") {
    card = await functions.editCard(
      classes.VisitCardiologist,
      currentCardId,
      object,
      TOKEN
    );
  } else if (object.doctor === "Therapist") {
    card = await functions.editCard(
      classes.VisitTherapist,
      currentCardId,
      object,
      TOKEN
    );
  } else if (object.doctor === "Dentist") {
    card = await functions.editCard(
      classes.VisitDentist,
      currentCardId,
      object,
      TOKEN
    );
  }
  cardsMap.get(card.id).remove();
  cardsMap.set(card.id, card);
  cardsMap.forEach((innerCard) => {
    innerCard.remove();
    innerCard.render();
  });
  modal.hide();
});

// Opening additional information when choosing a doctor after clicking the button create a visit

form.addEventListener("change", (e) => {
  if (e.target === form.querySelector("#doctor")) {
    renderAdditionalInformationForModal(e.target.value, saveBtn);
  }
});

// Collecting data from a modal window, creating a visit card

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let data = new FormData(form);
  let object = {};
  data.forEach((value, key) => (object[key] = value));
  let card;

  if (object.doctor === "Therapist") {
    card = await functions.createCard(classes.VisitTherapist, object, TOKEN);
  } else if (object.doctor === "Dentist") {
    card = await functions.createCard(classes.VisitDentist, object, TOKEN);
  } else if (object.doctor === "Cardiologist") {
    card = await functions.createCard(classes.VisitCardiologist, object, TOKEN);
  }

  cardsMap.set(card.id, card);
  modal.hide();
});

// Render additional input fields depending on the selected doctor in the modal window
function renderAdditionalInformationForModal(doctorType, button) {
  form.querySelector("#create-btn").classList.add("hidden");
  form.querySelector("#submit-changes-btn").classList.add("hidden");

  if (doctorType === "Cardiologist") {
    allDoctorsBlock.classList.remove("hidden");
    button.classList.remove("hidden");
    additionalBlock.classList.remove("hidden");
    additionalBlock.innerHTML = `
            <!-- Cardoilogist -->
            <div class="col-md-6 col-sm-12">
                <div class="mb-2 form-floating">
                    <input type="number" required class="form-control" name="age" id="age" placeholder="Age" min="1" max="110">
                    <label for="age" class="form-label">Age</label>
                    <div class="invalid-feedback">
                        Enter your age
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-sm-12">
                <div class="mb-2 form-floating">
                    <input type="number" required class="form-control" name="body_mass_index" id="body_mass_index" placeholder="Body mass index" min="18" max="55">
                    <label for="bmi" class="form-label">Body mass index</label>
                    <div class="invalid-feedback">
                        Enter a number
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="input-group mb-2">
                    <span class="input-group-text">Normal pressure</span>
                    <input type="number" required id="pressure" placeholder="Pressure" name="pressure" class="form-control" min="20" max="200">
                </div>
            </div>
            <div class="col-12">
                <div class="mb-2 form-floating">
                    <input type="text" required class="form-control" name="diseases" id="diseases" placeholder="Cardiovascular diseases">
                    <label for="diseases" class="form-label">Cardiovascular diseases</label>
                    <div class="invalid-feedback">
                        Can't be empty!
                    </div>
                </div>
            </div>
        `;
  } else if (doctorType === "Dentist") {
    allDoctorsBlock.classList.remove("hidden");
    button.classList.remove("hidden");
    additionalBlock.classList.remove("hidden");

    additionalBlock.innerHTML = `
            <!-- Dentist -->
            <div class="col-12">
                <div class="mb-2 form-floating">
                    <input type="date" required class="form-control" name="date" id="date" placeholder="Date of last visit">
                    <label for="date" class="form-label">Date of last visit</label>
                    <div class="invalid-feedback">
                        Choose a date
                    </div>
                </div>
            </div>
        `;
  } else if (doctorType === "Therapist") {
    allDoctorsBlock.classList.remove("hidden");
    button.classList.remove("hidden");
    additionalBlock.classList.remove("hidden");

    additionalBlock.innerHTML = `
        <!-- Therapist -->
        <div class="col-12">
            <div class="mb-2 form-floating">
                <input type="number" required class="form-control" name="age" id="age" placeholder="Age" min="1" max="110">
                <label for="age" class="form-label">Age</label>
                <div class="invalid-feedback">
                    Enter your age
                </div>
            </div>
        </div>
        `;
  }
}

//Filters//

f_btn.addEventListener("change", (event) => {
  functions.filterCardsByPeriod(event.target.value);
});

filter_input_btn.addEventListener("click", (event) => {
  functions.filterCardsByTitle(filter_input.value);
});

filter_status.addEventListener("change", (event) => {
  functions.filterCardsByStatus(event.target.value);
});

$(document).on("click", ".btn_status", function () {
  let t = $(this).parent().parent().children().eq(1);
  let g2 = t.children().eq(1);
  g2.text("Done");
  console.log(g2);
});

dragAndDrop();
