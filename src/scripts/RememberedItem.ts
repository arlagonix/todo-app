export default class RememberedItem {
  private _item: any;

  public constructor() {}

  public get item() {
    return this._item;
  }

  public set item(newItem: any) {
    this._item = newItem;
  }
}
