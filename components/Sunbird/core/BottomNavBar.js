var dom = require("@juspay/mystique-backend/src/doms/android");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var Space = require("@juspay/mystique-backend/src/android_views/Space");


class BottomNavBarItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "bottom_nav_bar_item";
    this.setIds([
      "tab",
      "imageSelected",
      "imageUnSelected",
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
      id: _this.idSet.imageSelected,
      visibility: "gone"
    });
    cmd += this.set({
      id: _this.idSet.imageUnSelected,
      visibility: "visible"
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
      id: _this.idSet.imageSelected,
      visibility: "visible"
    });
    cmd += this.set({
      id: _this.idSet.imageUnSelected,
      visibility: "gone"
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

        <ImageView
          height="18"
          width="18"
          id = {this.idSet.imageSelected} 
          margin="0,0,0,4"
          imageUrl={this.props.item.icon +"_blue"}
          visibility={this.props.item.select=="1"?"visible":"gone"} />

        <ImageView
          height="18"
          width="18"
          id = {this.idSet.imageUnSelected} 
          imageUrl={this.props.item.icon}
          visibility={this.props.item.select=="0"?"visible":"gone"} />  
          
        <TextView 
          margin="0,2,0,0"
          id={this.idSet.title}
          text={this.props.item.name}
          color={this.props.item.select=="1"?window.__Colors.PRIMARY_ACCENT:window.__Colors.DARK_GRAY} 
          width="match_parent"
          typeface = "bold"
          letterSpacing="0.05"
          height = "wrap_content"
          fontstyle ="SourceSansPro/Bold"
          gravity="center"
          textSize={window.__Font.fontSize.FONT_10}/>
        
      </LinearLayout>
    )

    return this.layout.render();
  }
}

class BottomNavBar extends View {
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
    this.currentIndex = (this.props.defaultIndex === undefined ? 0 : this.props.defaultIndex)
    window.__BottomNavBar = this;
  }



  handleNavigationChange = (index) => {
    console.log("\t\t\tB NAV TO INDEX -> ", index)
    if (this.currentIndex == index) {
      return;
    }
    this.currentIndex = index;
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
        <BottomNavBarItem 
          _onClick={this.handleNavigationChange} 
          index = {i} 
          item = {item}/>
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
        <LinearLayout 
          width="match_parent" 
          root="true">
          
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

module.exports = BottomNavBar;
