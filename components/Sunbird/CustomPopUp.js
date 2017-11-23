const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var dom = require("@juspay/mystique-backend/src/doms/android");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var PageOption = require("../../components/Sunbird/core/PageOption");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");


class CustomPopUp extends View{
  constructor(props,childern){
    super(props,childern);
    this.setIds([
      "popUpParent",
      "predictionLayout",
      "skillLayout",
      "cancelBtn",
      "applyBtn"
    ]);
    this.customPopUpVisibility="gone";    
    window.__CustomPopUp = this;
    this.dictionary=["train","tame","tackle","tounge","tickle","tram","taunt","taunting"]
    this.props=props;
    this.canSave=true   
    this.selectedSkills=[];
    this.cancelBtnState = {
      text : window.__S.CANCEL,
      id : this.idSet.cancelBtn,
      isClickable : "true",
      onClick : this.hide,
      visibility : "visible",
    };
    this.applyBtnState = {
      text : window.__S.APPLY,
      id : this.idSet.applyBtn,
      isClickable : "true",
      onClick : this.onConfirm,
      visibility : "visible",
    };

  }

  show = () => {
    this.customPopUpVisibility="visible";
    this.dictionary=window.__PopulateSkillsList||[];
    this.selectedSkills=[];
    this.dumyLayout=(
      <LinearLayout
      height="match_parent"
      width="match_parent"/>);
    this.replaceChild(this.idSet.skillLayout,this.dumyLayout.render(),0);
    this.updateSaveButtonStatus(false);
    this.setVisibility("visible");
  }

  hide = () => {
    this.customPopUpVisibility="gone";
    this.updateSaveButtonStatus(false);    
    JBridge.hideKeyboard();    
    this.setVisibility("gone");
  }

  updateSaveButtonStatus = (enabled) => {
    console.log("updateSaveButtonStatus",enabled)
    var alpha;
    var isClickable;

    if (enabled) {
      alpha = "1";
      isClickable = "true";
      this.canSave=true
    } else {
      alpha = "0.5";
      isClickable = "false";
      this.canSave=false      
    }

    var cmd = this.set({
      id: this.idSet.applyBtn,
      alpha: alpha,
      clickable: isClickable
    })

    Android.runInUI(cmd, 0);
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.popUpParent,
      visibility: data
    })

    Android.runInUI(cmd, 0)
  }
  getOptions = () => {
    var buttonList = [this.cancelBtnState, this.applyBtnState];
    return (<LinearLayout
          height="wrap_content"
          width="match_parent"
          alignParentBottom = "true, -1">
          <PageOption
            width="match_parent"
            buttonItems={buttonList}
            hideDivider={false}
            onButtonClick={this.handlePageOption}/>
          </LinearLayout>)
  }
  onConfirm=()=>{
    if(!this.canSave){
      window.__Snackbar.show(window.__S.NO_SKILL_ADDED);
      return;
    }
    this.hide();
    if(!JBridge.isNetworkAvailable()){
      window.__Snackbar.show(window.__S.ERROR_NO_INTERNET_MESSAGE);
      return;
    }
    window.__LoaderDialog.show();
    var request = {
       "endorsedUserId" :window.__userToken,
       "skillName": this.selectedSkills
   }
   var whatToSend = {
     "user_token" : window.__user_accessToken,
     "api_token" : window.__apiToken,
     "requestBody" : JSON.stringify(request)
   }
   var event= { "tag": "API_EndorseSkill", contents: whatToSend };
   window.__runDuiCallback(event); 
  }

  render(){
    this.layout=(
      <LinearLayout
      orientation="vertical"
      height="match_parent"
      width="match_parent"
      id={this.idSet.popUpParent}
      visibility="gone"
      background="#CC9E9E9E"
      gravity="center">
          <LinearLayout
          height= "match_parent"
          width="match_parent"
          weight="2"
          onClick={this.hide}/>
          <RelativeLayout
          height = "match_parent"
          width = "match_parent"
          weight= "1"
          background="#ffffff">
          <LinearLayout
          height = "match_parent"
          width = "match_parent"
          onClick={()=>this.getPredictions("")}
          orientation="vertical">
              <TextView
              height="wrap_content"
              width="match_parent"
              text={window.__S.LABEL_ADD_A_SKILL}
              margin="16,16,0,0"
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
              textSize="22"
              />
              <EditText
              height="wrap_content"
              margin="16,0,16,0"
              width="match_parent"
              hint={window.__S.TYPE_TO_ADD_A_SKILL}
              gravity="center_vertical"
              color="#000000"
              maxLines="1"
              onChange={this.getPredictions}
              textSize="18"
              />

              <RelativeLayout
              width="match_parent"
              height="match_parent">
                <HorizontalScrollView
                width="match_parent"
                height="wrap_content"
                margin="17,0,17,0">
                 <LinearLayout
                 height="wrap_content"
                 width="wrap_content"
                 id={this.idSet.skillLayout}/>
                 </HorizontalScrollView>
                 <LinearLayout
                 height="200"
                 width="match_parent"
                 margin="17,2,17,2">
                    <ScrollView
                    height="wrap_content"
                    width="match_parent"
                    stroke={"2,#000000"}
                    margin="2,0,2,0">
                        <LinearLayout
                        height="wrap_content"
                        width="match_parent"
                        margin="2,0,2,0"
                        id={this.idSet.predictionLayout}
                        background="#ffffff">
                        </LinearLayout>
                    </ScrollView>
                 </LinearLayout>
              </RelativeLayout>
          </LinearLayout>
          </RelativeLayout>
          {this.getOptions()}
      </LinearLayout>
    );
    return this.layout.render();
  }

  getPredictions = (data) =>{
  console.log(this.dictionary, " dictionary");
    var text=data;
    var predictions=[];
    var i;

    if(data!=""&&data.replace(/\s/g, '').length){
       for(i=0; i < this.dictionary.length;i++)
       {
         if(this.dictionary[i].startsWith(text))
            predictions.push(this.dictionary[i]);
       }
       console.log(predictions, "predi");
       if(predictions!=[])
       this.populatePredictions(predictions,data);
   }
   else {
     {
       this.predictlayout =(<LinearLayout
          height="wrap_content"
          width="match_parent"/>);

       this.replaceChild(this.idSet.predictionLayout, this.predictlayout.render(), 0);
     }
   }
  }

  populatePredictions = (predictions,data) =>{

    var predictionContent = predictions.map((item) => {
      return (this.getPredictionCard(item))
    });

    var addDictionaryString=window.__S.ADD+" \"String\"";
    addDictionaryString = addDictionaryString.replace("String", data);
    data = data.replace(/^[ ]+|[ ]+$/g,'')        
    this.predictlayout =(<LinearLayout
       height="match_parent"
       width="match_parent"
       orientation="vertical"
       margin="16,0,16,0">

         <LinearLayout
         height="match_parent"
         width="match_parent">
           <TextView
            height="wrap_content"
            width="match_parent"
            padding="16,17,0,17"
            textSize="20"
            onClick={()=>{this.addItem(data)}}
            text={addDictionaryString}
            textColor="#FF333333"/>
         </LinearLayout>
         {predictionContent}
         </LinearLayout>);

    this.replaceChild(this.idSet.predictionLayout, this.predictlayout.render(), 0);
  }

  getPredictionCard = (item)=>{
    console.log(item, "iitm")
    return (
      <LinearLayout
      height="wrap_content"
      width="match_parent"
      orientation="vertical">
      <LinearLayout
          height="1"
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK_66}/>
          <TextView
           height="wrap_content"
           width="match_parent"
           padding="16,17,0,17"
           textSize="20"
           onClick={()=>{this.selectItem(item)}}
           text= {item}
           textColor="#FF333333"/>
      </LinearLayout>
    );
  }

  selectItem =(data) =>{
    console.log(data, "selectItem");
    var index=this.dictionary.indexOf(data);
    if(index >-1){
      JBridge.hideKeyboard();

      this.predictlayout =(<LinearLayout
         height="wrap_content"
         width="wrap_content"/>);

      this.replaceChild(this.idSet.predictionLayout, this.predictlayout.render(), 0);

     this.dictionary.splice(index,1);
     this.selectedSkills.push(data);

     var skills = this.selectedSkills.map((item) => {
       return (this.skillItemLayout(item));
     });

    console.log(this.selectedSkills," skiilhere");
    this.updatedSkills=(
      <LinearLayout
      height="match_parent"
      width="match_parent"
      orientation="horizontal">
         {skills}
      </LinearLayout>);

      this.replaceChild(this.idSet.skillLayout,this.updatedSkills.render(),0);

   }
   if(this.selectedSkills.length>0){
    this.updateSaveButtonStatus(true);        
   }else{
    this.updateSaveButtonStatus(false);        
   }
  }

  addItem = (data) =>{
    if(this.dictionary.indexOf(data)==-1 && this.selectedSkills.indexOf(data)==-1)
    {
      this.dictionary.push(data);
      this.selectItem(data);
    }
    else {
      JBridge.hideKeyboard();
      window.__Snackbar.show(window.__S.ERROR_ALREADY_ADDED);
    }
  }

  skillItemLayout = (item)=> {
    return (
      <LinearLayout
      height="wrap_content"
      width="wrap_content"
      padding="12,4,12,4"
      margin="0,0,10,0"
      cornerRadius="16,16,16,16"
      background={window.__Colors.DARK_GRAY_44}
      gravity="center">

       <TextView
         height="wrap_content"
         width="wrap_content"
         text={item}
         margin="0,0,4,0"
         textStyle={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

       <ImageView
         height="15"
         width="15"
         imageUrl="ic_action_close"
         margin="0,1,0,0"
         onClick={()=>{this.removeSkill(item)}}
         />
    </LinearLayout>
  );
  }

  removeSkill= (item) =>{
    var index= this.selectedSkills.indexOf(item);
    if(index>-1){
      this.selectedSkills.splice(index,1);
      this.dictionary.push(item);

      var skills = this.selectedSkills.map((data) => {
        return (this.skillItemLayout(data));
      });

      console.log(this.selectedSkills," skiilll");
      this.updatedSkills=(
       <LinearLayout
       height="wrap_content"
       width="match_parent"
       orientation="horizontal">
          {skills}
       </LinearLayout>);

       this.replaceChild(this.idSet.skillLayout,this.updatedSkills.render(),0);
       this.updatedSkills=(
        <LinearLayout
        height="wrap_content"
        width="wrap_content"
        orientation="horizontal">
           {skills}
        </LinearLayout>);

        this.replaceChild(this.idSet.skillLayout,this.updatedSkills.render(),0);

    }
    if(this.selectedSkills.length>0){
      this.updateSaveButtonStatus(true);        
     }else{
      this.updateSaveButtonStatus(false);        
     }
  }
}

module.exports = CustomPopUp;
