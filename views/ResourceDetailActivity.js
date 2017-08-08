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
var SharePopup = require('../components/Sunbird/core/SharePopup');

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var ProgressButton = require('../components/Sunbird/core/ProgressButton');

window.R = require("ramda");

var _this;
class ResourceDetailActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'ratingBar',
      "progressButtonContainer",
      "ratingContainer",
      "simpleToolBarOverFlow",
      "sharePopupContainer"
    ]);
    this.state = state;
    this.screenName = "ResourceDetailActivity"
    this.menuData = {
      url: [
        {imageUrl: "ic_action_share_black" },
      ]
    }
    this.menuData1 = {
      url: [
        {imageUrl: "ic_action_share_black" },
        {imageUrl:'ic_action_overflow'}
      ]
    }
    this.popupMenu = "Delete"

    this.shouldCacheScreen = false;

    this.details = state.data.value0.resourceDetails;
    this.details = JSON.parse(this.details);

    console.log("Got Title", this.details)
    this.localStatus = false;

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
    console.log("hewllo in lc RC");
    var callback = callbackMapper.map(function(params) {
      console.log("params in RC", params);

      if (params[0] == "true") {
        _this.localStatus = true;
        console.log("true", _this.localStatus)
        var pButonLayout = <ProgressButton
                 width="match_parent"
                 isCourse = "false"
                 contentDetail = {_this.details.content}
                 buttonText="PLAY"
                 localStatus = {_this.localStatus}
                 identifier = {_this.details.identifier}
                 changeOverFlowMenu = {_this.changeOverFlow}
                 />
        _this.replaceChild(_this.idSet.progressButtonContainer, pButonLayout.render(), 0);
        _this.changeOverFlow();
        _this.shareContent(true);

      } else {
        var pButonLayout = <ProgressButton
                 width="match_parent"
                 isCourse = "false"
                 contentDetail = {_this.details.content}
                 buttonText="DOWNLOAD"
                 localStatus = {_this.localStatus}
                 identifier = {_this.details.identifier}
                 changeOverFlowMenu = {_this.changeOverFlow}
                 />
        _this.replaceChild(_this.idSet.progressButtonContainer, pButonLayout.render(), 0);

        _this.shareContent(false);

      }


    });
    JBridge.getLocalContentStatus(data.content.identifier, callback);

  }


  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }



  shareContent = (isContentLocallyAvailable) =>{

    var shareCallback = callbackMapper.map(function(data) {
    var input;
    if(isContentLocallyAvailable){
                  input = [{
                    type : "text",
                    data : "ntp.net.in/c/"+_this.details.identifier

                  },{
                    type : "file",
                    data : "file://"+data[0]

                  }];

    }else{
                  input = [{
                              type : "text",
                              data : "ntp.net.in/c/"+_this.details.identifier
                          }];

    }
                  
      var sharePopUp = (
        <SharePopup
        data = {input}/>
        )

    _this.replaceChild(_this.idSet.sharePopupContainer,sharePopUp.render(),0);

    });

    JBridge.exportEcar(this.details.identifier, shareCallback);
  }

  afterRender = () => {
    this.checkLocalStatus(this.details);
    console.log("this.details in RDA",this.details)

    if(this.details && this.details.content && this.details.content.me_averageRating){
    JBridge.setRating(this.idSet.ratingBar, this.details.content.me_averageRating);
    }else if(this.details.content.hasOwnProperty("contentData") && this.details.content.contentData.hasOwnProperty("me_averageRating")){
      JBridge.setRating(this.idSet.ratingBar, this.details.content.contentData.me_averageRating);
    }
    else{
      var layout=(<TextView
          text="Unrated"
          style={window.__TextStyle.textStyle.HINT.TINY}/>)

        this.replaceChild(this.idSet.ratingContainer,layout.render(),0)
    }

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
        text={this.details.description||this.details.content.contentData.description}
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
        text={this.details.content.creator}
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
    console.log("DETAIL IMAGE",this.details.imageUrl)

    return (

      <LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="0,16,0,0"
        orientation="vertical">


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
                circularImageUrl={"4,"+ (this.details.imageUrl?this.details.imageUrl:"ic_action_resource")}/>

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
            text={this.details.hasOwnProperty("content")&& this.details.content.hasOwnProperty("me_totalDownloads") ? this.details.content.me_totalDownloads : "0"}
            style={window.__TextStyle.textStyle.HINT.DULL}/>

          </LinearLayout>

        <LinearLayout
          margin="0,2,0,0"
          width="match_parent"
          height="wrap_content">

            <LinearLayout
              id={this.idSet.ratingContainer}>

              <RatingBar
               id = {this.idSet.ratingBar}
               width="wrap_content"
               height="wrap_content"/>
            </LinearLayout>
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



  overFlowCallback = (params) => {
    console.log("ITEM CLICKED",params);
    if(params == 0){
      var callback = callbackMapper.map(function(response){
        console.log("repsonse for delete",response)
        if(response[0] == "successful"){
          console.log("back to resource");
          _this.onBackPressed();
        }
      });
      JBridge.deleteContent(this.details.identifier,callback);
    }
  }


  onBackPressed = () => {
    console.log("RESOURCE DETAIL BACK CLICKED")
    var whatToSend = [];
    var event= { "tag": "BACK_ResourceDetailActivity", contents: whatToSend };
    window.__runDuiCallback(event);
  }

  changeOverFlow = () =>{
    var toolbar =  (<SimpleToolbar
          width="match_parent"
          menuData={this.menuData1}
          popupMenu={this.popupMenu}
          onBackPress={onBackPressed}
          onMenuItemClick={this.handleMenuClick}
          overFlowCallback = {this.overFlowCallback}
          showMenu="true"
          invert="true"/>)

    this.replaceChild(this.idSet.simpleToolBarOverFlow, toolbar.render(), 0);
    this.shareContent(true);
  }

  handleMenuClick = (url) =>{
    if(url == "ic_action_share_black"){
      window.__SharePopup.show();
    }
  }



  render() {

    this.layout = (
      <RelativeLayout
      width="match_parent"
      height="match_parent"
      afterRender={this.afterRender}
      root="true">
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <LinearLayout
        root = "true"
        width="match_parent"
        height="wrap_content"
        id = {this.idSet.simpleToolBarOverFlow}
        >
        <SimpleToolbar
          width="match_parent"
          menuData={this.menuData}
          popupMenu={this.popupMenu}
          onMenuItemClick={this.handleMenuClick}
          onBackPress={onBackPressed}
          overFlowCallback = {this.overFlowCallback}
          showMenu="true"
          invert="true"

          />
        </LinearLayout>

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
      <LinearLayout
       width="match_parent"
       height="match_parent"
       id={this.idSet.sharePopupContainer}/>

       

      </RelativeLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ResourceDetailActivity);
