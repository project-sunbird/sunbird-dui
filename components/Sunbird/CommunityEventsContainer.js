var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var AnnouncementCard = require('../Sunbird/AnnouncementCard');
const CommunityParams = require('../../CommunityParams');
var _this;
class CommunityEventsContainer extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      'eventContainer'
    ]);
  }


  afterRender = () => {

    var cards = CommunityParams.eventParams.map((item, i) => {
      return (
        <AnnouncementCard
         params={item}
         />
      )
    });
    var layout = (<LinearLayout
                        height="wrap_content"
                        orientation="vertical"
                        width="match_parent">
                          {cards}
                    </LinearLayout>);

    this.replaceChild(this.idSet.eventContainer, layout.render(), 0);

  }


  render() {


    this.layout = (

      <LinearLayout
      width="match_parent"
      height="wrap_content"
      margin = "0,0,0,0"
      afterRender={this.afterRender}
      orientation="vertical"
      >

        <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="wrap_content"
        id={this.idSet.eventContainer}/>

       </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = CommunityEventsContainer;
