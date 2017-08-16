var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var _this;
class ProfileExperiences extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this = this;
    this.isEditable = this.props.editable;
    this.data = [{
      "position": "All subjects class teacher",
      "place": "Balamandir, Vadgaon",
      "duration": "JUN ’10 - JUL ‘16 (6 YRS)"
    }, {
      "position": "Chemistry teacher - Std VII & VIII",
      "place": "Balamandir, Vadgaon",
      "duration": "JUN ’10 - JUL ‘16 (6 YRS)"
    }]

    this.jobs = (this.props.data != undefined)? this.props.data : [];

  }


  getHeader() {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
                width="wrap_content"
                height="wrap_content"
                text="Experience"
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
                height="0"
                weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Edit"
              visibility = {(this.isEditable == "true") ? "visible" : "gone"}
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }

  getLineSeperator = () => {
    return (<LinearLayout
              width="match_parent"
              height="1"
              margin="0,0,0,24"
              background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getBody(input) {
    var dateOptions = {month: "short", year: "2-digit"};
    var endDate = new Date(input.endDate);
    var endDateString = endDate.toLocaleDateString("en-us", dateOptions);
    var joiningDate = new Date(input.joiningDate);
    var joiningDateString = joiningDate.toLocaleDateString("en-us", dateOptions);
    if(input.hasOwnProperty("joiningDate") && input.joiningDate != ""){
      var noOfYears = " (" + Math.abs(joiningDate.getUTCFullYear() - endDate.getUTCFullYear()) + " YRS)";
    } else {
      var noOfYears = "";
    }
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              orientation="vertical"
              margin="12,0,0,0">

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={input.jobName}
                    style={window.__TextStyle.textStyle.CARD.HEADING}/>

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={input.address.city + ", " + input.address.country}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    text={joiningDateString + " - " + endDateString + noOfYears}
                    style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                </LinearLayout>)
  }

  experienceBody = () => {

    var cards = this.jobs.map((item, i) => {
      return (<LinearLayout
                width="wrap_content"
                height="wrap_content"
                gravity="center_vertical"
                margin="0,16,0,0">

                <LinearLayout
                  background={window.__Colors.WHITE_F4}
                  width="44"
                  height="44"/>

                {this.getBody(item)}

                </LinearLayout>)

    });

    return cards;

  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,24"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  render() {
    this.layout = (

      <LinearLayout
                width="wrap_content"
                height="match_parent"
                margin="0,16,0,0"
                orientation="vertical">

                {this.getLineSeperator()}

                {this.getHeader()}

                {this.experienceBody()}

              </LinearLayout>



    )
    return this.layout.render();
  }
}



module.exports = ProfileExperiences;
