var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
import TodoCard from '../Sunbird/TodoCard';

class TodoContainer extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      'todoContainer'
    ]);
  }


  afterRender = () => {
    this.indexItems = this.props.todoData;
    this.tmpArr = [];
    var _this = this;
    for (var i = 0; i < this.indexItems.length; i++) {

      var dat = {
        moduleBackground: (i % 2 == 0 ? "#22007aff" : "#229012FE"),
        moduleName: _this.indexItems[i]["name"],
        moduleImage: _this.indexItems[i]["imageUrl"],
        moduleClass: _this.indexItems[i]["class"],
        modulePendingClass: _this.indexItems[i]["pen_classes"],
        
      }
      console.log("ADDING")
      _this.tmpArr.push(dat)
    }
    console.log("SENDING THIS ", this.tmpArr)

    var cards = this.tmpArr.map((item, i) => {
      return (
        <TodoCard 
          item={item} 
          index={i} 
          onClick={this.handleModuleClick} />)
    });

    var renderItem = (<LinearLayout 
                        height="match_parent" 
                        root="true"
                        padding="0,16,0,20"
                        orientation="horizontal"
                        layout_gravity="center_horizontal"
                        width="match_parent">
                          {cards}
                    </LinearLayout>);
    console.log(renderItem)
    this.replaceChild(this.idSet.todoContainer, renderItem.render(), 0);
  }

  handleModuleClick = (index) => {
    console.log("in TODO container",index)
    this.props.onClick(index);
  }



  render() {


    this.layout = (

      <LinearLayout
      width="360"
      height="218"
      margin = "0,0,0,0"
      afterRender={this.afterRender}
      orientation="vertical"
      background={window.__Colors.CREAM}
      >

          <LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin = "0,0,0,0"
              >

          <TextView 
          margin="16,16,16,16"
          style={window.__TextStyle.textStyle.TITLE.DARK}
          text="Todo"/>
          <Space 
            width="0"
            weight="1"
          />


        </LinearLayout>
           <HorizontalScrollView
            width = "wrap_content"
            height = "wrap_content"
            scrollBarX="false"
            fillViewport="true">
              <LinearLayout
                id={this.idSet.todoContainer}
                orientation="vertical"
                height="wrap_content"
                width="match_parent"
                >
              </LinearLayout>
          </HorizontalScrollView>
                        
        <TextView 
          margin="16,0,0,0"
          style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}
          text="View all to-dos >"/>
                    
       </LinearLayout>


    )

    return this.layout.render();
  }
}

module.exports = TodoContainer;