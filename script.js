//Perform this function when the DOM is completely loaded
$(document).ready(function () {
  $("#search-button").on("click", function () {
    const searchField = $("#search-field").val();
  
    $("#search-field").val("");

    forecastSearch(searchField);
  });

  $(".history").on("click", "li", function () {
    forecastSearch($(this).text());
  });

  function makeRow(text) {
    const li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }
  //AJAX Call
  function forecastSearch(searchField) {
    $.ajax({
      type: "GET",
      //API Key
      url: `http://api.openweathermap.org/data/2.5/weather?q=${searchField}&appid=6815ddd879e7fbc993d502b88e3c7195&units=imperial`,
      dataType: "json",
      success: function (data) {
        // create history link for this search
        if (history.indexOf(searchField) === -1) {
          history.push(searchField);
          window.localStorage.setItem("history", JSON.stringify(history));

          makeRow(searchField);
        }

        // clear what was previously searched for so that next search will only yield current search results/values
        $("#today").empty();

        //html for current weather
        let title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        let card = $("<div>").addClass("card");
        let temp = $("<p>").addClass("card-text").text(`Temperature: ${data.main.temp}°F`);
        let humid = $("<p>").addClass("card-text").text(`Humidity: ${data.main.humidity}%`);
        let wind = $("<p>").addClass("card-text").text(`Wind Speed: ${data.wind.speed}MPH`);
        let cardBody = $("<div>").addClass("card-body");
        let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        // merge to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);

      
        getForecast(searchField);
      }
    });
  }

  //AJAX Call
  function getForecast(searchField) {
    $.ajax({
      type: "GET",
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${searchField}&appid=6815ddd879e7fbc993d502b88e3c7195&units=imperial`,
      dataType: "json",
      success: function (data) {
        //empty row
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        for (var i = 0; i < data.list.length; i++) {

          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // html elements
            let col = $("<div>").addClass("col-md-2");
            let card = $("<div>").addClass("card bg-primary text-white");
            let body = $("<div>").addClass("card-body p-2");

            let title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

            let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

            let p1 = $("<p>").addClass("card-text").text(`Temp: ${data.list[i].main.temp_max}°F`);

            let p2 = $("<p>").addClass("card-text").text(`Humidity: ${data.list[i].main.humidity}%`);

            // Merge
            col.append(card.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      }
    });
  }


  // History from searched items
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    forecastSearch(history[history.length - 1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});