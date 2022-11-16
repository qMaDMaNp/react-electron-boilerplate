const path = require('path');
const os = require('os');
const fs = require('fs');
const puppeteer = require('puppeteer');
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');

process.env.NODE_ENV = 'develop';

const isDev = process.env.NODE_ENV === 'develop';
const isMac = process.platform === 'darwin';

let mainWindow;

// Main Window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: isDev ? 1000 : 500,
        height: 600,
        // icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        resizable: isDev,
        webPreferences: {
            devTools: true,
            nodeIntegration: false,
            contextIsolation: false,
            // preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (isDev) mainWindow.webContents.openDevTools();

    const appURL = isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`;

    mainWindow.loadURL(appURL);
}

// When the app is ready, create the window
app.on('ready', async () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // const browser = await createBrowser();
    // let page = await browser.newPage();
    //
    // page.goto('https://www.electronjs.org/docs/latest/tutorial/installation');

    // Remove variable from memory
    mainWindow.on('closed', () => (mainWindow = null));

    // Open a window if none are open (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (!isMac) app.quit();
});

// Menu template
const menu = [
    ...(isMac
        ? [
            {
                label: app.name,
                submenu: [
                    {
                        label: 'About'
                    },
                ],
            },
        ]
        : []),
    {
        role: 'fileMenu',
    },
    ...(!isMac
        ? [
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'About'
                    },
                ],
            },
        ]
        : []),
    // {
    //   label: 'File',
    //   submenu: [
    //     {
    //       label: 'Quit',
    //       click: () => app.quit(),
    //       accelerator: 'CmdOrCtrl+W',
    //     },
    //   ],
    // },
    ...(isDev
        ? [
            {
                label: 'Developer',
                submenu: [
                    {role: 'reload'},
                    {role: 'forcereload'},
                    {type: 'separator'},
                    {role: 'toggledevtools'},
                ],
            },
        ]
        : []),
];

// Respond to the resize image event
ipcMain.on('image:resize', (e, options) => {
    // console.log(options);
    options.dest = path.join(os.homedir(), 'imageresizer');
});


function getChromiumExecPath() {
    return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

async function createBrowser() {
    let options = {
        executablePath: getChromiumExecPath(),
        headless: false,
        defaultViewport: null,
        args: [
            "--start-maximized"
        ],
    };

    return puppeteer.launch(options);
}