const { contextBridge } = require('electron')
const { ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
//   test (data) {
//       ipcRenderer.send('TESTING', data)
//   },
    renderAuth() {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('RENDER_AUTH').then(data => res(data))
        })
    },
    getGoods() {
      return new Promise((res, rej) => {
          ipcRenderer.invoke('GET_GOODS').then(data => res(data))
      })  
    },
    createWH(data) {
        return new Promise( (res, rej) => {
            ipcRenderer.invoke('CREATE_WEBHOOK', data).then(data => {
                console.log(data)
                res(data)
            })
        })
    },
    checkWH() {
        return new Promise( (res, rej) => {
            ipcRenderer.invoke('CHECK_WEBHOOK').then(data => res(data))
        })
    },
    createToken(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('CREATE_TOKEN', data).then(data => res(data))
        })
    },
    checkToken(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('CHECK_TOKEN', data).then(data => res(data))
        })
    },
    createProfile(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('CREATE_PROFILE', data).then(data => res(data))
        })
    },
    deleteProfile(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('DELETE_PROFILE', data).then(data => res(data))
        })
    },
    createTask(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('CREATE_TASK', data).then(data => res(data))
        })
    },
    deleteTask(data) {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('DELETE_TASK', data).then(data => res(data))
        })
    },
    startBot() {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('START_BOT').then(data => res(data))
        })
    },
    renderTask() {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('RENDER_TASK').then(data => res(data))
        })
    },
    renderProfile() {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('RENDER_PROFILE').then(data => res(data))
        })
    },
    renderSettings() {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('RENDER_SETTINGS').then(data => res(data))
        })
    },
    simpleExit() {
      return new Promise((res, rej) => {
          ipcRenderer.invoke('SIMPLE_EXIT').then(data => res(data))
      })  
    },
    exit() {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('EXIT').then(data => res(data))
        })
    },
    minimize() {
        return new Promise((res, rej) => {
            ipcRenderer.invoke('MINIMIZE').then(data => res(data))
        })
    }
})

// ipcRenderer.on('TESTING3', (e, data) => {
//     window.dispatchEvent(new CustomEvent('TESTING3', {detail: data}))
// })