render()

document.querySelector('.subBtn').addEventListener("click", e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    if(form.elements["userID"].value != '') {
        let data = {
            type: form.elements["Type"].value,
            manufacturer: form.elements["Manufacturer"].value,
            model: form.elements["Model"].value,
            price: parseInt(form.elements["Price"].value) ? parseInt(form.elements["Price"].value) : 0,
            userID: parseInt(form.elements["userID"].value)
        }
        window.app.createTask(data).then(data => {
            document.querySelectorAll('.taskBlock').forEach(div => {
                div.classList.remove('isActive')
            })
            let div = document.querySelector('.mainTaskBlock')
            let taskBlock = document.createElement('div')
            taskBlock.classList.add('taskBlock')
            taskBlock.classList.add('isActive')
            taskBlock.innerHTML = `
                <div class="idBox">
                    ${document.querySelector('.mainTaskBlock').childElementCount + 1}
                </div>
                <div class="typeBox">
                    ${data.type}
                </div>
                <div class="manufacturerBox">
                    ${data.manufacturer}
                </div>
                <div class="modelBox">
                    ${data.model}
                </div>
                <div class="priceBox">
                    ${data.price}
                </div>
                <div class="profileBox">
                    ${data.userID + 1}-${data.userName}
                </div>` 
            div.append(taskBlock)
            eListener()
            checkParams()
            if(document.querySelector('.startBotBtn').innerText == 'Stop Bot') {
                window.app.startBot().then(data => {
                    if(!data) {
                        document.querySelector('.startBotBtn').innerText = 'Start Bot'
                    }
                    else {
                        document.querySelector('.startBotBtn').innerText = 'Stop Bot'
                    }
                })
            }
        })
    }
});

document.querySelector('.startBotBtn').addEventListener("click", e => {
    e.preventDefault();
    window.app.startBot().then(data => {
        if(!data) {
            document.querySelector('.startBotBtn').innerText = 'Start Bot'
        }
        else {
            document.querySelector('.startBotBtn').innerText = 'Stop Bot'
        }
    })
})

document.querySelector('.delBtn').addEventListener("click", e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    let data = {
        type: form.elements["Type"].value,
        manufacturer: form.elements["Manufacturer"].value,
        model: form.elements["Model"].value,
        price: parseInt(form.elements["Price"].value) ? parseInt(form.elements["Price"].value) : 0,
        userID: parseInt(form.elements["userID"].value)
    }
    if(document.querySelector('.mainTaskBlock').childElementCount) {
        window.app.deleteTask(data).then(data => {
            if(Object.keys(data).length) {
                data.forEach(task => {
                    let div = document.querySelector('.mainTaskBlock')
                    div.removeChild(div.children[task])
                })
            }  
            Array.from(document.querySelector('.mainTaskBlock').children).forEach((task, i) => {
                task.children[0].innerText = i + 1 
            })
            form.elements["Price"].value = ''
            checkParams()
            if(document.querySelector('.startBotBtn').innerText == 'Stop Bot') {
                window.app.startBot().then(data => {
                    if(!data) {
                        document.querySelector('.startBotBtn').innerText = 'Start Bot'
                    }
                    else {
                        document.querySelector('.startBotBtn').innerText = 'Stop Bot'
                    }
                })
            }
        })
    }
});

function render() {
    window.app.renderTask().then(data => {
        let div = document.querySelector('.mainTaskBlock')
        data.tasks.forEach((task, i) => {
            let taskBlock = document.createElement('div')
            taskBlock.classList.add('taskBlock')
            taskBlock.innerHTML = `
                <div class="idBox">
                    ${i+1}
                </div>
                <div class="typeBox">
                   ${task.type}
                </div>
                <div class="manufacturerBox">
                    ${task.manufacturer}
                </div>
                <div class="modelBox">
                    ${task.model}
                </div>
                <div class="priceBox">
                    ${task.price}
                </div>
                <div class="profileBox">
                    ${task.userID + 1}-${task.userName}
                </div>` 
            div.append(taskBlock)
        })
        let list = document.querySelector('select[name="userID"]')
        data.profiles.forEach((profile, i) => {
            let profileSelect = document.createElement('option')
            profileSelect.value = i
            profileSelect.innerHTML = `${i+1}-${profile.FirstName}`
            list.append(profileSelect)
        })
        console.log(data.flag)
        if(!data.flag) {
            document.querySelector('.startBotBtn').innerText = 'Start Bot'
        }
        else {
            document.querySelector('.startBotBtn').innerText = 'Stop Bot'
        }
        eListener()
        checkParams()
    })
}

function eListener() {
    let divs = document.querySelectorAll('.taskBlock')
    divs.forEach(task => {
        task.addEventListener('click', e => {
            e.preventDefault()
            divs.forEach( div => {
                div.classList.remove('isActive')
            })
            task.classList.add('isActive')
            const form = document.forms["userForm"];
            form.elements["Type"].value = task.children[1].innerText,
            form.elements["Manufacturer"].value = task.children[2].innerText,
            form.elements["Model"].value = task.children[3].innerText,
            form.elements["Price"].value = task.children[4].innerText,
            form.elements["userID"].value = parseInt(task.children[5].innerText) - 1
            checkParams()
        })
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

function checkParams() {
    const form = document.forms["userForm"]
    const subBtn = document.querySelector('.subBtn')
    const delBtn = document.querySelector('.delBtn')
    const startBotBtn = document.querySelector('.startBotBtn')
    let len = document.querySelectorAll('.taskBlock').length
    if(len) {
        startBotBtn.removeAttribute('disabled')
    }
    else {
        startBotBtn.setAttribute('disabled', 'disabled')
    }
    let data = {
        type: form.elements["Type"].value,
        manufacturer: form.elements["Manufacturer"].value,
        model: form.elements["Model"].value,
        price: form.elements["Price"].value,
        userID: form.elements["userID"].value
    }
    if(data.type.length != 0 && data.manufacturer.length != 0 && data.model.length != 0 && data.price.length != 0 && data.userID.length != 0) {
        subBtn.removeAttribute('disabled')
        delBtn.removeAttribute('disabled')
    } 
    else {
        subBtn.setAttribute('disabled', 'disabled')
        delBtn.setAttribute('disabled', 'disabled')
    }
}