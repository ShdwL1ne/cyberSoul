window.app.getGoods().then(data => {
    if(data == 'True') {
        document.location.href = '../html/profile.html'
    }
})