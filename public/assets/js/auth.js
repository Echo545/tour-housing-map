import Housing from "./housing.js";
// import loadHousingCallback from "./map.js";

var self;

class Auth {

  constructor() {
    this._auth = firebase.auth();
    this._db = firebase.database();

    this._signingUp = false;

    self = this;
    this.init();
  }

  static get getThis() {
    return this;
  };

  /**
   * The realtime database cannot handle certain characters in file paths. This removes them
   * 
   * @param {string} address 
   */
  sanitizeAddress(address) {
    return address.replace(/[.$#\[\]]/g, "");
  }


  /**
   * Converts geoResults to a string so it can be stored in the DB
   * 
   * @param {[]} results 
   */
  sanitizeData(results) {
    return JSON.stringify(results);
  }


  /**
   * Converts the string representation of geoResults to object form
   * 
   * @param {string} resultsString 
   */
  parseData(resultsString) {
    return JSON.parse(resultsString);
  }


  /**
   * Get's the current user's user group. 
   * If for some reason the account doesn't have a usergroup
   * automatically assigns them to CSIS304 usergroup
   */
  getUserGroup() {
    // using photoURL for group becuase photoURL is an unused field

    var userGroup = self._auth.currentUser.providerData[0].photoURL;

    if (!userGroup || userGroup == "") {

      userGroup = "CSIS304";

      self._auth.currentUser.updateProfile({
        photoURL: userGroup
      });
    }

    return userGroup;
  }


  /**
   * returns the geodata & marker from geoData parent associated with the given address
   * 
   * @param {string} address 
   */
  getGeoData(address, house, callback, altCallback) {
    var result = null;
    var marker;
    var geoResults;
    var data;

    // var address = house.address;

    var geoDataRef = self._db.ref(`geoData/${self.sanitizeAddress(address)}`);

    geoDataRef.once("value").then(function (snapshot) {
      data = snapshot.val();

      if (data) {


        marker = data.marker;
        geoResults = data.geoResults;
        result = {
          "marker": "marker - we don't need this anymore",
          "geoResults": self.parseData(geoResults)
        };
      }
      else {
        console.log(`address: ${address} not found in geoData DB`);
      }

      callback(house, altCallback, result);
    });

    // console.log("returning geoData result: " + result);
    return result;
  }


  /**
   * This gets recursively called for each house in {userGroup}/housingData
   * 
   * @param {int} index 
   * @param {array} keys 
   * @param {array} houses 
   */
  readHousingData(index, keys, houses, callback) {

    const userGroup = self.getUserGroup();

    var tempHouseData;
    var tempGeoResults;
    var tempHouse;

    var address;
    var contactName;
    var contactInfo;
    var year;
    var notes;
    var marker;
    var geoResults;
    var submitter;


    var tempRef = self._db.ref(`housingDataLists/${userGroup}/housingData/${keys[index]}`);


    tempRef.once("value").then(function (snapshot) {
      tempHouseData = snapshot.val();

      // read specific fields
      address = tempHouseData.address;
      contactName = tempHouseData.contactName;
      contactInfo = tempHouseData.contactInfo;
      year = tempHouseData.year;
      notes = tempHouseData.notes;
      submitter = tempHouseData.submitter;

      // using weird callback because it's needed in map.js
      tempGeoResults = self.getGeoData(address, null, function (h, ac, gResults) {

        if (gResults) {
          marker = gResults.marker;
          geoResults = gResults.geoData;
        }
        else {
          // this should never happen because the only housing object submitted to the DB
          // should be complete & have entries in geoData
          marker = -1;
          geoResults = -1;
          console.log("NO GEORESULTS PROVIDED");
        }

        // make house object
        tempHouse = new Housing(address, contactName, contactInfo, year, notes);
        tempHouse.marker = marker;
        tempHouse.geoResults = geoResults;
        tempHouse.submitter = submitter;

        // add house to list
        houses.push(tempHouse);

        // recursively reading housing data until every value in keys has been processed
        self.tryCallback(callback, index, keys.length, houses, keys);

      }, function () {});
    });

  }

  /**
   * Read self._db at user's group's housingData (and handle errors)
   * Return a list of JSON data for each house
   */
  readHousingList(callback) {

    const userGroup = self.getUserGroup();
    var houses = [];

    var data = null;
    var keys = [];
    var housingDataRef = self._db.ref(`housingDataLists/${userGroup}/housingData`);

    housingDataRef.once("value").then(function (snapshot) {
      data = snapshot.val();

      // creates list of keys
      for (var i in data) {
        keys.push(i);
      }

      // this is a wacky recursive solution that calls readHousingData, which calls tryCallback
      // which calls readHousingData until every key has been processed
      self.readHousingData(0, keys, houses, callback);

    });
    return houses;
  }


  tryCallback(callback, index, length, houses, keys) {

    // if we're at the last index
    if (index == length - 1) {
      callback(houses);
    }
    else {
      var newIndex = index + 1;

      self.readHousingData(newIndex, keys, houses, callback);
    }
  }


  /**
   * Processes a given house and adds it to the currently
   * authenticaed user's group
   */
  addHouseToGroupDB(house) {
    var userGroup = self.getUserGroup();
    var ref = self._db.ref(`housingDataLists/${userGroup}/housingData`);
    var data;
    var addresses = [];
    var safeAddress;
    var updatedHouse;

    ref.push({
      "address": house.address,
      "contactName": house.contactName,
      "contactInfo": house.contactInfo,
      "year": house.year,
      "notes": house.notes,
      // "marker": house.marker,
      // "marker": "TEST from auth.js",
      // "geoResults": house.geoResults,
      "submitter": self._auth.currentUser.displayName
    });

    // add house's geoData to geoData if not already in db
    ref = self._db.ref(`geoData`);

    ref.once("value").then(function (snapshot) {
      data = snapshot.val();
    });

    for (var sanitizedAddress in data) {
      addresses.push(sanitizedAddress);
    }

    safeAddress = self.sanitizeAddress(house.address);

    // if not already in db
    if (!addresses.includes(safeAddress)) {

      ref = self._db.ref(`geoData/${safeAddress}`);
      ref.set({
        "marker": "self.sanitizeData(house.marker)",
        "geoResults": self.sanitizeData(house.geoResults)
      });

      console.log(`adding ${safeAddress} to geoDataDB`);
    }
    else {
      console.log(`not adding address to geoDate DB because it's already there: ${safeAddress}`);
    }
  }


  // A lot of this function is from Firebase's documentation
  initAuthUI() {
    // FirebaseUI config.
    var uiConfig = {
      signInSuccessUrl: '/map',
      signInFlow: 'popup',
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      tosUrl: 'https://policies.google.com/terms?hl=en-US',
      privacyPolicyUrl: function () {
        window.location.assign('https://policies.google.com/privacy?hl=en-US');
      }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
  }


  initSignup() {
    const signupForm = $("#signup-form");

    signupForm.submit(function (e) {
      e.preventDefault();

      // this prevents the page from reloading before the db is updated
      self._signingUp = true;

      // Get user info
      const email = $("#email-input").val();
      const password = $("#password-input").val();
      const displayName = $("#display-name-input").val();
      const group = $("#group-selection").val();

      // TODO: catch errors when registering user

      // Register User
      self._auth.createUserWithEmailAndPassword(email, password).then(function (cred) {

        // add group and display name to user's profile
        // instead of creating a new DB parent for users, I'm simplying using photoURL
        // for the user's group for now
        // group can be accessed with self._auth.currentUser.providerData[0].photoURL
        self._auth.currentUser.updateProfile({
          "displayName": displayName,
          "photoURL": group
        }).then(function () {

          // add uid to group's user list
          var ref = self._db.ref(`housingDataLists/${group}/users/${self._auth.currentUser.uid}`);
          ref.set(true);

          console.log("set ref: " + ref);

          console.log("account created: \n"
            + self._auth.currentUser.email
            + "\nDisplay name: " + self._auth.currentUser.displayName
            + "\nself._auth.currentUser.photoURL: " + self._auth.currentUser.photoURL
            + "\nGroup: " + group
          );

          // this check prevents the page from reloading infinintly
          if (window.location.pathname != "/map/") {
            window.location.replace("/map");

          }
          // clean up
          signupForm.trigger("reset");
        });
      });
      // cleanup
      $("#signup-modal").modal("hide");
    });
  }


  logout() {
    self._auth.signOut();
  }


  init() {
    $(document).ready(function () {

      // Login Modal Listener
      $("#login-button").click(function () {
        $("#login-modal").modal("show");
      });

      // Signup Modal Listener
      $("#signup-button").click(function () {
        $("#signup-modal").modal("show");
      });

      // Logout Button Listener
      $("#logout-button").click(self.logout);

      // Inits
      self.initAuthUI();
      self.initSignup();

      // Listen for self._auth status changes
      self._auth.onAuthStateChanged(function (user) {

        // this will only run if user is logged in
        if (user && !self._signingUp) {
          console.log("user logged in: " + user.email);

          // this check prevents the page from reloading infinintly
          if (window.location.pathname != "/map/") {
            window.location.replace("/map");
          }

          // self.readHousingList();
        }
        else if (!self._signingUp) {
          // this will run if user is logged out
          console.log("user logged out");

          // this check prevents the page from reloading infinintly
          if (window.location.pathname != "/") {
            window.location.replace("/");
          }
        }
      });
    });
  }

  get currentUser() {
    return self._auth.currentUser;
  }
}


export default Auth;