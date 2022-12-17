const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const puppeteer = require('puppeteer-extra')
const fs = require('fs')
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const path = require('path')
const fetch = require('node-fetch')

let intervalFunc = null
let win

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())

// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
// puppeteer.use(AdblockerPlugin({ blockTrackers: false }))

async function getGoodsList(win) {
    // dialog.showMessageBox(win, {message: JSON.stringify(Object.keys(puppeteer))})

    try {
        let browser = await puppeteer.launch({
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
            args: ['--use-gl=egl'],
            executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked')
        })
        // dialog.showMessageBox(win, {message: 'ya sozdal browser puppeteer'})

        let page = await browser.newPage()
        await page.setViewport({
            width: 1, height: 1
        })
        // dialog.showMessageBox(win, {message: 'ya sozdal stranicy'})

        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36');

        await page.setDefaultNavigationTimeout(0);

        // dialog.showMessageBox(win, {message: 'ya otpravlyau zapros'})

        await page.setRequestInterception(true);
        let request = {"requests":[{"indexName":"Prod-ComputerUniverse","params":{"highlightPreTag":"<ais-highlight-0000000000>","highlightPostTag":"</ais-highlight-0000000000>","filters":"(categoryid:1008 OR categoryids:1008)  AND (parentproductid:0 OR isparenteol:true)","ruleContexts":["facet_category_1008"],"distinct":true,"maxValuesPerFacet":1000,"clickAnalytics":false,"query":"","hitsPerPage":500,"page":0,"facets":["price_ag_floored","isnew","deliverydatepreorder","deliverydatenow","canPickupInStore","hasPublicationReviews","usedproduct","manufacturer","facets.Chipsatz.values","facets.GPUBasistakt.valuesDisplayOrder","facets.GPUBoost-Takt.valuesDisplayOrder","facets.%c3%9cbertaktet.values","facets.Leistungsstufe.values","facets.Speicher%28VRAM%29.valuesDisplayOrder","facets.VRAM-Typ.values","facets.Busbreite.values","facets.Anschluss.values","facets.HDMI.valuesDisplayOrder","facets.miniHDMI.valuesDisplayOrder","facets.DVI.valuesDisplayOrder","facets.VGA.valuesDisplayOrder","facets.DisplayPort.valuesDisplayOrder","facets.miniDisplayPort.valuesDisplayOrder","facets.VirtualLink%28USBTypC%29.valuesDisplayOrder","facets.HDCP.values","facets.SLI.values","facets.Crossfire.values","facets.DirectX.values","facets.K%c3%bchlungsart.values","facets.K%c3%bchlergr%c3%b6sse.values","facets.L%c3%a4ngederGrafikkarte.valuesDisplayOrder","facets.LowProfile.values","facets.Beleuchtung.values","facets.Stromanschluss.values","facets.NetzteilempfehlungdesHestellers.valuesDisplayOrder","facets.GPUBasistakt.values","facets.GPUBoost-Takt.values","facets.Speicher%28VRAM%29.values","facets.HDMI.values","facets.miniHDMI.values","facets.DVI.values","facets.VGA.values","facets.DisplayPort.values","facets.miniDisplayPort.values","facets.VirtualLink%28USBTypC%29.values","facets.L%c3%a4ngederGrafikkarte.values","facets.NetzteilempfehlungdesHestellers.values"],"tagFilters":"","facetFilters":[["deliverydatenow:true"]]}},{"indexName":"Prod-ComputerUniverse","params":{"highlightPreTag":"<ais-highlight-0000000000>","highlightPostTag":"</ais-highlight-0000000000>","filters":"(categoryid:1008 OR categoryids:1008)  AND (parentproductid:0 OR isparenteol:true)","ruleContexts":["facet_category_1008"],"distinct":true,"maxValuesPerFacet":1000,"clickAnalytics":false,"query":"","hitsPerPage":1,"page":0,"attributesToRetrieve":[],"attributesToHighlight":[],"attributesToSnippet":[],"tagFilters":"","analytics":false,"facets":"deliverydatenow"}}]}
        request = JSON.stringify(request)
        await page.on('request', interceptedRequest => {
            let data = {
                'method': 'POST',
                'postData':  request,
                "headers": {
                    "accept": "*/*",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/json",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 OPR/84.0.4316.21",
                    "x-algolia-usertoken": "anonymous-c6d7a38b-612f-43de-ba6a-e9ca904b5f72",
                    "Referer": "https://www.computeruniverse.net/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                    }
            }
            interceptedRequest.continue(data);
        })

        // dialog.showMessageBox(win, {message: 'ya perehvativau zapros'})
        
        const response = await page.goto(`https://search.computeruniverse.net/search`)

        // dialog.showMessageBox(win, {message: 'ya ortkril stranicy s dannimy'})

        let responseBody = await response.json()

        // dialog.showMessageBox(win, {message: 'ya json etu stranicy'})
        let res = responseBody.results[0].hits
        // dialog.showMessageBox(win, {message: 'spisok'})
        let goods = []
        res.forEach(good => {
            let tmp = {
                name: good.name,
                manufacturer: good.manufacturer,
                price: good.price_ag,
                link: good.url
            }
            goods.push(tmp)
        })
        goods.sort((a,b) => {
            if (a.price > b.price) {
            return 1;
            }
            if (a.price < b.price) {
            return -1;
            }
            return 0;
            })
        fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'goods.json'), JSON.stringify(goods))
        await browser.close()
    }
    catch(e) {
        dialog.showMessageBox(win, {message: JSON.stringify(e), type: "error"})
        console.log(e)
        await browser.close()
    }
}

fs.stat(path.join(app.getPath("appData"), 'CyberSoulAIO'), (err, stats) => {
    if(err) {
        fs.mkdir(path.join(app.getPath("appData"), 'CyberSoulAIO'), () => console.log('Ok'))
        fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), '""')
        fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), '[]')
        fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), '[]')
        fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'webhook.json'),'""')
        fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'goods.json'),'[]')
    }
    else {
        fs.stat(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), (e, stats) => {
            if(e) {
                fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), '[]')
            }
        })
        fs.stat(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), (e, stats) => {
            if(e) {
                fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), '[]')
            }
        })
        fs.stat(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), (e, stats) => {
            if(e) {
                fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), '""')
            }
        })
        fs.stat(path.join(app.getPath("appData"), 'CyberSoulAIO', 'webhook.json'), (e, stats) => {
            if(e) {
                fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'webhook.json'), '""')
            }
        })
        fs.stat(path.join(app.getPath("appData"), 'CyberSoulAIO', 'goods.json'), (e, stats) => {
            if(e) {
                fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'goods.json'), '[]')
            }
        })
    }
})

const createWindow = () => {
    win = new BrowserWindow({
        resizable: false,
        width: 1150,
        height: 708,
        title: 'CyberSoul AIO',
        frame: false,
        icon: 'recoures/images/logo.ico',
        roundedCorners: true,
        webPreferences: {
            preload: path.join(__dirname,"preload.js"),
            devTools: false,
            nodeIntegration: true,
            // sandbox: true
        }
    });

    // getGoodsList(win)

    win.on('session-end', () => {
    (async () => {
        let token = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), 'utf8')
        token = JSON.parse(token)
        const response = await fetch("http://31.172.66.221:3000/api/exit", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                key: token
            })
        })
        if (response.ok == true) {
            let mes = await response.text()
            if(mes == 'True') {
                if (process.platform !== 'darwin') app.quit()
            }
        }
        else {
            console.log('Error')
            return 'Something was wrong!'
        }
    })()
    })

//   win.loadFile('resources/html/auth.html');
  win.loadFile('resources/html/loading.html');
//   win.loadFile('testingHTML.html');
}



app.whenReady().then(() => {
    (async () => {
        let browser = await puppeteer.launch({
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
            args: ['--use-gl=egl']
        })

        try {
            let page = await browser.newPage()
            await page.setViewport({
                width: 1, height: 1
            })

            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36');

            await page.setDefaultNavigationTimeout(0);

            await page.setRequestInterception(true);
            let request = {"requests":[{"indexName":"Prod-ComputerUniverse","params":{"highlightPreTag":"<ais-highlight-0000000000>","highlightPostTag":"</ais-highlight-0000000000>","filters":"(categoryid:1008 OR categoryids:1008)  AND (parentproductid:0 OR isparenteol:true)","ruleContexts":["facet_category_1008"],"distinct":true,"maxValuesPerFacet":1000,"clickAnalytics":false,"query":"","hitsPerPage":500,"page":0,"facets":["price_ag_floored","isnew","deliverydatepreorder","deliverydatenow","canPickupInStore","hasPublicationReviews","usedproduct","manufacturer","facets.Chipsatz.values","facets.GPUBasistakt.valuesDisplayOrder","facets.GPUBoost-Takt.valuesDisplayOrder","facets.%c3%9cbertaktet.values","facets.Leistungsstufe.values","facets.Speicher%28VRAM%29.valuesDisplayOrder","facets.VRAM-Typ.values","facets.Busbreite.values","facets.Anschluss.values","facets.HDMI.valuesDisplayOrder","facets.miniHDMI.valuesDisplayOrder","facets.DVI.valuesDisplayOrder","facets.VGA.valuesDisplayOrder","facets.DisplayPort.valuesDisplayOrder","facets.miniDisplayPort.valuesDisplayOrder","facets.VirtualLink%28USBTypC%29.valuesDisplayOrder","facets.HDCP.values","facets.SLI.values","facets.Crossfire.values","facets.DirectX.values","facets.K%c3%bchlungsart.values","facets.K%c3%bchlergr%c3%b6sse.values","facets.L%c3%a4ngederGrafikkarte.valuesDisplayOrder","facets.LowProfile.values","facets.Beleuchtung.values","facets.Stromanschluss.values","facets.NetzteilempfehlungdesHestellers.valuesDisplayOrder","facets.GPUBasistakt.values","facets.GPUBoost-Takt.values","facets.Speicher%28VRAM%29.values","facets.HDMI.values","facets.miniHDMI.values","facets.DVI.values","facets.VGA.values","facets.DisplayPort.values","facets.miniDisplayPort.values","facets.VirtualLink%28USBTypC%29.values","facets.L%c3%a4ngederGrafikkarte.values","facets.NetzteilempfehlungdesHestellers.values"],"tagFilters":"","facetFilters":[["deliverydatenow:true"]]}},{"indexName":"Prod-ComputerUniverse","params":{"highlightPreTag":"<ais-highlight-0000000000>","highlightPostTag":"</ais-highlight-0000000000>","filters":"(categoryid:1008 OR categoryids:1008)  AND (parentproductid:0 OR isparenteol:true)","ruleContexts":["facet_category_1008"],"distinct":true,"maxValuesPerFacet":1000,"clickAnalytics":false,"query":"","hitsPerPage":1,"page":0,"attributesToRetrieve":[],"attributesToHighlight":[],"attributesToSnippet":[],"tagFilters":"","analytics":false,"facets":"deliverydatenow"}}]}
            request = JSON.stringify(request)
            await page.on('request', interceptedRequest => {
                let data = {
                    'method': 'POST',
                    'postData':  request,
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                        "content-type": "application/json",
                        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 OPR/84.0.4316.21",
                        "x-algolia-usertoken": "anonymous-c6d7a38b-612f-43de-ba6a-e9ca904b5f72",
                        "Referer": "https://www.computeruniverse.net/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                        }
                }
                interceptedRequest.continue(data);
            })
            
            const response = await page.goto(`https://search.computeruniverse.net/search`)

            let responseBody = await response.json()
            let res = responseBody.results[0].hits
            let goods = []
            res.forEach(good => {
                let tmp = {
                    name: good.name,
                    manufacturer: good.manufacturer,
                    price: good.price_ag,
                    link: good.url
                }
                goods.push(tmp)
            })
            goods.sort((a,b) => {
                if (a.price > b.price) {
                return 1;
                }
                if (a.price < b.price) {
                return -1;
                }
                return 0;
                })
            fs.writeFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'goods.json'), JSON.stringify(goods))
            await browser.close()
        }
        catch(e) {
            console.log(e)
            await browser.close()
        }
    })();
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
});

app.on('window-all-closed', () => {
    (async () => {
        let token = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), 'utf8')
        token = JSON.parse(token)
        const response = await fetch("http://31.172.66.221:3000/api/exit", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                key: token
            })
        })
        if (response.ok == true) {
            let mes = await response.text()
            if(mes == 'True') {
                if (process.platform !== 'darwin') app.quit()
            }
        }
        else {
            console.log('Error')
            return 'Something was wrong!'
        }
    })()
})

ipcMain.handle('GET_GOODS', async () => {
    await getGoodsList()
    return 'True'
})

ipcMain.handle('SIMPLE_EXIT', () => {
    win.close()
    app.quit()
})

ipcMain.handle('EXIT', () => {
    (async () => {
        let token = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), 'utf8')
        token = JSON.parse(token)
        const response = await fetch("http://31.172.66.221:3000/api/exit", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                key: token
            })
        })
        if (response.ok == true) {
            let mes = await response.text()
            if(mes == 'True') {
                win.close()
                app.quit()
            }
        }
        else {
            console.log('Error')
            return 'Something was wrong!'
        }
    })()

})

ipcMain.handle('MINIMIZE', () => {
    win.minimize()
})

ipcMain.handle('CHECK_WEBHOOK', () => {
    let json = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'webhook.json'), 'utf8')
    json = JSON.parse(json)
    try {
        const testWebHook = new Webhook(`${json}`)
        const embed = new MessageBuilder()
        .setTitle('Successfull Checkout!')
        .setAuthor('CyberSoul AIO', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96%27%27')
        .addField('Product', 'ASUS TUF GeForce RTX 3090 TI Gaming', false)
        .addField('Price', '1.750,97 €', false)
        .addField('Store', 'https://www.computeruniverse.net', false)
        .setColor('#6240a3')
        .setImage('https://cdn.discordapp.com/attachments/359408276162478081/962087167121829908/90892785BC990BA939DC4286ADE98682_photo-resizer.ru.jpg')
        .setFooter('Version 1.0.1', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96%27%27')
        .setTimestamp();
        testWebHook.send(embed);
        return "Webhook has been sent!"
    }
    catch(e) {
        console.log(e)
        return "Something went wrong!"
    }
})

ipcMain.handle('CREATE_WEBHOOK', async (_, data) => {
    let ret = 'true'
    const testWebHook = new Webhook(`${data}`)
    const embed = new MessageBuilder()
    .setTitle('Successfull Checkout!')
    .setAuthor('CyberSoul AIO', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96%27%27')
    .addField('Product', 'ASUS TUF GeForce RTX 3090 TI Gaming', false)
    .addField('Price', '1.750,97 €', false)
    .addField('Store', 'https://www.computeruniverse.net', false)
    .setColor('#6240a3')
    .setImage('https://media.discordapp.net/attachments/359408276162478081/962087167121829908/90892785BC990BA939DC4286ADE98682_photo-resizer.ru.jpg')
    .setFooter('Version 1.0.1', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96%27%27')
    .setTimestamp();
    try {
        await testWebHook.send(embed);
        fs.writeFile(path.join(app.getPath("appData"), 'CyberSoulAIO', 'webhook.json'), JSON.stringify(data), () => {
            console.log('webhook.json has been saved')
        });
        return ret
    }
    catch(e) {
        ret = 'false'
        return ret
    }
})

ipcMain.handle('CREATE_TOKEN', (_, data) => {
    try {
        fs.writeFile(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), JSON.stringify(data), () => {
            console.log('token.json has been saved')
        })
        return "token.json has been saved"
    } catch(err) {
        return "Something went wrong!"
    }
})

ipcMain.handle('CHECK_TOKEN', (_, data) => {
    return (async (data) => {
        const response = await fetch("http://31.172.66.221:3000/api/key", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                key: data
            })
        })
        if (response.ok == true) {
            let mes = await response.text()
            return mes
        }
        else {
            console.log('Error')
            return 'Something went wrong!'
        }
    })(data);
})

ipcMain.handle('CREATE_PROFILE', (_, data) => {
    let goods =  []
    let json = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), 'utf8')
    if(json) {
        goods.push(JSON.parse(json))
    }
    goods.push(data)
    fs.writeFile(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), JSON.stringify(goods.flat()), err => {
        if(err) {
            throw err
        }
        console.log('profile.json has been saved')
    })
})

ipcMain.handle('DELETE_PROFILE', (_, data) => {
    let num = []
    let json = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), 'utf8')
    if(json) {
        goods = JSON.parse(json)
    }
    goods.forEach( (obj, i) => {
        if(JSON.stringify(obj)===JSON.stringify(data)) {
            goods.splice(i, 1)
            num.push(i)
        }
    })
    fs.writeFile(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), JSON.stringify(goods.flat()), err => {
        if(err) {
            throw err
        }
        console.log('profile.json has been saved')
    }) 
    return num
})

ipcMain.handle('CREATE_TASK', (_, data) => {
    let goods =  []
    let json = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), 'utf8')
    let profiles = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), 'utf8')
    profiles = JSON.parse(profiles)
    goods.push(JSON.parse(json))
    goods.push(data)
    fs.writeFile(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), JSON.stringify(goods.flat()), err => {
        if(err) {
            throw err
        }
        console.log('tasks.json has been saved')
    })
    data.userName = profiles[data.userID].FirstName
    return data
})

ipcMain.handle('DELETE_TASK', (_, data) => {
    let num = []
    let goods = []
    let json = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), 'utf8')
    goods = JSON.parse(json)
    goods.forEach( (obj, i) => {
        if(JSON.stringify(obj)===JSON.stringify(data)) {
            goods.splice(i, 1)
            num.push(i)
        }
    })
    fs.writeFile(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), JSON.stringify(goods.flat()), err => {
        if(err) {
            throw err
        }
        console.log('tasks.json has been saved')
    })
    return num
})

ipcMain.handle('RENDER_TASK', (_, data) => {
    let profiles = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), 'utf8')
    let tasks = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), 'utf8')
    profiles = JSON.parse(profiles)
    tasks = JSON.parse(tasks)
    tasks.forEach( task => {
        task.userName = profiles[task.userID].FirstName
    })
    let obj = {
        "tasks": tasks,
        "profiles": profiles,
        "flag": flag
    }
    return obj
})

ipcMain.handle('RENDER_PROFILE', (_, data) => {
    let profiles = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), 'utf8')
    profiles = JSON.parse(profiles)
    return profiles
})

ipcMain.handle('RENDER_AUTH', () => {
    let token = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), 'utf8')
    token = JSON.parse(token)
    return token
})

ipcMain.handle('RENDER_SETTINGS', (_, data) => {
    let token = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), 'utf8')
    token = JSON.parse(token)
    
    let webhook = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'webhook.json'), 'utf8')
    webhook = JSON.parse(webhook)
    
    let obj = {
        token: token,
        webhook: webhook
    }
    return obj
})

// let goodsListInterval = setInterval( () => {
//     getGoodsList(win)
// }, 180*1000)

let flag = false
ipcMain.handle('START_BOT', (_, data) => {
    
    flag = !flag
    console.log(`Bot status = ${flag}`)

    if(!flag) {
        return 0
    }

    let duration = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), 'utf8')
    duration = JSON.parse(duration)
    duration = Object.keys(duration).length
    console.log(`Duration = ${duration}`)

    tasks = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), 'utf8')
    tasks = JSON.parse(tasks)
    let goods = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'goods.json'), 'utf8')
    goods = JSON.parse(goods)
    
    if(flag) {
        getGoodsList(win)
        setTimeout(() => {
            let resArr = []
            tasks.forEach(task => {
                let tmp = 0
                goods.filter(good => {
                    if(!tmp) {
                        let res = 1
                        for(let i of Array.from(task.model.split(' '))) {
                            if(task.manufacturer != '⸻') {
                                if(good.name.toLowerCase().includes(i.toLowerCase()) == false || good.manufacturer.toLowerCase().includes(task.manufacturer.toLowerCase()) == false) {
                                    res = 0
                                }
                            }
                            else {
                                if(good.name.toLowerCase().includes(i.toLowerCase()) == false) {
                                    res = 0
                                }
                            }
                        }
                        if(res == 1 && good.price < task.price + 0.05*task.price) {
                            resArr.push({"link": good.link, "user": task.userID, "manufacturer": good.manufacturer, "name": good.name, "price": good.price})
                            tmp = 1
                        }
                    }
                })
            })
            eListener(resArr)
            console.log(resArr)
            makeInterval(duration)
        }, 30*1000)
    }
    else {
        clearInterval(intervalFunc)
    }

    return(flag)  
})

async function eListener(resArr) {
    if(!flag) {
        return 0
    }
    let cnt = 0
    resArr.forEach(order => {
        setTimeout(() => {
            (async () => {
                await parseFunc(order)
            })()
        }, cnt++*180000)
    })
}

function parseFunc(order) {

    console.log('ParseFunc')

    if(!flag) {
        return 0
    }

    const hook = new Webhook(`${whURL[0]}`);

    (async () => {
        try {
    
            let browser = await puppeteer.launch({
                headless: true,
                ignoreDefaultArgs: ['--disable-extensions'],
                executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked')
            })
    
            let page = await browser.newPage()
            await page.setViewport({
                width: 1024, height: 720
            })

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 YaBrowser/22.11.3 Yowser/2.5 Safari/537.36');
            // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

            let profileJSON = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'profile.json'), 'utf8')

            try {
                let profile = JSON.parse(profileJSON)

                await page.goto(`https://www.computeruniverse.net/${order.link}`)

                await page.evaluate( () => {
                    document.cookie = ' '
                    location.reload()
                }, {waitUntil: 'domcontentloaded'})
    
                await page.waitForTimeout(5000)
    
                // let checkCountry = await page.evaluate( () => {
                //     return (/country=RU/gi).test(document.cookie)
                // }, {waitUntil: 'domcontentloaded'})
    

                    page.evaluate(() => {
                        window.scrollTo(0, 9e4)
                        document.querySelector("#main-content > footer > div.container.mx-auto.py-3 > div:nth-child(7) > div:nth-child(3) > div.w-full.py-2.md\\:pl-32.md\\:pr-32.lg\\:pl-0.lg\\:pr-0.md\\:flex > div.md\\:w-1\\/2.md\\:mr-4.md\\:order-0 > div > div > div > button").click()
                        document.querySelectorAll('.c-CountrySwitch__popover__item')[7].click()
                    }, {waitUntil: 'domconentloaded'})
                
                // await page.waitForTimeout(30000000)
    
                await page.waitForTimeout(5000)
    
                // let checkCookiesDiv = await page.evaluate(() => {
                //     if(isNaN(+document.getElementById('gdpr_cookie_notice'))) {
                //         document.getElementById('main-content').removeChild(document.getElementById('gdpr_cookie_notice'))
                //     }
                // })
    
                await page.waitForSelector('#main-content > section > div > div.flex.flex-wrap.at__pdp__product-information > div:nth-child(2) > div:nth-child(4) > div > button')
    
                // await page.waitForTimeout(5000)
    
                try {
                    await page.click('#main-content > section > div > div.flex.flex-wrap.at__pdp__product-information > div:nth-child(2) > div:nth-child(4) > div > button')
                } catch (e) {
                    await browser.close()
                    return 0
                }
                
                const embed = new MessageBuilder()
                .setTitle('New product!')
                .setAuthor('CyberSoul AIO', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                .addField('Manufacturer', `${order.manufacturer}`, true)
                .addField('Name', `${order.name}`)
                .addField('Link', `https://www.computeruniverse.net/${order.link}`, true)
                .addField('Price', `${order.price}€`)
                .setColor('#6240a3')
                .setDescription('A new product has been found')
                .setImage('https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                .setFooter('Version 1.0', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                .setTimestamp();
        
                hook.send(embed);
                
                await page.waitForSelector('button.at__go-to-cart')
    
                // await page.waitForNavigation('domcontentloaded')

                console.log('click on button.at_go-to-cart')
                await page.click('button.at__go-to-cart')
    
                await page.waitForSelector('#UpperAmazonPayButton')
    
                await page.waitForSelector('button.at__checkout_btn')
    
                // await page.waitForNavigation('domcontentloaded')
    
                console.log('click on button.at__checkout_btn 1')
                await page.click('button.at__checkout_btn')
                
                await page.waitForSelector('#non-dy-checkout > button')
    
                await page.waitForTimeout(1000)
    
                console.log('click on #non-dy-checkout > button')
                await page.click('#non-dy-checkout > button')
    
                await page.waitForSelector('input[name="BillingFormModel.FirstName')
    
                await page.waitForTimeout(1000)
    
                await page.type('input[name="BillingFormModel.FirstName"]', `${profile[order.user].FirstName}`, {delay: 100})
    
                await page.type('input[name="BillingFormModel.LastName"]', `${profile[order.user].LastName}`, {delay: 100})
    
                await page.type('input[id="react-select-2-input"]', `${profile[order.user].Country}`, {delay: 100})
    
                await page.keyboard.press('Enter')
    
                await page.type('input[name="BillingFormModel.ZipPostalCode"]', `${profile[order.user].ZipPostalCode}`, {delay: 100})
    
                await page.type('input[name="BillingFormModel.City"]', `${profile[order.user].City}`, {delay: 100})
    
                await page.type('input[name="BillingFormModel.StreetAddress"]', `${profile[order.user].StreetAddress}`, {delay: 100})
    
                await page.type('input[name="BillingFormModel.StreetAddress2"]', `${profile[order.user].StreetAddress2}`, {delay: 100})
    
                await page.type('input[name="BillingFormModel.EMail"]', `${profile[order.user].EMail}`, {delay: 100})
    
                console.log('click on button.at__checkout__billingAddress__submit')
                await page.click('button.at__checkout__billingAddress__submit')
    
                // await page.waitForSelector('div.LanguageSwitch_button_flag__3ck2k')
    
                await page.waitForTimeout(1000)
    
                await page.waitForSelector('.c-PaymentList__item')
    
                if(JSON.parse(profile[order.user].BankTransfer)) {
                    await page.evaluate(() => {
                        let radio = document.querySelectorAll('.c-PaymentList__item')
                        radio.forEach( (div, i) => {
                            if((/(Bank Transfer)/gi).test(div.childNodes[1].childNodes[0].innerText)) {
                                radio[i].click()
                            }
                        })
                    }, {waitUntil: 'domcontentloaded'})
                }
                else {
                    await page.evaluate(() => {
                        let radio = document.querySelectorAll('.c-PaymentList__item')
                        radio.forEach( (div, i) => {
                            if((/Credit card/gi).test(div.childNodes[1].childNodes[0].innerText)) {
                                radio[i].click()
                            }
                        })
                    }, {waitUntil: 'domcontentloaded'})
                }
    
                await page.waitForTimeout(5000)

                await page.waitForSelector('button.at__checkout__shipping_payment__submit')
    
                await page.click('button.at__checkout__shipping_payment__submit')
    
                // await page.waitForSelector('div.LanguageSwitch_button_flag__3ck2k')
    
                await page.waitForTimeout(2000)
    
                let shipTotalPrice = await page.evaluate(async () => {
                    
                    let shipping
                    let totalPrice
    
                    try {
                        totalPrice = document.querySelector('.c-OrderSummary__price--total > span').innerText
                        shipping = document.querySelectorAll('.c-OrderSummary__price > span')[1].innerText
                    } catch(e) {
                        console.log(e)
                    }
                    let data = {
                        ship: shipping,
                        totPrice: totalPrice
                    }
                    return data
    
                }, {waitForSelector: '#checkout-customsfee-info'})
    
                await page.click('#order_submit')

                await page.waitForTimeout(3000)
    
                if(!JSON.parse(profile[order.user].BankTransfer)) {
                    await page.waitForTimeout(5000)
    
                    await page.mouse.click(512, 100)
    
                    await page.waitForTimeout(1000)
    
                    let cardScroll
                    if(profile[order.user].Card=='Visa') {
                        cardScroll = 1
                    } else if(profile[order.user].Card=='American Express') {
                        cardScroll = 2
                    } else if(profile[order.user].Card=='MasterCard') {
                        cardScroll = 3
                    }
    
                    cardScroll = cardScroll*23 + 120
                    await page.mouse.click(512, cardScroll)
    
                    await page.type('input[id="KKnr"]', `${profile[order.user].CardNumber}`, {delay: 100})
    
                    await page.mouse.click(512, 246)
    
                    await page.waitForTimeout(1000)
    
                    let cardMonthScroll
                    if(profile[order.user].CardMonth=='01') {
                        cardMonthScroll = 2
                    } else if(profile[order.user].CardMonth=='02') {
                        cardMonthScroll = 3
                    } else if(profile[order.user].CardMonth=='03') {
                        cardMonthScroll = 4
                    } else if(profile[order.user].CardMonth=='04') {
                        cardMonthScroll = 5
                    }
                    else {
                        cardMonthScroll = +profile[order.user].CardMonth
                        cardMonthScroll = cardMonthScroll - 3 
    
                        await page.evaluate( () => {
                            const ul = document.getElementById('select2-results-4')
                            ul.scrollTop = ul.offsetHeight
                        }, {waitUntil: 'domcontentloaded'})
                    }
    
                    cardMonthScroll = cardMonthScroll*23 + 246
    
                    await page.mouse.click(512, cardMonthScroll)
    
                    await page.waitForTimeout(1000)
    
                    await page.mouse.click(712, 246)
    
                    await page.waitForTimeout(1000)
    
                    let cardYearScroll
                    if(profile[order.user].CardYear=='2022') {
                        cardYearScroll = 2
                    } else if(profile[order.user].CardYear=='2023') {
                        cardYearScroll = 3
                    } else if(profile[order.user].CardYear=='2024') {
                        cardYearScroll = 4
                    } else if(profile[order.user].CardYear=='2025') {
                        cardYearScroll = 5
                    } else if(profile[order.user].CardYear=='2026') {
                        cardYearScroll = 6
                    } else if(profile[order.user].CardYear=='2027') {
                        cardYearScroll = 7
                    } else if(profile[order.user].CardYear=='2028') {
                        cardYearScroll = 8
                    }
                    else {
                        cardYearScroll = +profile[order.user].CardYear
                        cardYearScroll = cardYearScroll%100 - 20 
    
                        await page.evaluate( () => {
                            const ul = document.getElementById('select2-results-6')
                            ul.scrollTop = ul.offsetHeight
                        }, {waitUntil: 'domcontentloaded'})
                    }
                    
                    cardYearScroll = cardYearScroll*23 + 246
                    await page.mouse.click(712, cardYearScroll)
    
                    await page.waitForTimeout(1000)
    
                    await page.type('input[name="cccvc"]', `${profile[order.user].CVC}`, {delay: 100})
    
                    await page.mouse.click(800, 410)
    
                    await page.waitForNavigation({
                        waitUntil: 'domcontentloaded',
                    });
    
                    await page.waitForTimeout(2000)
                    
                    let buyLink = await page.evaluate(async () => {
                        let list = "Error"
    
                        try {
                            let link = window.location.href
                            list = link
                        } catch(e) {
                            console.log(e)
                        }
    
                        return list;
    
                    }, {waitUntil: 'domcontentloaded'})
    
                    await page.goto(`https://clck.ru/--?url=${buyLink}`)
    
                    buyLink = await page.evaluate(() => {
                        return document.body.innerText
                    }, {waitUntil: 'domcontentloaded'})
    
                    console.log(buyLink)
    
                    const buyPassLink = new MessageBuilder()
                    .setTitle(`Your link to buy ${order.name}!`)
                    .setAuthor('CyberSoul AIO', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                    .addField('Manufacturer', `${order.manufacturer}`, true)
                    .addField('Name', `${order.name}`)
                    .addField('Total price', `${shipTotalPrice.totPrice}`)
                    .addField('Link to buy', `${buyLink}`)
                    .addField('Shipping', `${shipTotalPrice.ship}`)
                    .setColor('#6240a3')
                    .setDescription('Click on the link to enter the code!')
                    .setImage('https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                    .setFooter('Version 1.0', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                    .setTimestamp();
                    
                    hook.send(buyPassLink);
                }
                else {
                    const buyPassLink = new MessageBuilder()
                    .setTitle(`You will shortly receive a confirmation letter to your given email address ${profile[order.user].EMail}!`)
                    .setAuthor('CyberSoul AIO', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                    .addField('Manufacturer', `${order.manufacturer}`, true)
                    .addField('Name', `${order.name}`)
                    .addField('Total price', `${shipTotalPrice.totPrice}`)
                    .addField('Shipping', `${shipTotalPrice.ship}`)
                    .setColor('#6240a3')
                    .setImage('https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                    .setFooter('Version 1.0', 'https://cdn.discordapp.com/icons/892116711321526283/7a0bac55d295d862d3006df161e88dae.webp?size=96')
                    .setTimestamp();
                    
                    hook.send(buyPassLink);
                }
                
                await browser.close()
                return 0
            }
            catch(e) {
                console.log(e)
                await browser.close()
                return 0
            }
        } catch(e) {
            console.log(e)
        }
    })();
}

let TOKKEN
let myToken 
let whURL
let whJSON

TOKKEN = []
whURL =  []
setTimeout(() => {
    myToken = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), 'utf8')
    if(myToken) {
        TOKKEN.push(JSON.parse(myToken))
    }
    whJSON = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'webhook.json'), 'utf8')
    if(whJSON) {
        whURL.push(JSON.parse(whJSON))
    }
}, 15000)





function makeInterval(duration) {
    if(!flag) {
        return 0
    }
    intervalFunc = setInterval(async () => {
        await getGoodsList()

        TOKKEN = []
        myToken = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'token.json'), 'utf8')
        if(myToken) {
            TOKKEN.push(JSON.parse(myToken))
        }
        
        whURL =  []
        whJSON = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'webhook.json'), 'utf8')
        if(whJSON) {
            whURL.push(JSON.parse(whJSON))
        }

        tasks = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'tasks.json'), 'utf8')
        tasks = JSON.parse(tasks)
        let goods = fs.readFileSync(path.join(app.getPath("appData"), 'CyberSoulAIO', 'goods.json'), 'utf8')
        goods = JSON.parse(goods)

        let resArr = []
        tasks.forEach(task => {
            let tmp = 0
            goods.filter(good => {
                if(!tmp) {
                    let res = 1
                    for(let i of Array.from(task.model.split(' '))) {
                        if(task.manufacturer != '⸻') {
                            if(good.name.toLowerCase().includes(i.toLowerCase()) == false || good.manufacturer.toLowerCase().includes(task.manufacturer.toLowerCase()) == false) {
                                res = 0
                            }
                        }
                        else {
                            if(good.name.toLowerCase().includes(i.toLowerCase()) == false) {
                                res = 0
                            }
                        }
                    }
                    if(res == 1 && good.price < task.price + 0.05*task.price) {
                        resArr.push({"link": good.link, "user": task.userID, "manufacturer": good.manufacturer, "name": good.name, "price": good.price})
                        tmp = 1
                    }
                }
            })
        })

        eListener(resArr)
    }, duration*180000);
}
