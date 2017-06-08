var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var FeedCard = require('../Sunbird/FeedCard');
var _this;
class FeedComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      'feedContainer'
    ]);
  }


  afterRender = () => {

    var cards = this.props.feedData.map((item, i) => {
      return (
        <FeedCard
         feedData={this.props.feedData[i]}
         voteClick = {this.props.voteClick}
         answerClick= {this.props.answerClick}
         bookmarkClick= {this.props.bookmarkClick}
         />
      )
    });
    var layout = (<LinearLayout 
                        height="wrap_content" 
                        orientation="vertical"
                        width="match_parent">
                          {cards}
                    </LinearLayout>);

    this.replaceChild(this.idSet.feedContainer, layout.render(), 0);

  }





  render() {


    this.layout = (

      <LinearLayout
      width="match_parent"
      height="wrap_content"
      afterRender={this.afterRender}
      orientation="vertical"
      background={window.__Colors.PRIMARY_BLACK_11}
      >


        <TextView
        width="match_parent"
        height="wrap_content"
        margin="16,7,0,7"
        text="Feed"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

        <LinearLayout
        orientation="vertical"
        width="match_parent"
        height="wrap_content"
        id={this.idSet.feedContainer}/>
                    
       </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = FeedComponent;
