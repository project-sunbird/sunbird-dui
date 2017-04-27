var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;

var objectAssign = require('object-assign');

window.R = require("ramda");

var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var CropParagraph = require('../../components/Sunbird/CropParagraph');

class CourseActivityScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "parentContainer",
      "pageOption",
    ]);
    this.state = state;
    this.screenName = "COURSE_ACTIVITY_SCREEN"

    this.data = {
      type: "ASSIGNMENT",
      question: "Which type of progression is the following sequence? 3, 5, 8, 12, 17, …",
      answers: [{ key: "Arithemetic" },
        { key: "Geometric" },
        { key: "None of these" }
      ]
    };

  }

  afterRender = () => {

  }

  handleItemSelect = (data) => {
    console.log("CLICKED :", data);
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <SimpleToolbar
          title={this.data.type}
          width="match_parent"/>
        
            <ScrollView 
              height="0"
              weight="1"
              width="match_parent"
              
              fillViewPort="true">
              <LinearLayout
                height="match_parent"
                
                width="match_parent"
                padding="16,24,16,16"
                orientation="vertical">

                

                  
                </LinearLayout>
                  

             </ScrollView>   

            
        
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(CourseActivityScreen);
