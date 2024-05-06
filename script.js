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
        
        let songInfoElement = window.document.querySelector(".songInfo");
        let songTimeElement = window.document.querySelector(".songTime");
        let seekBarElement = window.document.querySelector(".seekbar");
        let seekCircleElement = window.document.querySelector(".seekCircle");


        seekBarElement.addEventListener("click", function(event){
            let percent = (event.offsetX/seekBarElement.offsetWidth)*100;
            seekCircleElement.style.left = percent + "%";

            if (currentSong.currentSrc !== ""){
                let seekTime = currentSong.duration*percent/100;
                currentSong.currentTime = seekTime;
            }
        });

        songTimeElement.innerText = "00:00/00:00";
        let playImage = window.document.querySelector(".playPauseImage");

        playImage.addEventListener("click", function(event){
            if (currentSong.currentSrc !== ""){
                if (currentSong.paused) {
                    currentSong.play();
                    playImage.src = "/images/pause.svg";
                }
                else{
                    currentSong.pause();
                    playImage.src = "/images/play.svg";
                }
            }
        });

        songList.forEach(function(song){
            let songName = song.querySelector(".songName").innerText;
            playImage.src = "/images/play.svg";

            song.addEventListener("click", function(event){
                let songPath = "/songs/" + songName;
                songInfoElement.innerText = songName;
                songPath = encodeURI(songPath);

                if (currentSong.currentSrc === ""){
                    console.log("song not there");
                    currentSong.src = songPath;
                    currentSong.volume = .1;
                    currentSong.play();
                    playImage.src = "/images/pause.svg";
                }
                else {
                    let currentSongSplit = "/songs/" + currentSong.currentSrc.split("/songs/")[1];
                    if (currentSongSplit === songPath) {
                        if (currentSong.paused) {
                            currentSong.volume = .1;
                            currentSong.play();
                            playImage.src = "/images/pause.svg";
                        }
                        else {
                            currentSong.volume = .1;
                            currentSong.pause();
                            playImage.src = "/images/play.svg";
                        }
                    }
                    else {
                        currentSong.src = songPath;
                        currentSong.volume = .1;
                        currentSong.play();
                        playImage.src = "/images/pause.svg";
                    }
                }
            });
        });

        currentSong.src = "/songs/" + songList[0].querySelector(".songName").innerText;
        currentSong.volume = .1;
        songInfoElement.innerText = songList[0].querySelector(".songName").innerText;
        playImage.src = "/images/play.svg";

        currentSong.addEventListener("timeupdate", function(event){
            let time = (currentSong.currentTime/currentSong.duration)*100;
            seekCircleElement.style.left = time + "%";
        });

        currentSong.addEventListener("ended", function(event){
            playImage.src = "/images/play.svg";
        });
    }
    catch(err){
        console.log(err);
    }
}

main();
