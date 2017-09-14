const View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var dom = require("@juspay/mystique-backend/src/doms/android");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");


class CustomPopUp extends View{
  constructor(props,childern){
    super(props,childern);
    this.setIds([
      "popUpParent",
      "predictionLayout",
      "skillLayout"
    ]);
    window.__CustomPopUp = this;
    this.dictionary=["train","tame","tackle","tounge","tickle","tram","taunt","taunting"]
    this.props=props;
    this.selectedSkills=[];
  }

  show = () => {
    this.setVisibility("visible");
  }

  hide = () => {
    this.setVisibility("gone");
    JBridge.hideKeyboard();
  }

  setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.popUpParent,
      visibility: data
    })

    Android.runInUI(cmd, 0)
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
          weight="4"
          onClick={this.hide}
          />
          <LinearLayout
          height = "match_parent"
          width = "match_parent"
          weight= "1"
          background="#ffffff"
          orientation="vertical">
              <TextView
              height="wrap_content"
              width="match_parent"
              text={window.__S.LABEL_ADD_A_SKILL}
              margin="16,16,0,0"
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
              textSize="22"/>
              <EditText
              height="wrap_content"
              margin="16,0,16,0"
              width="match_parent"
              hint={window.__S.TYPE_TO_ADD_A_SKILL}
              gravity="center_vertical"
              color="#000000"
              maxLines="1"
              onChange={this.getPredictions}
              textSize="18"/>
              <RelativeLayout
              width="match_parent"
              height="match_parent">
                 <LinearLayout
                 height="wrap_content"
                 width="wrap_content"
                 margin="17,0,17,0"
                 id={this.idSet.skillLayout}/>
                 <LinearLayout
                 height="wrap_content"
                 width="match_parent"
                 background="#E0E0E0"
                 margin="17,0,17,0">
                    <ScrollView
                    height="wrap_content"
                    width="match_parent"
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
      </LinearLayout>
    );
    return this.layout.render();
  }

  getPredictions = (data) =>{
  console.log(this.dictionary, " dictionary");
    var text=data;
    var predictions=[];
    var i;

    if(data!=""){
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
          width="wrap_content"/>);

       this.replaceChild(this.idSet.predictionLayout, this.predictlayout.render(), 0);
     }
   }
  }

  populatePredictions = (predictions,data) =>{

    var predictionContent = predictions.map((item) => {
      return (this.getPredictionCard(item))
    });

    var addDictionaryString="Add \"String\"";
    addDictionaryString = addDictionaryString.replace("String", data);
    this.predictlayout =(<LinearLayout
       height="match_parent"
       width="wrap_content"
       orientation="vertical"
       margin="16,0,16,0">

         {predictionContent}
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
         <LinearLayout
         height="3"
         width="328"
         background="#E0E0E0">
         </LinearLayout>
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
          <TextView
           height="wrap_content"
           width="match_parent"
           padding="16,17,0,17"
           textSize="20"
           onClick={()=>{this.selectItem(item)}}
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
  }

  addItem = (data) =>{
    if(this.dictionary.indexOf(data)==-1 && this.selectedSkills.indexOf(data)==-1)
    {
      this.dictionary.push(data);
      this.selectItem(data);
    }
    else {
      JBridge.hideKeyboard();
      JBridge.showSnackBar(window.__S.ERROR_ALREADY_ADDED);
    }
  }

  skillItemLayout = (item)=> {
    return (
      <LinearLayout
      height="wrap_content"
      width="wrap_content">
            <LinearLayout
            height="32"
            width="wrap_content"
            background="#66D8D8D8"
            cornerRadius="12,12,12,12">
                <TextView
                height="28"
                width="wrap_content"
                textColor="#ffffff"
                text={item}
                margin="12,2,0,0"/>
                <ImageView
                margin="11,8,11,8"
                height="match_parent"
                width="match_parent"
                imageFromUrl="https://ls.iu.edu/Images/close.png"
                onClick={()=>{this.removeSkill(item)}}/>
            </LinearLayout>
            <LinearLayout
            height="wrap_content"
            width="10"/>
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
       height="match_parent"
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
  }
}

module.exports = CustomPopUp;
