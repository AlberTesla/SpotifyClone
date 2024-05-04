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
                    <div>${(song.split("/songs/")[1]).replaceAll("%20", " ")}</div>
                    <div>AlberTesla</div>
                </div>
                <div class="playSongList">
                    <div class="playSongText">Play Song</div>
                    <img class="playSongImage invert" src="images/playsong.svg" alt="">
                </div>
            </li>`
        });

        cardList.innerHTML = string;

        // listElement.innerHTML = songCardTemplate.text;

        // var audio = new Audio(songs[0]);
        // audio.volume = .05;
        // console.log(songs);
        // audio.addEventListener("loadeddata", function(event){
        //     console.log(audio.duration);
        // });
    }
    catch(err){
        console.log(err);
    }
}

main();
