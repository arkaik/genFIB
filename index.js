var dies = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"]
var hores = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"]

class Assignatura {

    constructor(nom = "─") {
        this._nom = nom;
        this._long = 0;
        this._inici = new Grup()
    }

    get nom() {return this._nom}
    get longitud() {return this._long}
    get inici() {return this._inici}

    set nom(n) {this._nom = n}

    afegirGrup (v) {
        let aux1 = this._inici
        while (aux1.seguent != null) {
            let aux2 = aux1.seguent
            if (aux2.valor == v) return aux2
            else if (aux2.valor > v) {
                aux1.seguent = new Grup(v,aux2,this._nom)
                this._long++;
                return aux1.seguent
            }
            aux1 = aux2
        }
        aux1.seguent = new Grup(v,null,this._nom)
        this._long++
        return aux1.seguent
    }

    esborrarGrup(v) {
        let aux1 = this._inici
        while (aux1.seguent != null) {
            let aux2 = aux1.seguent;
            if (aux2.valor == v) {
                aux1.seguent = aux2.seguent
                this._long--
                return
            }
            if (aux2.valor > v) return
            aux1 = aux2
        }
    }

    grupNum(pos) {
        let aux1 = this._inici
        let c = 0
        while (aux1.seguent != null) {
            let aux2 = aux1.seguent
            if (c == pos) return aux2
            aux1 = aux2
            c++
        }
        return null
    }

    afegirHora(pos, dia, hora, tipus) {
        let aux = grupNum(pos)
        if (aux != null) aux.afegeixHora(dia,hora,tipus)
    }

    llistaGrups() {
        let aux1 = inici
        let ret = new Array(this._long)
        let c = 0
        while(aux1.seguent != null) {
            ret[c] = aux1.seguent.valor
            c++
            aux1 = aux1.seguent
        }
        return ret
    }

    static generateColor () {
        let r =  Math.floor(Math.random() * 256)
        let g =  Math.floor(Math.random() * 256)
        let b =  Math.floor(Math.random() * 256)
        return `rgb(${r},${g},${b})`
    }

}

class Grup {

    constructor(val = -1, s = null, nom = "") {
        this._nom = nom;
        this._val = val;
        this._seg = s
        this._horari = new Array(5)
        for (var i = 0; i < this._horari.length; i++) {
            this._horari[i] = new Array(13)
            this._horari[i].fill("Ø")
        }
        this._hores = []
    }

    get nom () {return this._nom;}
    get valor () {return this._val;}
    get seguent () {return this._seg;}
    get hores () {return this._hores;}

    hora(dia, franja) {
        return this._horari[dia][franja]
    }

    set valor(v) {this._val = v}
    set seguent(seg) {this._seg = seg}

    afegeixHora(dia, franja, tipus) {
        if (tipus != "Ø") {
            this._horari[dia-1][franja] = tipus
            this._hores.push(`${this._val} ${dia} ${franja} ${tipus}`)
        }
    }

    fusio(gr) {
        for (let x = 0; x < 5; x++)
            for (var y = 0; y < 13; y++) {
                let tipus = gr.hora(x,y)
                if (this._horari[x][y] == "Ø" && tipus != "Ø") {
                    this._horari[x][y] = gr.hora(x,y)
                    this._hores.push(`${this._val} ${x+1} ${y} ${tipus}`)
                }
            }
    }

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

class Solucio {
    constructor (sol) {
        if (sol == undefined) {
            this._longitud = 0;
    		this._espai = 10;
    		this._grups = new Array(this._espai);
            //this._grups = new Array(this._espai);
        } else {
            this._longitud = sol.longitud;
    		this._espai = sol.espai;
    		this._grups = new Array(this._espai);
    		for (let i = 0; i < this._grups.length; ++i) {
    			this._grups[i] = sol.grup(i);
            }
            //this._grups = sol.llistaGrups.slice();
        }
    }

    solapament () {
		let solapament = 0;
		for (let i = 0; i < 5; i++) for(let j = 0; j < 13; j++) {
			let aux = 0;
			for (let k = 0; k < this._longitud; k++){
				if (this._grups[k].hora(i,j) != '\0') aux++;
			}
			if (aux > 1) solapament += aux-1;
		}
		return solapament;
	}

    get longitud () {return this._longitud;}
    get espai () {return this._espai;}
    grup (i) {
        if (i >= this._longitud) return null;
		return this._grups[i];
    }
    get llistaGrups () {return this._grups}

    afegirGrup (gr) {
		if (this._longitud == this._espai) {
			this._espai += 5
			this._grups.length += 5
		}
		this._grups[this._longitud] = gr;
		this._longitud++;
	}

    esborrarGrup (gr) {
		let b = false;
		let comptador = this._longitud - 1;
		while (comptador > -1) {
			if (this._grups[comptador] == gr) {
				for(let i = comptador; i < this._longitud; i++) {
					this._grups[i] = this._grups[i+1];
				}
				this._longitud--;
				comptador = -1;
			}
			comptador--;
		}
		if (this._espai - this._longitud > 5 && this._espai > 10) {
			this._espai -= 5;
			let aux = new Grup[this._espai];
			for(let i = 0; i < this._longitud; i++) {
				aux[i] = this._grups[i];
			}
			this._grups = aux;
		}
	}

    nivell() {
		let comptador = 0;
		for(let i = 0; i < 5; i++) for(let j = 0; j < 13; j++) {
			for(let k = 0; k < this._longitud; k++) {
				if (this._grups[k].hora(i,j) != '\0') {
					if (j < 7) comptador++; else comptador--;
				}
			}
		}
		return comptador;
	}
}

class Generador {
    constructor () {
        this._mll_slp = true;
		this._matins = new Array(2);
		this._hrs_prh = new Array(5);
        for (let p = 0; p < this._hrs_prh.length; p++) {
             this._hrs_prh[p] = new Array(13)
        }
		this._max_slp = 99999;
		this._tol = 0;
    }

    set millorSolap (ms) {this._mll_slp = ms}
    set matins (b) {
        this._matins[0] = b;
        if (b) this._matins[1] = false;
    }
    set tardes (b) {
        this._matins[1] = b;
        if (b) this._matins[0] = false;
    }
    set tolerancia (tol) {this._tol = tol}
    set horesProh (hores) {this._hrs_prh = hores}
    set maximSolap (max) {this._max_slp = max}
    set filtres (f) {
        this._filtres = new String[f.length][2]
		for (let i = 0; i < f.length; i++) {
			let aux = f[i].split(":")
			this._filtres[i][0] = aux[0]
			this._filtres[i][1] = aux[1]
		}
    }

    filtrar (assig) {
        let ret = ""
        let noapp = new Array(this._filtres.length)
		for (let [k, v] of assig) {
			let b = false;
			let grps = v.llistaGrups();
			for (let j = 0; j < this._filtres.length; j++) {
				if (this._filtres[j][0] == v.nom()) {
					for(let k = 0; k < grps.length; k++) {
						if (grps[k] == parseInt(this._filtres[j][1])) {
							grps[k] = 0;
							noapp[j] = true;
							b = true;
						}
					}
				}
			}
			for (let j = 0; j < grps.length; j++) {
				if (grps[j] != 0 && b) v.esborrarGrup(grps[j]);
			}
		}
		let aplicat = true;
		for (let i = 0; i < noapp.length; i++) aplicat = noapp[i];
		if (!aplicat) ret = "(Alerta! Hi ha filtres invàlids!)";
		return ret;
    }

    generador (assig) {
		let llis = []
        let subj = [...assig.values()]
        console.log(subj);
		llis = this.generar(subj,llis,new Solucio(),0);

		if (this._matins[0] || this._matins[1]) matins(llis,this._tol);
        console.log("─────###─────");
		return llis;
	}

    generar (assig, llis, sol_curs, n_assig) {
        if (n_assig >= assig.length) {
			llis = this.registre(llis,sol_curs);
		}
        else if (assig[n_assig].longitud == 0) {
			llis = this.generar(assig,llis,sol_curs,n_assig+1);
		}
        else {
             for (let k = 0; k < assig[n_assig].longitud; k++) {
				let gr = assig[n_assig].grupNum(k);
				sol_curs.afegirGrup(gr);
				if (this.condicio(sol_curs)) {
					llis = this.generar(assig,llis,sol_curs,n_assig+1);
				}
				sol_curs.esborrarGrup(gr);
			}
		}
        return llis
    }

    condicio (sol) {
		// Comprovador d'Hores Prohibides
		for (let i = 0; i < 5; i++) for(let j = 0; j < 13; j++) {
			if (this._hrs_prh[i][j]) {
				for(let k = 0; k < sol.longitud(); k++) {
					let aux = sol.grup(k);
					if (aux.hora(i,j) != '\0') return false;
				}
			}
		}
		// Comprovador de Solapaments
		if (sol.solapament() > this._max_slp) return false;
		// Ha passat totes les proves
		return true;
	}

    registre (llis, sol){
		let suma = sol.solapament();
		if (this._mll_slp) {
			if (suma == this._max_slp) {
				llis.push(new Solucio(sol));
			} else if (suma < this._max_slp) {
				this._max_slp = suma;
				llis = [];
				llis.push(new Solucio(sol));
			}
		} else {
			llis.push(new Solucio(sol));
		}
        return llis;
	}

    matins (llis, tol) {
		let nova = [];
		let pitjor = 0;
		let valors = new Array(tol+1);
		for (let i = 0; i < tol+1; i++) valors[i] = (this._matins[0]?-99999:99999);
		if (this._matins[0]) {
			for (let j = 0; j < tol+1; j++) if (valors[j] < valors[pitjor]) pitjor = j;
		} else {
			for(let j = 0; j < tol+1; j++) if (valors[j] > valors[pitjor]) pitjor = j;
		}
		for (let i = 0; i < llis.length(); i++) {
			let auxiliar = undefined;
			let aux = llis.solucioNum(i);
			if (this._matins[0]) {
				if (aux.nivell > valors[pitjor]) {
					auxiliar = pitjor;
					for(let j = 0; j < tol+1; j++) {
						if (valors[j] < valors[pitjor]) pitjor=j;
					}
					for(let j = 0; j < tol+1; j++) {
						if (valors[j] == aux.nivell) valors[j] = valors[pitjor];
					}
					valors[auxiliar] = aux.nivell;
				}
			} else {
				if (aux.nivell < valors[pitjor]) {
					auxiliar = pitjor;
					for(let j = 0; j < tol+1; j++) {
						if (valors[j] > valors[pitjor]) pitjor=j;
					}
					for(let j = 0; j < tol+1; j++) {
						if (valors[j] == aux.nivell) valors[j] = valors[pitjor];
					}
					valors[auxiliar] = aux.nivell;
				}
			}

		}

		for(let j = 0; j < tol+1; j++) {
			if ((valors[j] < valors[pitjor] && matins[0])
			|| (valors[j] > valors[pitjor] && !matins[0])) pitjor=j;
		}
		let tolerat = valors[pitjor];
		for (let i = 0; i < llis.length; i++) {
			if ((llis.solucioNum(i).nivell >= tolerat && matins[0])
			|| (llis.solucioNum(i).nivell <= tolerat && !matins[0])) {
				nova.append(llis.solucioNum(i));
			}
		}
		llis = nova;
	}
}

var parser = function (resp) {
    let assigs = new Map();
    let rows = resp.split("\n");
    for (h of rows) {
        let [sigla, grup, d, f, tipus, aula] = h.split("\t");
        if (!sigla == ""){
            if (!assigs.has(sigla)) assigs.set(sigla, new Assignatura(sigla));
            let as = assigs.get(sigla);
            // let gr = {nom: sigla, valor: grup, dia: d, hora: f, t: tipus, a: aula};

            let g = 0
            let b = false
            let aux = null
            while (!b) {
                let aux2 = as.grupNum(g)
                if (aux2 == null) {
                    aux = as.afegirGrup(parseInt(grup))
                    b = true
                }
                else if (aux2.valor == parseInt(grup)) {
                    aux = aux2
                    b = true
                }
                else g++
            }

            let fr = parseInt(f.split(':',1))-8
            if (aux != null) aux.afegeixHora(parseInt(d),fr,tipus)
        }
    }

    return assigs;

}

var mesclador = function (assigs) {
    for ([k, as] of assigs) {
        let aux1 = null //Serà el grup que es fusionarà en els altres
        let subgrs = false
        for (let z = 0; z < as.longitud; z++) {
            let aux2 = as.grupNum(z)
            if (aux2.valor%10 == 0) aux1 = aux2
            else {
                if (aux1 != null) {
                    aux2.fusio(aux1)
                    subgrs = true
                }
            }
        }

        if (subgrs) {
            for (let w = 0; w < as.longitud; w++) {
                let aux2 = as.grupNum(w)
                if (aux2.valor%10 == 0) as.esborrarGrup(aux2.valor)
            }
        }

    }

    return assigs
}

var buildHorari = function (sols) {

    for (let s = 0; s < sols.length; s++) {
        let lg = sols[s].llistaGrups

        // Inicialització de matriu
        let mat = new Array(14);
        for (let i = 0; i < mat.length; i++) {
            mat[i] = new Array(6);
            for (let j = 0; j < mat[i].length; j++) mat[i][j] = [];
        }

        mat[0][0].push("")

        for (let dd = 0; dd < dies.length; dd++) mat[0][dd+1].push(dies[dd])
        for (let hh = 0; hh < hores.length; hh++) mat[hh+1][0].push(hores[hh])
        for (var g of sols[s].llistaGrups) {
            if (g) {
                for (var h of g._hores) {
                    [fg, fj, fi, ft] = h.split(" ");
                    let ni = parseInt(fi);
                    let nj = parseInt(fj);
                    mat[ni+1][nj].push(`${g.nom} ${fg} ${ft}`);
                }
            }
        }

        let horari_block = $("<div>")
        horari_block.addClass("horari");
        let rheight = 0;
        for (let i = 0; i < mat.length; i++) {
            for (let j = 0; j < mat[i].length; j++) {
                let block = $("<div>");
                block.attr("myStyle", `grid-row: ${j+1}; grid-column: ${i+1}`);
                block.addClass("hora");
                for (let k = 0; k < mat[i][j].length; k++) {
                    [sc, sg, st] = mat[i][j][k].split(" ");
                    let subblock = $("<div>");
                    if (sg == undefined) {
                        subblock.html(`${sc}`);
                    }
                    else {
                        //subblock.css("background-color", `rgb(100,80,60)`);
                        subblock.html(`${sc} ${sg} ${st}`);
                    }
                    subblock.addClass("grup");
                    block.append(subblock);
                }
                horari_block.append(block);

                let bheight = block.height();
                if (bheight > rheight) rheight = bheight;
            }
        }

        console.log(`row height: ${rheight}`);
        // Same height for all
        $(".hora").height(`${rheight}px`);

        $("#horari_list").append(horari_block);
    }

}

var obtain_data = function (subj) {
    let par = [];
    for (st of subj) par.push(st);
    var args = $.param({assignatures: par}, true);

    // ASYNC (only IN)
    $.get("https://raco.fib.upc.edu/api/horaris/horari-assignatures.txt", args, resp => {
        let assig = parser(resp);
        assig = mesclador(assig);
        let gen = new Generador()
        let sols = gen.generador(assig);
        buildHorari(sols);
    }, 'text');

}

var main = function(){

    var arg = $.param({codi: 'GRAU'},true);
    $.get("https://raco.fib.upc.edu/api/horaris/assignatures-titulacio.txt", arg, resp => {
        let rows = resp.split("\n");
        // Les assignatures PAE i FDM encara no estan agregades a la llista d'assignatures
        rows.push("GRAU-PAE", "GRAU-FDM")
        rows.sort()
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
        var est = $(".est_sel option:selected").val();
        var arg = $.param({codi: est},true);
        $.get("https://raco.fib.upc.edu/api/horaris/assignatures-titulacio.txt", arg, resp => {
            let rows = resp.split("\n");

            // Les assignatures PAE i FDM encara no estan agregades a la llista d'assignatures
            if (est == "GRAU") {
                rows.push("GRAU-PAE", "GRAU-FDM")
                rows.sort()
            }

            for (a of rows) {
                let assig_elem = $("<div>"+a+"</div>");
                assig_elem.addClass("assig")
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
        $("#horari_list").children().remove();
        $("#opt_list").children().each(function( index, element ){
            args.push($( this ).text());
            //$(this).remove();
        })

        obtain_data(args);
    });
}

$(document).ready(main);
