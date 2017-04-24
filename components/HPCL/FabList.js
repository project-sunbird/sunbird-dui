const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var FrameLayout = require("@juspay/mystique-backend").androidViews.FrameLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
 
const Styles = require("../../res/Styles"); 
const TextStyle = require("../../res/TextStyle"); 

// TODO
// Icons
class FabListItem extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "FabListItem";

    this.setIds([
      'image'
    ])
  }
  
  handleClick = () => {
    this.props.onClick(this.props.index);
  }
   
  render() {
    this.layout = (
      <LinearLayout 
        onClick={this.handleClick}
        gravity="right"
        root="true" 
        margin="0,0,0,10"
        width="match_parent"
        >
         
        <TextView margin="0,10,10,0"
          cornerRadius="3"
          style={TextStyle.textStyle.detailsDescription} 
          padding="10,5,10,5"
          background="#E9E9E9"
          text={this.props.item.title}/>

        <ImageView 
          id={this.idSet.image}
          padding="12,12,12,12"
          imageUrl={this.props.item.icon}
          width="48"
          height="48"/>


      </LinearLayout>
    )

    return this.layout.render();
  }
}

class FabList extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "FabList";

    this.setIds([
      'fabList',
      'fabIcon',
      'background'
    ]);
  }

  renderItems() {
    return this.props.items.map((item, index)=>{
      return (
        <FabListItem
          index = {index}
          onClick={this.toggleFabList.bind(index)}
          item = {item}/>
      )
    });
  }
  
  toggleFabList = (index) => {
    let cmd = "";
    let icon = this.fabListVisible ? "ic_fab" : "ic_mobile_verified";
    let visibility = this.fabListVisible ? "gone" : "visible";

    cmd += this.set({
      id: this.idSet.fabList,
      visibility: visibility,
    })
     
    cmd += this.set({
      id: this.idSet.background,
      visibility: visibility,
    })
     
    cmd += this.set({
      id: this.idSet.fabIcon,
      imageUrl: icon,
    })

    Android.runInUI(
      cmd,
      null
    );

    this.fabListVisible = !this.fabListVisible;

    if (typeof index !== "undefined")
    this.props.onSelect(index);
  }
   
  render() {
    this.layout = (
      <RelativeLayout 
        height="match_parent"
        orientation="vertical"
        root="true" 
        width="match_parent" >
        
        <LinearLayout  
          onClick={this.toggleFabList}
          visibility="gone"
          id = {this.idSet.background}
          background="#ffffff"
          alpha="0.8"
          width="match_parent"
          height="match_parent" />
           
        <LinearLayout
          orientation="vertical"
          width="match_parent"
          gravity="right"
          alignParentBottom= "true,-1" >
           
          <LinearLayout 
            padding="0,0,8,0"
            id={this.idSet.fabList}
            visibility="gone"
            width="match_parent"
            orientation="vertical">
             
            {this.renderItems()}
             
          </LinearLayout>
           
          <ImageView
            margin="0,0,20,20"
            allowMultipleClicks="true"
            id={this.idSet.fabIcon}
            onClick={this.toggleFabList}
            width="60"
            height="60"
            imageUrl="ic_fab" />
             
        </LinearLayout>
         
       </RelativeLayout>
    )
     
    return this.layout.render();
  }
}

module.exports = FabList;
