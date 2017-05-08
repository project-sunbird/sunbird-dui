var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require("@juspay/mystique-backend").androidViews.Space;


class TabHeadItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "tab_head_item";
    this.setIds([
      "tab",
      "bottomSelector",
      "title",
    ]);
  }

  unselect = () => {
    var _this = this;
    var cmd;
    cmd += this.set({
      id: _this.idSet.title,
      color: window.__Colors.DARK_GRAY
    });
    cmd += this.set({
      id: _this.idSet.bottomSelector,
      visibility: window.__Colors.DARK_GRAY
    });
    return cmd;
  }

  select = () => {
    var _this = this;
    var cmd;
    cmd += this.set({
      id: _this.idSet.title,
      color: window.__Colors.PRIMARY_ACCENT
    });
    cmd += this.set({
      id: _this.idSet.bottomSelector,
      visibility: window.__Colors.PRIMARY_ACCENT
    });
    return cmd;
  }



  handleClick = () => {
    if (this.props.item.select == "1") {
      this.props.item.select = "0";
    } else {
      this.props.item.select = "1";
    }
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
          margin="0,2,0,0"
          id={this.idSet.title}
          text={this.props.item.name}
          color={this.props.item.select=="1"?window.__Colors.PRIMARY_ACCENT:window.__Colors.DARK_GRAY} 
          width="match_parent"
          typeface = "bold"
          height = "wrap_content"
          fontstyle ="SourceSansPro/Bold"
          gravity="center"
          textSize={window.__Font.fontSize.FONT_12}/>

        <ViewWidget
          height="2"
          id=-{this.idSet.bottomSelector}
          width="match_parent"
          background={this.props.item.select=="1"?window.__Colors.PRIMARY_ACCENT:window.__Colors.DARK_GRAY}/> 
            
        
      </LinearLayout>
    )

    return this.layout.render();
  }
}

class TabHead extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "bottom_nav_bar";

    this.setIds([
      "horizontal",
      "TabContainer",
      "TabContainerSingle",
      "title",

    ]);

    this.bottomNavItemList = this.props.tabItems

  }



  handleNavigationChange = (index) => {
    var cmd;
    for (var i = 0; i < this.bottomNavItemList.length; i++) {
      if (i == index) {
        cmd += this.cardList.children[i].select();
      } else {
        cmd += this.cardList.children[i].unselect();
      }
    }
    Android.runInUI(cmd, 0);

    this.props._onClick(index);
  }



  renderBottonNavBarItems = () => {
    var cards = this.bottomNavItemList.map((item, i) => {
      return (
        <TabHeadItem _onClick={this.handleNavigationChange} index = {i} item = {item}/>
      )
    });

    if (cards.length == 1) {
      this.cardList = (
        <LinearLayout 
          layout_gravity="center_horizontal" 
          orientation="vertical" 
          width="match_parent"  
          root="true">
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
        height = "56"
        afterRender={this.renderBottonNavBarItems}
        background={window.__Colors.WHITE}>
        <LinearLayout
          id={this.idSet.TabContainer}
          width="match_parent"
          orientation="horizontal"/>
        
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = TabHead;
