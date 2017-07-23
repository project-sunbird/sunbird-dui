
module Main where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Utils

import Fragments.CommunityFragment
import Fragments.CourseFragment
import Fragments.ProfileFragment
import Fragments.ResourceFragment
import Fragments.HomeFragment

import Prelude
import Types.UITypes
import Types.APITypes
import UI


main :: Eff (exception::EXCEPTION, ui::UI, console::CONSOLE) Unit
main = void $ launchAff $ splashScreenActivity "{}" "Main" "{}"


splashScreenActivity::String-> String -> String -> Unit
splashScreenActivity input whereFrom whatToSendBack= do
  event <- ui $ SplashScreen
  case event of
    OPEN_UserScreenActivity -> userScreenActivity "{}" "SplashScreen" input
    _ -> splashScreenActivity input pId memory

userScreenActivity::String-> String -> String -> Unit
userScreenActivity input whereFrom whatToSendBack = do
  event <- ui UserActivity
    case event of
      API_SignUp{userName:x1,email:x2,firstName:x3,password:x4,mobileNumber:x5,language:x6,api_token:x7} -> do
        responseData <- userSignup $ x1 x2 x3 x4 x5 x6 x7
        _ <- sendUpdatedState {response : responseData, responseFor : "SignUpApiAction", screen:"asas"} 
        pure $ "Aborted 3"
      OPEN_MainActivity -> mainActivity "{}" "UserActivity" input 
      _ -> userScreenActivity input whereFrom whatToSendBack

mainActivity::String-> String -> String -> Unit 
mainActivity input whereFrom whatToSendBack = do
  event <- ui $ MainActivity
  case event of
    OPEN_HomeFragment {name:output} -> homeFragment "MainActivity" output
    OPEN_CourseFragment -> courseFragment input $ "{}" "MainActivity" input
    OPEN_ResourceFragment -> resourceFragment $ "{}" "MainActivity" input
    OPEN_CommunityFragment -> communityFragment $ "{}" "MainActivity" input
    OPEN_ProfileFragment -> profileFragment $ "{}" "MainActivity" input
    
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
    _ -> mainActivity input whereFrom whatToSendBack

changeFlow :: Eff (exception::EXCEPTION, ui::UI, console::CONSOLE) Unit
changeFlow = void $ launchAff $ mainActivity "{}" "LogInScreen" "Nothing"
