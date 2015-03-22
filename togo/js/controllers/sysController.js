$(function() {
    // STATUS CODES
    /*-1 = Extension not found
    0 = Idle
    1 = In Use
    2 = Busy
    4 = Unavailable
    8 = Ringing
    16 = On Hold*/

    // armazena as instancias de UserView.js
    var user_views = {};


    // STATUS CODES
    /*-1 = Extension not found
    0 = Idle
    1 = In Use
    2 = Busy
    4 = Unavailable
    8 = Ringing
    16 = On Hold*/

    // conectando com backend
    var socket = io.connect('http://localhost:1337');
        socket
            .on('connect', function () {
                console.log('conectado ao server... aguardando respostas do back-end.');
                //faz requisicao pro back
                io.socket.get('/socket/getPeers', function(peer) {
                    console.log('retorno de /socket/getPeers', peer);
                });
            })
            .on('asterisk connected', function(participant) {

                console.log('recebido informacoes do participante', participant);
                var user_view = user_views[participant.exten];
                if (!user_view) return;

                user_view.data.ramalOcupado = (participant.status == 0);
                user_view.render();
                console.log('asterisk connected', user_view);

            })
            .on('get peers', function(peers) {
                console.log('Retorna os ramais registrados no sip.conf', peers);
                // cada vez que alguem conectar, cada cliente vai disparar o evento `get peers` (rever isso)
                // para prevenir a duplicação de views, vamos limpar o container dessas views
                $('.usersDiv').html('');

                user_views = {};

                // renderiza as UserViews para cada ramal
                // e guarda em user_views
                $.each(peers, function(k, peer) {
                    var user_view = new UserView();

                    user_view.setPeer(peer);
                    user_views[peer.objectname] = user_view;
                    user_view.render();

                    $('.usersDiv').append(user_view.$el);
                });
            })
            /*.on('show result', function(result) {
                console.log('SHOWING RESULT:', result);
            })*/;
});