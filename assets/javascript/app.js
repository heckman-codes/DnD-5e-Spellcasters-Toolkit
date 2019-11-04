$(document).on("click", "#add-roll", function () {
  event.preventDefault();
  // This line of code will grab the input from the textbox
  $("#rolls-appear-here").text("You actually have to input things you fool");
  $("#modifier-here").empty();
  $("#total").empty();
  var total = 0;
  var DiceNum = $("#DiceNum-input")
    .val()
    .trim();
  var DiceValpre = $("#DiceVal-input")
    .val()
    .trim();
  var DiceVal = parseInt(DiceValpre);
  var mod = $("#mod-input")
    .val()
    .trim();
  total = 0 + parseInt(mod);
  $("#rolls-appear-here").empty();
  console.log(DiceVal);
  console.log(DiceValpre);
  // var GifFinder = $(this).attr("data-name");
  var diceQueryURL = "http://roll.diceapi.com/json/" + DiceNum + "d" + DiceVal;
  $.ajax({
    url: diceQueryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    $("#rolls-view").empty();
    // $("#rolls-view").append("<p><strong> Total: </strong>" + total + "</p>");

    var table = $("<table>").addClass("table table-dark")
    var thead = $("<thead>").addClass("thead-dark");
    var tbody = $("<tbody>")
    // var td = $("<td>");
    $("#rolls-view").append(table);
    $(table).append(thead);
    $(table).append(tbody);
    $(thead).append("<td>Dice</td><td>Roll</td>");

    var results = response.dice;
    for (var i = 0; i < results.length; i++) {
      var rollDiv = $("<div>");
      var rollRow = $("<tr>");
      var tdRoll = $("<td>d" + DiceVal + " #" + (i + 1) + "</td>");
      var tdRollResult = $("<td>" + results[i].value + "</td>");


      total = total + results[i].value;

      $(rollRow).append(tdRoll);
      $(rollRow).append(tdRollResult);
      $(tbody).append(rollRow);
      $("#rolls-appear-here").append(rollDiv);
    }
    $("#rolls-view").prepend("<p><strong>Modifier: </strong>" + mod + " | <strong> Total: </strong>" + total + "</p><br>");
    $("#rolls-view").prepend("<h1>Roll Results: </h1>");
  });
});
// The GIF from the textbox is then added to our array

// Calling renderButtons which handles the processing of our GIF array