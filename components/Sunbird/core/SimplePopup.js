const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var CheckBox = require("@juspay/mystique-backend").androidViews.CheckBox;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var Styles = require("../../../res/Styles");
let IconStyle = Styles.Params.IconStyle;
var _this;

class SimplePopup extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "chooseItemContainer",
      "featureContainer",
      "parentContainer",
      "contentContainer",
      "spinnerContainer",
      "linkShareIntents",
      "fileShareIntents"
    ]);
    this.chosenItem;
    this.selectedList = [];
    _this=this;
    window.__SimplePopup = this;
    console.log("SHARE POPUP CME")
    this.isVisible=false;
  }


  show = () => {
    this.setVisibility("visible");
    this.isVisible=true;
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
      id: this.idSet.parentContainer,
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
          margin="2,30,0,30"
          width="match_parent"
          height="wrap_content">

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.props.data.content}/>

       </LinearLayout>

    
     );

  }


  handleButtonClick = (type) =>{
    this.props.buttonClick(type);
  }


  getFooter = () =>{
     return (

        <LinearLayout
          width="match_parent"
          height="wrap_content">

          <LinearLayout
          stroke = {"2," + window.__Colors.PRIMARY_DARK}
          width="0"
          margin="0,0,10,0"
          cornerRadius="4"
          weight="1">
            <LinearLayout
            onClick={()=>{this.handleButtonClick("negative")}}
            width="match_parent"
            height="match_parent">
            
                 <TextView
                   gravity="center"
                   height="48"
                   width="match_parent"
                   style={window.__TextStyle.textStyle.CARD.ACTION.DARK}
                   text={this.props.data.negButtonText}/>

               </LinearLayout>

         </LinearLayout>

         <LinearLayout
           background = {window.__Colors.PRIMARY_DARK}
           cornerRadius="4"
           margin="10,0,0,0"
           width="0"
           weight="1">

           <LinearLayout
            onClick={()=>{this.handleButtonClick("negative")}}
            width="match_parent"
            height="match_parent">

                  <TextView
                   gravity="center"
                   height="48"
                   width="match_parent"
                   style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
                   text={this.props.data.posButtonText}/>

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
        margin="0,0,0,0">

          <TextView
            width = "wrap_content"
            height = "wrap_content"
            gravity="center_vertical"
            text = {this.props.data.title}
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
  }



  render() {

    this.layout = (
      <LinearLayout 
        height = "match_parent"
        width = "match_parent"
        id={this.idSet.parentContainer}
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

module.exports = SimplePopup;
