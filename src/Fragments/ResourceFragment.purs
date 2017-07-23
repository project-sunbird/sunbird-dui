
module Fragments.ResourceFragment where

import Prelude (bind, ($), (<>), pure, discard)
import Utils
import Prelude
import Types.UITypes
import Types.APITypes
import UI

resourceFragment::String-> String -> String -> String
resourceFragment input whereFrom whatToSendBack = do
	event <- ui $ HomeActivity
	case event of
		OPEN_ResourceDetailActivity {resourceDetails:output} -> resourceDetailActivity $ output "ResourceFlow" input
		OPEN_ResourceViewAllActivity {resourceDetails:output} -> resourceViewAllActivity $ output "ResourceFragmnet" input
		OPEN_SearchActivity {filterDetails: output} -> resourceSearchActivity $ output "ResourceFragmnet" input
		OPEN_CourseInfoActivity {course : output} -> courseDetailActivity $ output "ResourceFragmnet" input
		API_FilterPage{user_token:user_token, api_token:api_key,filter_to_send:delta}  ->	do
																									responseData <- getResourcePageFilterApi user_token api_key delta
																									_ <- sendUpdatedState {response : responseData, responseFor : "StartResourcePageApi", screen:"asas"}
																									pure $ "handled"
		_ -> pure $ "resourceFragmentEvent"

resourceSearchActivity::String-> String -> String -> String
resourceSearchActivity input whereFrom whatToSendBack = do
	event <- ui $ SearchActivity {filterDetails:input}
	case event of
	    OPEN_ResourceDetailActivity_SEARCH {resourceDetails : output} -> resourceDetailActivity $ output "ResourceSearch" input
	    OPEN_FilterActivity {filterDetails : output} -> filterActivity $ output "Terminate" input
	    OPEN_CourseEnrolledActivity_SEARCH {course : output} -> courseDetailActivity $ output "ResourceActivity" input
	    _ -> pure $ "resourceSearchActivity"

filterActivity::String-> String -> String
filterActivity input whereFrom whatToSendBack = do
	event <- ui $ FilterActivity {filterDetails : input}
	case event of
		OPEN_SearchActivity_FILTER {filterData: output} -> resourceSearchActivity  (whatToSendBack "Terminate" input)
		BACK_FilterActivity -> case whereFrom of
			"SearchScreen" -> resourceSearchActivity (whatToSendBack "Terminate" input)
			_ -> resourceSearchActivity (whatToSendBack "FilterActivity" input) 
		_ -> pure $ "filterActivity"

resourceDetailActivity::String-> String -> String -> String
resourceDetailActivity input whereFrom whatToSendBack= do
	event <- ui $ ResourceDetailActivity {resourceDetails : input}
	case event of
		BACK_ResourceDetailActivity -> case whereFrom of
			"ResourceViewAllAcitivity" -> resourceViewAllActivity (whatToSendBack "Terminate" input)
			"ResourceSearchActivity" -> resourceSearchActivity (whatToSendBack "Terminate" input) 
			"ResourceFragment" -> resourceFragment (whatToSendBack "Terminate" input)
			_ -> resourceFragment (whatToSendBack "Terminate" input)
		_ -> pure $ "resourceDetailActivity"

courseDetailActivity::String-> String -> String -> String
courseDetailActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseEnrolledActivity {courseDetails:input}
	case event of
		OPEN_ModuleDetailsActivity {moduleName : output1 , moduleDetails : output2} -> moduleResourceDetailActivity (output1 output2 "CourseEnrolledActivity" input)
		BACK_CourseEnrolledActivity -> case whereFrom of
			"ResourceActivity" -> resourceSearchActivity (whatToSendBack "Terminate" input)
			_ -> resourceFragment (whatToSendBack whereFrom input)
		_ -> pure $ "courseDetailActivity"

moduleResourceDetailActivity::String-> String -> String -> String -> String
moduleResourceDetailActivity mName input whereFrom whatToSendBack= do
	event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		AlternateModuleDetailActivity {moduleName:output1,moduleDetails:output2}-> subModuleResourceDetailActivity (output1 output2  "Terminate" input)
		BACK_ModuleDetailActivity -> case whereFrom of
			"CourseEnrolledActivity" -> courseDetailActivity (whatToSendBack "Terminate" input)
			"Terminate" -> courseDetailActivity (whatToSendBack "Terminate" input)
			_ ->  courseDetailActivity (event "Terminate" input)
  		_ -> pure $ "moduleResourceDetailActivity"

subModuleResourceDetailActivity::String -> String -> String -> String
subModuleResourceDetailActivity mName input whereFrom whatToSendBack= do
	event <- ui $ AlternateModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		OPEN_ModuleActivity {moduleName:output1,moduleDetails:output2}-> moduleResourceDetailActivity (output1 output2 "Terminate" input)
		BACK_AlternateModuleDetailActivity -> case whereFrom of
			"Terminate"->  courseDetailActivity $ whatToSendBack "Terminate" input
			"CourseEnrolledActivity" -> courseDetailActivity $ whatToSendBack "Terminate" input
			_ ->  courseDetailActivity $ whatToSendBack "Terminate" input
  		_ -> pure "subModuleResourceDetailActivity"

resourceViewAllActivity::String-> String -> String -> String
resourceViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ ResourceViewAllActivity {resourceDetails : input}
	case event of
		OPEN_ResourceInfo {resourceDetails:output} -> resourceDetailActivity $ output "ResourceViewAll" input
		OPEN_CourseEnrolled {resourceDetails:output} -> courseDetailActivity $ output "ResourceViewAll" input
		BACK_ResourceViewAllActivity -> case whereFrom of
			"ResourceFragmnet" -> resourceFragment $ whatToSendBack "Terminate" input
			_ -> resourceFragment $ whatToSendBack "Terminate" input
		_ -> pure $ "resourceViewAllActivity"