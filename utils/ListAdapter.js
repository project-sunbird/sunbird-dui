var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");

var Space = require("@juspay/mystique-backend/src/android_views/Space");
var _this;

var ScrollView = require("@juspay/mystique-backend/src/android_views/ScrollView");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");

const filterParams = require('../FilterParams');


/*
Created By : Amit Rohan
How to use 
Import the class


list : list of items
_getCardLayout : a function that returns layout based on item ( input -> variable, output design based input with text and all)
scrollDirection=  ( 1 : vertical , 0 : horizontal , default : horizontal)

 <ListAdapter
    height="300"
    width="300"
    list={this.list1}
    scrollDirection="1"
    _getCardItem={this.getCardDesign}/>





*/

class ListAdapter extends View {
  constructor(props, children,state) {
    super(props, children,state);

   this.setIds([
      "childContainer",
      "parentContainer"]);
  
   
   this.scrollDirection= (this.props.scrollDirection==undefined)? "0": this.props.scrollDirection;


    this.startIndex=0;

  }

  getHorizintalList = ()=>{
    return (
      
          <HorizontalScrollView
           width = "match_parent"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

           <LinearLayout
                    padding="0,0,16,0"
                    width="match_parent"
                    id={this.idSet.parentContainer}
                    layoutTransition="true"
                    height="wrap_content">



         </LinearLayout>



          </HorizontalScrollView>)
  }


  getVerticalList = ()=>{
    return (
      
          <ScrollView
           width = "match_parent"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

           <LinearLayout
                    padding="0,0,16,0"
                    width="match_parent"
                    id={this.idSet.parentContainer}
                    layoutTransition="true"
                    orientation="vertical"
                    height="wrap_content">



         </LinearLayout>



          </ScrollView>)
  }


  loadNext = () => {

    if(this.startIndex>=this.props.list.length){
      return;
    }


    var item=this.props.list[this.startIndex];
    console.log("RENDERING ",item);

    var layout=(<LinearLayout
                  height="wrap_content"
                  width="wrap_content">

                    {this.props._getCardItem(item)}

                </LinearLayout>);
          
    this.appendChild(this.idSet.parentContainer,layout.render(),this.startIndex);

    this.startIndex++;

    var _this=this;
    setTimeout(()=>{
      _this.loadNext()
    },200);
  }

 
  loadList = () => {

      this.loadNext();
  }


  render() {

    var scrollLayout=(this.scrollDirection==0)?this.getHorizintalList():this.getVerticalList();
    this.layout = (
     <LinearLayout
      height={this.props.height || "match_parent" }
      width={this.props.width || "match_parent" }
      afterRender={this.loadList}
      root="true">

      {scrollLayout}

     </LinearLayout> 

    )
    return this.layout.render();
  }
}

module.exports = ListAdapter;
