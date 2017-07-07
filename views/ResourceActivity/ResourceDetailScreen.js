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


class ResourceDetailScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'ratingBar'
    ]);
    this.state = state;
    this.screenName = "ResourceDetailScreen"
      this.menuData = {
      url: [
        { imageUrl: "ic_action_share"},
        { imageUrl: "ic_action_bookmark"},
        { imageUrl: "ic_action_overflow"},
      ]
      }

    this.shouldCacheScreen = false;


      this.details = JSON.parse(state.data.value0.resourceDetails);
      console.log("ResourceDetail description",this.details.description)
      console.log("Resource Title",this.details.name)
      console.log("Got Title",state)

  }

    formatBytes = (bytes)=> {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(2) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(2) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};


  

  
  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {

         JBridge.setRating(this.idSet.ratingBar,"3.3");   
  }


  getLineSeperator = () =>{
    return (<LinearLayout
            width="match_parent"
            height="2"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  getBody = () =>{
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
        visibility="gone"
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


  getHeader = () =>{

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

        </LinearLayout>

        <TextView
        width="wrap_content"
        height="wrap_content"
        padding="8,0,0,0"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        text={this.details.name}/>

        </LinearLayout>

        <LinearLayout
        margin="0,12,0,0"
        width="match_parent"
        height="wrap_content">

        <TextView
        width="wrap_content"
        height="wrap_content"
        text="PDF file [207 KB]"
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
    window.__changePureScriptFlow();
    window.__runDuiCallback({ action: "showMainFlow" });
  }

  render() {
    var buttonList = ["ENROLL FOR THIS COURSE"];
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

               <ProgressButton
                 width="match_parent"
                 buttonItems={buttonList}
                 identifier = {this.details.identifier}/>
       
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ResourceDetailScreen);


