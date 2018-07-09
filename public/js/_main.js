$(document).ready(function(){
    $('#formulario-cliente').on('submit', function(e){
        e.preventDefault();
    
        $.post('/gestor/public/clientes', {
            nombre: $('input[name="nombre"]').val(),
            _token: $('input[name="_token"]').val()
        }).done(function(respuesta){
            var listaClientes = $('#lista-clientes'), 
                htmlLista = '';
    
            // Mostrar mensaje de inserción
            $('#mensaje').html('Todo OK');
    
            // Vaciar lista
            listaClientes.html('');
    
            // Generar lista
            $.each(respuesta.datos, function(id, cliente){
                htmlLista += '<p>' + cliente.nombre + '</p>';
            });
    
            // Añadir lista
            listaClientes.append(htmlLista);
            
        }).fail(function(respuesta){
            console.log('error');
        });
    });
});

// -------------------------------------------------- OBJETOS ---------- 
// ---------- Historico -----
function Historico(){
	var base = this;
    
    // Constructor
	base.init = function(){
        localStorage.removeItem('historico');
        localStorage.setItem('historico', JSON.stringify([]));
    }

    // Funciones
    base.obtenerHistorico = function(){
        return JSON.parse(localStorage.getItem('historico'));
    };

    base.actualizarHistorico = function(lsHistorico){
        localStorage.setItem('historico', JSON.stringify(lsHistorico));
    };

    base.anadirEvento = function(evento, id, cadena){
        lsHistorico = base.obtenerHistorico();
            
        lsHistorico.push({
            evento: evento,
            id: id,
            cadena: cadena
        });

        base.actualizarHistorico(lsHistorico);
    };

    base.eliminarUltimoEvento = function(evento, id, cadena){
        lsHistorico = base.obtenerHistorico();

        lsHistorico.pop();

        base.actualizarHistorico(lsHistorico);
    };

    // Llamar al constructor
    base.init();
}

// ---------- Lista -----
function Lista(listaHtml){
	var base = this;
    base.listaHtml = $(listaHtml);
    base.botonAnadir = $('#anadir-cadena');
    base.botonEliminar = $('#eliminar-cadena');
    base.botonDeshacer = $('#deshacer');
    base.historico = new Historico();
    
    // Constructor
	base.init = function(){
        // Instanciar Mockjax
        $.mockjax({
            url: "/api/obtenerItemsIniciales",
            responseText: {
                'item-1': 'Cadena inicial 1',
                'item-2': 'Cadena inicial 2',
                'item-3': 'Cadena inicial 3',
                'item-4': 'Cadena inicial 4',
                'item-5': 'Cadena inicial 5',
            }
        });

        // Listeners
        base.botonAnadir.click(base.solicitarCadena);
        base.botonEliminar.click(base.eliminarItemsSeleccionados);
        base.botonDeshacer.click(base.deshacerUltimoEvento);

        // Funciones
        base.actualizarListenersItems();
		base.cargarItemsIniciales();
    }

    // Funciones
    base.actualizarListenersItems = function(){
        base.listaHtml.find('> li').off();

        base.listaHtml.find('> li').click(function(){
            base.seleccionItem($(this));
        });
        base.listaHtml.find('> li').dblclick(function(){
            base.eliminarItem($(this));
        });
    };
    
    base.cargarItemsIniciales = function(){
        $.ajax({
            url: '/api/obtenerItemsIniciales'
        }).done(function(retorno){
            $.each(retorno, function(id, cadena){
                base.anadirItem(cadena, id);
            });
        });
    }

    base.obtenerId = function(){
        ultimoItem = base.listaHtml.find('> li:last-of-type');

        if(ultimoItem[0]){
            ultimoIdAutonumerico = +ultimoItem.attr('id').substr(ultimoItem.attr('id').indexOf('-') + 1);
            
            return 'item-' + (ultimoIdAutonumerico + 1);
        } else{
            return 'item-1';
        }
    }

    base.anadirItem = function(cadena, id = null, anadirEvento = true){
        id = id ? id: base.obtenerId();

        base.listaHtml.append($('<li>', {
            id: id, 
            class: 'list-group-item', 
            text: cadena
        }));

        base.actualizarListenersItems();

        base.actualizarContador();

        if(anadirEvento){base.historico.anadirEvento('anadir', id, cadena);}
    }

    base.eliminarItem = function(itemHtml, anadirEvento = true){
        itemHtml.remove();

        base.actualizarContador();

        if(anadirEvento){base.historico.anadirEvento('eliminar', itemHtml.attr('id'), itemHtml.text());}
    }

    base.solicitarCadena = function(){
        var cadena = prompt('Introducir cadena:');

        if(cadena){base.anadirItem(cadena);}
    }

    base.eliminarItemsSeleccionados = function(){
        base.listaHtml.find('> li.active').each(function(){
            base.eliminarItem($(this));
        });
    }
    
    base.seleccionItem = function(itemHtml){
        if(itemHtml.hasClass('active')){
            itemHtml.removeClass('active');
        } else{
            itemHtml.addClass('active');
        }
    }

    base.deshacerUltimoEvento = function(){
        var ultimoRegistro = $(base.historico.obtenerHistorico()).last()[0];
        
        if(ultimoRegistro){
            if(ultimoRegistro.evento == 'anadir'){
                base.eliminarItem($('#' + ultimoRegistro.id), false);
    
                base.historico.eliminarUltimoEvento();
            } else if(ultimoRegistro.evento == 'eliminar'){
                base.anadirItem(ultimoRegistro.cadena, ultimoRegistro.id, false);
    
                base.historico.eliminarUltimoEvento();
            }
        }

        base.ordenarLista();
    }

    base.actualizarContador = function(){
        $('#contador').html(base.listaHtml.find('> li').length);
    }

    base.ordenarLista = function(){
        // https://stackoverflow.com/questions/21267120/
        base.listaHtml.find('> li').sort(function(a, b){
            ordernA = +$(a).attr('id').substr($(a).attr('id').indexOf('-') + 1);
            ordernB = +$(b).attr('id').substr($(b).attr('id').indexOf('-') + 1);

            return parseInt(ordernA) > parseInt(ordernB);
        }).each(function(){
            var itemHtml = $(this);
            itemHtml.remove();
            $(itemHtml).appendTo(base.listaHtml);
        });

        base.actualizarListenersItems();
    }

    // Llamar al constructor
    base.init();
}

// -------------------------------------------------- MAIN ----------
$(document).ready(function(){
    var lista = new Lista($('#lista'));
});