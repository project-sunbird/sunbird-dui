var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
import RecommendedCard from '../Sunbird/RecommendedCard';

class RecommendedContainer extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      'recommendedContainer'
    ]);
  }
  handleIndexMenu = (index) => {
    this.props.onClick(index);
  }


  afterRender = () => {
    this.indexItems = this.props.Data.content;
    this.tmpArr = [];
    var _this = this;
    for (var i = 0; i < this.indexItems.length; i++) {

      var dat = {
        moduleBackground: (i % 2 == 0 ? "#22007aff" : "#229012FE"),
        moduleName: _this.indexItems[i]["name"],
        moduleImage: _this.indexItems[i]["appIcon"],
        moduleUserCount: "50",
        moduleRating: "100",
        hideRating: this.props.hideRating,
        contentId: _this.indexItems[i]["contentId"],
        content: _this.indexItems[i]
      }
      _this.tmpArr.push(dat)
    }
    var cards = this.tmpArr.map((item, i) => {
      return (
        <RecommendedCard
          item={item}
          index={i}
          onClick={this.handleIndexMenu} />)
    });

    var renderItem = (<LinearLayout
                        height="match_parent"
                        root="true"
                        padding="0,16,16,20"
                        orientation="horizontal"
                        layout_gravity="center_horizontal"
                        width="match_parent">
                          {cards}
                    </LinearLayout>);
    this.replaceChild(this.idSet.recommendedContainer, renderItem.render(), 0);
  }


  render() {


    this.layout = (

      <LinearLayout
      width="match_parent"
      height="wrap_content"
      margin = "0,0,0,0"
      afterRender={this.afterRender}
      orientation="vertical"
      gravity="center"
      >

          <LinearLayout
              width="match_parent"
              height="match_parent"
              margin = "0,0,0,0"
              >

          <TextView
          margin="16,16,16,16"
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
          text={this.props.Data.display.title.en}/>
          <Space
            width="0"
            weight="1"
          />
          <TextView
          margin="16,16,16,16"
          style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
          text="View All"/>


        </LinearLayout>
           <HorizontalScrollView
            width = "match_parent"
            height = "match_parent"
            scrollBarX="false"
            fillViewport="true">
              <LinearLayout
                id={this.idSet.recommendedContainer}
                orientation="vertical"
                height="wrap_content"
                width="match_parent"
                >
              </LinearLayout>
          </HorizontalScrollView>


       </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = RecommendedContainer;
