var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var Button = require('../components/HPCL/Button');
var FormField = require('../components/HPCL/FormFields');
var Progress = require('@juspay/mystique-backend').androidViews.ProgressBar;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;

var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var objectAssign = require('object-assign');


import PageOption from '../components/HPCL/PageOption';

window.R = require("ramda");

class SplashScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.buttonList = ["abc"];
    this.buttonList2 = ["del", "abc"];
    this.setIds([
      'list', "item1", "item2"
    ]);
  }

  afterRender = () => {

  }

  getMonthName = (monthIndex) => {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    return monthNames[monthIndex];
  }

  updateCalendarDate = (expiryDate) => {
    var date = new Date(expiryDate)
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var month = this.getMonthName(monthIndex);
    var myData = day + ' ' + month + ' ' + year;
    console.log("DATE SELECTED ", myData);

  }

  handleDatePicker = () => {
    this.minDateLimit = new Date("12-28-2016").getTime();
    this.maxDateLimit = new Date("6-28-2017").getTime();
    var callback = callbackMapper.map((params) => {
      this.updateCalendarDate(params[0]);
    });
    //[MIN DATE,MAX DATE ,SELECTED (in timeStamp ) pass "" to use default value
    JBridge.showCalender(callback, this.minDateLimit + "", this.maxDateLimit + "", this.minDateLimit + "");
  }

  handleClick = (data) => {
    console.log("CLICKED 1", data)
  }

  render() {
    this.layout = (
      <LinearLayout
         root="true"
         orientation="vertical"
         width="match_parent"
         height="match_parent">

        <TextView
           text="ABCDF"
           margin="20,120,20,20"
           layout_gravity="center"
           height="wrap_content"
            />
         

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(SplashScreen);
