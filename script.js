let currentSong = new Audio();

async function getSongs(){
    try{
        let songslist = await fetch("http://127.0.0.1:5500/songs");
        return songslist;
    }
    catch(err){
        console.log("songs not found");
        return "song not found";
    }
}

async function main(){
    try{
        let songs = [];
        let response = await getSongs();
        let songtext = await response.text();
        let div = document.createElement("div");
        div.innerHTML = songtext;
        let allSongs = div.querySelectorAll("a");
        allSongs.forEach(function(songElement){
            if (songElement.href.endsWith(".mp3")){
                songs.push(songElement.pathname);
            }
        });

        let cardList = window.document.querySelector('.cardList');

        let string = "";

        songs.forEach(function(song){
            string += 
            `<li>
                <img class="invert" src="images/songicon.svg" alt="">
                <div class="songDetails">
                    <div class="songName">${(song.split("/songs/")[1]).replaceAll("%20", " ")}</div>
                    <div class="songArtist">AlberTesla</div>
                </div>
                <div class="playSongList">
                    <div class="playSongText">Play Song</div>
                    <img class="playSongImage invert" src="images/playsong.svg" alt="">
                </div>
            </li>`
        });

        cardList.innerHTML = string;

        let songList = cardList.querySelectorAll("li");

        currentSong.volume = .1;
        
        songList.forEach(function(song){
            let songName = song.querySelector(".songName").innerText;
            song.addEventListener("click", function(event){
                
                let songPath = "/songs/" + songName;
                
                songPath = encodeURI(songPath);
                console.log(songPath);
                console.log("current song : ", currentSong.currentSrc);

                if (currentSong.currentSrc === ""){
                    console.log("song not there");
                    currentSong.src = songPath;
                    currentSong.volume = .1;
                    currentSong.play();
                }
                else {
                    let currentSongSplit = "/songs/" + currentSong.currentSrc.split("/songs/")[1];
                    if (currentSongSplit === songPath) {
                        if (currentSong.paused) {
                            currentSong.volume = .1;
                            currentSong.play();
                        }
                        else {
                            currentSong.volume = .1;
                            currentSong.pause();
                        }
                    }
                    else {
                        currentSong.src = songPath;
                        currentSong.volume = .1;
                        currentSong.play();
                    }
                }
            });
        });
    }
    catch(err){
        console.log(err);
    }
}

main();
