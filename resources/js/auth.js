render()

document.forms["userForm"].addEventListener("submit", e => {
    e.preventDefault()
    const form = document.forms["userForm"]
    const key = form.elements["Key"].value
    window.app.createToken(key).then(data => console.log(data))
    window.app.checkToken(key).then(data => {
        if(data == 'True') {
            document.location.href = '../html/loading.html'
        }
    })
})

function render() {
    window.app.renderAuth().then(data => {
        document.querySelector('input[name="Key"]').value = data
    })
}

document.querySelector('.exitBtn').addEventListener('click', e => {
    e.preventDefault()
    window.app.simpleExit().then(data => console.log(data))
})

document.querySelector('.minBtn').addEventListener('click', e => {
    e.preventDefault()
    window.app.minimize()
})