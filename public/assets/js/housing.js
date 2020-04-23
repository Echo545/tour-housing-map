function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Converted to es2016 stage 1 using babeljs.io for cross compatibility

class Housing {
  constructor(address, contactName, contactInfo, year, notes) {
    if (typeof address === "undefined") {
      address = "421 8th St, Huntington Beach, CA 92648";
    }

    if (typeof contactName === "undefined") {
      contactName = "Brian Brennt";
    }

    if (typeof contactInfo === "undefined") {
      contactInfo = "123-998-1234";
    }

    if (typeof year === "undefined") {
      year = "2018";
    }

    if (typeof notes === "undefined") {
      notes = "This house is the best, it's a big big house with lots of rooms";
    }

    this.address = address;
    this.contactName = contactName;
    this.contactInfo = contactInfo;
    this.year = year;
    this.notes = notes;

    // Marker and geoResults are set once the address has been marked on the map
    this.marker = "";
    this.geoResults = "";
    this.submitter = "";

    this.id = Housing.idCounter;
    Housing.idCounter++;
  }

  get submitter() {
    return this._submitter;
  }

  get geoResults() {
    return this._geoResults;
  }

  get address() {
    return this._address;
  }

  get contactName() {
    return this._contactName;
  }

  get contactInfo() {
    return this._contactInfo;
  }

  get year() {
    return this._year;
  }

  get notes() {
    return this._notes;
  }

  get housingName() {
    return `${this.contactName}'s House`;
  }

  get marker() {
    return this._marker;
  }

  get id() {
    return this._id;
  }

  set submitter(sub) {
    this._submitter = sub;
  }

  set geoResults(geo) {
    this._geoResults = geo;
  }

  set address(addr) {
    this._address = addr;
  }

  set contactName(ctcName) {
    this._contactName = ctcName;
  }

  set contactInfo(ctcInfo) {
    this._contactInfo = ctcInfo;
  }

  set year(yr) {
    this._year = yr;
  }

  set notes(nts) {
    this._notes = nts;
  }

  set marker(mkr) {
    this._marker = mkr;
  }

  set id(i) {
    this._id = i;
  }

  toString() {
    return `id: ${this.id}\nname: ${this.housingName}\ngeoResults: ${this.geoResults}\naddress: ${this.address}\ncontact name: ${this.contactName}\ncontact info: ${this.contactInfo}\nyear: ${this.year}\nnotes: ${this.notes}\nsubmitter: ${this.submitter}`;
  }

}
// this gives every housing object a unique ID
_defineProperty(Housing, "idCounter", 0);

export default Housing;