const apiKey = '80731283f03d46cfbd7f0053cf1fc99e';

const platformMap = {
  "PC": 4,
  "PlayStation 5": 187,
  "Xbox One": 1,
  "PlayStation 4": 18,
  "Xbox Series S/X": 186,
  "Nintendo Switch": 7,
  "iOS": 3,
  "Android": 21,
  "Nintendo 3DS": 8,
  "Nintendo DS": 9,
  "Nintendo DSi": 13,
  "macOS": 5,
  "Linux": 6,
  "Xbox 360": 14,
  "Xbox": 80,
  "PlayStation 3": 16,
  "PlayStation 2": 15,
  "PlayStation": 27,
  "PS Vita": 19,
  "PSP": 17,
  "Wii U": 10,
  "Wii": 11,
  "GameCube": 105,
  "Nintendo 64": 83,
  "Game Boy Advance": 24,
  "Game Boy Color": 43,
  "Game Boy": 26,
  "SNES": 22,
  "NES": 23,
  "Classic Macintosh": 55,
  "Apple II": 41,
  "Commodore / Amiga": 166,
  "Atari 7800": 28,
  "Atari 5200": 29,
  "Atari 2600": 30,
  "Atari Flashback": 31,
  "Atari 8-bit": 32,
  "Atari ST": 33,
  "Atari Lynx": 34,
  "Atari XEGS": 35,
  "Genesis": 167,
  "SEGA Saturn": 25,
  "SEGA CD": 46,
  "SEGA 32X": 47,
  "SEGA Master System": 49,
  "Dreamcast": 50,
  "3DO": 34,
  "Jaguar": 53,
  "Game Gear": 48,
  "Neo Geo": 52,
  "Web": 171
};

const genreMap = {
  "Actie": "action",
  "Indie": "indie",
  "RPG": "role-playing-games-rpg",
  "Adventure": "adventure",
  "Strategy": "strategy",
  "Shooter": "shooter",
  "Casual": "casual",
  "Simulation": "simulation",
  "Puzzle": "puzzle",
  "Arcade": "arcade",
  "Platformer": "platformer",
  "Massively Multiplayer": "massively-multiplayer",
  "Racing": "racing",
  "Sports": "sports",
  "Fighting": "fighting",
  "Family": "family",
  "Board Games": "board-games",
  "Card": "card",
  "Educational": "educational"
};

let rawMatches = JSON.parse(document.body.dataset.userMatches);
const gebruikerString = document.body.dataset.userGebruiker;
const gebruiker = JSON.parse(gebruikerString);
let aantalMatches = Object.keys(rawMatches).length;

Object.entries(rawMatches).forEach(([matchKey, matchData], index) => {
    const vriendenLijst = document.body.dataset.userVrienden.split(",");
    console.log("matchData")
    console.log("'",matchData.matchID,"'")
    console.log("vriendenLijst")
    console.log(vriendenLijst)
    if (vriendenLijst.includes(matchData.matchID)) return;
  let match = `match${index + 1}Array`;

  let matchObject = {
    voornaam: matchData.voornaam,
    matchID: matchData.matchID,
    userImg: matchData.userImg,
    genres: matchData.Overeenkomende_genres,
    talen: matchData.Overeenkomende_talen,
    platformen: matchData.Overeenkomende_platformen
  };

const MatchesDiv = document.getElementById("matches"); // Sla de matches section op
const MatchContainer = document.createElement("article"); // Maak een div aan voor elke match
MatchContainer.classList.add("match"); // een class voor styling
MatchContainer.addEventListener("click", (e) => {
            if (e.target.closest("form")) return; // klik zat in het formulier, dus niks doen
            if (e.target.closest("details")) return; // klik zat in het details, dus niks doen
            console.log(matchData)
            showUser(matchData);
        });
MatchContainer.id = matchData.voornaam; // Voeg een id toe dat overeenkomt met de naam van de match
MatchContainer.setAttribute("style", `background-image: url("/uploads/${matchData.userImg}");`);

const naam = document.createElement("h3")
    naam.textContent = matchData.voornaam;

function addParagraphs(container, data) {
if (data && typeof data.forEach === "function") {
        // data is een array (of iets met forEach)
        data.forEach(item => {
        const p = document.createElement("p");
        p.textContent = item.trim();
        container.appendChild(p);
    });
    } else if (typeof data === "string") {
        // data is een string, split op komma
        data.split(",").forEach(item => {
            const p = document.createElement("p");
            p.textContent = item.trim();
            container.appendChild(p);
    });
    } else {
        // fallback: 1 p met de data (of melding als null/undefined)
        const p = document.createElement("p");
        p.textContent = data ?? "Geen data beschikbaar";
        container.appendChild(p);
    }
}

// Talen
const taalList = document.createElement("details");
taalList.className = "mtaal";

const talenSummary = document.createElement("summary");
talenSummary.textContent = "Taal match";
taalList.appendChild(talenSummary);

    const talenContent = document.createElement("div");
    talenContent.className = "itemstaal"
    addParagraphs(talenContent, matchData.Overeenkomende_talen);
    taalList.appendChild(talenContent);

// Genres
const genresList = document.createElement("details");
genresList.className = "mgenres";

const genresSummary = document.createElement("summary");
genresSummary.textContent = "Genre Match";
genresList.appendChild(genresSummary);

    const genresContent = document.createElement("div");
    genresContent.className = "itemsgenre"
    addParagraphs(genresContent, matchData.Overeenkomende_genres);
    genresList.appendChild(genresContent);



const form = document.createElement("form");  // voegt een form toe met de volgende class, action en method
    form.className = "addMatch";
    form.action = "/addMatch";
    form.method = "post";

    const input = document.createElement("input");  // voegt een input toe met de volgende waardes
    input.type = "image" 
    input.src = "images/plus.png" 
    input.alt = "Submit" 
    input.width = 24;
    input.height = 24;
    input.classList.add("add");
    input.id = matchData.matchID;
    
    const input_hidden = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
    input_hidden.type = "hidden"
    input_hidden.name = "matchId"
    input_hidden.value = matchData.matchID;

form.append(input_hidden, input);
MatchContainer.append(form, naam, genresList, taalList)    
MatchesDiv.append(MatchContainer);

window[match] = matchObject;
plusMin()
});

function plusMin() {
const rawMijnLikes = JSON.parse(document.body.dataset.userMijnlikes);

// Check if the array has at least one element
if (!Array.isArray(rawMijnLikes) || rawMijnLikes.length === 0) return;

const mijnLikes = rawMijnLikes[0].matchIds;

mijnLikes.forEach(Like => {
    const addMinusImage = document.getElementById(Like);
    if (addMinusImage) {
        addMinusImage.src = "images/minus.png";
    } else {
        return;
    }
});
}

function menuLoad() {
const vriendenData = document.body.dataset.userVrienden;
const vriendenHunData = JSON.parse(document.body.dataset.userVriendendata);

const vrienden = vriendenData.split(",");

const mijnVriendenDiv = document.getElementById("mijnVrienden");

vrienden.forEach(vriendId => {
    if (!vriendId) return;
    
    const vriendObj = vriendenHunData.find(v => v._id === vriendId);

    if (vriendObj) {
        const container = document.createElement("article");
        container.classList.add("vriend");
        container.id = vriendObj._id
        container.addEventListener("click", (e) => {
            if (e.target.closest("form")) return; // klik zat in het formulier, dus niks doen
            showUser(vriendObj);
        });
        const p = document.createElement("p");
        p.textContent = vriendObj.r_voornaam;
        const img = document.createElement("img")
        img.src = vriendObj.avatar ? "/uploads/" + vriendObj.avatar : "/images/default-avatar.png";
        img.className = "smallAvatar"

        const form = document.createElement("form");  // voegt een form toe met de volgende class, action en method
        form.className = "cacelInvite";
        form.action = "/removeVriend";
        form.method = "post";

        const input = document.createElement("input");  // voegt een input toe met de volgende waardes
        input.type = "image" 
        input.src = "images/cancel.png" 
        input.alt = "Submit" 
        input.width = 24;
        input.height = 24;
        input.classList.add("cancel");
    
        const hiddenMatchId = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        hiddenMatchId.type = "hidden"
        hiddenMatchId.name = "matchId"
        hiddenMatchId.value = vriendObj._id;

        const hiddenUserId = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        hiddenUserId.type = "hidden"
        hiddenUserId.name = "userId"
        hiddenUserId.value = gebruiker._id;

        form.append(input, hiddenMatchId, hiddenUserId);

        container.append(p, img, form)
        mijnVriendenDiv.append(container);
    }
});

const rawMijnLikes = JSON.parse(document.body.dataset.userMijnlikesexport);
const mijnLikesDiv = document.getElementById("gestuurdeInvites");

rawMijnLikes.forEach(user => {
    const container = document.createElement("article")
        container.classList.add(user._id);
        container.addEventListener("click", (e) => {
            if (e.target.closest("form")) return; // klik zat in het formulier, dus niks doen
            console.log(user)
            showUser(user);
        });
    const p = document.createElement("p");
    const img = document.createElement("img")
        img.src = user.avatar ? "/uploads/" + user.avatar : "/images/default-avatar.png";
        img.className = "smallAvatar"

    const form = document.createElement("form");  // voegt een form toe met de volgende class, action en method
        form.className = "cacelInvite";
        form.action = "/addMatch";
        form.method = "post";

    const input = document.createElement("input");  // voegt een input toe met de volgende waardes
        input.type = "image" 
        input.src = "images/cancel.png" 
        input.alt = "Submit" 
        input.width = 24;
        input.height = 24;
        input.classList.add("cancel");
    
    const hiddenMatchId = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        hiddenMatchId.type = "hidden"
        hiddenMatchId.name = "matchId"
        hiddenMatchId.value = user._id;

    const hiddenUserId = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        hiddenUserId.type = "hidden"
        hiddenUserId.name = "userId"
        hiddenUserId.value = gebruiker._id;

    form.append(input, hiddenMatchId, hiddenUserId);

    p.textContent = user.r_voornaam;

    container.append(p, img, form)
    mijnLikesDiv.append(container);
});


const rawAddUsers = JSON.parse(document.body.dataset.userMijnmatchesexport);
const addUsersDiv = document.getElementById("gekregenInvites");

rawAddUsers.forEach(user => {
    const container = document.createElement("article")
        container.classList.add(user._id);
        container.addEventListener("click", (e) => {
            if (e.target.closest("form")) return; // klik zat in het formulier, dus niks doen
            console.log(user)
            showUser(user);
        });
    const p = document.createElement("p");
    const img = document.createElement("img")
        img.src = user.avatar ? "/uploads/" + user.avatar : "/images/default-avatar.png";
        img.className = "smallAvatar"

    const formAccept = document.createElement("form");  // voegt een form toe met de volgende class, action en method
        formAccept.className = "acceptInvite";
        formAccept.action = "/accept";
        formAccept.method = "post";

    const inputAccept = document.createElement("input");  // voegt een input toe met de volgende waardes
        inputAccept.type = "image" 
        inputAccept.src = "images/accept.png"      //------------------------------------
        inputAccept.alt = "Submit" 
        inputAccept.width = 24;
        inputAccept.height = 24;
        inputAccept.classList.add("accept");
    
    const acceptHiddenMatchId = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        acceptHiddenMatchId.type = "hidden"
        acceptHiddenMatchId.name = "matchId"
        acceptHiddenMatchId.value = user._id;

    const acceptHiddenUserId = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        acceptHiddenUserId.type = "hidden"
        acceptHiddenUserId.name = "userId"
        acceptHiddenUserId.value = gebruiker._id;

    formAccept.append(inputAccept, acceptHiddenMatchId, acceptHiddenUserId);

    const formDecline = document.createElement("form");  // voegt een form toe met de volgende class, action en method
        formDecline.className = "declineInvite";
        formDecline.action = "/deny";
        formDecline.method = "post";

    const inputDecline = document.createElement("input");  // voegt een input toe met de volgende waardes
        inputDecline.type = "image" 
        inputDecline.src = "images/deny.png"      //------------------------------------
        inputDecline.alt = "Submit" 
        inputDecline.width = 24;
        inputDecline.height = 24;
        inputDecline.classList.add("decline");
    
    const declineHiddenMatchId = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        declineHiddenMatchId.type = "hidden"
        declineHiddenMatchId.name = "matchId"
        declineHiddenMatchId.value = user._id;

    const declineHiddenUserId = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        declineHiddenUserId.type = "hidden"
        declineHiddenUserId.name = "userId"
        declineHiddenUserId.value = gebruiker._id;

    formDecline.append(inputDecline, declineHiddenMatchId, declineHiddenUserId);

    p.textContent = user.r_voornaam;

    container.append(p, img, formAccept, formDecline)
    addUsersDiv.append(container);
    checkMatches()
});
}

// Pak alle articles met class 'match'
const articles = document.querySelectorAll('article.match');

articles.forEach(article => {
  // Pak alle details binnen dit artikel
  const detailsElems = article.querySelectorAll('details');

  detailsElems.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        // Sluit alle andere details in hetzelfde article behalve deze
        detailsElems.forEach(otherDetail => {
          if (otherDetail !== detail && otherDetail.open) {
            otherDetail.open = false;
          }
        });
      }
    });
  });
});

function change(data) {
    const [type, waarde, placeholder, email, min, max] = data.split(',,');
    let container = document.getElementById("hiddenChange")
    container.style.display = "block"

    const naam = document.createElement("h3")
        naam.textContent = "Verander hier uw " + placeholder

    const form = document.createElement("form")
        form.className = "change";
        form.action = "/change";
        form.method = "post";

    const input = document.createElement("input");  // voegt een input toe met de volgende waardes
        input.type = "submit"
        input.alt = "Submit"
        input.value = "Verstuur"

        if(type == "r_voornaam") {
            const waardeInput = document.createElement("input")
            waardeInput.type = "text"
            waardeInput.alt = type + "change"
            waardeInput.placeholder = waarde
            waardeInput.name = "Resultaat"
            waardeInput.value = waarde
            waardeInput.required = true;
            form.append(waardeInput, input)
        } else if(type == "avatar") {
            form.enctype = "multipart/form-data";
            const waardeInput = document.createElement("input")
            waardeInput.type = "file"
            waardeInput.id = "avatar"
            waardeInput.name = type
            waardeInput.accept = "image/*"
            form.append(waardeInput, input)
        } else if(type == "r_leeftijd") {
            const waardeInput = document.createElement("input")
            waardeInput.type = "number" 
            waardeInput.id = "r_leeftijd" 
            waardeInput.name = "Resultaat"
            waardeInput.placeholder = waarde
            waardeInput.min = "12" 
            waardeInput.max = "99"
            waardeInput.value = waarde
            waardeInput.required = true;
            form.append(waardeInput, input)
        } else if (type === "audience") {
            let waardeLos = waarde.split(",").map(item => item.trim());
            const options = [
                { value: "Man", id: "audience1" },
                { value: "Vrouw", id: "audience2" },
                { value: "Anders", id: "audience3" }
            ];

            options.forEach(opt => {
                const wrapper = document.createElement("div");

                const inputAudi = document.createElement("input");
                inputAudi.type = "checkbox";
                inputAudi.name = "Resultaat";
                inputAudi.value = opt.value;
                inputAudi.id = opt.id;

                const label = document.createElement("label");
                label.htmlFor = opt.id;
                label.textContent = opt.value;
                if (waardeLos.includes(opt.value)) {
                            inputAudi.checked = true;
                        }

                wrapper.appendChild(inputAudi);
                wrapper.appendChild(label);

                form.appendChild(wrapper);
            });
            form.append(input)
        } else if(type == "genres") {
            let waardeLos = waarde.split(",").map(item => item.trim());
            console.log(waardeLos)
            fetch('getDataGenres')
                .then(res => res.json())
                .then(data => {
                    data.forEach((genre) => {
                        console.log(genre.name)

                        const addGenre = document.createElement("label")
                        const addCheck = document.createElement("input")
                        const br = document.createElement("br")

                        addCheck.type = "checkbox"
                        addCheck.name = "Resultaat"
                        addCheck.value = genre.name
                        if (waardeLos.includes(genre.name)) {
                            addCheck.checked = true;
                        }

                        addGenre.append(addCheck, " ", genre.name, br)
                        form.append(addGenre, input)
                    })
                });
        } else if(type == "land") {
            let waardeLos = waarde
            console.log(waardeLos)
            fetch('getDataLand')
                .then(res => res.json())
                .then(data => {
                    data.forEach((land) => {
                        console.log(land.name)

                        const addLand = document.createElement("label")
                        const addCheck = document.createElement("input")
                        const br = document.createElement("br")

                        addCheck.type = "radio"
                        addCheck.name = "Resultaat"
                        addCheck.id = "Land"
                        addCheck.value = land.name
                        if (waardeLos.includes(land.name)) {
                            addCheck.checked = true;
                        }

                        addLand.append(addCheck, " ", land.name, br)
                        form.append(addLand, input)
                    })
                });
        } else if(type === "minAge" || type === "maxAge") {
            const rangeContainer = document.createElement("div")
                rangeContainer.className = "rangeContainer"

            const dualRange = document.createElement("div")
                dualRange.className = "dualRange"
            
            const sliderContainer = document.createElement("div")
                sliderContainer.className = "sliderContainer"

            const rangeMin = document.createElement("input")
                rangeMin.type = "range"
                rangeMin.id = "rangeMin"
                rangeMin.name = "minAge"
                rangeMin.min = "12"
                rangeMin.max = "99"
                rangeMin.value = Number(min)
                rangeMin.oninput = updateRange

            const rangeMax = document.createElement("input")
                rangeMax.type = "range"
                rangeMax.id = "rangeMax"
                rangeMax.name = "maxAge"
                rangeMax.min = "12"
                rangeMax.max = "99"
                rangeMax.value = Number(max)
                rangeMax.oninput = updateRange

            const leeftijdsklasse = document.createElement("div")
                leeftijdsklasse.textContent = "Leeftijdsklasse: "

            const span = document.createElement("span")
                span.id = "ageRange"
                span.textContent = `${min} - ${max}`

            
            sliderContainer.append(rangeMin, rangeMax)
            dualRange.append(sliderContainer)
            leeftijdsklasse.append(span)
            rangeContainer.append(dualRange, leeftijdsklasse)
            
            form.append(rangeContainer, input);
        } else if(type == "platform") {
            let waardeLos = waarde.split(",").map(item => item.trim());
            console.log(waardeLos)
            fetch('getDataPlatform')
                .then(res => res.json())
                .then(data => {
                    data.forEach((platform) => {
                        console.log(platform.name)

                        const addPlatform = document.createElement("label")
                        const addCheck = document.createElement("input")
                        const br = document.createElement("br")

                        addCheck.type = "checkbox"
                        addCheck.name = "Resultaat"
                        addCheck.value = platform.name
                        if (waardeLos.includes(platform.name)) {
                            addCheck.checked = true;
                        }

                        addPlatform.append(addCheck, " ", platform.name, br)
                        form.append(addPlatform, input)
                    })
                });
        } else if(type == "taal") {
            let waardeLos = waarde.split(",").map(item => item.trim());
            console.log(waardeLos)
            fetch('getDataTaal')
                .then(res => res.json())
                .then(data => {
                    data.forEach((taal) => {
                        console.log(taal.name)

                        const addTaal = document.createElement("label")
                        const addCheck = document.createElement("input")
                        const br = document.createElement("br")

                        addCheck.type = "checkbox"
                        addCheck.name = "Resultaat"
                        addCheck.value = taal.name
                        if (waardeLos.includes(taal.name)) {
                            addCheck.checked = true;
                        }

                        addTaal.append(addCheck, " ", taal.name, br)
                        form.append(addTaal, input)
                    })
                });
        } else {
            waardeInput.type = "hidden"
            waardeInput.alt = "onbekend"
            waardeInput.name = "waarde"
            waardeInput.value = "Onbekende keuze om te veranderen"
        }

    const typeHidden = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        typeHidden.type = "hidden"
        typeHidden.name = "type"
        typeHidden.value = type;

    const placeholderHidden = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        placeholderHidden.type = "hidden"
        placeholderHidden.name = "placeholder"
        placeholderHidden.value = placeholder;

    const userIdHidden = document.createElement("input"); // voegt een input toe die niet zichtbaar is met de user id
        userIdHidden.type = "hidden"
        userIdHidden.name = "userMail"
        userIdHidden.value = email;

    const close = document.createElement("button");  // voegt een input toe met de volgende waardes
        close.onclick = () => {
            location.reload();
        };
        close.type = "button";
        close.textContent = "Cancel";
        close.id = "closeChange"

    form.append(typeHidden, placeholderHidden, userIdHidden, close) 
    container.innerHTML = "";
    container.append(naam, form)
}

function updateRange() {
    const min = document.getElementById("rangeMin");
    const max = document.getElementById("rangeMax");
    const label = document.getElementById("ageRange");
    let minVal = parseInt(min.value);
    let maxVal = parseInt(max.value);
    if (minVal > maxVal) {
        [min.value, max.value] = [max.value, min.value];
        [minVal, maxVal] = [maxVal, minVal];
    }
    label.textContent = `${minVal} - ${maxVal}`;
}


function checkMatches() {
    const mogelijk = JSON.parse(document.body.dataset.userMatches);
    const mogelijk_IDs = Object.values(mogelijk).map(match => match.matchID);

    const gestuurdeInvites = JSON.parse(document.body.dataset.userMijnlikesexport);
    const gestuurdeInvites_IDs = gestuurdeInvites.map(user => user._id);

    const gekregenInvites = JSON.parse(document.body.dataset.userMijnmatchesexport);
    const gekregenInvites_IDs = gekregenInvites.map(user => user._id);

    console.log("Mogelijke matchIDs:", mogelijk_IDs);
    console.log("Gestuurde invite IDs:", gestuurdeInvites_IDs);
    console.log("Gekregen invite IDs:", gekregenInvites_IDs);

    gestuurdeInvites_IDs.forEach(id => {
        if (mogelijk_IDs.includes(id)) {
            console.log(`ID ${id} komt WEL voor in mogelijk_IDs | gestuurdeInvites`);
        } else {
            console.log(`ID ${id} komt NIET voor in mogelijk_IDs | gestuurdeInvites`);
            const test = ""
        }
    });
    gekregenInvites_IDs.forEach(id => {
        if (mogelijk_IDs.includes(id)) {
            console.log(`ID ${id} komt WEL voor in mogelijk_IDs | gekregenInvites`);
        } else {
            console.log(`ID ${id} komt NIET voor in mogelijk_IDs | gekregenInvites`);
        }
    });
}

async function filtersLoad() {
    const test = document.getElementById("filterMatchGames");
    const dropDownGenre = document.createElement("div");
    const dropDownGenreLabel = document.createElement("label");
    const dropDownPlatformLabel = document.createElement("label");
    const dropDownGenreSelect = document.createElement("select");
    const dropDownPlatformSelect = document.createElement("select");

    // Check if gebruiker exists and has properties
    const genreOptions = gebruiker?.genres || [];
    const platformOptions = gebruiker?.platform || [];

    dropDownGenreLabel.htmlFor = "genreDropDown";
    dropDownGenreLabel.textContent = "Kies je genre ";

    dropDownPlatformLabel.htmlFor = "PlatformDropDown";
    dropDownPlatformLabel.textContent = " en je platform ";

    dropDownGenreSelect.name = "genreDropDown";
    dropDownGenreSelect.id = "genreDropDown";

    dropDownPlatformSelect.name = "PlatformDropDown";
    dropDownPlatformSelect.id = "PlatformDropDown";

    genreOptions.forEach(goption => {
        const option = document.createElement('option');
        option.value = goption;
        option.textContent = goption;
        dropDownGenreSelect.appendChild(option);
    });

    platformOptions.forEach(poption => {
        const option = document.createElement('option');
        option.value = poption;
        option.textContent = poption;
        dropDownPlatformSelect.appendChild(option);
    });

    const buttonGo = document.createElement("button")
        buttonGo.textContent = 'Start';
        buttonGo.addEventListener('click', () => {
            gamesLoadNewOptions();
        });



    dropDownGenre.append(dropDownGenreLabel, dropDownGenreSelect, dropDownPlatformLabel, dropDownPlatformSelect, "   ", buttonGo);
    test.append(dropDownGenre);
    gamesLoadNewOptions()
}

async function gamesLoadNewOptions() {
    const genreSelect = document.getElementById('genreDropDown');
    const platformSelect = document.getElementById('PlatformDropDown');
    console.log("Genre select:", genreSelect.value);
    console.log("Platform select:", platformSelect.value);

    const selectedGenreName = genreSelect.value;
    const platformName = platformSelect.value;

    const genre = genreMap[selectedGenreName];
    const platformId = platformMap[platformName];

    if (!platformId) {
        console.warn("Onbekend platform geselecteerd:", platformName);
        return;
    }
    if (!genre) {
        console.warn("Onbekend genre geselecteerd:", selectedGenreName);
        return;
    }

    const response = await fetch(`https://api.rawg.io/api/games?genres=${genre}&platforms=${platformId}&page_size=25&key=${apiKey}`);
    const data = await response.json();
    console.log(data.results); // array van games
    showGamesFromResults(data.results)
}


async function showGamesFromResults(results) {
  const matchGamesDiv = document.getElementById("matchGames");
  matchGamesDiv.innerHTML = ''; // Maak leeg

  for (const game of results) {
    // rest van je code hetzelfde, gebruik 'game'
    const name = game.name;
    const genre = game.genres.map(g => g.name).join(', ');
    const platform = game.platforms.map(p => p.platform.name).join(', ');
    const image = game.background_image;
    const description = game.description;

    const title = document.createElement('h2');
    title.textContent = name;

    const img = document.createElement('img');
    img.src = image || 'https://via.placeholder.com/200x100?text=No+Image';
    img.alt = name;
    img.width = 300;

    const genres = document.createElement('p');
    genres.innerHTML = `<strong>Genres:</strong> ${genre}`;

    const platforms = document.createElement('p');
    platforms.innerHTML = `<strong>Platforms:</strong> ${platform}`;

    const button = document.createElement('button');
    button.textContent = 'Meer informatie';
    button.addEventListener('click', () => {
      openOverlay(game.id);
    });

    const form = document.createElement('form');
    form.className = 'like';
    form.action = '/like';
    form.method = 'post';

    const input = document.createElement('input');
    input.type = "image";
    input.src = "images/like_leeg.png";
    input.alt = "Submit";
    input.width = 24;
    input.height = 24;
    input.classList.add("heart");
    input.id = game.id;

    const input_hidden = document.createElement('input');
    input_hidden.type = "hidden";
    input_hidden.name = "game_id";
    input_hidden.value = game.id;

    const gameContainer = document.createElement('li');
    gameContainer.classList.add("vriendenShowGames");
    gameContainer.id = game.id;

    form.append(input_hidden, input);
    gameContainer.append(form, title, img, genres, platforms, button);
    matchGamesDiv.append(gameContainer);
  }

  hartjes();
}


filtersLoad()
menuLoad()
checkMatches()





async function showUser(vriend) {
  const display = document.getElementById("showUser");
  display.style.display = "block";
  const container = document.getElementById("showUserData");
  container.innerHTML = '<button onclick="closeShowUser()">Sluiten</button>';
  const username = vriend.r_voornaam;
  const talen = vriend.taal;
  let zin = `${username} spreekt `;

  const naam = document.createElement("h3");
  const afbeelding = document.createElement("img");
  const land = document.createElement("p");
  const taal = document.createElement("p");
  const platforms = document.createElement("details");
  const platformTitel = document.createElement("summary");
  const games = document.createElement("ul");
  const genres = document.createElement("details");
  const genresTitel = document.createElement("summary");
  const gamesDiv = document.createElement("div");

  naam.id = "vriendShowNaam";
  afbeelding.id = "vriendShowAfbeelding";
  gamesDiv.id = "vriendShowGamesDiv";
  genres.id = "vriendShowGenres";
  land.id = "vriendShowLand";
  taal.id = "vriendShowTaal";
  platforms.id = "vriendShowPlatforms";

  naam.textContent = `${vriend.r_voornaam} (${vriend.r_leeftijd})`;
  land.textContent = vriend.r_voornaam + " komt uit " + vriend.land;
  platformTitel.textContent = vriend.r_voornaam + "'s gekozen platform(en)"
  genresTitel.textContent = vriend.r_voornaam + "'s gekozen genres"

  afbeelding.src = vriend.avatar ? "/uploads/" + vriend.avatar : "/images/default-avatar.png";

  if (Array.isArray(vriend.genres)) {
    vriend.genres.forEach(genre => {
      const li = document.createElement("li");
      li.textContent = genre;
      genres.append(li);
    });
  }

  if (Array.isArray(talen)) {
    if (talen.length === 1) {
      zin += talen[0];
    } else if (talen.length === 2) {
      zin += `${talen[0]} en ${talen[1]}`;
    } else {
      const laatsteTaal = talen[talen.length - 1];
      const overigeTalen = talen.slice(0, -1);
      zin += `${overigeTalen.join(', ')} en ${laatsteTaal}`;
    }
    zin += ".";
  } else {
    zin += "geen talen.";
  }
  taal.textContent = zin;

  if (Array.isArray(vriend.platform)) {
    vriend.platform.forEach(platform => {
      const li = document.createElement("li");
      li.textContent = platform;
      platforms.append(li);
    });
  }
  genres.append(genresTitel)
  platforms.append(platformTitel)
  container.append(naam, afbeelding, land, taal, games, gamesDiv);

if (Array.isArray(vriend.games)) {
    for (const game of vriend.games) {
      console.log(game);
      const gameDiv = document.getElementById("vriendShowGamesDiv");
      const response = await fetch(`https://api.rawg.io/api/games/${game}?key=${apiKey}`);
      const data = await response.json();
      console.log(data);
      const name = data.name;
      const genre = data.genres.map(g => g.name).join(', ');
      const platform = data.platforms.map(p => p.platform.name).join(', ');
      const image = data.background_image
      const description = data.description

      const title = document.createElement('h2');
      title.textContent = name;

      const img = document.createElement('img');
      // Gebruik game-afbeelding of standaardplaatje als er geen is
      img.src = image || 'https://via.placeholder.com/200x100?text=No+Image';
      img.alt = name;
      img.width = 300;

      // haalt de objecten op en vertaald het naar leesbare tekst
      const genres = document.createElement('p');
      genres.innerHTML = `<strong>Genres:</strong> ${genre}`;

      // zelfde maar dan voor platform
      const platforms = document.createElement('p');
      platforms.innerHTML = `<strong>Platforms:</strong> ${platform}`;

      // maakt info button
      const button = document.createElement('button');
      button.textContent = 'Meer informatie';
      
      // Eventlistener toevoegen zodat de overlay verschijnt met info als je op de knop klikt
      button.addEventListener('click', () => {
          openOverlay(game);
      });

      const form = document.createElement('form');  // voegt een form toe met de volgende class, action en method
      form.className = 'like';
      form.action = '/like';
      form.method = 'post';

      const input = document.createElement('input');  // voegt een input toe met de volgende waardes
      input.type = "image" 
      input.src = "images/like_leeg.png" 
      input.alt = "Submit" 
      input.width = 24;
      input.height = 24;
      input.classList.add("heart");
      input.id = game;
      
      const input_hidden = document.createElement('input'); // voegt een input toe die niet zichtbaar is met de game id
      input_hidden.type = "hidden"
      input_hidden.name = "game_id"
      input_hidden.value = game;
    
      const gameContainer = document.createElement('li'); // Maak een div aan voor elke game
      gameContainer.classList.add("vriendenShowGames"); // een class voor styling
      gameContainer.id = game; // Voeg een id toe dat overeenkomt met het id van de game

      form.append(input_hidden, input);
      gameContainer.append(form, title, img, genres, platforms, button);
      gameDiv.append(gameContainer);
    }
      hartjes()
  }

}

function closeShowUser() {
  const display = document.getElementById("showUser")
  display.style.display = "none"
  const container = document.getElementById("showUserData")
  container.innerHTML = '<button onclick="closeShowUser()">Sluiten</button>';
}   

function hartjes() { // de functie om de hartjes per game toe te voegen.
  const userGames = document.body.dataset.userGames;  // Haal data op vanuit de body (hierin staan de gelikte games van de ingelogde gebruiker)
  if (!userGames) return; // Als er geen data is ga dan maar gewoon verder
  const userGamesArray = userGames.split(","); // split de lijst met data zodat het een leesbare array wordt
  console.log(userGamesArray);  // log de array even voor debug
  userGamesArray.forEach(gameID => {  // Voor elke losse game....
    let gameDIV = document.getElementById(gameID);  // Zoek de game id op als id om de pagina.
    if (!gameDIV) return; // Als het niet wordt gevonden kom dan terug
    let heart = gameDIV.querySelector("form input.heart[type='image']");  // variabele heart is het input type van een form met type img
    if (heart) {  // als heart wordt gevonden...
      heart.src = "images/like_vol.png";  // verander het dan zodat het een rood heartje wordt
    }
  });
}

// Functie om overlay te vullen en tonen
async function openOverlay(game) {
    const response = await fetch(`https://api.rawg.io/api/games/${game}?key=${apiKey}`);
    const data = await response.json();
  const overlay = document.getElementById('overlay');
  const overlayInfo = document.getElementById('overlayInfo');

  // Vul overlay met gewenste info van de game
  overlayInfo.innerHTML = `
    <h2>${data.name}</h2>
    <img src="${data.background_image || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${data.name}" style="width: 100%; max-width: 400px;"/>
    <p><strong>Genres:</strong> ${data.genres.map(g => g.name).join(', ')}</p>
    <p><strong>Platforms:</strong> ${data.platforms.map(p => p.platform.name).join(', ')}</p>
    <p><strong>Releasedatum:</strong> ${data.released || 'Onbekend'}</p>
    <p><strong>Rating:</strong> ${data.rating} / 5 (${data.ratings_count || '0'} reviews)</p>
    <p><strong>Beschrijving:</strong> ${data.description_raw || 'Geen beschrijving beschikbaar.'}</p>
  `;

  // Toon overlay
  overlay.style.display = 'flex';
}
// Sluitknop eventlistener
document.getElementById('sluitOverlay').addEventListener('click', () => {
  document.getElementById('overlay').style.display = 'none';
});