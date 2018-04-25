function ui_build(job)
{
    var screen = ui_setup(job);
    var videoframe = $("#videoframe");
    var framelabel = document.querySelector("#framelabel");
    var player = new VideoPlayer(framelabel,videoframe, job);
    var tracks = new TrackCollection(player, job);
    var objectui = new TrackObjectUI($("#newobjectbutton"), $("#objectcontainer"), videoframe, job, player, tracks);

    ui_setupbuttons(job, player, tracks);
    ui_setupslider(player);
    ui_setupsubmit(job, tracks);
    ui_setupclickskip(job, player, tracks, objectui);
    ui_setupkeyboardshortcuts(job, player, tracks);
    ui_loadprevious(job, objectui);

    $("#newobjectbutton").click(function() {
        if (!mturk_submitallowed())
        {
            $("#turkic_acceptfirst").effect("pulsate");
        }
    });
}



function ui_setup(job)
{
    var screen = $("<div id='annotatescreen'></div>").appendTo(container);

    $("<table>" + 

        "<tr>" +
              "<td><div id='videoframe'></div></td>" + 
              "<td rowspan='2'><div id='sidebar'></div></td>" +
          "</tr>" + 
          "<tr>" +
              "<td><div id='bottombar'></div></td>" + 
          "</tr>" +
          "<tr>" +
              "<td><div id='advancedoptions'></div></td>" +
              "<td><div id='submitbar'></div></td>" +
              "<td><div id='newbar'></div></td>" +
          "</tr>" +
      "</table>").appendTo(screen).css("width", "100%");


    var playerwidth = Math.max(720, job.width);


    $("#videoframe").css({"width": job.width + "px",
                          "height": job.height + "px",
                          "margin": "0 auto"})
                    .parent().css("width", playerwidth + "px");

    $("#sidebar").css({"height": job.height + "px",
                       "width": "205px"});



     $("#annotatescreen").css("width", (playerwidth + 205) + "px");

    $("#bottombar").append("<div id='playerslider'></div>");
    $("#bottombar").append("<div class='button' id='rewindbutton'>Rewind</div> ");
    $("#bottombar").append("<div class='button' id='playbutton'>Play</div> ");

    $("<div id='objectcontainer'></div>").appendTo("#sidebar");

   /* $("<div class='button' id='openadvancedoptions'>Options</div>")
        .button({
            icons: {
                primary: "ui-icon-wrench"
            }
        }).appendTo($("#advancedoptions").parent()).click(function() {
                eventlog("options", "Show advanced options");
                $(this).remove();
                $("#advancedoptions").show();
            });*/

  //  $("#advancedoptions").hide();





    $("#advancedoptions").append(
    "<input type='checkbox' id='anntateoptionsresize'/>" +
    "<label for='annotateoptionsresize'>Resize?</label> " +
     "<span class='tooltiptext'>hotkey:a</span></label>" +

    "<input type='checkbox' id='annotateoptionshideboxes'/>" +
    "<label for='annotateoptionshideboxes'>Boxes?" +
 "<span class='tooltiptext'>hotkey:b</span></label>" +
  

    "<input type='checkbox'  id='annotateoptionshideboxtext'>" +
    "<label class='tooltip' for='annotateoptionshideboxtext'>Labels?" +
     "<span class='tooltiptext'>hotkey:s</span></label> ");

    $("#advancedoptions").append(
    "<div id='speedcontrol'>" +
    "<input type='radio' name='speedcontrol' " +
        "value='5,1' id='speedcontrolslower'>" +
    "<label for='speedcontrolslower'>Crawl</label>" +
    "<input type='radio' name='speedcontrol' " +
        "value='15,1' id='speedcontrolslow'>" +
    "<label for='speedcontrolslow'>Slow</label>" +
    "<input type='radio' name='speedcontrol' " +
        "value='30,1' id='speedcontrolnorm' checked='checked'>" +
    "<label for='speedcontrolnorm'>Normal</label>" +
    "<input type='radio' name='speedcontrol' " +
        "value='90,1' id='speedcontrolfast'>" +
    "<label for='speedcontrolfast'>Fast</label>" +
    "</div>");

  $("#advancedoptions").append(

  "<div class='tooltip' id=''framenumber>" +
  "<input type='number' id='framelabel'>" +
  "<span class='tooltiptext'>frame #</span></div>" +
  "</div>");

    
    $("#framelabel")[0].value=1;
    $("#submitbar").append("<div id='submitbutton' class='button'>Submit HIT</div>");

   $("#newbar").append("<div id='newobjectcontainer'>" +
        "<div class='tooltip' id='newobjectbutton'>New" +
  "<span class='tooltiptext'>create new tracking object</span></div>" +
  "</div>");

    $("#submitbutton").html("Save Work");
    

    return screen;
}

function ui_setupbuttons(job, player, tracks)
{
    $('#framelabel').bind('input', function() { 
        // get the current value of the input field.

    player.frame=    $(this).val() ;
player.updateframe();
});


    $("#instructionsbutton").click(function() {
        player.pause();
        ui_showinstructions(job); 
    }).button({
        icons: {
            primary: "ui-icon-newwin"
        }
    });

    $("#playbutton").click(function() {
        if (!$(this).button("option", "disabled"))
        {
            player.toggle();
    $("#playbutton").innerHtml='0';
            if (player.paused)
            {
                eventlog("playpause", "Paused video");
            }
            else
            {
                eventlog("playpause", "Play video");
            }


        }
    }).button({
        disabled: false,
        icons: {
            primary: "ui-icon-play"
        }
    });

    $("#rewindbutton").click(function() {
        if (ui_disabled) return;
        player.pause();
        player.seek(player.job.start);
        eventlog("rewind", "Rewind to start");
    }).button({
        disabled: true,
        icons: {
            primary: "ui-icon-seek-first"
        }
    });

    player.onplay.push(function() {
        $("#playbutton").button("option", {
            label: "Pause",
            icons: {
                primary: "ui-icon-pause"
            }
        });
    });

    player.onpause.push(function() {
        $("#playbutton").button("option", {
            label: "Play",
            icons: {
                primary: "ui-icon-play"
            }
        });
    });

    player.onupdate.push(function() {
        if (player.frame == player.job.stop)
        {
            $("#playbutton").button("option", "disabled", true);
        }
        else if ($("#playbutton").button("option", "disabled"))
        {
            $("#playbutton").button("option", "disabled", false);
        }

        if (player.frame == player.job.start)
        {
            $("#rewindbutton").button("option", "disabled", true);
        }
        else if ($("#rewindbutton").button("option", "disabled"))
        {
            $("#rewindbutton").button("option", "disabled", false);
        }
    });

    $("#speedcontrol").buttonset();
    $("input[name='speedcontrol']").click(function() {
        player.fps = parseInt($(this).val().split(",")[0]);
        player.playdelta = parseInt($(this).val().split(",")[1]);
        console.log("Change FPS to " + player.fps);
        console.log("Change play delta to " + player.playdelta);
        if (!player.paused)
        {
            player.pause();
            player.play();
        }
        eventlog("speedcontrol", "FPS = " + player.fps + " and delta = " + player.playdelta);
    });

    $("#annotateoptionsresize").button().click(function() {
        var resizable = $(this).attr("checked") ? false : true;
        tracks.resizable(resizable);

        if (resizable)
        {
            eventlog("disableresize", "Objects can be resized");
        }
        else
        {
            eventlog("disableresize", "Objects can not be resized");
        }
    });

    $("#annotateoptionshideboxes").button().click(function() {
        var visible = !$(this).attr("checked");
        tracks.visible(visible);

        if (visible)
        {
            eventlog("hideboxes", "Boxes are visible");
        }
        else
        {
            eventlog("hideboxes", "Boxes are invisible");
        }
    });

    $("#annotateoptionshideboxtext").button().click(function() {
        var visible = !$(this).attr("checked");

        if (visible)
        {
            $(".boundingboxtext").show();
        }
        else
        {
            $(".boundingboxtext").hide();
        }
    });
}

function ui_setupsubmit(job, tracks)
{
    $("#submitbutton").button({
        icons: {
            primary: 'ui-icon-check'
        }
    }).click(function() {
        if (ui_disabled) return;
        ui_submit(job, tracks);
    });
}


function ui_setupslider(player)
{
    var slider = $("#playerslider");
    slider.slider({
        range: "min",
        value: player.job.start,
        min: player.job.start,
        max: player.job.stop,
        slide: function(event, ui) {
            player.pause();
            player.seek(ui.value);
            // probably too much bandwidth
            //eventlog("slider", "Seek to " + ui.value);
        }
    });

    /*slider.children(".ui-slider-handle").hide();*/
    slider.children(".ui-slider-range").css({
        "background-color": "#868686",
        "background-image": "none"});

    slider.css({
        marginTop: "6px",
        width: parseInt(slider.parent().css("width")) - 200 + "px", 
        float: "right"
    });

    player.onupdate.push(function() {
        slider.slider({value: player.frame});
    });
}



function ui_setupclickskip(job, player, tracks, objectui)
{
    if (job.skip <= 0)
    {
        return;
    }

    player.onupdate.push(function() {
        if (ui_iskeyframe(player.frame, job))
        {
            console.log("Key frame hit");
            player.pause();
            $("#newobjectbutton").button("option", "disabled", false);
            $("#playbutton").button("option", "disabled", false);
            tracks.draggable(true);
            tracks.resizable(ui_canresize());
            tracks.recordposition();
            objectui.enable();
        }
        else
        {
            $("#newobjectbutton").button("option", "disabled", true);
            $("#playbutton").button("option", "disabled", true);
            tracks.draggable(false);
            tracks.resizable(false);
            objectui.disable();
        }
    });

    $("#playerslider").bind("slidestop", function() {
        ui_snaptokeyframe(job, player);
    });
}
