var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;
var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');

var objectAssign = require('object-assign');

window.R = require("ramda");

class ProfileActivityScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_ACTIVITY_SCREEN"
   
    this.setIds([
    
      ])
    this.data = {
      imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif",
      connectionUrl : "https://image.freepik.com/free-icon/multiple-users-silhouette_318-49546.jpg",
      certifiedUrl : "https://camo.githubusercontent.com/eed0343c9cbfb1b5371e9d113694ad2ebba8a907/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313633393035362f313036333733372f36396662613637342d313265322d313165332d393930642d3463313134353663373462612e706e67",
      headingName: "",
      profileName : "Kiran Puppala",
      cityName : "Bhimavaram, Andhra"
    };
    
  }


  getHead = () => {

   var layout = (
    <LinearLayout
        orientation= "vertical"
        margin = "0,0,0,0"
        width="match_parent"
        height= "wrap_content">

    <LinearLayout
        orientation= "vertical"
        margin = "20,0,0,0"
        width="match_parent"
        height= "wrap_content">
        
        <ImageView
          imageFromUrl = {this.data.imageUrl}
          height = "80"
          width = "80"/>  

        <TextView
          text = {this.data.profileName}
          width = "wrap_content"
          height = "wrap_content"
          style={window.__TextStyle.textStyle.HEADING.DARK}/>
        <TextView
          text = {this.data.cityName}
          width = "wrap_content"
          height = "wrap_content"
          style={window.__TextStyle.textStyle.CARD.HEADING}/>

          </LinearLayout>

          <LinearLayout
          margin = "20,30,0,0"
          orientation = "vertical"
          width="match_parent"
          height="wrap_content">

          <LinearLayout
          margin = "0,10,0,0"
          width="match_parent"
          height="wrap_content"
          >

          <ImageView
          imageFromUrl = {this.data.connectionUrl}
          height = "20"
          width = "20"/>

          <TextView
          text = "340 Connections"
          width = "wrap_content"
          height = "wrap_content"
          margin = "10,0,0,0"
          style = {window.__TextStyle.textStyle.HINT.SEMI}
          />

          </LinearLayout>

          <LinearLayout
          margin = "0,10,0,0"
          width="match_parent"
          height="wrap_content">
          <ImageView
          imageFromUrl = {this.data.certifiedUrl}
          height = "20"
          width = "20"/>

          <TextView
          text = "340 Connections"
          width = "wrap_content"
          height = "wrap_content"
          margin = "10,0,0,0"
          style = {window.__TextStyle.textStyle.HINT.SEMI}
          />

          </LinearLayout>

          </LinearLayout>
          </LinearLayout>
          )

    return layout;
  }



  render() {
    this.layout = (
      <LinearLayout
        root = "true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <SimpleToolbar
          title={this.data.headingName}
          width="match_parent"
          invert="true"/>

            {this.getHead()}
       
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ProfileActivityScreen);
