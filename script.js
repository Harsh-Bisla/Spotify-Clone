let currSong = new Audio();
let songs;
let currFolder;
// Function for fetching songs url
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
     songs = [];
    console.log(as)
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <i class="fa-solid fa-music"></i>
                            <div class="info">
                                <div> ${song.replace("%20"," ")}</div>
                                <div>Bisla</div>
                            </div>
                            <div class="ply">Play Now</div>
                            <i class="fa-solid fa-play"></i>
                         </li>`;
    }
    //  Fetching the lists 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // Attaching event listner to each song
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs;
    
}
//  Function to convert seconds into a time format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


// Function for play songs
const playMusic = (track, pause = false) => {
    // let audio=new Audio("/songs/" + track)
    currSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currSong.play();
        play.src = "img/pause.svg"

    }
    document.querySelector(".song-info").innerHTML = track;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
}

async function main() {
     await getSongs("songs/karan_aujla")
    playMusic(songs[0], true)
    console.log(songs);
    

    // Attaching a event listner for play,next and previous buttons
    let play = document.querySelector("#play");
    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currSong.pause()
            play.src = "img/play.svg"
        }
    })
    //   Time update event listner
    currSong.addEventListener("timeupdate", () => {
        // console.log(currSong.currentTime, currSong.duration);
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)}/${secondsToMinutesSeconds(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration)
            * 100 + "%";
    })

    // Adding event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)
        *100;
     document.querySelector(".circle").style.left = percent  + "%";
     currSong.currentTime = ((currSong.duration) * percent)/100;
    })

    //  Adding event listner to the hamburger icon

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0; 
    })

    // Adding event listner to the close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = -200 +"%";
    })

    // Adding event listner to the previous button
    document.querySelector(".prev").addEventListener("click",()=>{
        console.log("previous clicked")
        let index = songs.indexOf(currSong.src.split("/").slice(-1) [0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        } 
    })

    //  Adding event listner to next button
    document.querySelector(".next").addEventListener("click",()=>{
        console.log("next clicked")
         let index = songs.indexOf(currSong.src.split("/").slice(-1) [0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }       
    })

    //  Adding event listner to the volume button
    document.querySelector(".range").querySelector("input").addEventListener("change",(e)=>{
        console.log(e, e.target.value)
        currSong.volume = parseInt(e.target.value)/100
    })

    //  Adding the event listner to the card 
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click", async item=>{
            console.log(item.target, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
           
        })
    })

    //  Adding event listner to the volume image
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        console.log(e.target);
        if(e.target.src.includes("img/volume.svg")){
            e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg");
            currSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("img/mute.svg", "img/volume.svg");
            currSong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })

    //  Adding an event listner to the search bar
        document.querySelector(".home>ul").querySelector("li").addEventListener("click",()=>{
            document.querySelector(".search-bar").style.display="block";
        })
    
    
    

}
main();


// http://127.0.0.1:5500