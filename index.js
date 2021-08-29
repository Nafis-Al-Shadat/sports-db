const startSpinner = () =>{
    document.getElementById('spinner').classList.remove('d-none');
}
const stopSpinner = () =>{
    document.getElementById('spinner').classList.add('d-none');
}

const loadApi = player => {
    if(player == '' || player == undefined){
        stopSpinner();
        return;
    }
    fetch(`https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=${player}`)
    .then(res => res.json())
    .then(data => displayData(data))
    .catch(error =>{
        document.getElementById('error').classList.remove('d-none');
        console.log(error)
    });
};
const loadDetailsApi = id =>{
    fetch(`https://www.thesportsdb.com/api/v1/json/1/lookupplayer.php?id=${id}`)
    .then(res => res.json())
    .then(data => displayModal(data));
}
const getAndSetInput = () =>{
    const inputValue = document.getElementById('search-input').value;
    document.getElementById('search-input').value = '';
    return inputValue;
}
const copyDes = () =>{
    const des = document.getElementById('des').innerText;
    navigator.clipboard.writeText(des);
    alert("Successfully copied to clipboard")
}
const clearModal = () =>{
    document.getElementById('modal').innerText = ``;
}
const displayModal = details =>{
    console.log(details.players[0]);
    const player = details.players[0];
    const modalParent = document.getElementById('modal');
    const description = player.strDescriptionEN;
    modalParent.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">${player.strPlayer}</h5>
          <button onclick="clearModal()" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <div class="grid m-5" id="info">
            <span>Birth Place</span>
            <span> : &nbsp; ${player.strBirthLocation}</span>
            <span>Date of birth</span>
            <span> : &nbsp; ${player.dateBorn}</span>
            <span>Gender</span>
            <span> : &nbsp; ${player.strGender}</span>
            <span>Height</span>
            <span> : &nbsp; ${player.strHeight}</span>
            <span>Weight</span>
            <span> : &nbsp; ${player.strWeight}</span>
            <span>Nationality</span>
            <span> : &nbsp; ${player.strNationality}</span>
        </div>
        <h3>About ${player.strPlayer} </h3>
          <p id="des">${description}</p>
          <button class="btn btn-danger my-3"onclick="copyDes()">
          Copy description
          </button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="clearModal()">Close</button>
        </div>
      </div>
    `
}
const displayData = playersObject =>{
    document.getElementById('parent').textContent = '';
    if(playersObject.player == null){
        document.getElementById('error').classList.remove('d-none');
        stopSpinner();
        return;
    }
    const article = document.getElementById('parent');
    const players = playersObject.player;

    for(const player of players){
        document.getElementById('error').classList.add('d-none');
        let description;
        try{
            description = player.strDescriptionEN;
            description = description.slice(0,250);
        }catch{

        }
        if(description == null){
            description = '';
        }
        if(player.strCutout == null){
            continue;
        }
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
        <div class="card h-100">
            <img src="${player.strCutout}" class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title">${player.strPlayer}</h5>
            <p class="card-text">${description}...</p>
            <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="loadDetailsApi(${player.idPlayer})">
            More Info
            </button>
            </div>
        </div> 
        `;
        article.appendChild(div);
    }
    // console.log(players);
    stopSpinner()
}
document.getElementById('search-input').addEventListener('keyup', (e)=>{
    if(e.keyCode === 13){
        document.getElementById('parent').textContent = '';
        document.getElementById('error').classList.add('d-none');
        startSpinner();
        const input = getAndSetInput();
        loadApi(input)
    }
});
document.getElementById('search-btn').addEventListener('click',()=>{
    document.getElementById('parent').textContent = '';
    document.getElementById('error').classList.add('d-none');
        startSpinner();
        const input = getAndSetInput();
        loadApi(input);
})