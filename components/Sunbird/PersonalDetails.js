var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

var _this;
class PersonalDetails extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);


    this.userName = (this.props.data.userName == undefined) ? "Mock User" : this.props.data.userName;
    this.email = (this.props.data.email == undefined) ? "mock@mock.com" : this.props.data.email;
    this.phone = (this.props.data.phone == undefined) ? "91mock4721" : this.props.data.phone;
    this.currLoc = (this.props.data.currLoc == undefined) ? "Bangalore" : this.props.data.currLoc;
    this.languagesData = (this.props.data.language == undefined) ? ["Mock"] : this.props.data.language;
    this.language = "";
    this.languagesData.map((item) => {
      if (this.language.length != 0)
        this.language += ", "
      this.language += item
    })

  }

  getHeader() {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={window.__S.PROFILE_DETAILS_TITLE}
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>



              </LinearLayout>)
  }


  getRows = (label, dataToShow) => {

    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,16,0,0">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={label}
              style={window.__TextStyle.textStyle.HINT.SEMI}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={dataToShow}
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

              </LinearLayout>)



  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,24"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  render() {
    this.layout = (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              gravity="center_horizontal"
              orientation="vertical">

              {this.getHeader()}

              {this.getRows(window.__S.LANGUAGES,this.language)}
              {this.getRows(window.__S.EMAIL_ID,this.email)}
              {this.getRows(window.__S.PHONE,this.phone)}
              {this.getRows(window.__S.CURRENT_LOCATION,this.currLoc)}

              </LinearLayout>)
    return this.layout.render();
  }
}



module.exports = PersonalDetails;
