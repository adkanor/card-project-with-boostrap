export const cardsContainer = document.querySelector(".cards-place");
import { noItemsBlock } from "./main.js";

// Вікно входу

export class Modal {
  constructor(userEmail, userPassword) {
    this.email = userEmail;
    this.password = userPassword;
  }

  async getToken() {
    let response = await fetch(
      "https://ajax.test-danit.com/api/v2/cards/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.email, password: this.password }),
      }
    );
    let result = await response.text();
    return result;
  }
}

//

export class Visit {
  constructor(name, urgency, short_desc, id, doctor, purpose) {
    this.id = id;
    this.name = name;
    this.urgency = urgency;
    this.short_desc = short_desc;
    this.doctor = doctor;
    this.purpose = purpose;
    this.card = document.createElement("div");
  }

  remove() {
    this.card.remove();
    this.card = document.createElement("div");
  }

  render() {
    this.card.insertAdjacentHTML(
      "beforeend",
      ` <div class="card p-2">
      <div class="d-flex justify-content-end align-start">
      <button type="button" class="btn_status btn btn-outline-info p-0 mx-2">
      <svg class ='m-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
      <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
      <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
    </svg>
  </button>
      <button type="button" class="btn  btn-outline-info p-0 mx-2">
      <svg class = "popup-link edit-button mx-2"xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
    </svg>
  </button>
        <button
          type="button"
          class=" btn btn-outline-info  p-0 mx-2 "

        ><svg  id="${this.id}" class = "closing-button mx-2  " xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
      </svg></button>
      </div>
      <div class ="status ">Status:<svg class ='m-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
      <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
      <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
    </svg> <span>Open</span></div>

      <h5 class="card-title fs-5 fw-medium lh-lg">Name: ${this.name}</h5>
      <div class = "d-flex  flex-row" >
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard2-pulse" viewBox="0 0 16 16">
  <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/>
  <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"/>
  <path d="M9.979 5.356a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.926-.08L4.69 10H4.5a.5.5 0 0 0 0 1H5a.5.5 0 0 0 .447-.276l.936-1.873 1.138 3.793a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h.5a.5.5 0 0 0 0-1h-.128L9.979 5.356Z"/>
</svg>
<h6 class="card-subtitle mb-2  ps-2 text-body-secondary fs-5 fw-medium">
      ${this.doctor}
      </h6> </div>
      <button
        class="btn btn-sm btn-outline-info"
        type="button"
      >
        Більше інформації
      </button>

        `
    );

    this.card.classList.add(
      "visiting-card",
      "col",
      "col-sm-6",
      "col-md-4",
      "col-lg-3",
      "p-1"
    );
    this.card.id = `${this.id}`;
    this.card.draggable = "true";
  }
}

export class VisitCardiologist extends Visit {
  constructor({
    name,
    urgency,
    short_desc,

    pressure,
    body_mass_index,
    diseases,
    age,
    id,
    doctor,
    purpose,
  }) {
    super(name, urgency, short_desc, id, doctor, purpose);
    this.pressure = pressure;
    this.body_mass_index = body_mass_index;
    this.diseases = diseases;
    this.age = age;
  }

  render() {
    super.render();
    this.card.insertAdjacentHTML(
      "beforeend",
      `
      <div class="card card-body hidden">
<p>Стислий опис: ${this.short_desc}</p>
<p>Мета візиту: ${this.purpose}</p>
<p class="period">Терміновість: ${this.urgency}</p>
<p>Вік: ${this.age}</p>
    <p>Тиск: ${this.pressure}</p>
    <p>Індекс маси тіла:${this.body_mass_index}</p>
    <p>Хвороби: ${this.diseases}</p>
</div>
      `
    );
    cardsContainer.append(this.card);
    noItemsBlock.style.display = "none";
  }
}

export class VisitDentist extends Visit {
  constructor({ name, urgency, short_desc, date, id, doctor, purpose }) {
    super(name, urgency, short_desc, id, doctor, purpose);
    this.date = date;
  }
  render() {
    super.render();
    this.card.insertAdjacentHTML(
      "beforeend",
      `
      <div class="card card-body hidden">
<p>Стислий опис: ${this.short_desc}</p>
<p>Мета візиту: ${this.purpose}</p>
<p class="period">Терміновість: ${this.urgency}</p>
<p>Дата: ${this.date}</p>
</div>
      `
    );
    cardsContainer.append(this.card);
    noItemsBlock.style.display = "none";
  }
}

export class VisitTherapist extends Visit {
  constructor({ name, urgency, short_desc, age, id, doctor, purpose }) {
    super(name, urgency, short_desc, id, doctor, purpose);
    this.age = age;
  }
  render() {
    super.render();
    this.card.insertAdjacentHTML(
      "beforeend",
      `
      <div class="card card-body hidden">
<p>Стислий опис: ${this.short_desc}</p>
<p>Мета візиту: ${this.purpose}</p>
<p class="period">Терміновість: ${this.urgency}</p>
<p>Вік: ${this.age}</p>

</div>
      `
    );
    cardsContainer.append(this.card);
    noItemsBlock.style.display = "none";
  }
}
