var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require('@juspay/mystique-backend').androidViews.EditText;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');
var ProfileHeader = require('../components/Sunbird/ProfileHeader');
var ComingSoonComponent = require('../components/Sunbird/ComingSoonComponent');
var PersonalDetails = require('../components/Sunbird/PersonalDetails');
var ProfileExperiences = require('../components/Sunbird/ProfileExperiences');
var ProfileSkillTags = require('../components/Sunbird/ProfileSkillTags');
var ProfileAccomplishments = require('../components/Sunbird/ProfileAccomplishments');
var ProfileCreations = require('../components/Sunbird/ProfileCreations');
var ProfileBadges = require('../components/Sunbird/ProfileBadges');
var ProfileAdditionalInfo = require('../components/Sunbird/ProfileAdditionalInfo');
var Styles = require("../res/Styles");
let IconStyle = Styles.Params.IconStyle;

class AdditionalInformationActivity extends View{
  constructor(props, children,state) {
    super(props, children,state);
    this.setIds([
      "predictionLanguageLayout",
      "LanguageLayout",
      "HobbiesLayout",
      "predictionHobbiesLayout"
    ]);
    this.shouldCacheScreen = false;
    this.state=state;
    this.screenName="AdditionalInformationActivity"
    this.languageDictionary=["english","hindi","marathi","telugu","kannada","punjabi","bhojpuri","bengali"];
    this.selectedLanguages=[];
    this.hobbieDictionary=["cycling","swimming","singing","travelling","playing","dancing"];
    this.selectedHobbies=[];
    console.log("cons");
  }

  render(){
    console.log("render");
    this.layout=(
      <LinearLayout
        orientation="vertical"
        root="true"
        background={window.__Colors.WHITE}
        width="match_parent"
        height="match_parent">

         {this.getToolbar()}

         {this.getBody()}

         {this.getTail()}
     </LinearLayout>
    );
console.log("rendered");
    return this.layout.render();
  }

  getToolbar  = () =>{
    return( <LinearLayout
            height="56"
            padding="0,0,0,2"
            gravity="center_vertical"
            background={window.__Colors.PRIMARY_BLACK_22}
            width="match_parent" >
                <LinearLayout
                  height="56"
                  padding="0,0,0,0"
                  gravity="center_vertical"
                  background={window.__Colors.WHITE}
                  width="match_parent" >

                    {this.getBack()}
                    {this.getTitle()}
                </LinearLayout>
            </LinearLayout>

      );
  }

  getBack = () => {
    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      height="48"
      width="48"
      onClick={this.onBackPressed}
      imageUrl = {"ic_action_arrow_left"}/>);
  }

  getTitle = () => {
    return (<LinearLayout
            height="match_parent"
            width="wrap_content"
            gravity="center_vertical">

              <TextView
                  height="match_parent"
                  width="match_parent"
                  gravity="center_vertical"
                  background="#ffffff"
                  text="Additional Information"
                  style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>


          </LinearLayout>);

  }

  getTail = () => {
    return (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      padding="0,2,0,0"
      background={window.__Colors.PRIMARY_BLACK_22}>
          <LinearLayout
          width="match_parent"
          height="wrap_content"
          padding="15,15,15,15"
          weight="14"
          background={window.__Colors.WHITE}>
              <LinearLayout
              background="#FF0076FE"
              height="50"
              width="match_parent"
              cornerRadius="4,4,4,4"
              gravity="center"
              >
              <TextView
              text="FINISH EDITING"
              style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
              />

              </LinearLayout>
          </LinearLayout>
      </LinearLayout>
    );
  }

  getBody = () =>{
    return (
      <ScrollView
       width="match_parent"
       height="479"
       weight="1"
       padding="15,25,15,0">
        <LinearLayout
        width="match_parent"
        height="match_parent"
        orientation="vertical">
               <LinearLayout
               width="match_parent"
               height="wrap_content"
               orientation="vertical">
                 <TextView
                  width="match_parent"
                  height="20"
                  style={window.__TextStyle.textStyle.HINT.BOLD}
                  text="LANGUAGES"/>
                  <LinearLayout
                  height="8"
                  orientation="horizontal"
                  width="match_parent"
                  />
                  <EditText
                  width="match_parent"
                  height="wrap_content"
                  maxLines="1"
                  style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
                  onChange={this.getLanguagePredictions}
                  hint="Start typing to add a language"
                  />

                </LinearLayout>

                <RelativeLayout
                 width="match_parent"
                 height="wrap_content">
                   <LinearLayout
                   height="wrap_content"
                   width="match_parent"
                   orientation="vertical">

                        <LinearLayout
                        height="wrap_content"
                        width="wrap_content"
                        orientation="horizontal"
                        id={this.idSet.LanguageLayout}
                        margin="0,4,0,0"/>

                       <LinearLayout
                       height="17"
                       orientation="horizontal"
                       width="match_parent"
                       />

                       <LinearLayout
                       width="match_parent"
                       height="wrap_content"
                       orientation="vertical">
                         <TextView
                          width="match_parent"
                          height="20"
                          style={window.__TextStyle.textStyle.HINT.BOLD}
                          text="E-MAIL"/>
                          <LinearLayout
                          height="8"
                          orientation="horizontal"
                          width="match_parent"
                          />
                          <EditText
                          width="match_parent"
                          height="wrap_content"
                          maxLines="1"
                          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
                          hint="Enter your email"
                          />
                        </LinearLayout>

                        <LinearLayout
                        height="17"
                        orientation="horizontal"
                        width="match_parent"
                        />

                        <LinearLayout
                        width="match_parent"
                        height="wrap_content"
                        orientation="vertical">
                          <TextView
                           width="match_parent"
                           height="20"
                           style={window.__TextStyle.textStyle.HINT.BOLD}
                           text="PHONE"/>
                           <LinearLayout
                           height="8"
                           orientation="horizontal"
                           width="match_parent"
                           />
                           <EditText
                           width="match_parent"
                           height="wrap_content"
                           maxLines="1"
                           style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
                           hint="Enter your phone number"
                           />
                         </LinearLayout>

                         <LinearLayout
                         height="17"
                         orientation="horizontal"
                         width="match_parent"
                         />

                         <LinearLayout
                         width="match_parent"
                         height="wrap_content"
                         orientation="vertical">
                           <TextView
                            width="match_parent"
                            height="20"
                            style={window.__TextStyle.textStyle.HINT.BOLD}
                            text="CURRENT LOCATION"/>
                            <LinearLayout
                            height="8"
                            orientation="horizontal"
                            width="match_parent"
                            />
                            <EditText
                            width="match_parent"
                            height="wrap_content"
                            maxLines="1"
                            style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
                            hint="Enter your location"
                            />
                          </LinearLayout>

                          <LinearLayout
                          height="17"
                          orientation="horizontal"
                          width="match_parent"
                          />

                          <LinearLayout
                          width="match_parent"
                          height="wrap_content"
                          orientation="vertical">
                            <TextView
                             width="match_parent"
                             height="20"
                             style={window.__TextStyle.textStyle.HINT.BOLD}
                             text="HOBBIES"/>
                             <LinearLayout
                             height="8"
                             orientation="horizontal"
                             width="match_parent"
                             />
                             <EditText
                             width="match_parent"
                             height="wrap_content"
                             maxLines="1"
                             style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
                             hint="Start typing to add a hobby"
                             onChange={this.getHobbiePredictions}
                             />
                             <RelativeLayout
                              width="match_parent"
                              height="wrap_content">
                                  <LinearLayout
                                  height="wrap_content"
                                  width="wrap_content"
                                  orientation="horizontal"
                                  id={this.idSet.HobbiesLayout}
                                  margin="0,4,0,8"/>

                                  <LinearLayout
                                  height="wrap_content"
                                  width="328"
                                  background={window.__Colors.PRIMARY_BLACK_22}>
                                     <ScrollView
                                     height="wrap_content"
                                     width="match_parent"
                                     margin="2,0,2,0">
                                         <LinearLayout
                                         height="wrap_content"
                                         width="match_parent"
                                         margin="2,0,2,0"
                                         id={this.idSet.predictionHobbiesLayout}
                                         background="#ffffff">
                                         </LinearLayout>
                                     </ScrollView>
                                  </LinearLayout>

                             </RelativeLayout>

                           </LinearLayout>





                    </LinearLayout>

                    <LinearLayout
                    height="wrap_content"
                    width="328"
                    background={window.__Colors.PRIMARY_BLACK_22}>
                       <ScrollView
                       height="wrap_content"
                       width="match_parent"
                       margin="2,0,2,0">
                           <LinearLayout
                           height="wrap_content"
                           width="match_parent"
                           margin="2,0,2,0"
                           id={this.idSet.predictionLanguageLayout}
                           background="#ffffff">
                           </LinearLayout>
                       </ScrollView>
                    </LinearLayout>
                 </RelativeLayout>


        </LinearLayout>
       </ScrollView>
    )
  }

  getLanguagePredictions = (data) => {

    console.log(this.languageDictionary, " languageDictionarycitionary");
    data=data.toLowerCase();
      var predictions=[];
      var i;

      if(data!=""){
         for(i=0; i < this.languageDictionary.length;i++)
         {
           if(this.languageDictionary[i].startsWith(data))
              predictions.unshift(this.languageDictionary[i]);
         }
         console.log(predictions, "LangPredi");
         if(predictions!=[])
         this.populateLanguagePredictions(predictions,data);
     }
     else {
       {
         this.predictLanguageLayout =(<LinearLayout
            height="wrap_content"
            width="wrap_content"/>);

         this.replaceChild(this.idSet.predictionLanguageLayout, this.predictLanguageLayout.render(), 0);
       }
     }

  }

  populateLanguagePredictions = (predictions,data) =>{

    var predictionContent = predictions.map((item) => {
      return (this.getLanguagePredictionCard(item))
    });

    var addDictionaryString="Add \"String\"";
    addDictionaryString = addDictionaryString.replace("String", data);
    this.predictLanguageLayout =(<LinearLayout
       height="match_parent"
       width="wrap_content"
       orientation="vertical"
       margin="16,0,16,0"
       >

         {predictionContent}
         <LinearLayout
         height="match_parent"
         width="match_parent">
           <TextView
            height="wrap_content"
            width="match_parent"
            padding="16,17,0,17"
            textSize="15"
            onClick={()=>{this.addLanguageItem(data)}}
            text={addDictionaryString}
            textColor="#FF333333"/>
         </LinearLayout>
         <LinearLayout
         height="3"
         width="328"
         background="#E0E0E0">
         </LinearLayout>
       </LinearLayout>);

    this.replaceChild(this.idSet.predictionLanguageLayout, this.predictLanguageLayout.render(), 0);


  }

  getLanguagePredictionCard = (item)=>{
    console.log(item, "iitm")
    return (
      <LinearLayout
      height="wrap_content"
      width="match_parent"

      orientation="vertical">
          <TextView
           height="wrap_content"
           width="match_parent"
           padding="16,17,0,17"
           textSize="15"
           onClick={()=>{this.selectLanguageItem(item)}}
           text= {item}
           textColor="#FF333333"
          />
          <LinearLayout
          height="1"
          width="328"
          background={window.__Colors.PRIMARY_BLACK_66}>
          </LinearLayout>
      </LinearLayout>
    );
  }

  selectLanguageItem =(data) =>{
    console.log(data, "selectItem");
    var index=this.languageDictionary.indexOf(data);
    if(index >-1){
      JBridge.hideKeyboard();

      this.predictLanguageLayout =(<LinearLayout
         height="wrap_content"
         width="wrap_content"/>);

      this.replaceChild(this.idSet.predictionLanguageLayout, this.predictLanguageLayout.render(), 0);

     this.languageDictionary.splice(index,1);
     this.selectedLanguages.unshift(data);


     var skills = this.selectedLanguages.map((item) => {
       return (this.languageItemLayout(item));
     });

    console.log(this.selectedLanguages," skiilhere");
    this.updatedLanguages=(
      <HorizontalScrollView
      height="wrap_content"
      width="match_parent">
          <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="horizontal">
             {skills}
          </LinearLayout>
    </HorizontalScrollView>);

      this.replaceChild(this.idSet.LanguageLayout,this.updatedLanguages.render(),0);

   }

  }

  addLanguageItem = (data) =>{
    if(this.languageDictionary.indexOf(data)==-1 && this.selectedLanguages.indexOf(data)==-1)
    {
      this.languageDictionary.unshift(data);
      this.selectLanguageItem(data);
    }
    else {
      JBridge.hideKeyboard();
      JBridge.showSnackBar("Language Already Added");
    }
  }




  languageItemLayout = (item)=> {
    return (
      <LinearLayout
      height="wrap_content"
      width="wrap_content"
      >
            <LinearLayout
            height="32"
            width="wrap_content"
            background="#66D8D8D8"
            cornerRadius="12,12,12,12"
            >
                <TextView
                height="28"
                width="wrap_content"
                textColor="#ffffff"
                text={item}
                margin="12,0,0,0"
                gravity="center"
                />
                <ImageView
                margin="11,8,11,8"
                height="match_parent"
                width="match_parent"
                imageFromUrl="https://ls.iu.edu/Images/close.png"
                onClick={()=>{this.removeLanguage(item)}}
                />
            </LinearLayout>
            <LinearLayout
            height="wrap_content"
            width="10"/>

    </LinearLayout>
  );
  }

  removeLanguage= (item) =>{
    var index= this.selectedLanguages.indexOf(item);
    if(index>-1){
      this.selectedLanguages.splice(index,1);
      this.languageDictionary.unshift(item);

      var languages = this.selectedLanguages.map((data) => {
        return (this.languageItemLayout(data));
      });

      console.log(this.selectedLanguages," skiilll");
      this.updatedLanguages=(
        <HorizontalScrollView
        height="wrap_content"
        width="match_parent">
           <LinearLayout
           height="match_parent"
           width="match_parent"
           orientation="horizontal">
              {languages}
           </LinearLayout>
         </HorizontalScrollView>)


       this.replaceChild(this.idSet.LanguageLayout,this.updatedLanguages.render(),0);

    }
  }

  getHobbiePredictions = (data) => {

    console.log(this.hobbieDictionary, " hobbieDictionary");
    data=data.toLowerCase();
      var predictions=[];
      var i;

      if(data!=""){
         for(i=0; i < this.hobbieDictionary.length;i++)
         {
           if(this.hobbieDictionary[i].startsWith(data))
              predictions.unshift(this.hobbieDictionary[i]);
         }
         console.log(predictions, "HobbPredi");
         if(predictions!=[])
         this.populateHobbiePredictions(predictions,data);
     }
     else {
       {
         this.predictHobbieLayout =(<LinearLayout
            height="wrap_content"
            width="wrap_content"/>);

         this.replaceChild(this.idSet.predictionHobbiesLayout, this.predictHobbieLayout.render(), 0);
       }
     }

  }

  populateHobbiePredictions = (predictions,data) =>{

    var predictionContent = predictions.map((item) => {
      return (this.getHobbiePredictionCard(item))
    });

    var addDictionaryString="Add \"String\"";
    addDictionaryString = addDictionaryString.replace("String", data);
    this.predictHobbieLayout =(<LinearLayout
       height="match_parent"
       width="wrap_content"
       orientation="vertical"
       margin="16,0,16,0"
       >

         {predictionContent}
         <LinearLayout
         height="match_parent"
         width="match_parent">
           <TextView
            height="wrap_content"
            width="match_parent"
            padding="16,17,0,17"
            textSize="15"
            onClick={()=>{this.addHobbieItem(data)}}
            text={addDictionaryString}
            textColor="#FF333333"/>
         </LinearLayout>
         <LinearLayout
         height="3"
         width="328"
         background="#E0E0E0">
         </LinearLayout>
       </LinearLayout>);

    this.replaceChild(this.idSet.predictionHobbiesLayout, this.predictHobbieLayout.render(), 0);


  }

  getHobbiePredictionCard = (item)=>{
    console.log(item, "iitm")
    return (
      <LinearLayout
      height="wrap_content"
      width="match_parent"

      orientation="vertical">
          <TextView
           height="wrap_content"
           width="match_parent"
           padding="16,17,0,17"
           textSize="15"
           onClick={()=>{this.selectHobbieItem(item)}}
           text= {item}
           textColor="#FF333333"
          />
          <LinearLayout
          height="1"
          width="328"
          background={window.__Colors.PRIMARY_BLACK_66}>
          </LinearLayout>
      </LinearLayout>
    );
  }

  selectHobbieItem =(data) =>{
    console.log(data, "selectItem");
    var index=this.hobbieDictionary.indexOf(data);
    if(index >-1){
      JBridge.hideKeyboard();

      this.predictHobbieLayout =(<LinearLayout
         height="wrap_content"
         width="wrap_content"/>);

      this.replaceChild(this.idSet.predictionHobbiesLayout, this.predictHobbieLayout.render(), 0);

     this.hobbieDictionary.splice(index,1);
     this.selectedHobbies.unshift(data);


     var skills = this.selectedHobbies.map((item) => {
       return (this.hobbieItemLayout(item));
     });

    console.log(this.selectedHobbies," skiilhere");
    this.updatedHobbies=(
      <HorizontalScrollView
      height="wrap_content"
      width="match_parent">
            <LinearLayout
            height="match_parent"
            width="match_parent"
            orientation="horizontal">
               {skills}
            </LinearLayout>
      </HorizontalScrollView>);

      this.replaceChild(this.idSet.HobbiesLayout,this.updatedHobbies.render(),0);

   }

  }

  addHobbieItem = (data) =>{
    if(this.hobbieDictionary.indexOf(data)==-1 && this.selectedHobbies.indexOf(data)==-1)
    {
      this.hobbieDictionary.unshift(data);
      this.selectHobbieItem(data);
    }
    else {
      JBridge.hideKeyboard();
      JBridge.showSnackBar("Hobbie Already Added");
    }
  }




  hobbieItemLayout = (item)=> {
    return (
      <LinearLayout
      height="wrap_content"
      width="wrap_content"
      >
            <LinearLayout
            height="32"
            width="wrap_content"
            background="#66D8D8D8"
            cornerRadius="12,12,12,12"
            >
                <TextView
                height="28"
                width="wrap_content"
                textColor="#ffffff"
                text={item}
                margin="12,0,0,0"
                gravity="center"
                />
                <ImageView
                margin="11,8,11,8"
                height="match_parent"
                width="match_parent"
                imageFromUrl="https://ls.iu.edu/Images/close.png"
                onClick={()=>{this.removeHobbie(item)}}
                />
            </LinearLayout>
            <LinearLayout
            height="wrap_content"
            width="10"/>

    </LinearLayout>
  );
  }

  removeHobbie= (item) =>{
    var index= this.selectedHobbies.indexOf(item);
    if(index>-1){
      this.selectedHobbies.splice(index,1);
      this.hobbieDictionary.unshift(item);

      var Hobbies = this.selectedHobbies.map((data) => {
        return (this.hobbieItemLayout(data));
      });

      console.log(this.selectedHobbies," skiilll");
      this.updatedHobbies=(
        <HorizontalScrollView
        height="wrap_content"
        width="match_parent">
           <LinearLayout
           height="match_parent"
           width="match_parent"
           orientation="horizontal">
              {Hobbies}
           </LinearLayout>
         </HorizontalScrollView>);

       this.replaceChild(this.idSet.HobbiesLayout,this.updatedHobbies.render(),0);

    }
  }

  onBackPressed = () => {
    var whatToSend = []
    var event = { tag: "BACK_AdditionalInformationActivity", contents: whatToSend};
    window.__runDuiCallback(event);
  }



}
module.exports = Connector(AdditionalInformationActivity);
