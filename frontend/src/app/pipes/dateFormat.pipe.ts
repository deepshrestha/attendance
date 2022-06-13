import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "formatdate" })
export class FormatDatePipe implements PipeTransform {

  transform(value) {
    if (value) {
        var date = new Date(value);
        const dateFormat = date.getFullYear() + "-" + 
                        ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
                        ("0" + date.getDate()).slice(-2) + " " + 
                        ("0" + date.getHours()).slice(-2) + ":" + 
                        ("0" + date.getMinutes()).slice(-2);
        return dateFormat;
    }
    return "";
  }
}
