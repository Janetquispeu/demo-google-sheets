const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const credentials = require('./account_service.json');
const mock = require('./mock.json');

const {client_email, private_key} = credentials;

const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];

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
      await insertImageFile(file.data.id);
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

function getPermissionFile(fileId) {
  const permission = {
    'type': 'user',
    'role': 'writer',
    'emailAddress': 'janetquispeu@gmail.com'
  };
  drive.permissions.create({
    resource: permission,
    fileId: fileId,
    fields: '*'
  }, async function (err, res) {
    if (err) {
      console.error(err);
    } else {
      console.log('Permission ID: ', res.data.id);
      return res.data.id;
    }
  });
}

function insertImageFile(fileId) {
  // const root = __dirname + '/files/photo.jpg';
  const  fileMetadataImage = {
    'name': 'Reporte de ventas.xls',
    parents: [fileId]
  };

  const media = {
    mimeType: 'application/vnd.google-apps.spreadsheet',
    // body: mock
  };

  drive.files.create({
    resource: fileMetadataImage,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      console.error(err);
    } else {
      console.log('File Id: ', file.data.id);
      getPermissionFile(file.data.id);
    }
  });
}

// async function insertFileExcel() {
//   const sheets = google.sheets('v4');
//   const request = {
//     resource: {
//       properties: {
//         title: "Reporte de ventas"
//       }
//     },

//     auth: client,
//   };
//   const response = (await sheets.spreadsheets.create(request)).data;
//   console.log(response);

//   getPermission(response.spreadsheetId);
// }