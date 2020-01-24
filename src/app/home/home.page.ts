import { Component } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  constructor(
    private file: File,
    private fileOpener: FileOpener) { }

  exportPdf() {
    const div = document.getElementById("printable-area");
    //const options = { background: "white", height: div.clientWidth, width: div.clientHeight };
    const options = {};
    domtoimage.toPng(div, options).then((dataUrl) => {


      //Initialize JSPDF
      var doc = new jsPDF("p", "mm", "a4");

      //Add image Url to PDF
      doc.addImage(dataUrl, 'PNG', 40, 10, 130, 280);
      //addImage(imageData, format, x, y, width, height, alias, compression, rotation).

      let pdfOutput = doc.output();
      // using ArrayBuffer will allow you to put image inside PDF
      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }


      const directory = this.file.dataDirectory;
      const fileName = "invoice.pdf";
      let options: IWriteOptions = { replace: true };

      this.file.checkFile(directory, fileName).then((success) => {
        this.file.writeFile(directory, fileName, buffer, options).then((success) => {
          console.log("File created Succesfully" + JSON.stringify(success));
          this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
        }).catch((error) => {
          console.log("Cannot Create File " + JSON.stringify(error));
        });
      }).catch((error) => {
        this.file.writeFile(directory, fileName, buffer)
          .then((success) => {
            console.log("File created Succesfully" + JSON.stringify(success));
            this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));
          }).catch((error) => {
            console.log("Cannot Create File " + JSON.stringify(error));
          });
      });
    }).catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
  }


}
