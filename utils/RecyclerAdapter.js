var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ListView = require("@juspay/mystique-backend").androidViews.ListView;

var Space = require('@juspay/mystique-backend').androidViews.Space;
var _this;

const filterParams = require('../FilterParams');


/*
Created By : Amit Rohan
How to use 
Import the class


list : list of items
_getCardLayout : a function that returns layout based on item ( input -> variable, output design based input with text and all)
scrollDirection=  ( 1 : vertical , 0 : horizontal , default : horizontal)

 <RecyclerAdapter
    height="300"
    width="300"
    list={this.list1}
    scrollDirection="1"
    id="IdForRecyclerView"
    _getCardItem={this.getCardDesign}/>





*/

class RecyclerAdapter extends View {
  constructor(props, children,state) {
    super(props, children,state);


      this.setIds([
       "parentContainer"
      ]);
  
   
     this.scrollDirection= (this.props.scrollDirection==undefined)? "0": this.props.scrollDirection;

  }

  getCardLayout= (item)=>{
    return this.props._getCardItem(item);
  }
 
  loadList = () => {

    var jsonArray = [];

     this.props.list.map((item, index) => {
  
     this.jsonArray.push({ view: this.getView(this.getCardLayout(item).render()), value: "", viewType: 1 });

    });

    //id,viewJsx,1,spanCount,direction
    JBridge.listViewAdapter(
      this.idSet.parentContainer,
      JSON.stringify(this.jsonArray),
      1
    );
   


  }


  render() {
    this.layout = (
     <LinearLayout
      height={"300" }
      width={"300" }
      afterRender={this.loadList}
      root="true">

       <ListView
        height="match_parent"
        width="match_parent"
        id={this.idSet.parentContainer}
        background="#123123"/>
     </LinearLayout> 

    )
    return this.layout.render();
  }
}

module.exports = RecyclerAdapter;
