const departureInput = document.getElementById("departure");
const destinationInput = document.getElementById("destination");
const departure_clearBtn = document.querySelector(".departure_clearBtn");
const destination_clearBtn = document.querySelector(".destination_clearBtn");

const departingStation = document.getElementById("departing_station");
const arrivingStation = document.getElementById("arriving_station");

const calculateFareBtn = document.getElementById("calculateBtn");
const fareDisplay = document.querySelector(".fare_display");

const journeyContainer = document.querySelector(".journey_container");

const errorMessage = document.querySelector(".error_message");

const departureDropdown = document.querySelector(".departure_dropdown");
const departureListUl = document.querySelector(".departure_dropdown ul");
const departureListItem = document.querySelectorAll(".departure_dropdown li");
const departureICSCodeElement = document.querySelector("#departureICSCode");
const destinationICSCodeElement = document.querySelector("#destinationICSCode");

const departure_user_query = async () => {
  departureDropdown.classList.remove("hide");
  const query = departureInput.value;

  const queryParams = {
    modes: ["overground", "elizabeth-line", "tube", "national-rail"],
  };

  // Convert the array to a comma-separated string
  const params = new URLSearchParams({
    modes: queryParams.modes.join(","),
  });

  try {
    const response = await fetch(
      `https://api.tfl.gov.uk/StopPoint/Search/${query} ? ${params.toString()}`
    );
    const responseBody = await response.json();

    const matches = responseBody.matches;
    console.log(matches);
    populateDepartureDropdown(matches);
    const departureListItem = document.querySelectorAll(
      ".departure_dropdown li"
    );
    departureListItem.forEach((item) => {
      item.addEventListener("click", (e) => {
        departureICSCodeElement.value = item.getAttribute("id");
        departureInput.value = item.innerHTML;
        departureDropdown.classList.add("hide");
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const populateDepartureDropdown = (matchesArray) => {
  departureListUl.innerHTML = " ";
  for (const match of matchesArray) {
    const listItem = `<li id=${match.icsId}>${match.name}</li>`;
    departureListUl.insertAdjacentHTML("beforeEnd", listItem);
  }
};

const destinationDropdown = document.querySelector(".destination_dropdown");
const destinationListItem = document.querySelectorAll(
  ".destination_dropdown li"
);
const destinationListUl = document.querySelector(".destination_dropdown ul");

const populateDestinationDropdown = (matchesArray) => {
  destinationListUl.innerHTML = "";
  for (const match of matchesArray) {
    const listItem = `<li id=${match.icsId}>${match.name}</li>`;
    destinationListUl.insertAdjacentHTML("beforeEnd", listItem);
  }
};

const destination_user_query = async () => {
  const query = destinationInput.value;
  const queryParams = {
    modes: ["overground", "elizabeth-line", "tube", "national-rail"],
  };
  const params = new URLSearchParams({
    modes: queryParams.modes.join(","),
  });
  destinationDropdown.classList.remove("hide");

  try {
    const response = await fetch(
      `https://api.tfl.gov.uk/StopPoint/Search/${query}? ${params.toString()}`
    );

    const responseBody = await response.json();
    // console.log(responseBody);
    const matches = responseBody.matches;
    console.log(matches);
    populateDestinationDropdown(matches);
    const destinationListItem = document.querySelectorAll(
      ".destination_dropdown li"
    );
    destinationListItem.forEach((li) => {
      li.addEventListener("click", (e) => {
        destinationICSCodeElement.value = li.getAttribute("id");
        destinationInput.value = li.innerHTML;
        destinationDropdown.classList.add("hide");
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const departure_toggle_clear_button = () => {
  if (departureInput.value.length > 0) {
    departure_clearBtn.style.display = "block";
  } else {
    departure_clearBtn.style.display = "none";
  }
};

const destination_toggle_clear_button = () => {
  if (destinationInput.value.length > 0) {
    destination_clearBtn.style.display = "block";
  } else {
    destination_clearBtn.style.display = "none";
  }
};

const departure_clear_input = () => {
  departureInput.value = "";
  departure_clearBtn.style.display = "none";
  departureDropdown.classList.add("hide");
};

const destination_clear_input = () => {
  destinationInput.value = "";
  destination_clearBtn.style.display = "none";
  destinationDropdown.classList.add("hide");
};

const calculateBtn = async () => {
  const departureInputValue = departureInput.value;
  const destinationInputValue = destinationInput.value;

  if (departureInputValue === "" || destinationInputValue === "") {
    alert("Fill details completely");

    journeyContainer.style.border = "none";
  } else {
    try {
      journeyContainer.innerHTML = "LOADING!!!";
      const response = await fetch(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${departureICSCodeElement.value}/to/${destinationICSCodeElement.value}`
      );
      const responseBody = await response.json();

      console.log(responseBody);
      journeyContainer.innerHTML = "";

      for (const journey of responseBody.journeys) {
        let journeys;

        for (const leg of journey.legs) {
          for (const routeOption of leg.routeOptions) {
            if (
              leg.mode.name !== "tube" &&
              leg.mode.name !== "overground" &&
              leg.mode.name !== "elizabeth-line" &&
              leg.mode.name !== "national-rail" &&
              leg.mode.name !== "dlr"
            ) {
              // console.log(leg);
              continue;
            }

            journeys = `<div class="journey">
          <li class="route">${routeOption.directions}</li>
          <li class="route">${routeOption.name}</li>
          
        <li class="departure_arrival_time">${leg.scheduledDepartureTime.slice(
          11,
          16
        )} - ${leg.scheduledArrivalTime.slice(11, 16)}</li>
        <li class="journey_duration">${journey.duration} mins</li>
        <li class="fare">£${(journey.fare.totalCost / 100).toFixed(2)}</li>
        <li class="platform"></li> </div>`;

            for (const stopPoint of leg.path.stopPoints) {
              // console.log(
              // `Stop Point: ${stopPoint.name} - Arrival Time: ${journey.arrivalDateTime} , Duration: ${journey.duration} minutes , Start Time: ${journey.startDateTime}`
              // );
            }
          }

          journeyContainer.insertAdjacentHTML("beforeend", journeys);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  //   fareResult.textContent += " 3.90";
};

const toggleStations = () => {
  let departureInputValue = departureInput.value;
  let destinationInputValue = destinationInput.value;

  departureInput.value = destinationInputValue;
  destinationInput.value = departureInputValue;
};

// travelResult.addEventListener("click", (e) => {
//   journeyContainer.classList.remove("hide");
//   journeyContainer.style.border = "2px solid black";
// });
