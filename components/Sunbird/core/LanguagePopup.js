const dom = require("@juspay/mystique-backend/src/doms/android");
const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var CheckBox = require("@juspay/mystique-backend/src/android_views/CheckBox");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Space = require("@juspay/mystique-backend/src/android_views/Space");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var callbackMapper = require("@juspay/mystique-backend/src/helpers/android/callbackMapper");
var Styles = require("../../../res/Styles");
var Spinner = require('./Spinner');
let IconStyle = Styles.Params.IconStyle;
var _this;

class LanguagePopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "parentContainer",
      "languageMapSpinner"
    ]);
    this.parentId = this.idSet.parentContainer;
    _this=this;
    window.__LanguagePopup = this;
    this.isVisible=false;
    // "اردو Urdu" : "ur_IN",
    this.languageMap = {
      "English" : "en_US",
      "हिंदी" : "hi_IN",
      "ಕನ್ನಡ" : "kn_IN",
      "తెలుగు": "te_IN",
      "தமிழ்" : "ta_IN",
      "বাঙালি" : "bn_IN",
      "മലയാളം" : "ml_IN",
      "Oriya" : "or_IN",
      "ગુજરાતી" : "gu_IN",
      "Assamese" : "as_IN",
      "मराठी" : "mr_IN",
      "ਪੰਜਾਬੀ" : "pa_IN"
    };
    this.selectedLang = window.__CurrentLanguage;
  }


  show = () => {
    this.setVisibility("visible");
    this.isVisible=true;
    this.afterRender();
  }

  hide = () => {
    this.setVisibility("gone");
    this.isVisible=false;
  }

  getVisible = () => {
    return this.isVisible;
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.parentId,
      visibility: data
    })
    Android.runInUI(cmd, 0)
  }



  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  getContent = () =>{

    return (

        <LinearLayout
          orientation="vertical"
          margin="2,16,0,16"
          width="match_parent"
          height="wrap_content">

          <LinearLayout
            width="match_parent"
            height="wrap_content"
            stroke={"2,"+window.__Colors.PRIMARY_BLACK_66}
            padding="0,8,8,8"
            margin="4,0,4,4"
            cornerRadius="4,4,4,4">

            <Spinner
              width="match_parent"
              height="24"
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
              margin="0,0,5,6"
              id={this.idSet.languageMapSpinner}
              onItemClick = {this.handleLanguageSpinnerItemClick}
              values={Object.keys(this.languageMap).join(",")} />

          </LinearLayout>

       </LinearLayout>


     );

  }

  handleButtonClick = (selectedLang) =>{
    this.props.buttonClick(selectedLang);
  }

  handleLanguageSpinnerItemClick = (...params) => {
    var keys = Object.keys(this.languageMap);
    var index = parseInt(params[2]);
    var keyValue = keys[index];
    this.selectedLang = this.languageMap[keyValue];
  }

  mapValueToKey = (value) => {
    for (var k in this.languageMap) {
      if (this.languageMap[k] == value)
        return k;
    }
    return null;
  }

  getFooter = () =>{
     return (

        <LinearLayout
          width="match_parent"
          height="wrap_content"
          margin = "0,8,0,0">

          <LinearLayout
          stroke = {"2," + window.__Colors.PRIMARY_DARK}
          width="0"
          margin="0,0,10,0"
          cornerRadius="4"
          weight="1">
            <LinearLayout
            onClick={()=>{this.handleDismissClick()}}
            width="match_parent"
            height="match_parent">

                 <TextView
                   gravity="center"
                   height="48"
                   width="match_parent"
                   style={window.__TextStyle.textStyle.CARD.ACTION.DARK}
                   text={"Cancel"}/>

               </LinearLayout>

         </LinearLayout>

         <LinearLayout
           background = {window.__Colors.PRIMARY_DARK}
           cornerRadius="4"
           margin="10,0,0,0"
           width="0"
           weight="1">

           <LinearLayout
            onClick={()=>{this.handleButtonClick(this.selectedLang)}}
            width="match_parent"
            height="match_parent">

                  <TextView
                   gravity="center"
                   height="48"
                   width="match_parent"
                   style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                   text={"Change"}/>

             </LinearLayout>

         </LinearLayout>

       </LinearLayout>


     );
  }

  getHeader = () => {
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        gravity="center_vertical"
        margin="0,0,0,8">

          <TextView
            width = "wrap_content"
            height = "wrap_content"
            gravity="center_vertical"
            text = {"Select a Language"}
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

          <ViewWidget
            width="0"
            weight="1"
            height="0"/>

          <ImageView
            width="18"
            height="18"
            onClick={this.handleDismissClick}
            gravity="center_vertical"
            imageUrl="ic_action_close"/>

      </LinearLayout>
    )
  }

  getBody = () => {
    return (<LinearLayout
              cornerRadius = "2"
              width = "match_parent"
              height = "wrap_content"
              root="true"
              visibility="visible"
              orientation= "vertical"
              clickable = "true"
              padding="16,18,16,16"
              background="#ffffff">

               {this.getHeader()}

               {this.getContent()}

               {this.getFooter()}


            </LinearLayout>)
  }


  handleDismissClick = () => {
    this.hide();
  }



  afterRender = () => {
    var lang = this.mapValueToKey(window.__CurrentLanguage);
    var keys = Object.keys(this.languageMap);
    JBridge.selectSpinnerItem(this.idSet.languageMapSpinner,keys.indexOf(lang));
  }



  render() {

    this.layout = (
      <LinearLayout
        height = "match_parent"
        width = "match_parent"
        id={this.parentId}
        visibility="gone"
        afterRender={this.afterRender}
        root="true"
        background = { window.__Colors.PRIMARY_BLACK_44}
        orientation="vertical">
          <LinearLayout
            height="0"
            width="match_parent"
            onClick={this.handleDismissClick}
            weight="1"/>

          {this.getBody()}


      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = LanguagePopup;
