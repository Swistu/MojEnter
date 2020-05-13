import React from 'react';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';

import Input from '../../UI/Input/Input';

const NewOrderExcelFile = ({ data }) => {

  const downloadExcel = async () => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("report");

    worksheet.getCell('A2').value = 'Hello, ExcelJS!';
    worksheet.mergeCells('A4:B5');

    worksheet.getCell('A4').value = data.orderNumber;

    workbook.xlsx.writeBuffer().then(data => {
      var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `${data.name}. 000.xlsx`);
    });
  }

  return (
    <Input type="button" value="pobierz" onClick={downloadExcel} />
  )
}

export default NewOrderExcelFile;