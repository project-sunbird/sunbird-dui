var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var FilterView = require('../components/HPCL/FilterBottomSheet');

var Colors = require("../res/Colors").color;
var CustomSnackBar = require("../components/HPCL/CustomSnackBar");

class RootScreen extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      'root'
    ]);

    this.OTP = null;
    this.setStatusBarColor(Colors.BLACK);
  }

  handleStateChange = () => {
    return true;
  }

  startOTP = () => {
    OtpJBridge.setOtpRules(JSON.stringify(window.otpRules));
    this.startSessionOTP();

    OtpJBridge.startOtpAutoRead("2000", "0", "0", "BHIM"); //interval, delay, bank
  }

  stopOTP = () => {
    OtpJBridge.stopOtpAutoRead();
  }

  startSessionOTP = () => {
    OtpJBridge.setSessionStartForOtp(new Date().getDate().toString());
  }

  onOtpReceived = (otp) => {
    this.stopOTP();
    this.OTP = otp;
  }

  setStatusBarColor(color) {
    let _color = "set_color=android.graphics.Color->parseColor:s_" + color + ";";

    Android.runInUI(
      "set_win=ctx->getWindow;get_win->addFlags:i_-2147483648;" + _color + "get_win->setStatusBarColor:get_color",
      null
    );
  }



  render() {
    this.layout = (
      <RelativeLayout
        root="true" 
        width="match_parent" 
        height="match_parent">
        <LinearLayout
          orientation="vertical"
          width="match_parent"
          height="match_parent">   
           
          <RelativeLayout
            id = {this.idSet.root}
            width="match_parent"
            height="match_parent">
          </RelativeLayout>

        </LinearLayout>

        
        <FilterView />
         
        <CustomSnackBar
          text = "snackBar"/>

      </RelativeLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(RootScreen);
