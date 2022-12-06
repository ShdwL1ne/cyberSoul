render()

document.querySelector('.acceptBtn').addEventListener('click', e => {
    e.preventDefault(); 
    const form = document.forms["userForm"];
    let data = {
        FirstName: form.elements["FirstName"].value,
        LastName: form.elements["LastName"].value,
        Country: form.elements["Country"].value,
        ZipPostalCode: parseInt(form.elements["ZipPostalCode"].value),
        City: form.elements["City"].value,
        StreetAddress: form.elements["StreetAddress"].value,
        StreetAddress2: parseInt(form.elements["StreetAddress2"].value),
        EMail: form.elements["EMail"].value,
        Phone: form.elements["Phone"].value,
        BankTransfer: form.elements["bankTransfer"].checked,
        Card: form.elements["Card"].value,
        CardNumber: form.elements["CardNumber"].value,
        CardMonth: parseInt(form.elements["CardMonth"].value),
        CardYear: parseInt(form.elements["CardYear"].value),
        CVC: form.elements["CVC"].value
    }
    window.app.createProfile(data).then(data => {
        let div = document.querySelector('.profileBox')
        div.removeChild(div.lastChild)
        let profileBlock = document.createElement('div')
        profileBlock.classList.add('profile')
        profileBlock.innerHTML = `
            <div class="profileImage"><img src="../images/profileImage.svg" alt="Profile Image"></div>
            <div class="profileName">${form.elements["FirstName"].value}</div>`
        profileBlock.dataset.FirstName = form.elements["FirstName"].value
        profileBlock.dataset.LastName = form.elements["LastName"].value
        profileBlock.dataset.Country = form.elements["Country"].value
        profileBlock.dataset.ZipPostalCode = parseInt(form.elements["ZipPostalCode"].value)
        profileBlock.dataset.City = form.elements["City"].value
        profileBlock.dataset.StreetAddress = form.elements["StreetAddress"].value
        profileBlock.dataset.StreetAddress2 = parseInt(form.elements["StreetAddress2"].value)
        profileBlock.dataset.EMail = form.elements["EMail"].value
        profileBlock.dataset.Phone = form.elements["Phone"].value
        profileBlock.dataset.BankTransfer = form.elements["bankTransfer"].checked
        profileBlock.dataset.Card = form.elements["Card"].value
        profileBlock.dataset.CardNumber = form.elements["CardNumber"].value
        profileBlock.dataset.CardMonth = parseInt(form.elements["CardMonth"].value)
        profileBlock.dataset.CardYear = parseInt(form.elements["CardYear"].value)
        profileBlock.dataset.CVC = form.elements["CVC"].value
        div.append(profileBlock)
        let newProfileBlock = document.createElement('div')
        newProfileBlock.classList.add('newProfile')
        newProfileBlock.innerHTML = `
            <div class="profileImage"><img src="../images/newProfile.svg" alt="New Profile"></div>
            <div class="profileName">New profile</div>`
        div.append(newProfileBlock)
        eListener()
    })
});


document.querySelector('.deleteBtn').addEventListener('click', e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    let data = {
        FirstName: form.elements["FirstName"].value,
        LastName: form.elements["LastName"].value,
        Country: form.elements["Country"].value,
        ZipPostalCode: parseInt(form.elements["ZipPostalCode"].value),
        City: form.elements["City"].value,
        StreetAddress: form.elements["StreetAddress"].value,
        StreetAddress2: parseInt(form.elements["StreetAddress2"].value),
        EMail: form.elements["EMail"].value,
        Phone: form.elements["Phone"].value,
        BankTransfer: form.elements["bankTransfer"].checked,
        Card: form.elements["Card"].value,
        CardNumber: form.elements["CardNumber"].value,
        CardMonth: parseInt(form.elements["CardMonth"].value),
        CardYear: parseInt(form.elements["CardYear"].value),
        CVC: form.elements["CVC"].value
    }
    if(document.querySelector('.profileBox').childElementCount)
    window.app.deleteProfile(data).then(data => {
        data.forEach(task => {
            let div = document.querySelector('.profileBox')
            div.removeChild(div.children[task])
        })
    })
});

function render() {
    window.app.renderProfile().then(data => {
        let div = document.querySelector('.profileBox')
        data.forEach(profile => {
            let profileBlock = document.createElement('div')
            profileBlock.classList.add('profile')
            profileBlock.innerHTML = `
                <div class="profileImage"><img src="../images/profileImage.svg" alt="Profile Image"></div>
                <div class="profileName">${profile.FirstName}</div>`
            profileBlock.dataset.FirstName = profile.FirstName
            profileBlock.dataset.LastName = profile.LastName
            profileBlock.dataset.Country = profile.Country
            profileBlock.dataset.ZipPostalCode = profile.ZipPostalCode
            profileBlock.dataset.City = profile.City
            profileBlock.dataset.StreetAddress = profile.StreetAddress
            profileBlock.dataset.StreetAddress2 = profile.StreetAddress2
            profileBlock.dataset.EMail = profile.EMail
            profileBlock.dataset.Phone = profile.Phone
            profileBlock.dataset.BankTransfer = profile.BankTransfer
            profileBlock.dataset.Card = profile.Card
            profileBlock.dataset.CardNumber = profile.CardNumber
            profileBlock.dataset.CardMonth = profile.CardMonth
            profileBlock.dataset.CardYear = profile.CardYear
            profileBlock.dataset.CVC = profile.CVC
            div.append(profileBlock)
        })
        let newProfileBlock = document.createElement('div')
        newProfileBlock.classList.add('newProfile')
        newProfileBlock.innerHTML = `
            <div class="profileImage"><img src="../images/newProfile.svg" alt="New Profile"></div>
            <div class="profileName">New profile</div>`
        div.append(newProfileBlock)
        eListener()
        checkParams()
    })
}

function eListener() {
    let divs = document.querySelectorAll('.profile')
    let newProfile = document.querySelector('.newProfile')
    divs.forEach(profile => {
        profile.addEventListener('click', e => {
            e.preventDefault()
            divs.forEach( div => {
                div.classList.remove('isActive')
            })
            newProfile.classList.remove('isActive')
            profile.classList.add('isActive')
            const form = document.forms["userForm"];
            form.elements["FirstName"].value = profile.dataset.FirstName
            form.elements["LastName"].value = profile.dataset.LastName
            form.elements["Country"].value = profile.dataset.Country
            form.elements["ZipPostalCode"].value = parseInt(profile.dataset.ZipPostalCode)
            form.elements["City"].value = profile.dataset.City
            form.elements["StreetAddress"].value = profile.dataset.StreetAddress
            form.elements["StreetAddress2"].value = parseInt(profile.dataset.StreetAddress2)
            form.elements["EMail"].value = profile.dataset.EMail
            form.elements["Phone"].value = profile.dataset.Phone
            form.elements["bankTransfer"].checked = JSON.parse(profile.dataset.BankTransfer)
            form.elements["Card"].value = profile.dataset.Card
            form.elements["CardNumber"].value = profile.dataset.CardNumber
            form.elements["CardMonth"].value = parseInt(profile.dataset.CardMonth)
            form.elements["CardYear"].value = parseInt(profile.dataset.CardYear)
            form.elements["CVC"].value = profile.dataset.CVC
            switchBox()
        })
    })
    newProfile.addEventListener('click', e => {
        e.preventDefault()
        divs.forEach( div => {
            div.classList.remove('isActive')
        })
        newProfile.classList.add('isActive')
        const form = document.forms["userForm"];
        form.elements["FirstName"].value = null
        form.elements["LastName"].value = null
        form.elements["Country"].value = null
        form.elements["ZipPostalCode"].value = null
        form.elements["City"].value = null
        form.elements["StreetAddress"].value = null
        form.elements["StreetAddress2"].value = null
        form.elements["EMail"].value = null
        form.elements["Phone"].value = null
        form.elements["bankTransfer"].checked = false
        form.elements["Card"][0].checked = false
        form.elements["Card"][1].checked = false
        form.elements["Card"][2].checked = false
        form.elements["CardNumber"].value = null
        form.elements["CardMonth"].value = null
        form.elements["CardYear"].value = null
        form.elements["CVC"].value = null
        switchBox()
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
    const form = document.forms["userForm"];
    const acceptBtn = document.querySelector('.acceptBtn')
    const deleteBtn = document.querySelector('.deleteBtn')
    let data = {
        FirstName: form.elements["FirstName"].value,
        LastName: form.elements["LastName"].value,
        Country: form.elements["Country"].value,
        ZipPostalCode: parseInt(form.elements["ZipPostalCode"].value),
        City: form.elements["City"].value,
        StreetAddress: form.elements["StreetAddress"].value,
        StreetAddress2: parseInt(form.elements["StreetAddress2"].value),
        EMail: form.elements["EMail"].value,
        Phone: form.elements["Phone"].value,
        BankTransfer: form.elements["bankTransfer"].checked,
        Card: form.elements["Card"].value,
        CardNumber: form.elements["CardNumber"].value,
        CardMonth: parseInt(form.elements["CardMonth"].value),
        CardYear: parseInt(form.elements["CardYear"].value),
        CVC: form.elements["CVC"].value
    }

    if((data.FirstName.length != 0 && 
        data.LastName.length != 0 && 
        data.Country.length != 0 && 
        data.ZipPostalCode.length != 0 && 
        data.City.length != 0 && 
        data.StreetAddress.length != 0 && 
        data.StreetAddress2.length != 0 && 
        data.EMail.length != 0 && 
        data.Phone.length != 0 && 
        data.BankTransfer == false &&
        data.Card.length != 0 && 
        data.CardNumber.length != 0 && 
        data.CardMonth.length != 0 && 
        data.CardYear.length != 0 && 
        data.CVC.length != 0) || 
        (data.FirstName.length != 0 && 
        data.LastName.length != 0 && 
        data.Country.length != 0 && 
        data.ZipPostalCode.length != 0 && 
        data.City.length != 0 && 
        data.StreetAddress.length != 0 && 
        data.StreetAddress2.length != 0 && 
        data.EMail.length != 0 && 
        data.Phone.length != 0 && 
        data.BankTransfer == true)) {
        acceptBtn.removeAttribute('disabled')
        deleteBtn.removeAttribute('disabled')
    }
    else {
        acceptBtn.setAttribute('disabled', 'disabled')
        deleteBtn.setAttribute('disabled', 'disabled')
    }
    
}

function switchBox() {
    if(!document.getElementById('bankTransfer').checked) {
        document.querySelector('.formPayment').children[2].style.opacity = "1"
        document.querySelector('.formPayment').children[3].style.opacity = "1"
        document.querySelector('.formPayment').children[2].classList.remove('disabledbutton')
        document.querySelector('.formPayment').children[3].classList.remove('disabledbutton')
    }
    else {
        document.querySelector('.formPayment').children[2].style.opacity = "0.5"
        document.querySelector('.formPayment').children[3].style.opacity = "0.5"
        document.querySelector('.formPayment').children[2].classList.add('disabledbutton')
        document.querySelector('.formPayment').children[3].classList.add('disabledbutton')
    }
    checkParams()
}