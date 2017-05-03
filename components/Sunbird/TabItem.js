var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require("@juspay/mystique-backend").androidViews.Space;


class TabItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "TabItem";
    this.setIds([
      "tab",
      "title",
      "selectline"
    ]);
  }

  unselect = () => {
    var _this = this;
    var cmd;
    cmd += this.set({
      id: _this.idSet.title,
      alpha: "0.3"
    });
    cmd += this.set({
      id: _this.idSet.selectline,
      visibility: "gone"
    });
    return cmd;
  }

  select = () => {
    var _this = this;
    var cmd;
    cmd += this.set({
      id: _this.idSet.title,
      alpha: "1"
    });
    cmd += this.set({
      id: _this.idSet.selectline,
      visibility: "visible"
    });
    return cmd;
  }



  handleClick = () => {
    this.props._onClick(this.props.index);
  }

  afterRender = () => {
    JBridge.setClickFeedback(this.idSet.tab)
  }

  render() {
    this.layout = (
      <LinearLayout 
        weight='1' 
        id={this.idSet.tab}
        afterRender = {this.afterRender}
        onClick={this.handleClick}
        gravity="center"
        height = "49"
        orientation="vertical"
        width="match_parent">
        <TextView 
          id={this.idSet.title}
          text={this.props.item.name}
          color={window.__Colors.PRIMARY_ACCENT} 
          width="match_parent"
          typeface = "bold"
          height = "45"
          fontstyle ="SourceSansPro/Bold"
          alpha={this.props.item.select=="0"?"0.3":"1"}
          gravity="center"
          textSize={window.__Font.fontSize.FONT_16}/>
        <Space  width = "0" weight = "1"/>
        <ViewWidget 
          id={this.idSet.selectline}
          background={window.__Colors.PRIMARY_ACCENT}
          height="3"
          margin = "0,0,0,0"
          visibility={this.props.item.select=="0"?"gone":"visible"}
          width="match_parent"/>
      </LinearLayout>
    )

    return this.layout.render();
  }
}

class Tabs extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "tabs";

    this.setIds([
      "horizontal",
      "TabContainer",
      "TabContainerSingle",
      "title",
      "filter",
      "sort"
    ]);
  }

  hideFilter = () => {
    var cmd;
    cmd += this.set({
      id: this.idSet.filter,
      visibility: "gone"
    });
    Android.runInUI(cmd, null);
  }

  getTabList() {
    console.log("", this.cardList);
    return this.cardList.children;
  }

  showSort = () => {
    var cmd;
    cmd += this.set({
      id: this.idSet.filter,
      visibility: "gone"
    });
    cmd += this.set({
      id: this.idSet.sort,
      visibility: "visible"
    });

    Android.runInUI(cmd, null);
    console.log("Sorting");
  }
  showFilter = () => {
    var cmd;
    cmd += this.set({
      id: this.idSet.filter,
      visibility: "visible"
    });
    cmd += this.set({
      id: this.idSet.sort,
      visibility: "gone"
    });

    Android.runInUI(cmd, null);
    console.log("filter");
  }

  renderTabItems(list) {
    var cards = list.map((item, i) => {
      return (
        <TabItem _onClick={this.props._onClick} index = {i} item = {item}/>
      )
    });

    if (cards.length == 1) {
      this.cardList = (
        <LinearLayout layout_gravity="center_horizontal" orientation="vertical"  width="match_parent"  root="true">
          {cards}
        </LinearLayout>
      )
    } else {
      this.cardList = (
        <LinearLayout width="match_parent" root="true">
          {cards}
        </LinearLayout>
      )
    }
    this.appendChild(this.idSet.TabContainer, this.cardList.render(), 0);
  }

  render() {
    this.layout = (
      <LinearLayout 
        orientation="vertical" 
        width="match_parent"
        height = "50"
        background={window.__Colors.PRIMARY_ACCENT}>
        <LinearLayout
          id={this.idSet.TabContainer}
          width="match_parent"
          orientation="horizontal"/>
        <Space
          width = "0"
          weight = "1"/>
        <ViewWidget
          background={window.__Colors.PRIMARY_ACCENT}
          width="match_parent"
          height="1"
          alpha = "0.3"/>
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = Tabs;
