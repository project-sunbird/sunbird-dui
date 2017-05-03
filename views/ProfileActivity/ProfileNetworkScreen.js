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

class ProfileNetworkScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_CERTIFICATION_SCREEN"
    this.data={

      imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/a6/88/32/a68832c79725180370fa5e147b19b8c5.gif",
      
    }
  }
  

  afterRender = () => {

  }

  getHeadContent = () =>{

    var layout = (<LinearLayout
            height="45"
            width="match_parent"
            padding="12,12,12,12"
            background={window.__Colors.LIGHT_BLUE_22}>

                <TextView
                  text="14 Requests Pending "
                  height="wrap_content"
                  style={window.__TextStyle.textStyle.HINT.DARK}/>            
                <Space
                  width ="0"
                  weight="1"/>

                <TextView
                  text="View All"
                  height="wrap_content"
                  style={window.__TextStyle.textStyle.HINT.BLUE}/>  

            </LinearLayout>)
    return layout;
  }

  getData = (name,description) => {
    var layout = (<LinearLayout
            width="match_parent"
            height="wrap_content"
            padding="12,12,12,12"

            >
            <LinearLayout
              width="70"
              height="70"
              cornerRadius="70">

            <ImageView
              height="70"
              width="70"
              cornerRadius="70"
              imageUrl= {"ic_account"} />

              </LinearLayout>
            <LinearLayout
                    height="match_parent"
                    width="0"
                    weight="1"
                    padding="12,12,12,12"
                    orientation="vertical">
                      
                      <TextView
                        text={name}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>
                      <Space
                        width="0"
                        weight="1" />
                      <TextView
                        text={description}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.HINT.SEMI}/>  

                      <Space
                        width="0"
                        weight="1" />

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

          {this.getData("Samit Kumar Ganguli","National School for Children, Pune")}

          


          
            

      </LinearLayout>
          
    );

    return this.layout.render();
  }
}

module.exports = Connector(ProfileNetworkScreen);
