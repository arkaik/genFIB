var obtain_data = function (subj) {
    for (var i = 0; i < subj.length; i++) {
        subj[i] = "GRAU-"+subj[i];
    }
    var args = $.param({assignatures: subj}, true);

    $.get("https://raco.fib.upc.edu/api/horaris/horari-assignatures.txt", args,
        function(resp) {
            console.log(resp);
        }, 'text'
    );
}

var main = function(){

    $.getJSON("https://raco.fib.upc.edu/api/assignatures/llista.json",
        function(resp) {
            $.each(resp, function(key, value){
                var assig_elem = $("<div>"+value.idAssig+"</div>");
                assig_elem.addClass("assig");
                assig_elem.appendTo("#assig_list");
            });

            $(".assig").click(function(){
                $(this).toggleClass("active");
            });
        }
    );

    // CLICK
    $("#l2r").click(function(){
        $("#assig_list > .active").clone(true).removeClass("active").appendTo("#opt_list");
        $("#assig_list > .active").removeClass("active");
    });

    $("#r2l").click(function(){
        $("#opt_list > .active").remove();
    })

    $("#cerca").click(function(){
        var args = [];
        $("#opt_list").children().each(function( index, element ){
            args.push($( this ).text());
        })
        obtain_data(args);
    });
}

$(document).ready(main);
