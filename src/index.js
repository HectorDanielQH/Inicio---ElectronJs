const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const url = require('url');



let mainWindow, ProductWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            contextIsolation:false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        },
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    });
});

function createNewProductWindow(){
    ProductWindow = new BrowserWindow({
        width: 600,
        height: 400,
        title: 'Add Product',
        webPreferences: {
            contextIsolation:false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        }
    });
    //ProductWindow.setMenu(null);
    ProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true,
    }));
    ProductWindow.on('closed', () => {
        ProductWindow = null;
    });
}

ipcMain.on('product:new', (e,newProduct) => {
    mainWindow.webContents.send('product:new', newProduct);
    ProductWindow.close();
});

const templateMenu=[
    {
        label: 'File',
        submenu: [  //submenu
            {
                label: 'New Product',
                accelerator: 'Ctrl+N',
                click(){
                    createNewProductWindow() 
                }
            },
            {
                label: 'Remove All Products',
                click(){
                    mainWindow.webContents.send('product:removeAll');
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
];

if(process.platform == 'darwin'){
    templateMenu.unshift({
        label: app.getName()
    });
}
if(process.env.NODE_ENV !== 'production'){
    templateMenu.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Show/Hide DevTools',
                accelerator: process.platform == 'darwin' ? 'Cmd+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}