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

window.R = require("ramda");

class ProfileCertificationComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_CERTIFICATION_SCREEN"
    this.data = {
      name: "Chemistry",
      progressValue: "40",
      totalValue: "100",
      imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif",
      image2: "http://images.cdn1.stockunlimited.net/clipart/bookmark-icon_1910015.jpg",
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
    var layout = (<LinearLayout
            width="match_parent"
            height="wrap_content"
            padding="16,16,16,0"
            elevation="6"
            >

            <ImageView
              height="72"
              width="72"
              imageFromUrl= {this.data.imageUrl} />

                  <LinearLayout
                    height="match_parent"
                    width="0"
                    weight="1"
                    padding="16,16,16,16"
                    orientation="vertical">
                      
                      <TextView
                        text={this.data.name}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.HINT.BOLD}/>

                      <TextView
                        text={"Progress " + this.data.progressValue + " / " + this.data.totalValue}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.HINT.SEMI}/>  

                      <Space
                        width="0"
                        weight="1" />

                      <HorizontalProgressBar 
                        currentProgress={this.data.progressValue}
                        totalProgress = {this.data.totalValue}
                        width="match_parent"
                        height="wrap_content"/>  

                  </LinearLayout>

                 <LinearLayout

                    height="match_parent"
                    width="wrap_content"
                    padding="16,16,16,0"
                    orientation="vertical">


                    <ImageView
                      height="30"
                      width="30"
                      imageFromUrl= {this.data.image2} />

                    <TextView
                        text={"LEVEL "+ this.data.level}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.HINT.BLUE}/>

                  </LinearLayout>

          </LinearLayout>)

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
