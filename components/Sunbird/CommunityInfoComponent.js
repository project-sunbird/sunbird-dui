var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var CommunityDescription = require('./CommunityDescription');
var CommunityDefault = require('./CommunityDefault');

var SearchToolbar = require('../Sunbird/SearchToolbar');
var _this;
class CommunityInfoComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      'defaultContainer',
      'descContainer',
      'arrow'
    ]);


      this.typeCount = 2;

    this.menuData = {
      url: [
        { imageUrl: "ic_action_plus" },
        { imageUrl: "ic_action_search" },
        { imageUrl: "ic_action_overflow"}
      ]
    }
  }


  afterRender = () => {
  }


  getLogo(){
        return (<RelativeLayout
                width="70"
                gravity="center"
                height="wrap_content">

                <LinearLayout
                  width="70"
                  height="70"
                  gravity="center"
                  background={window.__Colors.PRIMARY_BLACK_22}>

                      <ImageView
                      gravity="center"
                      width="42"
                      height="32"
                      imageUrl="ic_action_group"/>

                  </LinearLayout>

                <LinearLayout
                  width="70"
                  height="wrap_content"
                  margin="0,62,0,0"
                  gravity="center">

                    <TextView
                    width="wrap_content"
                    height="wrap_content"
                    padding="5,2,5,2"
                    cornerRadius="3"
                    gravity="center"
                    background={window.__Colors.PRIMARY_BLACK_66}
                    text="OPEN"
                    style={window.__TextStyle.textStyle.SYMBOL.STATUSBAR.LABEL}/>

                  </LinearLayout>

                </RelativeLayout>)
  }

  getGroupInfo(){
    return (<LinearLayout
            width="200"
            height="wrap_content"
            orientation="vertical"
            margin="10,0,0,0"
            >
                <TextView
                width="wrap_content"
                height="wrap_content"
                text={this.props.name}
                margin="0,0,0,8"
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                <TextView
                width="wrap_content"
                height="wrap_content"
                text="(250 members)"
                style={window.__TextStyle.textStyle.HINT.REGULAR}/>


            </LinearLayout>)

  }

  getGroupActions(){
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              orientation="vertical"
              gravity="center_horizontal"
              >
                  <ImageView
                  width="25"
                  height="25"
                  margin="0,0,0,33"
                  padding="5,5,5,5"
                  id={this.idSet.arrow}
                  onClick={()=>{
                    (this.typeCount %2 ==0 )?  this.handleDownClick("descr"):  this.handleDownClick("norm")
                    this.typeCount++;
                  }}
                  imageUrl="ic_action_arrow_down"/>

                  <TextView
                  width="wrap_content"
                  height="wrap_content"
                  text="JOIN"
                  style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>
              </LinearLayout>
            )
  }


  getHeader(){
      return (<LinearLayout
                height="match_parent"
                width="match_parent"
                padding="0,0,0,1"
                background={window.__Colors.PRIMARY_BLACK_22}
                orientation="vertical">

                    <LinearLayout
                      width="wrap_content"
                      height="wrap_content"
                      padding="16,16,16,16"
                      background={window.__Colors.WHITE}
                      orientation="horizontal">

                            {this.getLogo()}

                        <LinearLayout
                          width="wrap_content"
                          height="wrap_content"
                          orientation="horizontal">

                            {this.getGroupInfo()}

                            <ViewWidget
                             weight="1"
                             height="0"/>

                             {this.getGroupActions()}
                        </LinearLayout>
                    </LinearLayout>
          </LinearLayout>)
  }

  handleDownClick = (type) =>{
      var cmd = "";
      if(type == "descr"){
       cmd = this.set({
                id: this.idSet.defaultContainer,
                focusOut:"true",
                visibility: "gone"
                });
            cmd += this.set({
              id: this.idSet.descContainer,
              visibility: "visible"
            })
            cmd += this.set({
              id: this.idSet.arrow,
              imageUrl: "ic_action_arrow_up"
            })
      }
      else{
        cmd = this.set({
                  id: this.idSet.defaultContainer,
                  focusOut:"true",
                  visibility: "visible"
                  });
            cmd += this.set({
              id: this.idSet.descContainer,
              visibility: "gone"
            })
            cmd += this.set({
              id: this.idSet.arrow,
              imageUrl: "ic_action_arrow_down"
            })
      }

      Android.runInUI(cmd,null);
  }

  handleMenuClick = (url) =>{
    console.log("url clicked",url);
  }

  handleBackPress=()=>{
    this.props.onBackPress();    
  }

  handleSearch=(data)=>{
    console.log("searched",data);
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE_F7}
        height="match_parent">

          <SearchToolbar
            hint="Enter your search"
            invert="true"
            title={this.props.name}
            onBackPress={this.handleBackPress}
            onMenuItemClick={this.handleMenuClick}
            menuData={this.menuData}
            onSearch={this.handleSearch}/>


            <ScrollView
              height="0"
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical">

                  {this.getHeader()}

                  <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  orientation="vertical"
                  gravity="center"
                  visibility="visible"
                  id={this.idSet.defaultContainer}>

                  <CommunityDefault/>

                  </LinearLayout>

                  <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  visibility="gone"
                  id={this.idSet.descContainer}
                  orientation="vertical">

                  <CommunityDescription type="join"/>

                  </LinearLayout>

                </LinearLayout>
           </ScrollView>
      </LinearLayout>

    )

    return this.layout.render();
  }
}



module.exports = CommunityInfoComponent;
