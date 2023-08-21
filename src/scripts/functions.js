import * as main from "./main.js";
import * as classes from "./classes.js";
import { TOKEN } from "./main.js";
import { noItemsBlock } from "./main.js";
import { cardsMap } from "./main.js";

let no_item_filter = document.querySelector(".hide");

// Get all cards

export async function getUserCards(TOKEN) {
  let response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  let result = await response.json();
  console.log(result);
  return result;
}

// checking whether there are cards in the array, if not, publishing No items have been added, publishing cards per page.

export function publishCards() {
  let cardsList = getUserCards(TOKEN);
  cardsList.then((result) => {
    console.log(result);
    if (result.length === 0) {
      noItemsBlock.style.display = "block";
    } else {
      result.forEach((visit) => {
        console.log(visit);
        if (visit.doctor === "Cardiologist") {
          let cardCardio = new classes.VisitCardiologist(visit);
          cardsMap.set(cardCardio.id, cardCardio);
          cardCardio.render();
        } else if (visit.doctor === "Therapist") {
          let cardTherapist = new classes.VisitTherapist(visit);
          cardsMap.set(cardTherapist.id, cardTherapist);
          cardTherapist.render();
        } else if (visit.doctor === "Dentist") {
          let card = new classes.VisitDentist(visit);
          cardsMap.set(card.id, card);
          card.render();
        }
      });
    }
  });
};



// The function takes the class and the object, creates new card and calls post requests
export async function createCard(className, Obj, TOKEN) {
  console.log(TOKEN);
  let card = await postRequest(TOKEN, Obj);
  let newCard = new className(card);
  console.log(newCard);
  newCard.render();
  return newCard;
}

//The function post-request to the server, returns a card-object (with data + id)

export async function postRequest(TOKEN, obj) {
  try {
    let response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("There has been a problem with fetch operation:", error);
  }
}

//The function opens & closes additional information in cards

export function showHide(element_id) {
  if (document.getElementById(element_id)) {
    let obj = document.getElementById(element_id);
    let hiddenText = obj.children[1];

    if (hiddenText.style.display != "block") {
      hiddenText.style.display = "block";
    } else hiddenText.style.display = "none";
  }
}
//The function that removes the card from the DOM tree and sends a delete request to the server

export async function deleteRequest(id, card, TOKEN) {
  try {
    const response = await fetch(
      "https://ajax.test-danit.com/api/v2/cards/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    console.log(response);
    card.remove();
  } catch (error) {
    console.error("There has been a problem with fetch operation:", error);
  }
}
//The function that get info about one card

export async function getOneCard(id, TOKEN) {
  try {
    const response = await fetch(
      "https://ajax.test-danit.com/api/v2/cards/" + id,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    let json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error("There has been a problem with fetch operation:", error);
  }
}

// The function takes the class and the object, change the card and calls put requests

export async function editCard(className, id, obj, TOKEN) {
  let card = await editRequest(id, obj, TOKEN);
  let newCard = new className(card);
  return newCard;
}

//The function put-request to the server

export async function editRequest(id, obj, TOKEN) {
  try {
    const response = await fetch(
      "https://ajax.test-danit.com/api/v2/cards/" + id,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(obj),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("There has been a problem with fetch operation:", error);
  }
}

//Функция фильтрации карточек

export function cardDisplayValidation(data){
  data.classList.add("filter_cards_show");
  if (data.classList.contains("filter_cards_show")) {
    data.classList.remove("filter_cards_show");
    data.classList.add("filter_cards");
  } else {
    data.classList.add("filter_cards_show");
    data.classList.remove("filter_cards");
  }
}


export function filterCardsByPeriod(target) {
  let cards_period = document.querySelectorAll(".visiting-card");
  let counter = 0;
  console.log(counter)

    cards_period.forEach((data) => {
      let card = data.lastElementChild.children.item(2);

      cardDisplayValidation(data)

      if (card.textContent == `Терміновість: ${target}`) {
        data.classList.remove("filter_cards");
        data.classList.add("filter_cards_show");
        no_item_filter.classList.add("hide");
      } else if (target == "Urgency/All Cards") {
        data.classList.remove("filter_cards");
        data.classList.add("filter_cards_show");

        no_item_filter.classList.add("hide");
      }
      if (!data.classList.contains("filter_cards_show")) {
        counter++;
        if (counter == cards_period.length) {
          no_item_filter.classList.remove("hide");
        } else {
          no_item_filter.classList.add("hide");
        }
      }
    });
  }



export function filterCardsByTitle(target) {
  let cards_period = document.querySelectorAll(".visiting-card");
  let cards_title = document.querySelectorAll(".card-title");
  let counter = 0;
  console.log(cards_period);
    cards_title.forEach((data) => {
      let card = data.parentElement.parentElement;
      cardDisplayValidation(card)

      if (data.textContent == `Name: ${target}`) {
        console.log(data.textContent, target);
        card.classList.remove("filter_cards");
        card.classList.add("filter_cards_show");
      }

      //если нет элементов, то показывать надпись(No items have been funded)
      if (!card.classList.contains("filter_cards_show")) {
        counter++;
        if (counter == cards_period.length) {
          no_item_filter.classList.remove("hide");
        } else {
          no_item_filter.classList.add("hide");
        }
      }
      main.filter_input.value = "";
    });
}



export function filterCardsByStatus(target) {
  let cards_period = document.querySelectorAll(".visiting-card");
  let counter = 0;
  console.log(cards_period);
  //проверка какой тип фильтрации был выбрал
    cards_period.forEach((data) => {
      let card = data.firstElementChild.children.item(1).children.item(1);
      cardDisplayValidation(data)
      if (card.textContent == target) {
        data.classList.remove("filter_cards");
        data.classList.add("filter_cards_show");
        no_item_filter.classList.add("hide");
      } else if (target == "Status") {
        data.classList.remove("filter_cards");
        data.classList.add("filter_cards_show");
        no_item_filter.classList.add("hide");
      }
      if (!data.classList.contains("filter_cards_show")) {
        counter++;
        if (counter == cards_period.length) {
          no_item_filter.classList.remove("hide");
        } else {
          no_item_filter.classList.add("hide");
        }
      }
    });
  }
