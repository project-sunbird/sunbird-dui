

var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var _this;
class ProfileAdditionalInfo extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "holder"
    ]);
    _this = this;

    this.data = this.props.data;
    console.log("this.data", this.data);

    this.languages = "";
    this.data.language.map((item, i) => {
      var append = ",";
      if (i == this.data.language.length - 1) append = "";
      this.languages += item + append;
    })
    this.info = [{
      name: "LANGUAGES",
      value : this.languages
    },
    {
      name: "EMAIL",
      value : this.data.email
    },
    {
      name: "PHONE",
      value : this.data.phone
    }]

    this.getAddress(this.data.address);

    this.hobbies = "Books, cycling, music, sports, browsing, teaching"

    this.visibility = "gone"
    if (this.data.languages != "" && this.data.email && this.data.phone){
      this.visibility = "visible";
    }
  }

  getAddress = (address) => {
    address.map((item, i) => {
      // if(item.addType == "permanent"){
      //   this.info.push({
      //     name: "PERMANENT ADDRESS",
      //     value :item.city + ", " + item.country
      //   })
      // } else
      if (item.addType == "current" && item.country){
        this.info.push({
          name: "CURRENT LOCATION",
          value :item.city + ", " + item.country
        })
      }
    })
  }

  getRows = (input)=> {
    var rows = this.info.map((item, i) => {
      return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,16,0,0"
              visibility = {(item.value && item.value != "") ? "visible" : "gone"}>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={item.name}
              style={window.__TextStyle.textStyle.HINT.SEMI}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={item.value}
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

              </LinearLayout>)
    });

    return rows;
  }

  getBody = () => {
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="0,0,0,0"
            orientation="vertical">

            {this.getRows()}

            </LinearLayout>)
  }

  getHeader = () =>{
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
                width="wrap_content"
                height="wrap_content"
                text="Personal Details"
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Edit"
              visibility = "gone"
              onClick={this.handleEditProfileClick}
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

              </LinearLayout>)
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,15"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  getHobbies = () => {
    return (
      <LinearLayout
        orientation = "horizontal"
        width = "match_parent"
        margin="0,16,0,0">
        <TextView
        width="wrap_content"
        height="wrap_content"
        text="HOBBIES"
        style={window.__TextStyle.textStyle.HINT.SEMI}/>

        <ViewWidget
        height="0"
        weight="2"/>

        <LinearLayout
          orientation = "vertical"
          width = "wrap_content"
          height = "wrap_content"
          weight = "1">
          <TextView
          width="wrap_content"
          height="wrap_content"
          text={this.hobbies}
          gravity = "right"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>
        </LinearLayout>
      </LinearLayout>
    )
  }


  render() {
    this.layout = (
      <LinearLayout
                width="match_parent"
                height="wrap_content"
                margin="0,15,0,60"
                orientation="vertical"
                id = {this.idSet.holder}
                gravity = "center"
                visibility = {this.visibility}>

                {this.getLineSeperator()}

                {this.getHeader()}
                {this.getBody()}

              </LinearLayout>
    )
    return this.layout.render();
  }
  handleEditProfileClick = () => {

    var whatToSend = { "profile" : JSON.stringify(this.data)}
    var event ={ tag: "OPEN_EditProfileActivity", contents: whatToSend }
    window.__runDuiCallback(event);

  }

}



module.exports = ProfileAdditionalInfo;
