let rawMatches = JSON.parse(document.body.dataset.userMatches);
const gebruiker = document.body.dataset.userGebruiker;
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
        hiddenUserId.value = gebruiker;

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
        hiddenUserId.value = gebruiker;

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
        acceptHiddenUserId.value = gebruiker;

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
        declineHiddenUserId.value = gebruiker;

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

            dualRange.append(rangeMin, rangeMax)
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


menuLoad()
checkMatches()