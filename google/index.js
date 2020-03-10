const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const credentials = require('./account_service.json');

const {client_email, private_key} = credentials;

const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];
// const root = __dirname + '/mock.json';
// console.log(fs.createReadStream(root))

const client = new google.auth.JWT(
  client_email,
  null,
  private_key,
  SCOPES,
  null
);

 client.authorize(async(err, tokens) => {
  if(err) {
    console.log(err);
  } else {
    console.log('Connected!')
    await createFileDrive();
  
  }
});

const drive = google.drive({ version: "v3", auth: client });

async function createFileDrive() {
  const fileMetadata = {
    'name': 'Ecommerces1',
    'mimeType': 'application/vnd.google-apps.folder',
  };
  drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  },async function (err, file) {
    if (err) {
      console.error(err);
    } else {
      console.log('Folder Id: ', file.data.id);
      getPermission(file.data.id);
      await createFileExcel(file.data.id);
      return file.data.id;
    }
  });
}

function getPermission(fileId) {
  const permission = {
    'type': 'user',
    'role': 'owner',
    'emailAddress': 'janetquispeu@gmail.com'
  };
  drive.permissions.create({
    resource: permission,
    fileId: fileId,
    fields: '*',
    transferOwnership: true
  }, async function (err, res) {
    if (err) {
      console.error(err);
    } else {
      console.log('Permission ID: ', res.data.id);
      return res.data.id;
    }
  });
}

function createFileExcel(fileId) {
  const root = __dirname + '/mock.json';
  const data = require("./mock.json");
  const  fileMetadataImage = {
    name: 'Reporte de ventas',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    parents: [fileId]
  };
  
  const media = {
    mimeType: 'application/octet-stream',
    body: [["nombre"]]
  };
  console.log(drive.files.create);
  drive.files.create({
    resource: fileMetadataImage,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      console.error(err);
    } else {
      console.log('File Id: ', file.data.id);
      insertDataFileExcel(file.data.id);
    }
  });
}

async function insertDataFileExcel(spreadsheetId) {
  const sheets = google.sheets('v4');
  const request = {
    spreadsheetId,
    range: "A2",
    valueInputOption: 'USER_ENTERED',
    resource: { values: [["nombre"], ["Apellido"]] },
    auth: client,
  }

  await sheets.spreadsheets.values.update(request);
}