
module Fragments.ProfileFragment where


import Prelude (bind, ($), (<>), pure, discard)
import Utils
import Types.UITypes
import Types.APITypes
import UI



profileFragment input whereFrom whatToSendBack = do
	event <- ui $ MainActivity
	case event of
		OPEN_NotificationActivity -> notificationActivity "{}" "ProfileFragment"  input
		OPEN_CommProfSearchActivity {filterDetails : output} -> searchProfileActivity output "ProfileFragment" input
		OPEN_EditProfileActivity -> additionalInformationActivity "{}" "profileFragment"  input
		API_CreatedBy { user_token:x, api_token:y, sendBack:z , filters:w} -> do
			responseData <- compositeSearch x y w
			_ <- sendUpdatedState {response : responseData, responseFor : "API_CreatedBy", screen:"asas", sendBack:z}
			pure $ "handled"
		_ -> profileFragment input whereFrom whatToSendBack

notificationActivity input whereFrom whatToSendBack = do
	event <- ui $ NotificationActivity
	case event of
		BACK_NotificationActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment input "Terminate" input
			_ -> profileFragment input "Terminate" input
		_ -> notificationActivity input whereFrom whatToSendBack

searchProfileActivity input whereFrom whatToSendBack = do
	event <- ui $ CommProfSearchActivity {filterDetails:input}
	case event of
		API_SearchProfile {user_token:x, api_token:y, filter_to_send:z} -> do
			resData <- searchUser x y z
			_<- sendUpdatedState {response : resData, responseFor : "API_SearchProfile", screen:"asas"}
			pure $ "apiCalled"
		API_GetProfile {user_token:x, api_token:y} -> do
			resData <- getProfileDetail x y
			_<- sendUpdatedState {response : resData, responseFor : "API_GetProfile", screen:"asas"}
			pure $ "apiCalled"
		OPEN_ProfileActivity_SEARCH {profile: output} -> profileActivity output "CommProfSearchActivity" input
		BACK_CommProfSearchActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment whatToSendBack "Terminate" input
			_ -> profileFragment whatToSendBack "Terminate" input
		_ -> searchProfileActivity input whereFrom whatToSendBack

profileActivity input whereFrom whatToSendBack = do
	event <- ui $ ProfileActivity {profile : input}
	case event of
		OPEN_CommProfSearchActivity_Prof {filterDetails : output} -> searchProfileActivity output "ProfileFragment" input
		BACK_ProfileActivity -> searchProfileActivity whatToSendBack "Terminate" input
		_ -> profileActivity input whereFrom whatToSendBack

additionalInformationActivity input whereFrom whatToSendBack = do
	event <- ui $ AdditionalInformationActivity
	case event of
		BACK_AdditionalInformationActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment input "Terminate" input
			_ -> profileFragment input "Terminate" input
		_ -> additionalInformationActivity input whereFrom whatToSendBack
