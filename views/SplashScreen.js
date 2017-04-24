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
      'list',"item1","item2"
    ]);
  }

  afterRender = () => {
    var listView = this.find("ListView")[0];

		var item11 = (
		 		<RelativeLayout
 					clickable = "true"
		 			width="match_parent">
		 			<TextView
	 					id = {this.idSet.item1}
	 					clickable = "true"
						background = "#F4f4f4"
            height = "32"
            typeface = "bold"
            color = "#000000"
            width = "match_parent"
            textSize = "20"/>
			    </RelativeLayout>);

		for(var i = 0; i<26 ; i++){
			var cmd = this.set({
					      id : this.idSet.item1,
					      text: i
				    	});
      listView.generateListItem(item11,cmd,0);
		}

		var callback = callbackMapper.map((params) => {
	      console.info("INDEX : ", params[0]);
	    });

    listView.setListItem(this.idSet.list,callback,1);
    setTimeout(() => {
      window.__runDuiCallback({ event: "step", state: { event: "standard" } });
    }, 1000);
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

        <ImageView
           margin="20,120,20,20"
           layout_gravity="center"
           height="wrap_content"
           onClick={this.handleDatePicker}
           imageUrl="logo_hpcl_full" />

           <ListView
             id={this.idSet.list}
             width="match_parent"
             height="match_parent"/>

          <PageOption
          buttonItems={this.buttonList}
          onButtonClick={this.handleClick}
          />

          <PageOption
          buttonItems={this.buttonList2}
          hideDivider="true"
          onButtonClick={this.handleClick}
          />

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(SplashScreen);
