let currentSong = new Audio();

async function getSongs(folder){
    try{
        let songslist = await fetch(`http://127.0.0.1:5500/${folder}`);
        return songslist;
    }
    catch(err){
        console.log("songs not found");
    }
}

async function getFolders(){
    try {
        let foldersList = await fetch("http://127.0.0.1:5500/songs/");
        return foldersList;
    }
    catch (err){
        console.log("no folders exist");
    }
}

async function main(folder){
    try{
        let songs = [];
        let response = await getSongs(folder);
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
        let volumeElement = window.document.querySelector(".volumeRange");
        let previousElement = window.document.querySelector(".previousImage");
        let nextElement = window.document.querySelector(".nextImage");

        previousElement.addEventListener("click", function(event){
            let selectedSong =  decodeURI((currentSong.currentSrc).split(folder)[1]);
            selectedSong = `${folder + selectedSong}`;
            let i = -1;

            let previousSong = "";

            for (i = 0; i < songList.length; i++){
                let songPath = "songs/" + songList[i].querySelector(".songName").innerText;
                console.log(songPath);
                if (selectedSong === songPath){
                    if (i > 0){
                        previousSong = songList[i-1].querySelector(".songName").innerText;
                    }
                    break;
                }
            }

            if (i > 0){
                console.log("/songs/" + previousSong);
                currentSong.src = "/songs/" + previousSong;
                currentSong.volume = volumeElement.value/100;
                currentSong.play();
                songInfoElement.innerText = previousSong;
                playImage.src = "/images/pause.svg";
            }
        });

        nextElement.addEventListener("click", function(event){
            let selectedSong =  decodeURI((currentSong.currentSrc).split("/songs/")[1]);
            let i = -1

            let nextSong = "";

            for (i = 0; i < songList.length; i++){
                if (selectedSong === songList[i].querySelector(".songName").innerText){
                    if (i >= 0 && i < songList.length - 1 ){
                        nextSong = songList[i+1].querySelector(".songName").innerText;
                    }
                    break;
                }
            }

            if (i >= 0 &&i < songList.length - 1){
                currentSong.src = "/songs/" + nextSong;
                currentSong.volume = volumeElement.value/100;
                currentSong.play();
                songInfoElement.innerText = nextSong;
                playImage.src = "/images/pause.svg";
            }
        });

        volumeElement.addEventListener("change", function(event){
            currentSong.volume = event.target.value/100;
        });

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
                    currentSong.volume = volumeElement.value/100;
                    currentSong.play();
                    playImage.src = "/images/pause.svg";
                }
                else {
                    let currentSongSplit = "/songs/" + currentSong.currentSrc.split("/songs/")[1];
                    if (currentSongSplit === songPath) {
                        if (currentSong.paused) {
                            currentSong.volume = volumeElement.value/100;
                            currentSong.play();
                            playImage.src = "/images/pause.svg";
                        }
                        else {
                            currentSong.volume = volumeElement.value/100;
                            currentSong.pause();
                            playImage.src = "/images/play.svg";
                        }
                    }
                    else {
                        currentSong.src = songPath;
                        currentSong.volume = volumeElement.value/100;
                        currentSong.play();
                        playImage.src = "/images/pause.svg";
                    }
                }
            });
        });

        currentSong.src = "/songs/" + songList[0].querySelector(".songName").innerText;
        currentSong.volume = volumeElement.value/100;
        songInfoElement.innerText = songList[0].querySelector(".songName").innerText;
        playImage.src = "/images/play.svg";

        currentSong.addEventListener("timeupdate", function(event){
            let time = (currentSong.currentTime/currentSong.duration)*100;

            let milliSeconds = Math.trunc(currentSong.currentTime*1000);

            let durationMilliSeconds = Math.trunc(currentSong.duration*1000);
            
            let durationHours = Math.trunc(durationMilliSeconds/3600000);
            let remainingDuration = durationMilliSeconds%3600000;

            let durationMinutes = Math.trunc(remainingDuration/60000);
            remainingDuration = remainingDuration%60000;

            let durationSeconds = Math.trunc(remainingDuration/1000);
            remainingDuration = remainingDuration%1000;

            let hours = Math.trunc(milliSeconds/3600000);
            let remainingSeconds = milliSeconds%3600000;

            let minutes = Math.trunc(remainingSeconds/60000);
            remainingSeconds = remainingSeconds%60000;

            let seconds = Math.trunc(remainingSeconds/1000);
            remainingSeconds = remainingSeconds%1000;

            // console.log("hr : ", hours, ", min : ", minutes, ", sec : ", seconds);

            songTimeElement.innerText = String(minutes).padStart(2, '0')  + ":" + String(seconds).padStart(2, '0')
            + "/" + String(durationMinutes).padStart(2, '0')  + ":" + String(durationSeconds).padStart(2, '0');

            seekCircleElement.style.left = time + "%";
        });

        currentSong.addEventListener("ended", function(event){
            playImage.src = "/images/play.svg";
        });

        let hamburger = window.document.querySelector(".hamburger");
        hamburger.addEventListener("click", function(event){
            document.querySelector(".left").style.left = "0";
        })

        let close = window.document.querySelector(".close");
        close.addEventListener("click", function(event){
            document.querySelector(".left").style.left = "-150%";
        })
    }
    catch(err){
        console.log(err);
    }
}

// main();

async function test(){
    try {
        let response = await getFolders();
        let data = await response.text();
        let div = window.document.createElement("div");
        div.innerHTML = data;

        let playList = div.querySelectorAll("ul li");

        let cardContainerElement = document.querySelector(".cardContainer");

        // Define an array to store promises
        let promises = [];

        playList.forEach(async function(folder){
            let folderElement = folder.querySelector("a");
            let folderName = folderElement.href.split("/songs/")[1];
            if (folderName){
                // Push the promise to the array
                promises.push(
                    fetch(`/songs/${folderName}/info.json`)
                    .then(response => response.json())
                    .then(folderData => {
                        // Construct HTML string
                        return `
                        <div class="card relative">
                            <div class="play">
                                <img src="images/play-circle-02-stroke-rounded.svg" alt="">
                            </div>
                            <img class="bannerImage" src="/songs/${folderName}/${folderData.banner}.jfif" alt="">
                            <h2>${folderData.title}</h2>
                            <p>${folderData.description}</p>
                        </div>
                        `;
                    })
                    .catch(error => {
                        console.error("Error fetching data:", error);
                        return ''; // Return empty string if there's an error
                    })
                );
            }
        });

        // After the loop, wait for all promises to resolve
        Promise.all(promises)
        .then(htmlStrings => {
            // Join all HTML strings and set the HTML content
            cardContainerElement.innerHTML = htmlStrings.join('');

            let cardList = document.querySelectorAll(".card");

            cardList.forEach(function(card){
                card.addEventListener("click", function(event){
                    let path = card.querySelector(".bannerImage").src;
                    path = path.split("/songs/")[1];
                    path = path.split("/")[0];
                    console.log(`songs/${path}`);
                    main(`songs/${path}`);
                })
            })
        });
    }
    catch(err){
        console.log("error : ", err);
    }
}

test();
