import { Pipe, PipeTransform, Inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({ name: "safeHtml" })
export class SafeHtmlPipe implements PipeTransform {

  sanitizer: DomSanitizer;
  constructor(@Inject(DomSanitizer) sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  transform(value) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
