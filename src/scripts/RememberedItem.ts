export default class RememberedItem {
  private _item: any;
  public get item(): any {
    return this._item;
  }

  public set item(newItem: any) {
    this._item = newItem;
  }
}
