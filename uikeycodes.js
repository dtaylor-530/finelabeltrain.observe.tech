
function ui_setupkeyboardshortcuts(job, player, tracks)
{
    $(window).keypress(function(e) {
        console.log("Key press: " + e.keyCode);

        if (ui_disabled)
        {
            console.log("Key press ignored because UI is disabled.");
            return;
        }

        var keycode = e.keyCode ? e.keyCode : e.which;
        eventlog("keyboard", "Key press: " + keycode);
        // space
        if (keycode == 32 )
        {
            $("#playbutton").click();
        }
        // r
        if (keycode == 114)
        {
            $("#rewindbutton").click();
        }
        // n
        else if (keycode == 110)
        {
            $("#newobjectbutton").click();
        }
        // a
        else if (keycode == 65)
        {
            $("#annotateoptionsresize").click();
        }
        // b
        else if (keycode == 66)
        {
            $("#annotateoptionshideboxes").click();
        }
        // s
        else if (keycode == 83)
        {
            $("#annotateoptionshideboxtext").click();
        }
      
        // q
        else if( keycode == 81 ||  keycode == 113){
            console.log('Tracks',tracks)
            var pellets = tracks.tracks.reduce( (p,el) => {var k = (Number(el.label%2) === 0)?0:1;
              return p + k;
            },0);
            var waste   = tracks.tracks.reduce( (p,el) => {var k = (Number(el.label%2) === 1)?0:1;
              return p+k;
            },0);
            console.log('should allert!')
            alert('Waste - '+waste+'    Pellets -'+pellets)
          } 
        else if(e.keyCode == '87' || keycode == 119){
          if (window.confirm("Delete all tracks?"))
          {
                tracks.tracks.forEach( function(el) {
                  el.remove();
                })
               $("#objectcontainer").empty();
               $("#objectcontainer").html("<div>Please save the changes and reload the app before going further.</div>")
          }
        }

        else 
        {
            // d
            var skip = 0;
            if (keycode == 44 || keycode == 100)
            {
                skip = job.skip > 0 ? -job.skip : -3;
            }
            // f
            else if (keycode == 46 || keycode == 102)
            {
                skip = job.skip > 0 ? job.skip : 3;
            }
            // v
            else if (keycode == 62 || keycode == 118)
            {
                skip = job.skip > 0 ? job.skip : 1;
            }
            // c
            else if (keycode == 60 || keycode == 99)
            {
                skip = job.skip > 0 ? -job.skip : -1;
            }

            if (skip != 0)
            {
                player.pause();
                player.displace(skip);

                ui_snaptokeyframe(job, player);
            }
        }
    });

}