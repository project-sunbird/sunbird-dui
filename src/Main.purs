
module Main where

import Control.Monad.Aff

import Utils

import Fragments.CommunityFragment
import Fragments.CourseFragment
import Fragments.ProfileFragment
import Fragments.ResourceFragment
import Fragments.HomeFragment

import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import Types.UITypes
import Types.APITypes
import UI


main :: Eff (exception::EXCEPTION, ui::UI, console::CONSOLE) Unit
main = void $ launchAff $ splashScreenActivity

splashScreenActivity :: Aff(ui::UI,console::CONSOLE) String
splashScreenActivity = do
    event <- ui $ InitScreen
    case event of
        OPEN_UserActivity -> userActivity "SplashScreenActivity"
        _ -> pure $ "SplashScreenActivity"


userActivity input = do
    event <- ui $ UserActivity {whereFrom:input}
    case event of
        API_GetProfileData {user_token:x,api_token:y}-> do
            responseData <- getProfileDetail x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_GetProfileData", screen:"asas"}
            pure $ "handled"
        API_SignUp { request: requestBody , api_token :token} -> do
            responseData <- userSignup requestBody token
            _ <- sendUpdatedState {response : responseData, responseFor : "API_SignUp", screen:"asas"}
            pure $ "Aborted 3"
        API_EnrolledCourses {user_token:x,api_token:y}-> do
            responseData <- getUserEnrolledCourses x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_EnrolledCourses", screen:"asas"}
            pure $ "apiDefault"
        OPEN_MainActivity -> mainActivity "{}" "UserActivity" "{}"
        OPEN_Deeplink_ResourceDetail {resource:details} ->  resourceDetailActivity details "Deeplink" details
        OPEN_Deeplink_CourseEnrolled {course:details} -> enrolledCourseActivity details "Deeplink" details
        OPEN_DeepLink_CourseInfo {course:details} -> courseInfoActivity details "Deeplink" details
        OPEN_DeepLink_ContentPreview {details:details} -> contentPreviewActivity details "Deeplink" details

        _ -> pure $ "UserActivity"

contentPreviewActivity input whereFrom whatToSendBack = do
    event <- ui $ ContentPreviewScreen {details:input}
    case event of
        BACK_ContentPreviewScreen -> pure $ "handled"
        OPEN_UserActivityFromPreview -> userActivity "Deeplink"
        _ -> pure $ "default"



courseInfoActivity input whereFrom whatToSendBack= do
    event <- ui $ CourseInfoActivity {courseDetails:input}
    case event of
        OPEN_EnrolledActivity {course:output} -> enrolledCourseActivity output "HomeFragment" input
        API_EnrollCourse {user_token:x,reqParams:details,api_token:token} -> do
            output <- enrollCourse x details token
            _ <- sendUpdatedState {response : output, responseFor : "API_EnrollCourse", screen:"asas"}
            pure $ "apiDefault"
        API_EnrolledCoursesList {user_token:x,api_token:y} -> do
                responseData <- getUserEnrolledCourses x y
                _ <- sendUpdatedState {response : responseData, responseFor : "API_EnrolledCoursesList", screen:"asas"}
                pure $ "apiDefault"
        BACK_CourseInfoActivity -> do
            case whereFrom of
                "Deeplink" -> mainActivity "{}" "UserActivity" "{}"
                _ -> pure $ "default"
        _ -> courseInfoActivity input whereFrom whatToSendBack


resourceDetailActivity input whereFrom whatToSendBack = do
    event <- ui $ ResourceDetailActivity {resourceDetails : input}
    case event of
        BACK_ResourceDetailActivity -> case whereFrom of
            "Deeplink" -> mainActivity "{}" "UserActivity" "{}"
            _ -> resourceFragment whatToSendBack "Terminate" input
        _ -> resourceDetailActivity input whereFrom whatToSendBack

enrolledCourseActivity input whereFrom whatToSendBack = do
    event <- ui $ CourseEnrolledActivity {courseDetails : input}
    case event of
        API_FlagCourse {user_token: user_token,api_token: api_token,requestBody:request,identifier:identifier} -> do
            responseData <- flagContent user_token api_token request identifier
            _ <- sendUpdatedState {response : responseData, responseFor : "API_FlagCourse", screen:"asas"}
            pure $ "handled"
        OPEN_ModuleDetailsActivity {moduleName:output1,moduleDetails:output2} -> subModuleDetailActivity output1 output2 "DeepLinkCourseEnrolled" input
        BACK_CourseEnrolledActivity -> case whereFrom of
            "Deeplink" -> mainActivity "{}" "UserActivity" "{}"
            _ -> mainActivity "{}" "UserActivity" "{}"
        _ -> enrolledCourseActivity input whereFrom whatToSendBack


subModuleDetailActivity mName input whereFrom whatToSendBack = do
    event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
    case event of
        BACK_ModuleDetailActivity -> case whereFrom of
            "DeepLinkCourseEnrolled" -> enrolledCourseActivity whatToSendBack "Terminate" input
            _ ->  enrolledCourseActivity whatToSendBack "Terminate" input
        _ -> subModuleDetailActivity mName input whereFrom whatToSendBack


mainActivity input whereFrom whatToSendBack = do
    event <- ui $ MainActivity
    case event of
        OPEN_HomeFragment -> homeFragment input "MainActivity" input
        OPEN_CourseFragment -> courseFragment input "MainActivity" input
        OPEN_ResourceFragment -> resourceFragment input "MainActivity" input
        OPEN_CommunityFragment -> communityFragment input "MainActivity" input
        OPEN_ProfileFragment -> profileFragment input "MainActivity" input

        API_CourseFragment {user_token:x,api_token:y}-> do
            responseData <- getCoursesPageApi x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_CourseFragment", screen:"asas"}
            pure $ "handled"
        API_ResourceFragment {user_token:x,api_token:y}-> do
            responseData <- getResourcePageApi x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_ResourceFragment", screen:"asas"}
            pure $ "handled"
        API_ProfileFragment {user_token:x,api_token:y}-> do
            responseData <- getProfileDetail x y
            _ <- sendUpdatedState {response : responseData, responseFor : "API_ProfileFragment", screen:"asas"}
            pure $ "handled"
        API_Tenant {user_token:x, api_token:y, slug:z} -> do
          responseData <- getTenantDetail x y z
          _ <- sendUpdatedState {response : responseData, responseFor : "API_Tenant", screen:"asas"}
          pure $ "apiDefault"
        _ -> mainActivity input whereFrom whatToSendBack


changeFlow = void $ launchAff $ mainActivity "{}" "LogInScreen" "Nothing"
onBoardingFLow = void $ launchAff $ userActivity "SplashScreenActivity"
