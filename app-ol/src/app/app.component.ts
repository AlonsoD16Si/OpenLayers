import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './map/map.component';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,

} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface DialogMapaData {
  wkt: string;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MapComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'app-ol';
  animal!: string;
  name!: string;

  constructor(public dialog: MatDialog) { }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogMapa, {
      data: { wkt: '' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("Resultado del dialog", result);
    });
  }
  //form2
  @ViewChild(MapComponent) map!: MapComponent;
  abrirMapa(templateRef: TemplateRef<any>): void {
    this.dialog.open(templateRef, {});
  }
  saveMapa(): void {
console.log("Resultado del dialog: ",this.map.wkt);
  }
}

//Componente de dialogo
@Component({
  selector: 'dialog-mapa',
  templateUrl: './dialog-mapa.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MapComponent,
  ],
})
export class DialogMapa {
  constructor(
    public dialogRef: MatDialogRef<DialogMapa>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMapaData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  recibir(wkt: any) {
    console.log("....", wkt);
    this.data.wkt = wkt;
  }
}