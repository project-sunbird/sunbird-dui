var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require("@juspay/mystique-backend").androidViews.Space;


class RadioItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "radio_item";
    this.setIds([
      "tab",
      "title",
      "imageSelected",
      "imageUnSelected",
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

  render() {
    this.layout = (
      <LinearLayout
        onClick={this.handleClick}
        height="wrap_content"
        width="match_parent">

        <RelativeLayout>
              <ImageView
                height="14"
                width="14"
                margin="0,2,6,0"
                gravity="center"
                id = {this.idSet.imageSelected}
                imageUrl={this.props.item.icon+"_blue"}
                visibility={this.props.item.select=="1"?"visible":"gone"} />

              <ImageView
                height="14"
                width="14"
                margin="0,2,6,0"
                gravity="center"
                id = {this.idSet.imageUnSelected}
                imageUrl={this.props.item.icon}
                visibility={this.props.item.select=="0"?"visible":"gone"} />
        </RelativeLayout>

        <TextView
          id={this.idSet.title}
          text={this.props.item.name}
          color={this.props.item.select=="1"?window.__Colors.PRIMARY_ACCENT:window.__Colors.DARK_GRAY}
          width="wrap_content"
          typeface = "bold"
          letterSpacing="0.05"
          height = "wrap_content"
          fontstyle ="SourceSansPro/Bold"
          gravity="center"
          margin="0,0,12,0"
          textSize={window.__Font.fontSize.FONT_12}/>



      </LinearLayout>
    )

    return this.layout.render();
  }
}
var _this;

class RadioButton extends View {


  constructor(props, children) {
    super(props, children);
    this.displayName = "radio_button";
    this.setIds([
      "itemContainer"
    ]);

    this.itemList = props.items;
    this.currentIndex = (this.props.defaultIndex === undefined ? -1 : this.props.defaultIndex)
    this.onClickCallback = props.onClick;

    _this = this;
    window.__RadioButton=this;

  }

  handleItemClick =  (index) =>{
    if (_this.currentIndex == index) {
      return;
    }
    _this.currentIndex = index;
    var cmd;
    for (var i = 0; i < this.itemList.length; i++) {
      if (i == index) {
        cmd += this.cardList.children[i].select();
      } else {
        cmd += this.cardList.children[i].unselect();
      }
    }
    Android.runInUI(cmd, 0);

    _this.onClickCallback();
  }

  renderItems = () =>{
    var items = _this.itemList.map((data,i)=>{
      return(

        <RadioItem
        item={data}
        _onClick={this.handleItemClick}
        index = {i} />
      )
    });

    this.cardList =(
      <LinearLayout
      width="wrap_content"
      height="wrap_content">
      {items}
      </LinearLayout>
    );

    this.appendChild(this.idSet.itemContainer, this.cardList.render(), 0);
  }

  render(){
    this.layout = (<LinearLayout
      orientation="horizontal"
      width="match_parent"
      height="wrap_content"
      id={this.idSet.itemContainer}
      afterRender={this.renderItems}
      background={window.__Colors.WHITE}
      onClick = {_this.props.onClick}>
      </LinearLayout>);
    return this.layout.render();

  }
}

module.exports = RadioButton;
