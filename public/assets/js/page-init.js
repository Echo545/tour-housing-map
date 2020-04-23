import Auth from "./auth.js";

// simple page init

$(document).ready(function () {


    $("#about-button").click(function () {
        $("#about-modal").modal("show");
    });

    var auth = new Auth();


});