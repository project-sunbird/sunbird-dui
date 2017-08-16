var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var RatingBar = require("@juspay/mystique-backend").androidViews.RatingBar;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;

var _this;
class ProfileCreations extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this=this;
    this.completed = 0.65;
    this.followingPpl = "180";
    this.followedBy = "60";
    this.followingGrp = "05";
    this.isEditable = this.props.editable;

  }


  getHeader = () => {
    this.completedPercentage = this.completed * 100 + "%";
    return (
        <LinearLayout
          margin="0,0,0,16"
          orientation="vertical"
          width="match_parent"
          height="wrap_content">

          <LinearLayout
            orientation = "horizontal"
            width = "match_parent"
            height = "wrap_content">

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={"Your profile is "+this.completedPercentage+" complete"}
            style={window.__TextStyle.textStyle.HINT.REGULAR}/>

            <ViewWidget
            height="0"
            weight="1"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text="Edit Profile"
            style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

          </LinearLayout>
          <LinearLayout
            width = "match_parent"
            height = "10"
            margin = "0, 10, 0, 0"
            cornerRadius = "2"
            orientation = "horizontal">
            <LinearLayout
              multiCorners = {"10,0,0,10," + window.__Colors.PRIMARY_ACCENT}
              width = "0"
              height = "match_parent"
              weight = "1"/>
            <LinearLayout
              alpha="0.3"
              multiCorners = {"0,10,10,0," + window.__Colors.PRIMARY_BLACK}
              width = "0"
              height = "match_parent"
              weight = "1"/>
          </LinearLayout>
        </LinearLayout>
      )
  }

  getHorizontalSpace() {
    return (<LinearLayout
            width="1"
            height="match_parent"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getFollowBtn = () => {
    return (
      <LinearLayout
        width = "wrap_content"
        height = "wrap_content"
        cornerRadius = "3"
        orientation = "horizontal"
        gravity = "center"
        margin = "0, 0, 0, 10"
        padding = "10, 3, 10, 3"
        stroke ={ "2," + window.__Colors.PRIMARY_ACCENT}>
        <ImageView
          imageFromUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR1X3cm5xzR4D1W9oPb2QWioKlrfLVd0DvXFUNqSjZfg-M0bpc"
          height = "10"
          width = "10" />
        <ViewWidget
          width = "10" />
        <TextView
          text = "Follow"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.BLUE_R} />
      </LinearLayout>
    )
  }

  getFollowing = () => {
    return (
      <LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "horizontal"
        gravity = "center">

        <LinearLayout
          width = "0"
          weight = "1"
          height = "wrap_content"
          orientation = "vertical"
          gravity = "center">

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.followingPpl}
          style={window.__TextStyle.textStyle.CARD.TITLE.BIG_BLUE}/>

          <TextView
          width="wrap_content"
          height="wrap_content"
          text="People you follow"
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>

        </LinearLayout>

        {this.getHorizontalSpace()}

        <LinearLayout
          width = "0"
          weight = "1"
          height = "wrap_content"
          orientation = "vertical"
          gravity = "center">

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.followingGrp}
          style={window.__TextStyle.textStyle.CARD.TITLE.BIG_BLUE}/>

          <TextView
          width="wrap_content"
          height="wrap_content"
          text="Groups you follow"
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>

        </LinearLayout>

        {this.getHorizontalSpace()}

        <LinearLayout
          width = "0"
          weight = "1"
          height = "wrap_content"
          orientation = "vertical"
          gravity = "center">

          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.followedBy}
          style={window.__TextStyle.textStyle.CARD.TITLE.BIG_BLUE}/>

          <TextView
          width="wrap_content"
          height="wrap_content"
          text="People follow you"
          style={window.__TextStyle.textStyle.HINT.REGULAR}/>

        </LinearLayout>

      </LinearLayout>
    )
  }

  render() {
    this.layout= (
              <LinearLayout
                margin="0,24,0,0"
                width = "match_parent"
                height = "wrap_content"
                orientation="vertical">

                <LinearLayout
                  orientation = "vertical"
                  width = "match_parent"
                  height = "match_parent"
                  visibility = {(this.isEditable == "true") ? "visible" : "gone"}>
                    {this.getHeader()}
                </LinearLayout>

                <LinearLayout
                  orientation = "vertical"
                  width = "match_parent"
                  height = "match_parent"
                  gravity = "center"
                  visibility = {(this.isEditable != "true") ? "visible" : "gone"}>
                    {this.getFollowBtn()}
                </LinearLayout>

                <LinearLayout
                  orientation = "horizontal"
                  width = "match_parent"
                  height = "match_parent"
                  gravity = "center">
                    {this.getFollowing()}
                </LinearLayout>
              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileCreations;
