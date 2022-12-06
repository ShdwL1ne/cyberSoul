render()

document.forms["webHook"].addEventListener('submit', e => {
    e.preventDefault(); 
    const form = document.forms["webHook"];
    const whURL = form.elements["webHookURL"].value;
    window.app.createWH(whURL).then(data => {
        
        let block = document.createElement('div')
        block.classList.add('popUpBackrground')
        console.log(data)
        if(data == 'true') {
            block.innerHTML = `
                <div class="popUp">
                    <img src="../images/popUp.svg">
                    <p>Your webhook is ready to use</p>
                    <button>Close</button>
                </div>
            `
        }
        else {
            block.innerHTML = `
                <div class="popUp">
                    <img src="../images/popUpBad.svg">
                    <p>Your link is not correct</p>
                    <button>Close</button>
                </div>
            `
        }
        
        document.querySelector('body').appendChild(block)
        eListener()
    })
});

function eListener() {
    document.querySelector('.popUp > button').addEventListener('click', e => {
        e.preventDefault() 
        document.querySelector('.popUpBackrground').remove()
    })
}


document.querySelector('.checkWH').addEventListener('click', e => {
    e.preventDefault()
    window.app.checkWH().then(data => console.log(data))
})

function render() {
    window.app.renderSettings().then(data => {
        document.querySelector('.profileInfo').children[1].innerText = data.token

        document.querySelector('input[name="webHookURL"]').value = data.webhook
    })
}

document.querySelector('.exitBtn').addEventListener('click', e => {
    e.preventDefault()
    window.app.exit().then(data => console.log(data))
})

document.querySelector('.minBtn').addEventListener('click', e => {
    e.preventDefault()
    window.app.minimize()
})