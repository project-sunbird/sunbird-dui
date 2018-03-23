var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var utils = require('../../utils/GenericFunctions');
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");
var debounce = require("debounce");


class SearchResult extends View {
  constructor(props, children) {
    super(props, children);
    console.log(this.props.data);
    this.type = this.props.type ? this.props.type : "Resource";
    this.jsonArray = [];
    this.setIds([
      'listContainer',
      "gradeTextView"
    ]);
    this.handleItemClick = debounce(this.handleItemClick, 50);
    this.screenWidth = JBridge.getScreenWidth();
  }
  getData = () => {
    return (<ListView
      id={this.idSet.listContainer}
      background="#ffffff"
      width="match_parent"
      height="wrap_content" />);
  }
  showList = () => {
    this.props.data.map((item, index) => {
      var halfWidth = Math.floor(((this.screenWidth-100)/2));
      var appIcon = "ic_launcher";
      if (this.type == "Profile") {
        appIcon = (item.data && item.data.avatar) ? item.data.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc";
      } else {
        appIcon = item.hasOwnProperty("appIcon") ? item.appIcon : "ic_launcher";
      }
      var resultLayout = (
        <LinearLayout
          width="match_parent"
          height="warp_content"
          orientation="vertical"
          margin="16,0,16,0"
          onClick={() => { this.props.onClick(item, index)}}>

          <LinearLayout
            width="match_parent"
            height="wrap_content">

            <ImageView
              width="37"
              height="37"
              margin={item.subject || item.gradeLevel? "10,22,0,22":"10,12,0,12"}
              scaleType="fixXY"
              gravity="center"
              circularImageUrl={"0," + appIcon} />

            <LinearLayout
              width="match_parent"
              height="wrap_content"
              orientation="vertical">

              <LinearLayout
                height="wrap_content"
                width="match_parent">

                <TextView
                  height="wrap_content"
                  width="wrap_content"
                  padding="10,10,0,0"
                  enableEllipse="true"
                  text={item.name}
                  weight="0"
                  style={window.__TextStyle.textStyle.CARD.HEADING} />

                  <ImageView
                    width="16"
                    height="16"
                    gravity="left"
                    visibility="gone"
                    margin="4,10,0,0"
                    imageUrl="ic_check_circle"/>
              </LinearLayout>
              <LinearLayout
                orientation="horizontal">
              <TextView
                height="wrap_content"
                padding="10,4,0,0"
                width="wrap_content"
                visibility={item.contentType ? "visible" : "gone"}
                text={item.contentType}
                style={window.__TextStyle.textStyle.HINT.SEMI} />

                <ImageView
                  width="10"
                  height="10"
                  gravity="left"
                  margin="4,7,0,0"
                  imageUrl="ic_dot_lightgrey"/>

                  <ImageView
                    width="12"
                    height="12"
                    gravity="left"
                    margin="4,6,0,0"
                    visibility={item.me_averageRating? "visible":"gone"}
                    imageUrl="ic_grey_star"/>

                    <TextView
                       height="wrap_content"
                       padding="4,4,0,0"
                       gravity="left"
                       width="wrap_content"
                       visibility={item.me_averageRating ? "visible":"gone"}
                       text={item.me_averageRating ? parseInt(item.me_averageRating).toString() : ""}
                       style={window.__TextStyle.textStyle.HINT.SEMI} />


                  <ImageView
                    width="10"
                    height="10"
                    gravity="left"
                    margin="4,7,0,0"
                    visibility={item.me_averageRating? "visible":"gone"}
                    imageUrl="ic_dot_lightgrey"/>

                    <TextView
                       height="wrap_content"
                       padding="4,4,0,0"
                       gravity="left"
                       width="wrap_content"
                       visibility={item.hasOwnProperty("size") ? "visible" : "gone"}
                       text={item.hasOwnProperty("size") ? utils.formatBytes(item.size) : " "}
                       style={window.__TextStyle.textStyle.HINT.SEMI} />
                   </LinearLayout>

                   <LinearLayout
                      orientation="horizontal"
                      padding = "10,0,0,0">

                      <TextView
                         height="wrap_content"
                         id={this.idSet.gradeTextView}
                         width={item.gradeLevel && item.gradeLevel.length > 2 && item.subject ? halfWidth+"" : "wrap_content"}
                         padding={item.subject ? "0,4,0,10":"0,4,16,10"}
                         gravity="left"
                         enableEllipse="true"
                         singleLine="true"
                         scrollHorizontally="true"
                         visibility={item.gradeLevel?"visible":"gone"}
                         text={item.gradeLevel ? item.gradeLevel.toString().replace(/,/g , ", ") : ""}
                         style={window.__TextStyle.textStyle.HINT.SEMI} />


                         <ImageView
                           width="10"
                           height="10"
                           visibility={item.gradeLevel && item.subject ? "visible":"gone"}
                           gravity="left"
                           margin="4,7,0,0"
                           imageUrl="ic_dot_lightgrey"/>

                           <TextView
                              height="wrap_content"
                              padding="4,3,16,10"
                              gravity="left"
                              width="wrap_content"
                              enableEllipse="true"
                              singleLine="true"
                              visibility={item.subject?"visible":"gone"}
                              text={item.subject ? item.subject.toString() : ""}
                              style={window.__TextStyle.textStyle.HINT.SEMI} />



                      </LinearLayout>


              <LinearLayout
                width="wrap_content"
                height="wrap_content"
                cornerRadius="4"
                background={"#e8e8e8"}
                alpha="0.70"
                visibility={this.type == "Profile" ? "visible" : "gone"}
                padding="5,1,5,1"
                margin="10,5,0,10">

                <TextView
                  height="wrap_content"
                  width="wrap_content"
                  visibility={this.type == "Profile" ? "visible" : "gone"}
                  text={this.type == "Profile" ? (item.data.status == 1 ? "Active" : "Inactive") : ""}
                  style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK} />
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
      );
      this.jsonArray.push({ view: this.getView(resultLayout.render()), value: "", viewType: 0 });
    })
    //console.log(this.jsonArray);
    JBridge.listViewAdapter(
      this.idSet.listContainer,
      JSON.stringify(this.jsonArray),
      1000,
      null,
      "",
      "",
      1
    );
  }

  render() {

    this.layout = (
      <LinearLayout
        width="match_parent"
        afterRender={this.showList}
        height="match_parent"
        orientation="vertical"
        background="#ffffff">

        {this.getData()}

      </LinearLayout>
    )
    return this.layout.render();
  }
}
module.exports = SearchResult;
