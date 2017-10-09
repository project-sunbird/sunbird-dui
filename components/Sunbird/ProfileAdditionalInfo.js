var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var utils = require('../../utils/GenericFunctions')

var _this;
class ProfileAdditionalInfo extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "holder"
    ]);
    _this = this;

    this.data = this.props.data;
    console.log("this.data hakuna matata", this.data);

    //initialise data
    this.maxLen = 30;
    this.languages = "";
    this.email = this.data.email ? this.data.email : "";
    this.phone = this.data.phone ? this.data.phone : "";
    this.gender = this.data.gender ? this.data.gender : "";
    this.subjects = "";
    this.dob = this.data.dob ? this.data.dob : "";
    this.grade = "";
    this.currentLoc = this.data.location ? this.data.location : "";

    this.data.language.map((item, i) => {
      var append = ",";
      if (i == this.data.language.length - 1) append = "";
      this.languages += item + append;
    });
    this.languages = utils.cropText(this.languages, this.maxLen);

    this.data.subject.map((item, i) => {
      var append = ",";
      if (i == this.data.subject.length - 1) append = "";
      this.subjects += item + append;
    });
    this.subject = utils.cropText(this.subject, this.maxLen);

    this.data.grade.map((item, i) => {
      var append = ",";
      if (i == this.data.grade.length - 1) append = "";
      this.grade += item + append;
    });
    this.grade = utils.cropText(this.grade, this.maxLen);

    // this.currentLoc = this.getAddress(this.data.address);

    this.info = [{
      name: window.__S.LANGUAGES,
      value : this.languages
    },
    {
      name: window.__S.EMAIL,
      value : this.data.email
    },
    {
      name: window.__S.PHONE,
      value : this.data.phone
    },
    {
      name: window.__S.GENDER,
      value : this.gender
    },
    {
      name: window.__S.SUBJECTS,
      value : this.subjects
    },
    {
      name: window.__S.DATE_OF_BIRTH,
      value : this.dob
    },
    {
      name: window.__S.GRADE,
      value : this.grade
    },
    {
      name: window.__S.CURRENT_LOCATION,
      value : this.currentLoc
    }]


    this.hobbies = "Books, cycling, music, sports, browsing, teaching"

    this.visibility = "gone"
    if (this.props.editable == "true"){
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
        return item.city + ", " + item.country;
      }
    })
    return "";
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
              textAllCaps = "true"
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
            margin="0,0,0,16"
            orientation="vertical">

            {this.getRows()}

            </LinearLayout>)
  }

  getHeader = () =>{
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              padding="0,16,0,0">

              <TextView
                width="wrap_content"
                height="wrap_content"
                text={window.__S.ADDITIONAL_INFORMATION}
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>
              <LinearLayout
          width = "wrap_content"
          height = "wrap_content"
          padding = "10,5,0,10"
          onClick={this.handleEditProfileClick}>
          <ImageView
          width="18"
          height="18"
          imageUrl="ic_action_edit_blue"/>
        </LinearLayout>
              </LinearLayout>)
  }

  getLineSeperator = () => {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,16,0,0"
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
        text={window.__S.HOBBIES}
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
  getRows1=()=>{
    var count=0;
    var rows= this.data.webPages.map((item,i)=>{
      var dumy=this.data.webPages[i].url
      if(dumy!=undefined&&dumy!="")
        {
          count++;
        }
        var dumy1=utils.cropText(dumy,20);
        dumy= "<a href="+dumy+">"+dumy1+"</a>"
      return (
        <LinearLayout
        width="match_parent"
        height="match_parent"
        gravity="right">
        <TextView
        widht="wrap_content"
        height="wrap_content"
        textFromHtml={dumy}
        padding="0,0,0,8"
        onClick={()=>this.socialClicked(i)}/>
        </LinearLayout>
        );
    });
    return rows;
  }
  getSocialDetils=()=>{ 
    return (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      orientation="horizontal" >
      <LinearLayout
      width="wrap_content"
      height="match_parent">
      <TextView
      width="wrap_content"
      height="wrap_content"
      text={window.__S.SOCIAL}
      textAllCaps = "true"
      style={window.__TextStyle.textStyle.HINT.SEMI}/>
      </LinearLayout>
      <LinearLayout
      width="wrap_content"
      height="wrap_content"
      orientation = "vertical"
      weight='1'
      >
      {this.getRows1()}
        </LinearLayout>
        </LinearLayout>
    );
  }
 socialClicked=(index)=>{
   console.log("Social media link clicked",index);
 }


  render() {
    this.layout = (
      <LinearLayout
                width="match_parent"
                height="wrap_content"
                margin="0,0,0,0"
                orientation="vertical"
                id = {this.idSet.holder}
                gravity = "center"
                visibility = {this.visibility}>

                {this.getLineSeperator()}

                {this.getHeader()}
                {this.getBody()}
                {this.getSocialDetils()}
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
