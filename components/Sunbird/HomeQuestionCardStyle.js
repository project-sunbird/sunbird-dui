var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");

var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");

var _this;

window.R = require("ramda");

class HomeQuestionCardStyle extends View {

	constructor(props, children, state) {
		super(props, children, state);
		this.setIds([
			"parentId"
    	]);
		this.state = state;
		this.screenName = "HomeQuestionCardStyle";
		window.__HomeQuestionCardStyle = this;
		this.visible = true;

		_this = this;

	}

	show = () => {
    this.setVisibility("visible");
    this.isVisible=true;
    //this.afterRender();
  }

  hide = () => {
    this.setVisibility("gone");
    this.isVisible=false;
  }

	setVisibility = (data) => {
    var cmd = this.set({
      id: this.idSet.parentId,
      visibility: data
    })
    Android.runInUI(cmd, 0)
  }

	onPop = () => {}

	handleLoginClick = () => {
		if(this.props.fromWhere && this.props.fromWhere!="")
			JBridge.logGuestEvent(this.props.fromWhere);
			
		JBridge.setInSharedPrefs("goToOnLogin", this.props.currComponentLocation);
		console.log(window.__loginUrl, "/auth/realms/sunbird/protocol/openid-connect/auth ", "android");
		JBridge.keyCloakLogin(window.__loginUrl + "/auth/realms/sunbird/protocol/openid-connect/auth", "android");
	}

	afterRender = () => {
		JBridge.logSettingsScreenEvent("SIGNIN_OVERLAY");

	}

	render = () => {
		this.layout = (
			<LinearLayout
				height={this.props.height ? this.props.height : "wrap_content"}
				width="match_parent"
				id={this.idSet.parentId}
				orientation="vertical"
				background={"#FFFFFF"}
				padding="16,16,16,16"
				cornerRadius="5"
				clickable="true"
				afterRender={this.afterRender}
				root={true}>
				<TextView
					height="27"
					width="match_parent"
					text={this.props.headerText ? this.props.headerText : ""}
					textSize={this.props.textSize ? this.props.textSize : "20"}
					color={"#000000"}
					gravity={this.props.gravity ? this.props.gravity : "center"}
				/>
				<TextView
					height="match_parent"
					width="match_parent"
					padding="0,16,0,16"
					text={this.props.infoText ? this.props.infoText : ""}
					textSize={"15"}
					color={"#000000"}
					gravity={this.props.gravity ? this.props.gravity : "center"}
				/>
				<LinearLayout
					height="38"
					width="match_parent"
					onClick={this.handleLoginClick}>
					<TextView
						background={window.__Colors.THICK_BLUE}
						stroke={"5," + window.__Colors.THICK_BLUE}
						cornerRadius="5"
						height="match_parent"
						width="match_parent"
						gravity="center"
						textAllCaps="true"
						style={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}
						text={window.__S.SIGN_IN} />
				</LinearLayout>
			</LinearLayout>
		);
		//this.containerId = this.layout.idSet.id;
		return this.layout.render();
	}

};

module.exports = HomeQuestionCardStyle;
