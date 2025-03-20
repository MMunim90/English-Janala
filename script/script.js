
showSpinner = () =>{
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("wordsLevel-container").classList.add("hidden");
}

hideSpinner = () =>{
    document.getElementById("wordsLevel-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
}


function removeActiveClass(){
    const activeButtons = document.getElementsByClassName("active");

    for(let btn of activeButtons){
        btn.classList.remove("active");
    }
}

function loadAllLevels() {
  //fetch all levels
  fetch("https://openapi.programming-hero.com/api/levels/all").then((res) =>
    res.json().then((data) => displayAllLevels(data.data))
  );
}

function displayAllLevels(levels){
    const levelsContainer = document.getElementById("levels-container");
    // loadLevels();
    for(let lvl of levels){
        // console.log(lvl);

        const levelsDiv = document.createElement("div");
        levelsDiv.innerHTML=`
        <a id="btn-${lvl.level_no}" onclick="loadWordsByLevel(${lvl.level_no})" href="#learn"
            class="btn group hover:bg-[#422AD5] text-[#422AD5] hover:text-white border-[#422AD5]"
            ><img
              class="group-hover:brightness-0 group-hover:invert"
              src="assets/fa-book-open.png"
              alt=""
            />Lesson-${lvl.level_no}</a
          >
        `;
        levelsContainer.append(levelsDiv)
    }
}

// function loadLevels(){
//     fetch(`https://openapi.programming-hero.com/api/level/7`).then(response => response.json()).then(data => displayLevels(data.data));
// }

const displayLevels = (allData) => {
    // console.log(allData)
    const wordsLevelContainer = document.getElementById("wordsLevel-container");

    wordsLevelContainer.innerHTML = "";

    if(allData.length == 0){
        wordsLevelContainer.innerHTML=`
        <div class="flex flex-col items-center text-center gap-5 col-span-full" id="empty-lesson">
                <img src="assets/alert-error.png" alt="">
                <p class="font-bold">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি</p>
                <h1 class="font-bold text-3xl">নেক্সট Lesson এ যান</h1>
            </div>
        `
        hideSpinner();
        return;
    }

    allData.forEach(data => {
        // console.log(data)

        const levelsCard = document.createElement("div");
        
        levelsCard.innerHTML=`
        <div class="card bg-base-100 shadow-sm">
  <div class="card-body items-center text-center">
    <h2 class="font-bold text-2xl">${data.word}</h2>
    <p class="font-bold">Meaning / Pronounciation</p>
    <h2 class="text-2xl font-bold">"${data.meaning || "অর্থ নেই"} / ${data.pronunciation}"</h2>
    <div class="card-actions flex justify-center gap-72 mt-8">
      <button onclick=loadWordDetail('${data.id}') class="hover:scale-115 duration-300 p-4 rounded-lg bg-[#1A91FF10]"><img src="assets/fi-sr-info.png"></button>
      <button onclick=pronounceWord('${data.word}') class="hover:scale-115 duration-300 p-4 rounded-lg bg-[#1A91FF10]"><img src="assets/fi-sr-volume.png"></button>
    </div>
  </div>
</div>
        `;

        wordsLevelContainer.append(levelsCard);
    });
    hideSpinner();
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN'; // English
    window.speechSynthesis.speak(utterance);
  }

const loadWordsByLevel = (level) => {
    showSpinner();
    const url = `https://openapi.programming-hero.com/api/level/${level}`;
    // console.log(url);

    fetch(url)
    .then(response => response.json())
    .then(data => {
        removeActiveClass();
        const clickedButton = document.getElementById(`btn-${level}`)
        clickedButton.classList.add("active");
        // console.log(clickedButton)
        displayLevels(data.data)
    });
}


const loadWordDetail = (wordId) => {
    // console.log(wordId);
    const url = `https://openapi.programming-hero.com/api/word/${wordId}`
    fetch(url)
    .then(response => response.json())
    .then(data => displayWordDetails(data.data))
}

const displayWordDetails = (details) => {
    // console.log(details);
    document.getElementById("word_details").showModal();
    const detailsContainer = document.getElementById("details-container");

    detailsContainer.innerHTML= (details.synonyms?.length || details.meaning) ? `
    <h2 class="font-bold text-2xl">${details.word} ( <img class="inline" src="assets/fi-ss-microphone.png">  :  ${details.pronunciation} )</h2><br>

    <p class="font-bold">Meaning</p>
    <p>${details.meaning || "অর্থ পাওয়া যায়নি"}</p><br>

    <p class="font-bold">Example</p>
    <p>${details.sentence}</p><br>

    <p class="font-bold mb-4">সমার্থক শব্দ গুলো</p>
    <p>${details.synonyms.map(synonym => `<span class=" px-5 py-[6px] bg-[#EDF7FF] rounded-lg mr-5 border border-[#D7E4EF]">${synonym} </span>`).join('')}
    
    </p>
    <br>
    ` : `<h2 class="font-bold text-2xl">${details.word} ( <img class="inline" src="assets/fi-ss-microphone.png">  :  ${details.pronunciation} )</h2><br>

    <p class="font-bold">Meaning</p>
    <p>${details.meaning || "অর্থ পাওয়া যায়নি"}</p><br>

    <p class="font-bold">Example</p>
    <p>${details.sentence}</p><br>

    <p class="font-bold mb-4">সমার্থক শব্দ গুলো</p>
    <br>`
}

const showSection = () => {
    loadAllLevels();
    document.getElementById("top-heading").classList.remove("hidden");
    document.getElementById("learn").classList.remove("hidden");
    document.getElementById("faq").classList.remove("hidden");
    document.getElementById("section1").classList.add("hidden");
};

let hideSectionCalled = false;
const hideSection = () => {
    if(hideSectionCalled){
        return;
    }
    document.getElementById("top-heading").classList.add("hidden");
    document.getElementById("learn").classList.add("hidden");
    document.getElementById("faq").classList.add("hidden");
    document.getElementById("section1").classList.remove("hidden");

    hideSectionCalled = true;
};

const checkPassword = (event) => {
    event.preventDefault();  

    const usernameInput = document.getElementById('username');
    const username = usernameInput.value; 

    const pinInput = document.getElementById('password');
    const pinNumber = pinInput.value;  

    if (!username) {  
        alert("Please Tell us your Name first")
        return; 
    }

    if (parseInt(pinNumber) === 123456) {

        showSection();

        Swal.fire({
            title: `অভিনন্দন ${username}!`,
            text: "চলুন আজ নতুন কিছু শেখা যাক",
            icon: "success",
            confirmButtonText: "OK"
        });
    } else {
        alert("Wrong Password. Contact admin to get your Login Code");
        pinInput.value = "";   
    }
};


hideSection();
