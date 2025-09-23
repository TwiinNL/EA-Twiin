function toggleItem(item) {
    var table = document.getElementById("TableGroup");
    var i;

    if (table) {
        var height = 0;

        var titles = table.getElementsByTagName('li');
        for (i = 0; i < titles.length; i++) {
            if (titles[i].id == item + "Title") {
                titles[i].style.background = "#FFFFFF";
                titles[i].style.color = "#000000";
            } else {

                titles[i].style.background = "#DDDDDD";
                titles[i].style.color = "#666666";
            }
        }

        var tabs = table.getElementsByClassName('ItemBody');
        if (tabs.length > 0) {
            height = toggleItemDetails(tabs, item);
        }

        /* table.style.height = height + aparent.clientHeight + table.clientHeight + "px";*/
    }
}
function toggleItemDetails(tabs, title) {
    var i,
    height = 0;

    for (i = 0; i < tabs.length; i++) {
        var tab = tabs[i];

        if (tab.id == title + "Table") {
            tab.style.display = "block";
            height = tab.clientHeight;
        } else
            tab.style.display = "none";
    }

    return height;
}

function bulkshow(showpage) {
    var pagesData = document.getElementsByClassName("PageBody");

    var i = 0;
    if (showpage !== undefined) {
        var blockdiv;
        for (i = 0; i < pagesData.length; i++) {
            var id = pagesData[i].attributes["id"].value;

            if (showpage == id) {
                blockdiv = document.getElementById(id);
                blockdiv.style.display = 'block';

                var divs = blockdiv.getElementsByClassName("ObjectDetailsNotes");
                for (var j = 0; j < divs.length; j++) {
                    var tmpStr = divs[j].innerHTML;
                    tmpStr = tmpStr.replace(/&gt;/g, ">");
                    tmpStr = tmpStr.replace(/&lt;/g, "<");

                    tmpStr = tmpStr.replace(/#gt;/g, "&gt;");
                    tmpStr = tmpStr.replace(/#lt;/g, "&lt;");

                    divs[j].innerHTML = tmpStr;
                }
            } else {
                document.getElementById(id).style.display = 'none';
            }
        }

        if (blockdiv !== undefined) {
            tableSel = null;
            var tab = blockdiv.getElementsByClassName('TableGroup');
            if (tab.length > 0) {
                toggleItem(tab[0].getElementsByTagName('li')[0].id.replace("Title", ""), tab[0].getElementsByTagName('li')[0]);
            }
        }
    }
}

//START - OPEN ELEMENT IN NIEUWE WINDOW
 document.addEventListener("DOMContentLoaded", function () {
    // Alle <area>-links in diagrammen in een nieuw tabblad openen
    var areas = document.querySelectorAll("map area[href$='.htm'], map area[href$='.html']");
    areas.forEach(function(area) {
        area.setAttribute("target", "_blank");
    });
});

//START - ALLEEN TOOLTIP, GEEN NAVIGATIE
// document.addEventListener("DOMContentLoaded", function () {
    // Alle <area>-links in diagrammen selecteren
//    var areas = document.querySelectorAll("map area[href$='.htm'], map area[href$='.html']");
//    areas.forEach(function(area) {
//        // Klik blokkeren
//        area.addEventListener("click", function(event) {
//            event.preventDefault();   // geen navigatie
//            event.stopPropagation();  // niet verder bubbelen
//        });
//
//        // Optioneel: cursor aanpassen zodat het niet meer op een link lijkt
//        area.style.cursor = "pointer"; // of "default" als je geen handje wilt
//    });
// });

// START - TOOLTIP CODE
function mapRectangleMouseOver(sender) {

    if (!sender || !sender.href) return;

    var informationURL = sender.href;
    if (!informationURL) return;

    jQuery.get(informationURL, function (data) {

        var loadedHTML = jQuery.parseHTML(data);
        var docDOM = $('<output>').append(loadedHTML);
        var bodyDOM = $('.ElementPage', docDOM);

        if (!bodyDOM.length) return;

        var itemNotes = $('.ObjectDetailsNotes', bodyDOM);
        
        if (!itemNotes.length) return;

        var notes = unescapeHtml(itemNotes.html() || "");
        if (notes === "") return;

        var array = sender.coords.split(',');

        // coördinaten omzetten naar getallen
        var x1 = Number(array[0]);
        var y1 = Number(array[1]);
        var x2 = Number(array[2]);
        var y2 = Number(array[3]);

        $(".previewPanel").html("");
        $(".previewPanel").append(notes);

        // offsets instelbaar
        var offsetX = -405;  // positief = x pixels naar rechts, negatief = naar links
        var offsetY = -85;  // positief = x pixels naar beneden, negatief = naar boven

        // positie van de afbeelding op de pagina
        var $img = $(sender).closest('map').prev('img');
        var imgOffset = $img.offset();

        // horizontaal links van het object, verticaal gecentreerd
        var leftX = x1 + imgOffset.left + offsetX;
        var centerY = ((y1 + y2) / 2) + imgOffset.top + offsetY;

        $(".previewPanel").css({
            "position": "absolute",
            "top": centerY + "px",
            "left": leftX + "px",
            "transform": "translate(0%, -50%)"
        });

        $(".previewPanel").stop(true, true).fadeIn(400);
    });

}

function mapRectangleMouseOut(sender) {
    if ($(".previewPanel:hover").length === 0) {
        $(".previewPanel").stop(true, true).fadeOut(400);
    }
}

function unescapeHtml(safe) {
    return $('<div>').html(safe).text();
}
// EINDE - TOOLTIP CODE