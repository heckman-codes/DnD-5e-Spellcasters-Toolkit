$(document).on("click", "#add-roll", function() {
  event.preventDefault();
  // console.log($(window).height());

  var DiceNum = $("#DiceNum-input")
    .val()
    .trim();
  $(".dicetodelete").remove();
  for (let i = 0; i < DiceNum; i++) {
    var p = document.getElementById("wrapper");
    var style = p.currentStyle || window.getComputedStyle(p);
    var crazy_y = Math.floor(Math.random() * $(window).height()) - 100;
    var crazy_x =
      Math.floor(Math.random() * $(window).width()) -
      100 -
      parseInt(style.marginLeft);
    console.log("side: " + style.marginLeft);
    // var crazy_yback = $(window).height() - crazy_y;
    var crazy_xback = $(window).width() - crazy_x;
    console.log("x " + crazy_x);
    console.log("width: " + $(window).width());
    console.log("back: " + crazy_xback);
    $("#wrapper").prepend(
      "<i class='fas fa-dice-d20 fa-3x dicetodelete' id='rollingdice" +
        i +
        "'></i> "
    );
    // if (crazy_xback < 0) {
    //   let rolldicebaby = anime({
    //     targets: "#rollingdice" + i,
    //     translateY: crazy_y,
    //     easing: "easeOutBack",
    //     keyframes: [
    //       { translateX: $(window).width() },
    //       { translateX: crazy_xback }
    //     ],
    //     rotate: { value: 1080 },
    //     duration: 1500
    //   });
    // } else {
    let rolldicebaby = anime({
      targets: "#rollingdice" + i,
      translateY: crazy_y,
      easing: "easeOutBack",

      translateX: crazy_x,
      rotate: { value: 1080 },
      duration: 1500
    });

    let byebyedice = anime({
      targets: ".dicetodelete",
      opacity: 0,
      delay: 1600,
      duration: 2000
    });
  }

  let myAnimation = anime({
    targets: "#coverdice",
    rotate: { value: 720 },
    duration: 3000

    /* describe the animation details */
  }); // This line of code will grab the input from the textbox
  myAnimation.restart;
  // document.querySelector("#add-roll").onclick = byebyedice.restart;
  // document.querySelector("#add-roll").onclick = rolldicebaby.restart;
  document.querySelector("#add-roll").onclick = myAnimation.restart;

  $("#rolls-appear-here").text("You actually have to input things you fool");
  $("#modifier-here").empty();
  $("#total").empty();
  var total = 0;

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
  }).then(function(response) {
    console.log(response);
    $("#rolls-view").empty();
    // $("#rolls-view").append("<p><strong> Total: </strong>" + total + "</p>");

    var table = $("<table>").addClass("table table-dark");
    var thead = $("<thead>").addClass("thead-dark");
    var tbody = $("<tbody>");
    // var td = $("<td>");
    $("#rolls-view").append(table);
    $(table).append(thead);
    $(table).append(tbody);
    $(thead).append("<td>Dice</td><td>Roll</td>");

    myAnimation.repeat;

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
    $("#rolls-view").prepend(
      "<p><strong>Modifier: </strong>" +
        mod +
        " | <strong> Total: </strong>" +
        total +
        "</p><br>"
    );
    $("#rolls-view").prepend("<h1>Roll Results: </h1>");
  });
});
// The GIF from the textbox is then added to our array

// Calling renderButtons which handles the processing of our GIF array
