const { GoogleSpreadsheet } = require('google-spreadsheet');
const mock = require('./mock.json');

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet('14UtjUVf2_2_mjIwCxdz3_4Oo9Fjtz_jYHhfGEN_ZJWo');

  await doc.useServiceAccountAuth(require('./credentials.json'), (err) => {
    doc.getRows(1, (err, rows) => {
      console.log(rows, '-----------------');
    });
  });
  await doc.loadInfo(); 
  await doc.updateProperties({ title: 'Reporte de ventas' });
  // console.log(doc);

  // const getData = await doc.axios.get();
  // console.log(getData.data.sheets);
  // const sheet = await doc.addSheet({ headerValues: ['name', 'email'] });

  // for (i = 0; i<mock.length; i++) {
  //   await sheet.addRow({ name: mock[i].name, email: mock[i].email });
  //   const rows = await sheet.getRows();
  //   await rows[i].save();
  //   console.log(sheet, '------------------');

  // }
};



accessSpreadsheet();