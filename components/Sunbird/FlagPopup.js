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
var FeatureButton = require("../../components/Sunbird/FeatureButton");
var RadioListItem = require('../Sunbird/RadioListItem');
var Spinner = require("../Sunbird/core/Spinner");
var TextInputView = require('../Sunbird/core/TextInputView');
var Styles = require("../../res/Styles");

let IconStyle = Styles.Params.IconStyle;

class FlagPopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer",
      "parentContainer",
      "contentContainer",
      "spinnerContainer",
      "bodyWithOptionsContainer",
      "bodyWithMessageContainer",
      "bodyContainer"
    ]);
    this.chosenItem;
    this.selectedList = [];
    window.__FlagPopup = this;
    this.comment = "";
  }


  show = () => {
    this.resetPopup()
    this.showBodyWithOptions();
    this.setVisibility("visible");
  }

  hide = () => {
    this.setVisibility("gone");
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.parentContainer,
      visibility: data
    })

    Android.runInUI(cmd, 0)
  }


  showBodyWithOptions = () =>{
    var cmd = this.set({
      id: this.idSet.bodyWithOptionsContainer,
      visibility: "visible"
    })

    Android.runInUI(cmd, 0)
  }

  hideBodyWithOptions = () =>{
    var cmd = this.set({
      id: this.idSet.bodyWithOptionsContainer,
      visibility: "gone"
    })

    Android.runInUI(cmd, 0)
  }

  


  onConfirm = () =>{
    if(JBridge.isNetworkAvailable()){
          if (this.selectedList.length == 0) {
          JBridge.showSnackBar(window.__S.ERROR_FLAG_CONTENT_MIN_REASON)
          return;
        }

        this.hideBodyWithOptions();
        console.log(this.comment,this.selectedList)
        this.props.onConfirm(this.comment,this.selectedList)

    }
    else
      JBridge.showSnackBar(window.__S.NO_INTERNET)

  }

  resetPopup = () => {
    console.log("reset flag popup")
    this.replaceChild(this.idSet.bodyContainer,this.getBody().render(),0)
  }



  getFeatureButton = () => {
    return (<LinearLayout
              width = "match_parent"
              orientation="vertical"
              height="0"
              id={this.idSet.featureContainer}
              padding = "3,3,3,3"
              cornerRadius="5"
              weight="1"
              gravity = "center">
                  <FeatureButton
                    typeface = "bold"
                    clickable="true"
                    width = "match_parent"
                    height = "56"
                    stroke = {"3," + window.__Colors.WHITE}
                    background = {window.__Colors.PRIMARY_ACCENT}
                    text = {window.__S.CONFIRM}
                    buttonClick = {this.onConfirm}
                    textColor = {window.__Colors.WHITE}
                    textSize = "18"/>
            </LinearLayout>)


  }




  handleSpinnerClick = (...params) => {


    console.log("SPINNER CLICKED",params);

  }

   getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }


  getContent = () =>{

    var spinnerArray = "Notations & Symbols,Something,Something";

    return (
      <LinearLayout
      orientation="vertical"
      width="match_parent"
      height="wrap_content">

        <TextView
          margin="0,16,0,0"
          width="match_parent"
          style={window.__TextStyle.textStyle.HINT.BOLD}
          height="wrap_content"
          text={window.__S.SELECT_A_REASON}/>

          {this.getRadioList()}

      <TextView
          margin="0,16,0,0"
          width="match_parent"
          style={window.__TextStyle.textStyle.HINT.BOLD}
          height="wrap_content"
          text={window.__S.ADD_COMMENT}/>

      <EditText
        width = "match_parent"
        height = "wrap_content"
        onChange  = {this.updateComment}
        maxLine = "2"
        singleLine="true"
         />




     </LinearLayout>);

  }

  updateComment = (data) => {
    console.log(data)
    this.comment = data;
  }

  handleRadioButtonClick = (title,checked) =>{
    console.log("TITLE",title);
    console.log("CHECKED RADIO",checked);
    if(checked && this.selectedList.indexOf(title) == -1){
      this.selectedList.push(title)
    }
    else if(checked == "false" && this.selectedList.indexOf(title)!=-1){
      console.log(checked)
      var temp = this.selectedList.splice(this.selectedList.indexOf(title),1)
    }

    console.log("selectedList",this.selectedList)
  }

  getRadioList = () =>{

    this.radioList = ["Inappropriate content","Copyright violation","Piracy violation","Other"];

    var rows = this.radioList.map((item, index) => {
      return(
        <LinearLayout
        margin="0,4,0,0"
        gravity="center_vertical"
        width="wrap_content"
        height="wrap_content">


        <CheckBox
          gravity="center_vertical"
          onCheckChange={(value)=>{this.handleRadioButtonClick(item,value)}}
          checked= {false}
          text={item}/>

        <ImageView
         margin="8,0,0,0"
         width="10"
         height="10"
         gravity="center_vertical"
         imageUrl="ic_info_grey"/>

        </LinearLayout> )

         });

        return (
          <LinearLayout
            width="match_parent"
            height="wrap_content"
            margin="0,12,0,0"
            orientation="vertical">

            {rows}

          </LinearLayout>
          )
  }


  getHeader = () => {
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        gravity="center_vertical"
        margin="0,0,16,0">

          <TextView
           width = "wrap_content"
           height = "wrap_content"
           gravity="center_vertical"
           text = {window.__S.WHAT_WENT_WRONG}
           style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

           <ViewWidget
             width="0"
             weight="1"
             height="0"/>

           <ImageView
             width="14"
             height="14"
             gravity="center_vertical"
             imageUrl="ic_info_grey"/>

      </LinearLayout>
    )
  }





  getBodyWithOptions = () => {
    return (<LinearLayout
              cornerRadius = "2"
              width = "match_parent"
              height = "450"
              root="true"
              id={this.idSet.bodyWithOptionsContainer}
              visibility="visible"
              orientation= "vertical"
              clickable = "true"
              padding="16,18,16,16"
              background="#ffffff">

               {this.getHeader()}

               {this.getContent()}

               <ViewWidget
                 width="match_parent"
                 height="0"
                 weight="1"/>

              {this.getFeatureButton()}

            </LinearLayout>)
  }




  handleDismissClick = () => {
    this.hide();
  }

  getBody = () => {
    return (<LinearLayout
            height="wrap_content"
            width="match_parent"
            root="true"
            orientation="vertical">

            {this.getBodyWithOptions()}

          </LinearLayout>)
  }

  render() {

    this.layout = (
      <LinearLayout
        height = "match_parent"
        width = "match_parent"
        id={this.idSet.parentContainer}
        visibility="gone"
        root="true"
        background = { window.__Colors.PRIMARY_BLACK_44}
        orientation="vertical">

          <LinearLayout
            height="0"
            width="match_parent"
            onClick={this.handleDismissClick}
            weight="1"/>

          <LinearLayout
            height="wrap_content"
            width="match_parent"
            id={this.idSet.bodyContainer}>

            {this.getBody()}



          </LinearLayout>

      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = FlagPopup;
