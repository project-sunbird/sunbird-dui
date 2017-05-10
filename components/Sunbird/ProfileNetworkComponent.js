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


window.R = require("ramda");

class ProfileNetworkComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_CERTIFICATION_SCREEN"
    this.data = {

      imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif",

    }
  }


  afterRender = () => {

  }

  getHeadContent = () => {

    var layout = (<LinearLayout
            height="45"
            width="match_parent"
            padding="16,14,16,14"
            background={window.__Colors.LIGHT_BLUE_22}>

                <TextView
                  text={ Object.keys(this.props.data).length + " Requests Pending "} 
                  height="match_parent"
                  gravty="center"
                  style={window.__TextStyle.textStyle.CARD.HEADING}/>            
                <Space
                  width ="0"
                  weight="1"/>

                <TextView
                  text="View All"
                  height="match_parent"
                  gravty="center"
                  style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>  

            </LinearLayout>)
    return layout;
  }

  getData = () => {
    var answerCards = this.props.data.map((item, index) => {
      return <LinearLayout
            width="match_parent"
            height="wrap_content"
            padding="16,16,0,0"
            orientation="vertical"
            >
            
            <LinearLayout
              width="match_parent"
              height="wrap_content"
            >
              <LinearLayout
                width="40"
                height="40"
                cornerRadius="70">

              <ImageView
                height="40"
                width="40"
                cornerRadius="70"
                imageUrl= {item.image} />

                </LinearLayout>
                <LinearLayout
                        height="match_parent"
                        width="0"
                        weight="1"
                        padding="16,0,0,0"
                        orientation="vertical"
                        layout_gravity="center_vertical"
                        >
                          
                          <TextView
                            text={item.name}
                            height="wrap_content"
                            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
                          <Space
                            width="0"
                            weight="1" />
                          <TextView
                            margin="0,3,0,0"
                            text={item.description}
                            height="wrap_content"
                            style={window.__TextStyle.textStyle.HINT.SEMI}/>  

                          <Space
                            width="0"
                            weight="1" />

                  </LinearLayout>

              </LinearLayout>
              <LinearLayout
                    height="1"
                    width="match_parent"
                    margin="0,12,0,0"
                    background={window.__Colors.DARK_GRAY}
                     />
          </LinearLayout>
    })

    return answerCards;
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

          {this.getHeadContent()}

        
      <ScrollView 
        height="0"
        weight="1"
        width="match_parent"
        fillViewPort="true">

        <LinearLayout
                height="match_parent"
                width="match_parent"
                orientation="vertical">
          {this.getData()}
        </LinearLayout>
      </ScrollView>
            

      </LinearLayout>

    );

    return this.layout.render();
  }
}

module.exports = ProfileNetworkComponent;
