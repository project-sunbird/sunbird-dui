
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
		OPEN_EditProfileActivity {profile: output} -> additionalInformationActivity output "ProfileFragment"  input
		OPEN_AddressActivity {profile: output} -> addressActivity output "ProfileFragment"  input
		OPEN_EducationActivity {profile: output} -> educationActivity output "ProfileFragment"  input
		OPEN_ExperienceActivity {profile: output} -> experienceActivity output "ProfileFragment"  input
		OPEN_EnrolledCourseActivity {course:output} -> enrolledCourseActivity output "ProfileFragment" input
		OPEN_CourseInfoActivity {course:output} -> courseInfoActivity output "ProfileFragment" input
		OPEN_ResourceDetailActivity {resourceDetails:output} -> resourceDetailActivity output "ProfileFragment" input
		API_CreatedBy { user_token:x, api_token:y, sendBack:z , filters:w} -> do
			responseData <- compositeSearch x y w
			_ <- sendUpdatedState {response : responseData, responseFor : "API_CreatedBy", screen:"asas", sendBack:z}
			pure $ "handled"
		API_SetProfileVisibility {user_token:x, api_token:y , request:z } -> do
			resData <- setProfileVisibility x y z
			_ <- sendUpdatedState{response : resData, responseFor : "API_SetProfileVisibility", screen:"asas"}
			pure $ "apiCalled"
		API_EndorseSkill {user_token: user_token,api_token: api_token,requestBody:request} -> do
			responseData <- endorseSkill user_token api_token request
			_ <- sendUpdatedState {response : responseData, responseFor : "API_EndorseSkill", screen:"asas"}
			pure $ "handled"
		API_GetSkillsList {user_token : user_token,api_token : api_token} -> do
			responseData <- getSkillsList user_token api_token
			_ <- sendUpdatedState {response : responseData, responseFor : "API_GetSkillsList", screen:"asas"}
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
		API_CreatedBy_Search { user_token:x, api_token:y, sendBack:z , filters:w} -> do
			responseData <- compositeSearch x y w
			_ <- sendUpdatedState {response : responseData, responseFor : "API_CreatedBy_Search", screen:"asas", sendBack:z}
			pure $ "handled"
		OPEN_ProfileActivity_SEARCH {profile: output} -> profileActivity output "CommProfSearchActivity" input
		BACK_CommProfSearchActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment whatToSendBack "Terminate" input
			_ -> profileFragment whatToSendBack "Terminate" input
		_ -> searchProfileActivity input whereFrom whatToSendBack

profileActivity input whereFrom whatToSendBack = do
	event <- ui $ ProfileActivity {profile : input}
	case event of
		OPEN_CommProfSearchActivity_Prof {filterDetails : output} -> searchProfileActivity output "ProfileFragment" input
		OPEN_EnrolledCourseActivity_Prof {course:output} -> enrolledCourseActivity output "ProfileActivity" input
		OPEN_CourseInfoActivity_Prof {course:output} -> courseInfoActivity output "ProfileActivity" input
		OPEN_ResourceDetailActivity_Prof {resourceDetails:output} -> resourceDetailActivity output "ProfileActivity" input
		API_EndorseSkill1 {user_token: user_token,api_token: api_token,requestBody:request} -> do
			responseData <- endorseSkill user_token api_token request
			_ <- sendUpdatedState {response : responseData, responseFor : "API_EndorseSkill1", screen:"asas"}
			pure $ "handled"
		API_GetSkills1 {user_token: user_token,api_token: api_token,requestBody:request} -> do
			responseData <- getSkills user_token api_token request
			_ <- sendUpdatedState {response : responseData, responseFor : "API_GetSkills1", screen:"asas"}
			pure $ "handled"
		BACK_ProfileActivity -> searchProfileActivity whatToSendBack "Terminate" input
		_ -> profileActivity input whereFrom whatToSendBack

additionalInformationActivity input whereFrom whatToSendBack = do
	event <- ui $ AdditionalInformationActivity {profile : input}
	case event of
		API_ProfileVisibility {user_token:x, api_token:y , request:z } -> do
			resData <- setProfileVisibility x y z
			_ <- sendUpdatedState{response : resData, responseFor : "API_ProfileVisibility", screen:"asas"}
			pure $ "apiCalled"
		BACK_AdditionalInformationActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment input "Terminate" input
			_ -> profileFragment input "Terminate" input
		_ -> additionalInformationActivity input whereFrom whatToSendBack

--------------------------------------------------------------------------------

addressActivity input whereFrom whatToSendBack = do
	event <- ui $ AddressActivity {profile : input}
	case event of
		BACK_AddressActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment input "Terminate" input
			_ -> profileFragment input "Terminate" input
		_ -> addressActivity input whereFrom whatToSendBack

--------------------------------------------------------------------------------

educationActivity input whereFrom whatToSendBack = do
	event <- ui $ EducationActivity {profile : input}
	case event of
		BACK_EducationActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment input "Terminate" input
			_ -> profileFragment input "Terminate" input
		_ -> educationActivity input whereFrom whatToSendBack

--------------------------------------------------------------------------------

experienceActivity input whereFrom whatToSendBack = do
	event <- ui $ ExperienceActivity {profile : input}
	case event of
		BACK_ExperienceActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment input "Terminate" input
			_ -> profileFragment input "Terminate" input
		_ -> experienceActivity input whereFrom whatToSendBack

--------------------------------------------------------------------------------

resourceDetailActivity input whereFrom whatToSendBack = do
	event <- ui $ ResourceDetailActivity {resourceDetails : input}
	case event of
		API_FlagContent{user_token: user_token,api_token: api_token,requestBody:request,identifier:identifier} -> do
			responseData <- flagContent user_token api_token request identifier
			_ <- sendUpdatedState {response : responseData, responseFor : "API_FlagContent", screen:"asas"}
			pure $ "handled"
		BACK_ResourceDetailActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment whatToSendBack "Terminate" input
			"ProfileActivity" -> profileActivity whatToSendBack "Terminate" input
			_ -> profileFragment whatToSendBack "Terminate" input
		_ -> resourceDetailActivity input whereFrom whatToSendBack

--------------------------------------------------------------------------------

courseInfoActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseInfoActivity {courseDetails : input}
	case event of
		OPEN_ViewBatchActivity {course: output}-> viewBatchActivity output "CourseInfoActivity" input
		OPEN_EnrolledActivity {course: output} -> enrolledCourseActivity output "CourseFragment" input
		API_EnrolledCoursesList {user_token:x,api_token:y} -> do
	            responseData <- getUserEnrolledCourses x y
	            _ <- sendUpdatedState {response : responseData, responseFor : "API_EnrolledCoursesList", screen:"asas"}
	            pure $ "apiDefault"
		BACK_CourseInfoActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment whatToSendBack "Terminate" input
			"ProfileActivity" -> profileActivity whatToSendBack "Terminate" input
			_ -> profileFragment whatToSendBack "Terminate" input
		_ -> courseInfoActivity input whereFrom whatToSendBack

enrolledCourseActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseEnrolledActivity {courseDetails : input}
	case event of
		API_Get_Batch_Creator_name {user_token:user_token,api_token:api_token} -> do
			responseData <- getUserDetail user_token api_token
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_Creator_name", screen:"asas"}
			pure $ "handled"
  		OPEN_ModuleDetailsActivity {moduleName:output1,moduleDetails:output2} -> subModuleDetailActivity output1 output2 "EnrolledCourseActivity" input
  		BACK_CourseEnrolledActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment whatToSendBack "Terminate" input
			"ProfileActivity" -> profileActivity whatToSendBack "Terminate" input
			_ -> profileFragment whatToSendBack "Terminate" input
		_ -> enrolledCourseActivity input whereFrom whatToSendBack


subModuleDetailActivity mName input whereFrom whatToSendBack = do
	event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		BACK_ModuleDetailActivity -> case whereFrom of
			"Misc" ->  subModuleDetailActivity mName input whereFrom input
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  enrolledCourseActivity whatToSendBack "Terminate" input
  		_ -> subModuleDetailActivity mName input whereFrom whatToSendBack


viewBatchActivity input whereFrom whatToSendBack = do
	event <- ui $ ViewBatchActivity {extras : input}
	case event of
		OPEN_EnrolledActivity_BATCH {course: output} -> enrolledCourseActivity output "CourseFragment" input
		API_BatchCreator {user_token:x, api_token:y} -> do
			resData <- getUserDetail x y
			_<- sendUpdatedState {response : resData, responseFor : "API_BatchCreator", screen:"ViewBatchActivity"}
			pure $ "apiCalled"
		API_Get_Batch_list {user_token : x, api_token: token , request : request } -> do
			responseData <- getBatchList x token request
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_list", screen:"asas"}
			pure $ "apiDefault"
		API_EnrollInBatch {reqParams : details , user_token : x, api_token: token} -> do
			responseData <- enrollInBatch details x token
			_ <- sendUpdatedState {response : responseData, responseFor : "API_EnrollInBatch", screen:"asas"}
			pure $ "apiDefault"
		BACK_ViewBatchActivity -> case whereFrom of
			"CourseInfoActivity" -> courseInfoActivity whatToSendBack "Terminate" input
			_ -> courseInfoActivity whatToSendBack "Terminate" input
		_ -> viewBatchActivity input whereFrom whatToSendBack
