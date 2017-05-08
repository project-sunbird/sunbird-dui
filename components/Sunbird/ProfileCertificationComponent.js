var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var objectAssign = require('object-assign');
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var HorizontalProgressBar = require("../Sunbird/HorizontalProgressBar");
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
window.R = require("ramda");
var Space = require("@juspay/mystique-backend").androidViews.Space;
class ProfileCertificationComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_CERTIFICATION_SCREEN"
    this.data = {
      name: "Chemistry",
      progressValue: "40",
      totalValue: "100",
      imageUrl: "ic_account",
      image2: "ic_action_bookmark",
      level: "2"
    }
  }


  afterRender = () => {

  }

  getHeadContent = () => {

    var layout = (<LinearLayout
            height="45"
            width="match_parent"
            padding="16,0,16,0"
            background={window.__Colors.LIGHT_BLUE_22}>

                <TextView
                  text="Ongoing "
                  height="match_parent"
                  gravity="center"
                  style={window.__TextStyle.textStyle.CARD.HEADING}/>            
                <Space
                  width ="0"
                  weight="1"/>

                <TextView
                  text="View All"
                  height="match_parent"
                  gravity="center"
                  style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>  

            </LinearLayout>)
    return layout;
  }

  getData = () => {
    var layout = (
 <LinearLayout
            width="match_parent"
            height="wrap_content"
            background= {window.__Colors.PRIMARY_BLACK_22}
            cornerRadius="4"
            margin="10,10,10,0">
      <LinearLayout
            width="match_parent"
            height="wrap_content"
            background= "#ffffff"
            margin="2,0,2,2">

            <LinearLayout
              height="72"
              width="72"
              gravity="center"
              background= {window.__Colors.DARK_VIOLET_10}>

                    <ImageView
                      height="44"
                      width="41"
                      imageUrl= {this.data.imageUrl} />

            </LinearLayout>

                  <LinearLayout
                    height="match_parent"
                    width="0"
                    weight="1"
                    margin="16,16,16,14"
                    orientation="vertical">
                      
                      <TextView
                        text={this.data.name}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.CARD.HEADING}/>

                      <TextView
                        text={"Progress " + this.data.progressValue + " / " + this.data.totalValue}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.HINT.REGULAR}/>  

                      <Space
                        width="0"
                        weight="1" />

                      <HorizontalProgressBar 
                        currentProgress={this.data.progressValue}
                        totalProgress = {this.data.totalValue}
                        width="match_parent"
                        padding="12,12,0,0"
                        height="wrap_content"/>  

                  </LinearLayout>

          <LinearLayout
              height="72"
              width="72"
              gravity="center_horizontal"
              orientation="vertical"
              background= {window.__Colors.PRIMARY_LIGHT}>

              <LinearLayout
              width = "wrap_content"
              height = "wrap_content"
              orientation="vertical"
              >

                    <ImageView
                      height="22"
                      width="16"
                      margin = "35,0,0,0"
                      imageUrl= {this.data.image2} />

          </LinearLayout>

          <LinearLayout
              width = "wrap_content"
              height = "wrap_content"
              orientation="vertical"
              >
                      <TextView
                      text = "LEVEL 2"
                      margin = "0,23,0,0"
                      style={window.__TextStyle.textStyle.HINT.BLUE}/>

          </LinearLayout>
          </LinearLayout>

          </LinearLayout>
          </LinearLayout>


          )

    return layout;
  }

  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

          {this.getHeadContent()}

          {this.getData()}

      </LinearLayout>

    );

    return this.layout.render();
  }
}

module.exports = ProfileCertificationComponent;
