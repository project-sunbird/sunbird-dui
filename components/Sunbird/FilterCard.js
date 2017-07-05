var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var ChooseItem = require('../Sunbird/ChooseItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
const transitParams = require('../../transitions');
const filterParams = require('../../FilterParams');

var _this;
class FilterCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount',
      'rowsContainer'
    ]);
    _this=this;
    this.params = filterParams;
   
   this.EaseOut = transitParams.animParams.EaseOut;

  }

  handleClick = (type) =>{

    var languageParams =
{
  type : "language",
  items : [ "English",
            "Hindi",
            "Assamese",
            "Bengali",
            "Gujarati",
            "Kannada",
            "Malayalam",
            "Marathi",
            "Nepali",
            "Odia",
            "Punjabi",
            "Tamil",
            "Telugu",
            "Urdu",
            "Sanskrit",
            "Maithili",
            "Munda",
            "Santali",
            "Juang",
            "Ho",
            "Other" ]

};

var gradeParams =
{
  type : "grade",
  items : [   "Kindergarten",
              "Grade 1",
              "Grade 2",
              "Grade 3",
              "Grade 4",
              "Grade 5",
              "Grade 6",
              "Grade 7",
              "Grade 8",
              "Grade 9",
              "Grade 10",
              "Grade 11",
              "Grade 12",
              "Other"   ]
};

var domainParams =
{
  type : "domain",
  items : [ "numeracy",
            "literacy",
            "science" ]
             
};

var frameworkParams =
{
  type : "framework",
  items : []
             
};

var conceptParams =
{
  type : "concepts",
  items : []
             
};

var typeParams =
{
  type : "type",
  items : [ "Story",
            "Worksheet",
            "Collection",
            "LessonPlan",
            "TextBook"  ]
             
};

var subjectParams =
{
  type : "subject",
  items : [ "Maths",
            "English",
            "Hindi",
            "Assamese",
            "Bengali",
            "Gujarati",
            "Kannada",
            "Malayalam",
            "Marathi",
            "Nepali",
            "Odia",
            "Punjabi",
            "Tamil",
            "Telugu",
            "Urdu",
            "Other", ]
             
};

var mediumParams =
{
  type : "medium",
  items : [ "English",
            "Hindi",
            "Assamese",
            "Bengali",
            "Gujarati",
            "Kannada",
            "Malayalam",
            "Marathi",
            "Nepali",
            "Odia",
            "Punjabi",
            "Tamil",
            "Telugu",
            "Urdu",
            "Other"  ]
             
};

var ownershipParams =
{
  type : "ownership",
  items : [ "current user",
            "all" ]
             
};

    console.log("TYPE OF FILTER ACTOIN",type)
    console.log("HANDLE CLICK",_this.params.languageParams)

    if(type == "Language")
        this.showFilterDialog(languageParams);
    if(type == "Grade")
        this.showFilterDialog(gradeParams);
    if(type == "Domain")
        this.showFilterDialog(domainParams);
    if(type == "Framework")
      this.showFilterDialog(frameworkParams);
    if(type == "Concepts")
      this.showFilterDialog(conceptsParams);
    if(type == "Type")
      this.showFilterDialog(typeParams);
    if(type == "Subject")
      this.showFilterDialog(subjectParams);
    if(type == "Medium")
      this.showFilterDialog(mediumParams);
    if(type == "Ownership")
      this.showFilterDialog(ownershipParams);
  }

  handleSelection(list){

    let cmd = _this.set({
    id: _this.idSet.filterCount,
      text: list.length + " added"
    });

  Android.runInUI(cmd,null);

  }

  showFilterDialog = (data) =>{
    console.log("DATA IN showFilterDialog",data)

    var layout = ( <LinearLayout
                    width="match_parent"
                    height="wrap_content"
                    visibility="visible"
                    alignParentBottom = "true,-1"
                    weight="1"
                    orientation="vertical"
                    background={window.__Colors.WHITE}
                    >

                    <ChooseItem
                    data={data}
                    onSelect={this.handleSelection}
                    />

                  </LinearLayout>);
    window.__RootScreen.showFilterDialog(layout,this.EaseOut);
  }


  getFilterRows(data){
    var layout = data.map((item, index) => {

                    return (
                          <LinearLayout
                            width="match_parent"
                            height="wrap_content"
                            margin="16,16,16,0"
                            gravity="center_vertical"
                            onClick={()=>{this.handleClick(item)}}>
                          
                           <LinearLayout
                            width="match_parent"
                            height="match_parent"
                            padding="10,10,0,10"
                            gravity="center_vertical"
                            background={window.__Colors.WHITE_F4}>

                              <TextView
                              width="wrap_content"
                              height="wrap_content"
                              text={item}
                              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                              <ViewWidget 
                              height = "1"
                              width = "0"
                              weight = "1"/>

                              <TextView
                              width="wrap_content"
                              height="wrap_content"
                              id={this.idSet.filterCount}
                              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                              <ImageView
                              width="24"
                              height="24"
                              imageUrl="ic_chevron_right"/>

                            </LinearLayout>
                          </LinearLayout>      )
                            
    })

      return   (
                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  orientation="vertical"
                  gravity="center_vertical">

                    {layout}

                </LinearLayout>)

  }

  afterRender = () =>{

    var layout = _this.getFilterRows(_this.props.filterData);

    this.replaceChild(this.idSet.rowsContainer, layout.render(), 0);

  }



  render() {
    this.layout = (
              <LinearLayout
                height="400"
                width="match_parent"
                afterRender={this.afterRender}
                background={window.__Colors.WHITE}
                orientation="vertical">

              
                <LinearLayout
                  width="match_parent"
                  height="wrap_content"
                  id={this.idSet.rowsContainer}
                  gravity="center_vertical"/>

      
              </LinearLayout> 

    )
    return this.layout.render();
  }
}

module.exports = FilterCard;
