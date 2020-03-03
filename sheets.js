const {google} = require('googleapis');
const fs       = require('fs');
const mock = require('./mock.json');

const credentials = JSON.parse(fs.readFileSync('client_secret.json', 'utf-8'));

const {
  client_secret: clientSecret,
  client_id: clientId,
  redirect_uris: redirectUris,
} = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    clientId, clientSecret, redirectUris[0],
  );

  // Generate a url that asks permissions for Gmail scopes
  const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
  ];

  const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
  });
  // console.log(url);
  // const code = "4/xAF9p-tVA0cE3vujwXESPFoYX3-1mep7qzfBwpb_tSX0kKLwidTsfR8";

  // const getToken = async () => {
  //   const { tokens } = await oAuth2Client.getToken(code);
  //   fs.writeFileSync('google-outh-token.json', JSON.stringify(tokens));

  // };

  // getToken();

  const token = fs.readFileSync('google-outh-token.json', 'utf-8');
  oAuth2Client.setCredentials(JSON.parse(token));


  // const read = async (spreadsheetId, range) => {
  //   const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

  //   return sheets.spreadsheets.values.get({
  //     spreadsheetId,
  //     range,
  //   })
  //     .then(_.property('data.values'));
  // };


  const update = async (spreadsheetId, range, data) => {
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

    return sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: data },
    });
  }

  update('14UtjUVf2_2_mjIwCxdz3_4Oo9Fjtz_jYHhfGEN_ZJWo', 'E2', mock);

