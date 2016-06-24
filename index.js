var dies = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];

class Assignatura {
    /// _nom: String
    /// _grup: Map(Grup)
    constructor(nom = "ø") {
        this._nom = nom;
        this._grup = new Map();
        this._color = this._generateColor();
    }

    get nom() {
        return this._nom;
    }

    set nom(n) {
        this._nom = n;
    }

    get grups() {return this._grup;}

    get color() {return this._color;}

    afegirGrup (v) {
        let vg = Grup.obtenirGrupVal(v.valor);
        if (!this._grup.has(vg)) {
            let g = new Grup(v.nom);
            g.afegirHora(v.valor, v.dia, v.hora);
            this._grup.set(g.valor, g);
        }
        else {
            let g = this._grup.get(vg);
            g.afegirHora(v.valor, v.dia, v.hora);
        }
    }

    _generateColor () {
        let r =  Math.floor(Math.random() * 256);
        let g =  Math.floor(Math.random() * 256);
        let b =  Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }

}

class Grup {
    constructor(nom) {
        this._nom = nom;
        this._val = "─";
        this._subgrup = [];
        this._hores = [];
    }

    afegirHora(sg, sd, sh) {
        if (this._val == "─") this._val = Grup.obtenirGrupVal(sg);

        if (Grup.esSubgrup(sg)) this._subgrup.push(`${sg} ${parseInt(sd)-1} ${parseInt(sh.slice(0,-3))-8}`);
        else this._hores.push(`${sg} ${parseInt(sd)-1} ${parseInt(sh.slice(0,-3))-8}`);

    }

    get valor () {return this._val;}

    static esSubgrup (sg) {
        let lci = sg.length - 1;
        return sg.charAt(lci) != '0';
    }

    static esGrup (sg) {
        return sg.charAt(-1) == '0';
    }

    static obtenirGrupVal (sg) {
        return sg.slice(0,-1)+'0';
    }
}

var parser = function (resp) {
    let assigs = new Map();
    let rows = resp.split("\n");
    for (h of rows) {
        let [sigla, grup, d, f, tipus, aula] = h.split("\t");
        if (!sigla == ""){
            if (!assigs.has(sigla)) assigs.set(sigla, new Assignatura(sigla));
            let gr = {nom: sigla, valor: grup, dia: d, hora: f, t: tipus, a: aula};
            let as = assigs.get(sigla);
            as.afegirGrup(gr);
        }
    }
    return assigs;

}

var buildHorari = function (assig) {
    // Inicialització de matriu
    let mat = new Array(12);
    for (let i = 0; i < mat.length; i++) {
        mat[i] = new Array(7);
        for (let j = 0; j < mat[i].length; j++) {
            mat[i][j] = [];
        }
    }

    for (var a of assig.values()) {
        console.log(a.nom+": ");
        for (var g of a.grups.values()) {
            console.log("\t"+g.valor);
            for (var h of g._hores) {
                [fg, fj, fi] = h.split(" ");
                let ni = parseInt(fi);
                let nj = parseInt(fj);
                console.log("\t\t"+h);
                mat[ni][nj].push(`${a.nom} ${fg}`);
            }
        }
    }

    let rheight = 0;
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            let block = $("<div>");
            block.attr("myStyle", `grid-row: ${j}; grid-column: ${i}`);
            block.addClass("hora");
            for (let k = 0; k < mat[i][j].length; k++) {
                [sc, sg] = mat[i][j][k].split(" ");
                let subblock = $("<div>");
                subblock.css("background-color", `rgb(100,80,60)`);
                subblock.html(`${sc}\n${sg}`);
                subblock.addClass("grup");
                block.append(subblock);
            }
            $("#horari").append(block);

            let bheight = block.height();
            if (bheight > rheight) rheight = bheight;
        }
    }
    console.log(`row height: ${rheight}`);
    // Same height for all
    $(".hora").height(`${rheight}px`);
}

var obtain_data = function (subj) {
    let par = [];
    for (st of subj) par.push("GRAU-"+st);
    var args = $.param({assignatures: par}, true);

    // ASYNC (only IN)
    $.get("https://raco.fib.upc.edu/api/horaris/horari-assignatures.txt", args, resp => {
        let assig = parser(resp);
        //Generador de soluciones --> aquí
        buildHorari(assig);
    }, 'text');

}

var main = function(){

    var arg = $.param({codi: 'GRAU'},true);
    $.get("https://raco.fib.upc.edu/api/horaris/assignatures-titulacio.txt", arg, resp => {
        let rows = resp.split("\n");
        for (a of rows) {
            var assig_elem = $("<div>"+a+"</div>");
            assig_elem.addClass("assig");
            assig_elem.appendTo("#assig_list");
        }

        $(".assig").click(function() {
            $(this).toggleClass("active");
        });

    }, 'text');

    $(".est_sel").change(function(){
        $(".assig").remove();
        var est = $(".est_sel option:selected").text;
        var arg = $.param({codi: est},true);
        $.get("https://raco.fib.upc.edu/api/horaris/assignatures-titulacio.txt", arg, resp => {
            let rows = resp.split("\n");
            for (a of rows) {
                var assig_elem = $("<div>"+a+"</div>");
                assig_elem.addClass("assig");
                assig_elem.appendTo("#assig_list");
            }

            $(".assig").click(function() {
                $(this).toggleClass("active");
            });

        }, 'text');
    });

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
        $("#horari").children().remove();
        $("#opt_list").children().each(function( index, element ){
            args.push($( this ).text());
            $(this).remove();
        })


        obtain_data(args);
    });
}

$(document).ready(main);
