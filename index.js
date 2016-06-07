var main = function(){
    $.getJSON("https://raco.fib.upc.edu/api/assignatures/llista.json",
        function(resp) {
            $.each(resp, function(key, value){
                console.log(key+":"+value[idAssig]);
            });
        }
    );
}

$(document).ready(main);
