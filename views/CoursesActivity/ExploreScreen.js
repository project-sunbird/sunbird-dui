var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var objectAssign = require('object-assign');
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
window.R = require("ramda");

var VideoCard = require('../../components/Sunbird/VideoCard');

var RecommendedContainer = require('../../components/Sunbird/RecommendedContainer');

var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var Space = require('@juspay/mystique-backend').androidViews.Space;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;

class ExploreScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "EXPLORE_SCREEN"

    this.menuData = {
      url: [
        { title: "hello" }
      ]
    }

    this.recommendedData = {
        title: "New",
        data: [
      {
        name: "Organic Chemistry for Standard VII",
        imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
        count: 55,
        rating: 5
      },
      {
        name: "Molecular Reactions for Beginners",
        imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
        count: 25,
        rating: 5
      },
      {
        name: "Intermediate Metallurgy",
        imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
        count: 65,
        rating: 5
      },
      {
        name: "Organic Chemistry for Standard VII",
        imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
        count: 55,
        rating: 5
      },
      {
        name: "Molecular Reactions for Beginners",
        imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
        count: 25,
        rating: 5
      },
      {
        name: "Intermediate Metallurgy",
        imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
        count: 65,
        rating: 5
      } 
    ]
  }
  this.recommendedData1 = {
        title: "Popular",
        data: [
      {
        name: "Organic Chemistry for Standard VII",
        imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
        count: 55,
        rating: 5
      },
      {
        name: "Molecular Reactions for Beginners",
        imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
        count: 25,
        rating: 5
      },
      {
        name: "Intermediate Metallurgy",
        imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
        count: 65,
        rating: 5
      },
      {
        name: "Organic Chemistry for Standard VII",
        imageUrl: "http://sr.photos3.fotosearch.com/bthumb/RBL/RBL007/b00663.jpg",
        count: 55,
        rating: 5
      },
      {
        name: "Molecular Reactions for Beginners",
        imageUrl: "http://photos.gograph.com/thumbs/CSP/CSP446/k17526632.jpg",
        count: 25,
        rating: 5
      },
      {
        name: "Intermediate Metallurgy",
        imageUrl: "http://sr.photos2.fotosearch.com/bthumb/AGE/AGE063/b20-1458802.jpg",
        count: 65,
        rating: 5
      } 
    ]
  }


  this.dummyData = [{
      moduleData: "Assignments",
      imageUrls: "ic_assignment_module"
    }]

  }

  handleBackPress = () => {
    console.log("BACK PRESS TO Course Home");
    window.__changePureScriptFlow();
    window.__runDuiCallback({ action: "showMainFlow" });
  }

  

  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  
  afterRender = () => {

  }
  getVideosContentHead = () => {
    return (<LinearLayout
       width = "match_parent"
       height = "wrap_content"
       >

       <TextView
        text = "Top Pickup"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        margin = "0,0,0,0"
        />

        <ViewWidget
        height = "1"
        width = "0"
        weight = "1"/>

       </LinearLayout>)
  }

  getVideosContent = () => {

    var cards = this.dummyData.map((item) => {
      return (<VideoCard
                height="wrap_content"
                item={item}
                width="match_parent"/>)
    })


    return (<LinearLayout
        height="match_parent"
        orientation="vertical"
        padding="16,0,16,0"
        width="match_parent">

        {
          this.getVideosContentHead()
        }

        {
          cards
        }

        </LinearLayout>)
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
            title="Explore"
            width="match_parent"
            showMenu="true"
            invert="true"
            onBackPress={this.handleBackPress}
            menuData={this.menuData}
            onMenuItemClick={this.handleMenuClick}
            />
        <ScrollView
          height="match_parent"
          width="match_parent"
          fillViewPort="true">
           <LinearLayout
              height="match_parent"
              width="match_parent"
              orientation="vertical">

                <RecommendedContainer
                recommendedData = {this.recommendedData}
                   />

                {
                    this.getVideosContent()
                }

                <RecommendedContainer
                recommendedData = {this.recommendedData1}
                   />
              </LinearLayout>
          </ScrollView>


      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ExploreScreen);
