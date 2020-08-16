import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ternimal-confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  styleUrls: ['confirm-dialog.scss']
})
export class ConfirmDialogComponent {
  message: string;
  title: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    this.message = data.message;
    this.title = data.title;
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  dismiss(): void {
    this.dialogRef.close(false);
  }
}
