var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var RatingBar = require('@juspay/mystique-backend').androidViews.RatingBar;
var objectAssign = require('object-assign');
window.R = require("ramda");
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var ProgressButton = require('../../components/Sunbird/core/ProgressButton');


var _this;
class ResourceDetailScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'ratingBar',
      "progressButtonContainer"
    ]);
    this.state = state;
    this.screenName = "ResourceDetailScreen"
    this.menuData = {
      url: []
    }

    this.shouldCacheScreen = false;




    this.details = state.data.value0.resourceDetails;
    this.details = JSON.parse(this.details);

    console.log("Got Title", this.details)
    this.localStatus = false;

    // if(this.details.hasOwnProperty("content") && this.details.content.hasOwnProperty("isAvailableLocally")){
    //   this.localStatus = true;
    // }
    _this = this;
    console.log("true", this.localStatus)


    setTimeout(function() {
      Android.runInUI(
        _this.animateView(),
        null
      );
    }, 100)

  }

  checkLocalStatus = (data) => {
    if (data.hasOwnProperty("content")) {
      if (data.content.hasOwnProperty("isAvailableLocally")) {
        this.localStatus = true;
      } else {
        console.log("data in RRC", data);
        var callback = callbackMapper.map(function(params) {
          console.log("params in RC", params);

          if (params[0] == "true") {
            _this.localStatus = true;
            console.log("true", _this.localStatus)


          }

          var pButonLayout = (<ProgressButton
                 width="match_parent"
                 isCourse = "false"
                 contentDetail = {_this.details.content}
                 buttonText="DOWNLOAD THIS RESOURCE"
                 localStatus = {_this.localStatus}
                 identifier = {_this.details.identifier}/>)

          _this.replaceChild(_this.idSet.progressButtonContainer, pButonLayout.render(), 0);
        });
        JBridge.getLocalContentStatus(data.content.identifier, callback);

      }
    }
  }


  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {
    this.checkLocalStatus(this.details);
    JBridge.setRating(this.idSet.ratingBar, "3.3");

  }


  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  getBody = () => {
    return (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      orientation="vertical">

        <TextView
        margin="0,13,0,0"
        width="wrap_content"
        height="wrap_content"
        text="ABOUT THIS MODULE"
        style={window.__TextStyle.textStyle.HINT.BOLD}/>

       <TextView
        margin="0,4,0,0"
        width="wrap_content"
        height="wrap_content"
        text={this.details.description}
        style={window.__TextStyle.textStyle.CARD.TITLE.REGULAR_BLACK}/>

        <TextView
        margin="0,16,0,0"
        width="wrap_content"
        height="wrap_content"
        text="PREVIEWS"
        style={window.__TextStyle.textStyle.HINT.BOLD}/>


       <LinearLayout
        width="match_parent"
        height="wrap_content"
        visibility="gone"
        margin="0,8,0,0">
      

          <ImageView
          width="156"
          height="200"
          stroke ={"3," + window.__Colors.PRIMARY_BLACK}
          imageFromUrl = "https://pbs.twimg.com/media/CRafzhtWIAEQ2c9.png"/>

          <ImageView
          width="156"
          height="200"
          margin="16,0,0,0"
          stroke ={"3," + window.__Colors.PRIMARY_BLACK}
          imageFromUrl = "https://pbs.twimg.com/media/CRafzhtWIAEQ2c9.png"/>

        </LinearLayout>



        <TextView
        margin="0,4,0,0"
        width="wrap_content"
        height="wrap_content"
        text="No preview available"
        style={window.__TextStyle.textStyle.HINT.REGULAR}/>


        <TextView
        margin="0,16,0,0"
        width="wrap_content"
        height="wrap_content"
        text="CREATED BY"
        style={window.__TextStyle.textStyle.HINT.BOLD}/>


        <LinearLayout
        width="match_parent"
        height="wrap_content">

        <TextView
        margin="0,4,0,10"
        width="wrap_content"
        height="wrap_content"
        text="Rajesh Kumar"
        style={window.__TextStyle.textStyle.CARD.TITLE.REGULAR_BLACK}/>


        <ViewWidget
        width="0"
        height="0"
        weight="1"/>


        <ImageView
        width="20"
        height="12"
        imageUrl="ic_chat"/>

      </LinearLayout>
      </LinearLayout>

    )
  }


  getHeader = () => {

    return (

      <LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="0,16,0,0"
        orientation="vertical"
        >

        <LinearLayout
        width="match_parent"
        height="wrap_content">


        <LinearLayout
        width="80"
        height="50"
        cornerRadius="4"
        background={window.__Colors.PRIMARY_BLACK_66}>

        <ImageView
        width="80"
        height="50"
        circularImageUrl={"4,"+this.details.imageUrl}/>

        </LinearLayout>

        <TextView
        width="wrap_content"
        height="wrap_content"
        padding="8,0,0,0"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        text={this.details.title}/>

        </LinearLayout>

        <LinearLayout
        margin="0,12,0,0"
        width="match_parent"
        height="wrap_content">

        <TextView
        width="wrap_content"
        height="wrap_content"
        text={this.details.headFooterTitle}
        style={window.__TextStyle.textStyle.HINT.REGULAR}/>

        <ViewWidget
        width="0"
        weight="1"
        height="0"/>

        <TextView
        width="wrap_content"
        height="wrap_content"
        text="1870"
        style={window.__TextStyle.textStyle.HINT.DULL}/>

        </LinearLayout>

        <LinearLayout
          margin="0,2,0,0"
          width="match_parent"
          height="wrap_content">

          <RatingBar
           id = {this.idSet.ratingBar}
           width="wrap_content"
           height="wrap_content"/>

          <ViewWidget
            width="0"
            weight="1"
            height="0"/>

          <TextView
            width="wrap_content"
            height="wrap_content"
            text="downloads"
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

        </LinearLayout>
        </LinearLayout>

    )

  }


  onBackPressed = () => {
    var eventAction = { "tag": "ResourceDetailaBack", contents: [] };
    window.__runDuiCallback(eventAction);
  }

  render() {

    this.layout = (
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <SimpleToolbar
          afterRender={this.afterRender}
          width="match_parent"
          menuData={this.menuData}
          onBackPress={onBackPressed}
          showMenu="true"
          invert="true"/>

              <ScrollView
                height="0"
                weight="1"
                width="match_parent"
                fillViewport="true"
                >

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  padding="16,0,16,0"
                  orientation="vertical">


                  {this.getHeader()}

                  {this.getLineSeperator()}

                  {this.getBody()}
                  

                </LinearLayout>

                </ScrollView>

               <LinearLayout
                height="wrap_content"
                width="match_parent"
                id={this.idSet.progressButtonContainer}
                root="true"/>
       
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ResourceDetailScreen);
