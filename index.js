var main = function(){
    $.getJSON("https://raco.fib.upc.edu/api/assignatures/llista.json",
        function(resp) {
            $.each(resp, function(key, value){
                console.log(key+":"+value.idAssig);
                var assig_elem = $("<div>"+value.idAssig+"</div>");
                assig_elem.appendTo("#assig_list");
            });
        }
    );
}

$(document).ready(main);
