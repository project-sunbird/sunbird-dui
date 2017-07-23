
module Fragments.ResourceFragment where

import Prelude (bind, ($), (<>), pure, discard)
import Utils
import Prelude
import Types.UITypes
import Types.APITypes
import UI

resourceFragment input whereFrom whatToSendBack = do
	event <- ui $ HomeActivity
	case event of
		OPEN_ResourceDetailActivity {resourceDetails:output} -> resourceDetailActivity output "ResourceFlow" input
		OPEN_ResourceViewAllActivity {resourceDetails:output} -> resourceViewAllActivity output "ResourceFragmnet" input
		OPEN_SearchActivity {filterDetails: output} -> rsourceSearchActivity output "ResourceFragmnet" input
		OPEN_CourseInforActivity {course : output} -> courseActivityFlow output "ResourceFragmnet" input
		API_FilterResourceFragment{user_token:user_token, api_token:api_key,filter_to_send:delta}  ->	do
																									responseData <- getResourcePageFilterApi user_token api_key delta
																									_ <- sendUpdatedState {response : responseData, responseFor : "StartResourcePageApi", screen:"asas"}
																									pure $ "handled"
		_ -> resourceFragment input whereFrom whatToSendBack


resourceSearchActivity input whereFrom whatToSendBack = do
  event <- ui $ SearchActivity {filterDetails:input}
  case event of
    OPEN_ResourceDetail {resourceDetails : output} -> startResourceDetailFlow output "ResourceSearch" input
    OPEN_Filter {filterDetails : output} -> startFilterFlowRes output "Terminate" input
    OPEN_SearchResource {course : output} -> startFilterActivity output "ResourceActivity" input
    _ -> rsourceSearchActivity

courseDetailActivity input whereFrom whatToSendBack = do
  event <- ui $ CourseEnrolledActivity {courseDetails:input}
  case event of
    OPEN_ModuleDetailsActivity {moduleName:mName,moduleDetails:output}-> moduleDetailsActivity mName output input
    BACK_CourseEnrolledActivity -> case whereFrom of
    	"ResourceActivity" -> resourceSearchActivity whatToSendBack 
    _ -> pure $ "default"

filterActivity input whereFrom whatToSendBack = do
  event <- ui $ FilterActivity {filterDetails : input}
  case event of
    OPEN_SearchActivity_FILTER {filterData: output} -> resourceSearchActivity output
    BACK_FilterActivity -> case whereFrom of
    	"SearchScreen" -> resourceSearchActivity whatToSendBack "Terminate" input
    	_ -> resourceSearchActivity whatToSendBack "FilterActivity" input 
  	_ -> filterActivity input whereFrom whatToSendBack 



resourceViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ ResourceViewAllActivity {resourceDetails : input}
	case event of
		OPEN_ResourceInfo {resourceDetails:output} -> resourceDetailActivity output "ResourceViewAll" input
		OPEN_ResourceViewAllDetail {resourceDetails:output} -> courseDetailActivity output "ResourceViewAll" input
		BACK_ResourceViewAllActivity -> case whereFrom of
			"ResourceFragmnet" -> resourceFragment "Terminate" "ResourceViewAllActivity"
			_ -> resourceFragment whatToSendBack "Terminate" input
		_ -> resourceViewAllActivity input whereFrom whatToSendBack

resourceDetailActivity input whereFrom whatToSendBack= do
	event <- ui $ ResourceDetailActivity {resourceDetails : input}
	case event of
		BACK_ResourceDetailActivity -> case whereFrom of
			"ResourceViewAllAcitivity" -> resourceViewAllActivity whatToSendBack "Terminate" input
			"resourceSearchActivity" -> resourceSearchActivity whatToSendBack "Terminate" input 
			"ResourceFragment" -> resourceFragment whatToSendBack "Terminate" input
			_ -> resourceFragment whatToSendBack "Terminate" input
		_ -> resourceDetailActivity input whereFrom whatToSendBack


-- --for collection and textbooks
-- resourceEnrolledCourseFlow cDetail= do
-- 	event <- ui $ CourseEnrolledScreen {courseDetails:cDetail}
-- 	case event of
-- 		DummyCourseEnrolledAction -> pure $ "handled"
--   		ShowModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceModuleDetailsFlow mName mDetails cDetail
-- 		_ -> pure $ "default"

-- resourceModuleDetailsFlow mName mDetails parentCourse= do
-- 	event <- ui $ ModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
-- 	case event of
-- 		DummyModuleDetailsAction -> pure $ "handled"
-- 		ShowSubModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceSubModuleDetailsFlow mName mDetails parentCourse
-- 		BackToParent -> resourceEnrolledCourseFlow parentCourse
--   		_ -> pure $ "default"

-- resourceSubModuleDetailsFlow mName mDetails parentCourse= do
-- 	event <- ui $ AlternateModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
-- 	case event of
-- 		DummyAlternateModuleDetailAction -> pure $ "handled"
-- 		ShowModuleAgainScreen {moduleName:mName,moduleDetails:mDetails}-> resourceModuleDetailsFlow mName mDetails parentCourse
-- 		BackToHome -> resourceEnrolledCourseFlow parentCourse
--   		_ -> pure $ "default"
