//This gets the spell information

$(".query-option").on("click", function (event) {
    event.preventDefault();
    console.log($(this).attr("data-option"));
});

$("#class-list").on("click", function (event) {
    event.preventDefault();

    $("#result-count").hide();
    $(".spell-div").remove();
    $(".school-div").remove();
    $(".class-div").remove();
    $(".search-index").hide();
    $(".search-table").empty();

    $.ajax({
        url: "https://www.dnd5eapi.co/api/classes/",
        method: "GET"
    }).then(function (response) {
        console.log(response);

        for (let i = 0; response.results.length; i++) {

            $.ajax({
                url: "https://www.dnd5eapi.co" + response.results[i].url,
                method: "GET"
            }).then(function (response) {
                console.log(response);


                var classDiv = $("<div>").addClass("class-div card");
                var cardBody = $("<div>").addClass("card-body")
                var savingThrows = [];
                var proficiencies = [];
                var skills = [];

                response.proficiency_choices[0].from.forEach(element => {
                    return skills.push(element.name.toString().replace(/^Skill:+/i, ''));
                });


                response.proficiencies.forEach(element => {
                    return proficiencies.push(element.name);
                });

                response.saving_throws.forEach(element => {
                    return savingThrows.push(element.name);
                });

                $("#results-display").append(classDiv);
                $(classDiv).append(cardBody);
                $(cardBody).append("<h2>" + response.name + "</h2>").addClass("card-title");
                $(cardBody).append("<hr>");
                $(cardBody).append("<p> Hit Die: <strong>" + response.hit_die + "</strong></p>");
                $(cardBody).append("<h6> Saving Throws: " + savingThrows.join(', ') + "</h6>");
                $(cardBody).append("<br>");
                $.ajax({
                    url: response.subclasses[0].url,
                    method: "GET"
                }).then(function (response) {
                    console.log(response);
                    $(cardBody).append("<p><strong>" + response.name + "</strong> | <i>" + response.subclass_flavor + "</i>:</p>");
                    for (let k = 0; k < response.desc.length; k++) {
                        $(cardBody).append("<p style='font-weight: lighter'>" + response.desc[k].toString().replace(/[^\x00-\x7F]/g, "") + "</p><br>");
                    }
                });
                $(cardBody).append("<p><strong>Proficiencies: </strong>" + proficiencies.join(', ') + "</p>");
                $(cardBody).append("<br>");
                $(cardBody).append("<h6> Skills: " + skills.join(', ') + "</h6>");
                $(cardBody).append("<hr>");


                // $(classDiv).append(backButton);
            })
        }
    });


});

$("#spell-list").on("click", function (event) {
    event.preventDefault();
    $("#result-count").hide();
    $(".spell-div").remove();
    $(".school-div").remove();
    $(".class-div").remove();
    $(".search-index").show();
    $(".search-table").empty();
    $.ajax({
        url: "https://www.dnd5eapi.co/api/spells/",
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for (let i = 0; i < response.results.length; i++) {

            $.ajax({
                url: "https://www.dnd5eapi.co" + response.results[i].url,
                method: "GET",
            }).then(function (response) {
                var tr = $("<tr>");
                var tdNum = $("<td>").append("<p><strong>" + (i + 1) + "</strong></p>");
                var tdSpell = $("<td>").text(response.name).addClass("spell-name").attr("data-url", ("https://www.dnd5eapi.co" + response.url));
                var tdSchool = $("<td>").text(response.school.name).addClass("school-name").attr("data-url", ("https://www.dnd5eapi.co" + response.school.url));
                console.log(response.name)

                //Holds all the classes for each spell in the table
                var classLoop = [];

                // This puts all the classes on the right place in the table inline
                response.classes.forEach(element => {
                    return classLoop.push(element.name);
                });

                var tdClasses = $("<td>").append("<p>" + classLoop.join(', ') + "</p>");
                // var tdSchool = $("<td>").text(response.school.name).addClass("school-name").attr("data-url", response.school.url);

                $(".search-table").append(tr);
                $(tr).append(tdNum);
                $(tr).append(tdSpell);
                $(tr).append(tdClasses);
                $(tr).append(tdSchool);
            });
        };
    });
});

$("#submit-button").on("click", function (event) {
    event.preventDefault();

    // _stop = false;
    $("#result-count").show();
    $(".spell-div").remove();
    $(".school-div").remove();
    $(".class-div").remove();
    $(".search-index").show();
    $(".search-table").empty();

    var resultTotal = 0;
    var classSearch = $("#class-search").val().trim().split(' ').join('+');
    var querytype = $("option:selected").attr("data-option");
    var queryURL = "https://www.dnd5eapi.co/api/" + querytype + classSearch;
    var index;
    $("#class-search").val('');
    console.log(querytype);
    console.log(classSearch);
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        resultTotal = response.length;

        if (resultTotal > 1 || resultTotal < 1) {
            $("#result-count").text("There are " + resultTotal + " spells for: " + (classSearch.toString().charAt(0).toUpperCase() + classSearch.substring(1)).split('+').join(' ')).addClass("result-count");
        } else {
            $("#result-count").text("There is " + resultTotal + " spell for: " + (classSearch.toString().charAt(0).toUpperCase() + classSearch.substring(1)).split('+').join(' ')).addClass("result-count");
        }
        for (let i = 0; i < response.length; i++) {
            var searchTerm = JSON.stringify(response[i].name).trim().split(' ').join('+');

            // Will do this ajax call if your search query is for spells specifically
            if (querytype == "spells/") {
                if ('"' + classSearch + '"' == searchTerm) {

                    $.ajax({
                        url: "https://www.dnd5eapi.co" + response[i].url,
                        method: "GET"
                    }).then(function (response) {
                        // console.log(response);
                        $(".search-index").hide();
                        var spellDiv = $("<div>").addClass("spell-div card");
                        var cardBody = $("<div>").addClass("card-body")
                        // var backButton = $("<button>").addClass("btn btn-warning back-btn").text("X");
                        var classLoop = [];
                        response.classes.forEach(element => {
                            return classLoop.push(element.name);
                        });

                        $("#results-display").append(spellDiv);
                        $(spellDiv).append(cardBody);
                        // $(cardBody).append(backButton);
                        $(cardBody).append("<h2>" + response.name + "</h2>").addClass("card-title");
                        $(cardBody).append("<hr>");
                        for (let k = 0; k < response.desc.length; k++) {
                            $(cardBody).append("<p>" + response.desc[k].toString().replace(/[^\x00-\x7F]/g, "") + "</p><br>");
                        }
                        if (response.higher_level) {
                            $(cardBody).append("<p>" + response.higher_level + "</p>");
                        }
                        $(cardBody).append("<p><strong>Range: </strong>" + response.range + "</p>").addClass("card-subtitle mb-2 text-muted");
                        $(cardBody).append("<p><strong>Components: </strong>" + response.components + "</p>");
                        $(cardBody).append("<p><strong>Level: </strong>" + response.level);
                        $(cardBody).append("<p><strong>Ritual: </strong>" + response.ritual + "</p>");
                        $(cardBody).append("<p><strong> Duration: </strong>" + response.duration + "</p>");
                        $(cardBody).append("<p><strong>Casting Time: </strong>" + response.casting_time + "</p>");
                        $(cardBody).append("<br>");
                        $(cardBody).append("<h6>" + classLoop.join(', ') + "</h6>").addClass("class-results")
                    });
                }

                return;

            } else {
                //AJAX calls for spells based on class search
                $.ajax({
                    url: response.results[i].url,
                    method: "GET"
                }).then(function (response) {
                    // console.log(response.name);

                    // This Logs all the spells and classes that use them
                    for (let j = 0; j < response.classes.length; j++) {
                        var classes = (JSON.stringify(response.classes[j].name).toLowerCase().trim());

                        //If user class a user searches with exists it will return all of their spells.
                        if ('"' + classSearch + '"' == classes) {
                            var tr = $("<tr>");
                            var tdNum = $("<td>").append("<p><strong>" + (i + 1) + "</strong></p>");
                            var tdSpell = $("<td>").addClass("spell-name").attr("data-url", ("https://www.dnd5eapi.co" + response.url));

                            //Holds all the classes for each spell in the table
                            var classLoop = [];

                            //This puts all the classes on the right place in the table inline
                            response.classes.forEach(element => {
                                return classLoop.push(element.name);
                            });

                            var tdClasses = $("<td>").append("<p>" + classLoop.join(', ') + "</p>");
                            var tdSchool = $("<td>").text(response.school.name).addClass("school-name").attr("data-url", response.school.url);

                            console.log(response.url)

                            $(tdSpell).text(response.name);
                            $(".search-table").append(tr);
                            $(tr).append(tdNum);
                            $(tr).append(tdSpell);
                            $(tr).append(tdClasses);
                            $(tr).append(tdSchool);

                        }
                    }
                });
            }
        }
        console.log(response);
    })
});

$(document).on("click", ".back-btn", function () {
    $(".spell-div").hide()
    $(".school-div").hide()
    $(".class-div").hide();
    $(".search-index").show();

});


$(document).on("click", ".spell-name", function () {
    $("#result-count").hide();
    $(".search-index").hide()
    console.log($(this).attr("data-url"));

    $.ajax({
        url: $(this).attr("data-url"),
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var spellDiv = $("<div>").addClass("spell-div card");
        var cardBody = $("<div>").addClass("card-body")
        var classLoop = [];
        var editedString = response.desc
        var backButton = $("<button>").addClass("btn btn-warning back-btn").text("X");
        response.classes.forEach(element => {
            return classLoop.push(element.name);
        });

        $("#results-display").append(spellDiv);
        $(spellDiv).append(cardBody);
        $(cardBody).append(backButton);
        $(cardBody).append("<h2>" + response.name + "</h2>").addClass("card-title");
        $(cardBody).append("<hr>");
        for (let k = 0; k < editedString.length; k++) {
            $(cardBody).append("<p>" + editedString[k].toString().replace(/[^\x00-\x7F]/g, "") + "</p><br>");
        }
        if (response.higher_level) {
            $(cardBody).append("<p>" + response.higher_level + "</p>");
        }
        $(cardBody).append("<p><strong>Level: </strong>" + response.level);
        $(cardBody).append("<p><strong> Range: </strong> " + response.range + "</p>").addClass("card-subtitle mb-2 text-muted");
        $(cardBody).append("<p><strong> Components: </strong>" + response.components + "</p>");
        $(cardBody).append("<p><strong> Ritual: </strong>" + response.ritual + "</p>");
        $(cardBody).append("<p><strong>Duration: </strong>" + response.duration + "</p>");
        $(cardBody).append("<p><strong>Casting Time: </strong>" + response.casting_time + "</p>");
        $(cardBody).append("<br>");
        $(cardBody).append("<h6>" + classLoop.join(', ') + "</h6>")
        console.log(classLoop);

    });

});

$(document).on("click", ".school-name", function () {
    $("#result-count").hide();
    $(".search-index").hide()
    console.log($(this).attr("data-url"));

    $.ajax({
        url: $(this).attr("data-url"),
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var schoolDiv = $("<div>").addClass("school-div card");
        var cardBody = $("<div>").addClass("card-body")
        var backButton = $("<button>").addClass("btn btn-warning back-btn").text("X");


        $("#results-display").append(schoolDiv);
        $(schoolDiv).append(cardBody);
        $(cardBody).append(backButton);

        $(cardBody).append("<h2>" + response.name + "</h2>");
        $(cardBody).append("<hr>");
        $(cardBody).append("<p>" + response.desc.toString().replace(/[^\x00-\x7F]/g, "") + "</p>");
    });


});