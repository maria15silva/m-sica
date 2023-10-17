let player;
let trackName;
let pontos = 0;
let erros = 0;

// Extrai apenas o nome da música e remove tudo após o hífen (-)
function extrairNomeDaMusica() {
    if (trackName.includes('-')) {
        const partes = trackName.split('-');
        trackName = partes[0].trim();
    }
    trackName = trackName.trim();
    return trackName;
}

function atualizarPontuacao() {
    const pontuacaoElement = document.getElementById("score");
    pontuacaoElement.innerText = `Pontuação: ${pontos}`;
}

function mostrarMensagem(mensagem) {
    const mensagemContainer = document.getElementById("mensagem-container");
    const mensagemElement = document.getElementById("mensagem");
    
    // Mostra a div de mensagem
    mensagemContainer.classList.remove("hidden");
    
    // Define o texto da mensagem
    mensagemElement.innerText = mensagem;
}

function reiniciarJogo() {
    mostrarMensagem("Você errou 3 vezes e perdeu o jogo!");
    pontos -= 5; // Subtrai 5 pontos quando o jogador erra
    atualizarPontuacao();
    setTimeout(() => {
        window.location.href = "index.html"; // Redireciona para a página de entrada
    }, 2000); // Redireciona após 2 segundos
}

window.onSpotifyWebPlaybackSDKReady = () => {
    // Substitua o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started
    const token = "BQCV6j1nscR-7sLKC9ywQFFZzwJIRrIfbG6t7hyLPnf-sOQiRsC9GRkAY1NrcZn-JiQx4-Effq8-KiQf9NzQ8otssafPbM1RKgpFE2AI45prFHCmFndWaw5TC4OHH8kURMObcs1YvNv4IPGOfwlwGH3MxblcYnSaVS98gIcIMDgeCvrVepE8WSK85QkWv0lDjdzCJ_ulJHmm20dA5i8UvKmbwPsa";
    player = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
            cb(token);
        },
        volume: 0.5,
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        const connect_to_device = () => {
            let album_uri = "spotify:playlist:5PWqIDBCLGnt9ET1nVR76H";
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: "PUT",
                body: JSON.stringify({
                    context_uri: album_uri,
                    play: false,
                }),
                headers: new Headers({
                    "Authorization": "Bearer " + token,
                }),
            }).then(response => console.log(response))
            .then(data => {
                player.addListener('player_state_changed', ({
                    track_window
                }) => {
                    trackName = track_window.current_track.name;
                    trackName = trackName.toLowerCase();
                    console.log('Current Track:', trackName);
                });
            });
        }
        connect_to_device();
    });

    document.getElementById("play-music").addEventListener('click', () => {
        player.togglePlay();
        setTimeout(() => {
            player.pause();
        }, 13000);
    });

    document.getElementById("btn-resposta").addEventListener('click', (event) => {
        event.preventDefault();
        let resposta = document.getElementById("resposta").value;
        resposta = resposta.toLowerCase();
        
        // Obtém apenas o nome da música sem o artista
        const nomeDaMusica = extrairNomeDaMusica();

        if (resposta === nomeDaMusica) {
            mostrarMensagem("Você Acertou, Parabéns!");
            pontos += 10;
            atualizarPontuacao();
            document.getElementById("resposta").value = "";
            player.nextTrack();
            setTimeout(() => {
                player.pause();
                // Oculta a mensagem após um curto período de tempo
                document.getElementById("mensagem-container").classList.add("hidden");
            }, 1300);
        } else {
            mostrarMensagem("Você errou, tente novamente!");
            erros++;
            if (erros === 3) {
                reiniciarJogo();
            }
            else {
                pontos -= 5; // Subtrai 5 pontos quando o jogador erra
                atualizarPontuacao();
            }
        }
    });
    player.connect();
};
