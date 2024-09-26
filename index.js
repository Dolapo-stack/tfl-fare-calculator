const departureInput = document.getElementById("departure");
const destinationInput = document.getElementById("destination");
const departingStation = document.getElementById("departing_station");
const arrivingStation = document.getElementById("arriving_station");

const calculateFareBtn = document.getElementById("calculateBtn");
const fareResult = document.getElementById("fare");
const travelResult = document.querySelector(".travel_result");
const journeyContainer = document.querySelector(".journey_container");

// calculateFareBtn.addEventListener("click", (e) => {
//   fareResult.textContent += " 3.90";
// });

const calculateBtn = async () => {
  const departureInputValue = departureInput.value;
  const destinationInputValue = destinationInput.value;

  departingStation.textContent = departureInputValue;
  arrivingStation.textContent = destinationInputValue;

  try {
    const response = await fetch(
      `https://api.tfl.gov.uk/Journey/JourneyResults/${departureInputValue}/to/${destinationInputValue}`
    );
    const responseBody = await response.json();
    console.log(responseBody.journeys);

    for (const journey of responseBody.journeys) {
      let journeys = `<div class="journey">
        <li class="departure_arrival_time">piok9</li>
        <li class="journey_duration">${journey.duration}</li>
        <li class="platform"></li>
      </div>`;
      //   console.log(`Arrival Time: ${journey.arrivalDateTime}`);

      //   console.log(`Duration: ${journey.duration} minutes`);
      //   console.log(`Start Time: ${journey.startDateTime}`);
      for (const leg of journey.legs) {
        journeys = `<div class="journey">
        <li class="departure_arrival_time">${leg.departureTime.slice(
          11,
          16
        )} - ${leg.arrivalTime.slice(11, 16)}</li>
        <li class="journey_duration">${journey.duration} mins</li>
        <li class="platform"></li> </div>`;
        // console.log(leg.departurePoint.commonName);
        // console.log(leg.arrivalPoint.commonName);
        for (const stopPoint of leg.path.stopPoints) {
          console.log(
            `Stop Point: ${stopPoint.name} - Arrival Time: ${journey.arrivalDateTime} , Duration: ${journey.duration} minutes , Start Time: ${journey.startDateTime}`
          );
        }
      }
      journeyContainer.insertAdjacentHTML("beforeend", journeys);
    }
  } catch (err) {
    console.error(err);
  }

  //   fareResult.textContent += " 3.90";
};

const toggleStations = () => {
  let departureInputValue = departureInput.value;
  let destinationInputValue = destinationInput.value;

  departureInput.value = destinationInputValue;
  destinationInput.value = departureInputValue;
};

travelResult.addEventListener("click", (e) => {
  journeyContainer.classList.remove("hide");
});
