
module Flows.CourseFlow where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Maybe
import Flows.NotificationFlow
import Flows.FilterFlow
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON,decodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Types.UITypes
import Types.APITypes
import UI



startCourseFlow values = do
	event <- ui $ HomeScreen
	case event of
		StartCourseInfoFlow {course:courseDetail} -> startCourseInfoFlow courseDetail "CourseFlow" values
		StartEnrolledCourseFlow {course:courseDetail} -> startEnrolledCourseFlow courseDetail "CourseFlow" values
		StartNotificationFlow -> startNotificationFlow values
		StartSearchFlow {filterDetails : details} -> startCourseSearchFlow details
		StartCourseViewAllFlow {courseListDetails : details} -> startCourseViewAllFlow details
		GetEnrolledCourseApi {user_token:x,api_token:y}-> do
			responseData <- getUserEnrolledCourses x y
	 		_ <- sendUpdatedState {response : responseData, responseFor : "GetEnrolledCourseApi", screen:"asas"}
	  		pure $ "apiDefault"
		_ -> pure $ "default"


startCourseViewAllFlow values = do
	event <- ui $ CourseViewAllScreen {courseViewAllDetails : values}
	case event of
		StartEnrolledCourseFlowFromCourseViewAll {course:details} -> startEnrolledCourseFlow details "CourseViewAll" values
		DummyCourseViewAllAction -> pure $ "handled"
		_ -> pure $ "handled"

startCourseInfoFlow values whereFrom whatToSendBack= do
	event <- ui $ CourseInfoScreen {courseDetails:values}
	case event of
		DummyCourseInfoAction -> pure $ "handled"
		ShowEnrolledCourse {course:courseDetail} -> startEnrolledCourseFlow courseDetail "CourseFlow" whatToSendBack
		EnrollCourseApi {user_token:x,reqParams:details,api_token:token} -> do
			output <- enrollCourse x details token
  			_ <- sendUpdatedState {response : output, responseFor : "EnrollCourseApi", screen:"asas"}
			pure $ "apiDefault"

		ShowModuleDetails {moduleName:mName,moduleDetails:mDetails}-> startModuleDetailsFlow mName mDetails values
		CourseInfoBackpress -> do
			case whereFrom of
				"CourseFlow" -> startCourseFlow whatToSendBack
				"CourseViewAll" -> startCourseViewAllFlow whatToSendBack
				"CourseSearch" -> startCourseSearchFlow whatToSendBack
				_ -> startCourseFlow whatToSendBack
		_ -> pure $ "default"

startEnrolledCourseFlow values whereFrom whatToSendBack= do
	event <- ui $ CourseEnrolledScreen {courseDetails:values}
	case event of
		DummyCourseEnrolledAction -> pure $ "handled"
  		ShowModuleScreen {moduleName:mName,moduleDetails:mDetails}-> startModuleDetailsFlow mName mDetails values
  		CourseEnrolledBackpress -> do
			case whereFrom of
				"CourseFlow" -> startCourseFlow whatToSendBack
				"CourseViewAll" -> startCourseViewAllFlow whatToSendBack
				_ -> startCourseFlow whatToSendBack 
		_ -> pure $ "default"

startModuleDetailsFlow mName mDetails parentCourse= do
	event <- ui $ ModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
	case event of
		DummyModuleDetailsAction -> pure $ "handled"
		ShowSubModuleScreen {moduleName:mName,moduleDetails:mDetails}-> startSubModuleDetailsFlow mName mDetails parentCourse
		BackToParent -> startEnrolledCourseFlow parentCourse "CourseFlow" parentCourse
  		_ -> pure $ "default"

startSubModuleDetailsFlow mName mDetails parentCourse= do
	event <- ui $ AlternateModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
	case event of
		DummyAlternateModuleDetailAction -> pure $ "handled"
		ShowModuleAgainScreen {moduleName:mName,moduleDetails:mDetails}-> startModuleDetailsFlow mName mDetails parentCourse
		BackToHome -> startEnrolledCourseFlow parentCourse "CourseFlow" parentCourse
  		_ -> pure $ "default"

startCourseSearchFlow values = do
  liftEff $ log $ "Search FLow started"
  event <- ui $ SearchScreen {filterDetails:values}
  case event of
    CourseInfoFlow {course : details} -> startCourseInfoFlow details "CourseSearch" values
    StartFilterFlow{filterDetails : details} -> startFilterFlow details
    SearchResourceFlow {course : details} -> startCourseInfoFlow details "CourseSearch" values
    _ -> pure $ "aborted"
