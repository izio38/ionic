import {Directive,  Input, TemplateRef, ViewContainerRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[ifPl]',
})
export class IfPlatform {
  public _context: IfPlatformContext = new IfPlatformContext();
  public _thenTemplateRef: TemplateRef<IfPlatformContext>|null = null;
  public platform: string;
  constructor(public _viewContainer: ViewContainerRef, public templateRef: TemplateRef<any>, public render: Renderer2) {
    this._thenTemplateRef = templateRef;
  }

  onResize() {
    if (this._context.inversed) {
      this._context.$implicit = this._context.ifPlatform = !IsThisPlateForm(window, this.platform);
    }else{
      this._context.$implicit = this._context.ifPlatform = IsThisPlateForm(window, this.platform);
    }
    this._updateView();
  }

  @Input('ifPl')
  set myIfPl(platform: string) {
    this.platform = this.ParsePlatform(platform);
    if (this._context.inversed) {
      this._context.$implicit = this._context.ifPlatform = !IsThisPlateForm(window, this.platform);
    }else{
      this._context.$implicit = this._context.ifPlatform = IsThisPlateForm(window, this.platform);
    }
    this._updateView();
    this.render.listen("window", "resize", this.onResize.bind(this));

  }


  private _updateView() {
    if (!this._context.$implicit) {
      this._viewContainer.clear();
      this._context.see = false;
    } else {
      if(!this._context.see){
        this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
      }
      this._context.see = true;

    }
  }

  private ParsePlatform(pl: string) {
    var splitted = pl.split("!");
    if (splitted.length > 1) {
      this._context.inversed = true;
      return splitted[1]
    }
  }
}

export class IfPlatformContext {
  public $implicit: any = null;
  public ifPlatform: any = null;
  public see: boolean = false;
  public inversed: boolean = false;
}

// TODO: Use the util provided by core/src/util
export function IsThisPlateForm(win, pl){
  let agent = win.navigator.userAgent;
  switch (pl){
    case "ios":
      return (agent.match("/iPad|iPhone|iPod/i") || []).length > 0;
    case "iPad":
      return (agent.match("/iPad/i") || []).length > 0;
    case "iPhone":
      return (agent.match("/iPhone/i") || []).length > 0;
    case "android":
      return (agent.match(/Android/i) || []).length > 0;
    case "wd":
      return (agent.match(/Windows Phone/i) || []).length > 0;
  }
  throw new Error(`there is no platform named : ${pl}. Use : ios, iPad, iPhone, android, wd instead.`);
}

