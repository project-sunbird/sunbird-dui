var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var Styles = require("../../res/Styles"); 
var TextStyle = require("../../res/TextStyle"); 

class RadioListItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "RadioListItem";

    this.setIds([
      'image'
    ]);
  }
  
  handleClick = () => {
    this.props.onClick(this.props.index);
  }

  afterRender = () => {
    console.log(this.props.item);
    if(this.props.item.check) {
      this.check();
    }
  }
  
  check = () =>  {
    let cmd = "";

    cmd += this.set({
      id: this.idSet.image,
      imageUrl: "ic_checked"
    });

    Android.runInUI(
      cmd, 
      null
    );
  }
   
  uncheck = () => {
    let cmd = "";

    cmd += this.set({
      id: this.idSet.image,
      imageUrl: "ic_unchecked"
    });
     
    Android.runInUI(
      cmd, 
      null
    );
  }

  render() {
    this.layout = (
      <LinearLayout
         afterRender={this.afterRender}
        gravity="center_vertical"
        root="true" 
        margin="0,0,0,10"
        width="wrap_content"
        background="#00000" >

        <ImageView 
          id={this.idSet.image}
          onClick={this.handleClick}
          padding="0,12,12,12"
          imageUrl="ic_unchecked"
          margin="0,0,10,0"
          width="48"
          height="48"/>

        <TextView style={TextStyle.textStyle.bigBody} text={this.props.item.title}/>

      </LinearLayout>
    )

    return this.layout.render();
  }
}

class DoubleRadioList extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "DoubleRadioList";
  }

  handleClick = (index) => {
    let RadioListItems = this.find("RadioListItem");
    
    RadioListItems.map((item, i)=> {
      if (index == i) {
        item.check();
      } else {
        item.uncheck();
      }
    });

    // this.props.onSelect(index);
  }



renderItems() {
      var lengthOfMenu = Object.keys(this.props.items).length;
      this.totalItems = this.props.items.splice(0,lengthOfMenu/2)
      this.rightItems = this.props.items.splice(0,lengthOfMenu/2);
      this.leftItems = this.totalItems.splice(0,lengthOfMenu/2);

      var leftBar = "";
      var rightBar = "";
      leftBar = this.leftItems.map((item, index) => {
        return this.setMenu(item,index);
      });

      rightBar = this.rightItems.map((item, index) => {
        return this.setMenu(item,index+(lengthOfMenu/2));
      });
      this.totalBar = (
          <LinearLayout
          orientation = "horizontal"
          width = "wrap_content"
          height = "wrap_content">
          <LinearLayout
          orientation = "vertical"
          width = "wrap_content"
          height = "wrap_content">
          {leftBar}
          </LinearLayout>

          <LinearLayout
          orientation = "vertical"
          width = "wrap_content"
          height = "wrap_content"
          margin = "86,0,0,0">
          {rightBar}
          </LinearLayout>
          </LinearLayout>
        )

    return this.totalBar;
  }


  setMenu = (item,index) => {
    return  <RadioListItem
          index = {index}
          onClick={this.handleClick}
          item = {item}/>
  }

  render() {
    this.layout = (
      <LinearLayout 
        orientation="vertical"
        root="true" 
        width="wrap_content" >
           
        {this.renderItems()}
       </LinearLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = DoubleRadioList;