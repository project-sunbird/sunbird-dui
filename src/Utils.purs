module Utils where

import Prelude
import Data.String
import Data.List (List(..), fromFoldable)
import Data.List.Types
import Data.Identity
import Data.Foreign.Index
import Data.NonEmpty (NonEmpty(..), singleton, head, tail, (:|))
import Data.Foldable
import Data.Array
import Control.Monad.Eff
import Control.Monad.Eff.Console
import Control.Monad.Aff (launchAff, Aff, makeAff, attempt)
import Control.Monad.Eff.Exception (Error, error, try)
import Control.Monad.Eff.Class (liftEff)
import Network.HTTP.StatusCode
import Network.HTTP.RequestHeader
import Data.HTTP.Method (Method(..))
import Data.Either
import Data.Maybe
import Data.Foreign
import Data.Foreign.Class
import Data.Foreign.Generic
import Data.Foreign.Index
import Data.Argonaut.Core as A
import Data.StrMap as StrMap
import Data.Tuple
import Control.Monad.Except.Trans
import Partial.Unsafe
import Data.Bifoldable

    
type State a = {screen :: String | a}

type AffError e = (Error -> Eff e Unit)
type AffSuccess s e = (s -> Eff e Unit)
type ApiResponse = {status :: String, statusCode :: Int, response :: A.Json}

foreign import sendUpdatedState' :: forall e s1 s2. (AffSuccess (State s1) e) -> (AffError e) -> (State s2) -> Eff e Unit  
foreign import setRegistrationToken' :: forall e a s. (AffSuccess s e) -> (AffError e) -> String -> Eff e Unit
foreign import getRegistrationToken' :: forall e a s. (AffSuccess String e) -> (AffError e) -> Eff e Unit
foreign import setEmployeeDetails' :: forall e a s. (AffSuccess s e) -> (AffError e) -> a -> Eff e Unit
foreign import getEmployeeDetails' :: forall e s. (AffSuccess s e) -> (AffError e) -> Eff e Unit
foreign import setLoginToken' :: forall e s. (AffSuccess s e) -> (AffError e) -> String -> Eff e Unit
foreign import getLoginToken' :: forall e a s. (AffSuccess String e) -> (AffError e) -> Eff e Unit
foreign import getDeviceDetails' :: forall e. (AffSuccess A.Json e) -> (AffError e) -> Eff e Unit
foreign import updateState' :: forall a b s1 s2 e. (AffSuccess (State s2) e) -> (AffError e) -> a -> (State s1) -> Eff e Unit
foreign import showUI' :: forall e a b. (AffSuccess (State a) e) -> (AffError e) -> (State b) -> Boolean -> Eff e Unit
foreign import getLoginStatus' :: forall e a b. (AffSuccess Boolean e) -> (AffError e) -> b -> Eff e Unit
foreign import checkPermission' :: forall a e. (AffSuccess {|a} e) -> (AffError e) -> Eff e Unit 
foreign import setPermissions' :: forall a e. (AffSuccess {|a} e) -> (AffError e) -> Eff e Unit 
foreign import getCurrentDay :: Int -> String
foreign import callAPI' :: forall e. (AffSuccess ApiResponse e) -> (AffError e) -> Method -> String -> A.Json -> Array RequestHeader -> Eff e Unit

sendUpdatedState state = ExceptT (pure <$> makeAff(\error success -> sendUpdatedState' success error state))
getRegistrationToken = ExceptT (pure <$> makeAff(\error success -> getRegistrationToken' success error))
setRegistrationToken token =  ExceptT $ pure <$> makeAff(\error success -> setRegistrationToken' success error token)
getEmployeeDetails = ExceptT $ pure <$> makeAff(\error success -> getEmployeeDetails' success error)
setEmployeeDetails empDetails = ExceptT $ pure <$> makeAff(\error success -> setEmployeeDetails' success error empDetails)
getLoginToken = ExceptT (pure <$> makeAff(\error success -> getLoginToken' success error))
setLoginToken loginToken = ExceptT $ pure <$> makeAff(\error success -> setLoginToken' success error loginToken)
getDeviceDetails = ExceptT $ pure <$> makeAff(\error success -> getDeviceDetails' success error)
updateState changes state = ExceptT $ pure <$> makeAff(\error success -> updateState' success error changes state)
getLoginStatus response = ExceptT $ pure <$> makeAff(\error success -> getLoginStatus' success error response)

get path headers =
  makeAff(\error success -> callAPI' success error GET ("https://qa.ekstep.in" <> path) (A.jsonEmptyObject) headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers
                            
post path headers body =
  makeAff(\error success -> callAPI' success error POST ("https://qa.ekstep.in" <> path) body headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers

delete path headers =
  makeAff(\error success -> callAPI' success error DELETE ("https://qa.ekstep.in" <> path) (A.jsonEmptyObject) headers')
  where headers' = cons (RequestHeader "Content-Type" "application/json") headers
        
checkPermission = ExceptT (pure <$> makeAff(\error success -> checkPermission' success error))
setPermissions = ExceptT (pure <$> makeAff(\error success -> setPermissions' success error))
                          
retry' :: forall e a. Aff e a -> (a -> Boolean) -> Int -> String -> ExceptionableAff e a 
retry' action cond i errMsg = ExceptT $ retry'' action cond i errMsg
                              where retry'' action cond i errMsg | i == 0 = pure $ Left $ error errMsg
                                                                 | otherwise = do
                                                                     res <- action
                                                                     if cond res then pure $ Right res else retry'' action cond (i-1) errMsg



getPropFromPath :: forall a. (IsForeign a) => Foreign -> String -> F a
getPropFromPath f s = let path = fromFoldable $ split (Pattern ".") s
                        in ExceptT <$> runExceptT $ parseProp path f where
                          parseProp :: forall a. (IsForeign a) => List String -> Foreign -> F a
                          parseProp path f' = case path of
                                                  Nil -> ExceptT(Identity(Left (NonEmptyList (singleton (JSONError "No key specified")))))
                                                  (Cons x Nil) -> readProp x f'
                                                  (Cons x xs) -> (readProp x f') >>= (parseProp xs)
infixr 5 getPropFromPath as #!

                                                                        
type ExceptionableAff e a = ExceptT Error (Aff e) a
type ExceptionableEff e a = ExceptT Error (Eff e) a


pollTokenStatus token = unsafePartial $ 
  let requestUrl = "/api/content/v3/hierarchy/" <> token  
   headers = [(RequestHeader "api_key" registrationToken)]
  payload = A.fromObject (StrMap.fromFoldable [(Tuple "passcode" (A.fromString passcode))]) in
  ExceptT $ attempt $ ((post ("/api/v1/employee/" <> employeeId) headers payload))
 


newRegistrationToken = do
  deviceDetails <- getDeviceDetails
  ExceptT $ attempt $ (post "/api/v1/devices?embed=registrationToken" [] deviceDetails)

getTokenStatus token = 
  let requestUrl = "/api/v1/tokens/" <> token in 
  ExceptT $ attempt $ (get requestUrl [])

pollTokenStatus token = unsafePartial $ 
  let requestUrl = "/api/v1/tokens/" <> token in 
  map (\r -> r.response) $ retry' (get requestUrl []) (\r -> extractTokenStatus r) 5 "VERIFICATION_FAILED"

setPasscode passcode employeeId registrationToken =
  let requestUrl = "/api/v1/employee/" <> employeeId
      headers = [(RequestHeader "X-Reg-Token" registrationToken)]
      payload = A.fromObject (StrMap.fromFoldable [(Tuple "passcode" (A.fromString passcode))]) in
  ExceptT $ attempt $ ((post ("/api/v1/employee/" <> employeeId) headers payload))
  
managerLogin passcode registrationToken =
  let requestUrl = "/api/v1/employee/login"
      headers = [(RequestHeader "X-Reg-Token" registrationToken)]
      payload = A.fromObject (StrMap.fromFoldable [(Tuple "passcode" (A.fromString passcode))]) in
  ExceptT $ attempt $ (post requestUrl headers payload)

boothLogin boothId registrationToken =
  let requestUrl = "/api/v1/booths/" <> boothId <> "/boothLogin"
      headers = [(RequestHeader "X-Reg-Token" registrationToken)]
      payload = A.fromObject (StrMap.fromFoldable []) in
  ExceptT $ attempt $ (post requestUrl headers payload)

getBoothTransactions boothLoginId queryString registrationToken =
  let requestUrl = "/api/v1/booths/" <> boothLoginId <> "/transactions?" <> queryString 
      headers = [(RequestHeader "X-Reg-Token" registrationToken)]
      payload = A.fromObject (StrMap.fromFoldable []) in
  ExceptT $ attempt $ (post requestUrl headers payload)

managerSummary registrationToken =
  let requestUrl = "/api/v1/agency/agents"
      headers = [(RequestHeader "X-Reg-Token" registrationToken)] in
  ExceptT $ attempt (get requestUrl headers)
  
listBooths registrationToken =
  let requestUrl = "/api/v1/booths"
      headers = [(RequestHeader "X-Reg-Token" registrationToken)] in

  ExceptT $ attempt $ (get requestUrl headers)

listAgents registrationToken loginToken =
  let requestUrl = "/api/v1/agents"
      headers = [(RequestHeader "X-Reg-Token" registrationToken)
                ,(RequestHeader "X-Login-Token" loginToken)] in
  ExceptT $ attempt $ (get requestUrl headers)

getBoothDetail boothId registrationToken =
  let requestUrl = "/api/v1/agency/booth/" <> boothId
      headers = [(RequestHeader "X-Reg-Token" registrationToken)] in
  ExceptT $ attempt $ (get requestUrl headers)

findTxnByCustRef custRef registrationToken  =
  let requestUrl = "http://hpclpp-beta.ap-south-1.elasticbeanstalk.com/api/v1/transactions/query/" <> custRef
      headers = [(RequestHeader "X-Reg-Token" registrationToken)] in
  ExceptT $ attempt $ (get requestUrl headers)

getAgentTransactions queryString registrationToken =
  let requestUrl = "http://hpclpp-beta.ap-south-1.elasticbeanstalk.com/api/v1/transactions?"<> queryString 
      headers = [(RequestHeader "X-Reg-Token" registrationToken)]
      payload = A.fromObject (StrMap.fromFoldable []) in
  ExceptT $ attempt $ post requestUrl headers payload

createBooth fuelType nickName registrationToken loginToken  =
  let requestUrl = "/api/v1/booths"
      headers = [(RequestHeader "X-Reg-Token" registrationToken)
                ,(RequestHeader "X-Login-Token" loginToken)]
      payload = A.fromObject $ StrMap.fromFoldable [(Tuple "type" (A.fromString fuelType)),
                                                    (Tuple "nickName" (A.fromString nickName))] in

  ExceptT $ attempt $ post requestUrl headers payload

createCollectRequest amount vpa remarks registrationToken  =
  let requestUrl = "/api/v1/transactions"
      headers = [(RequestHeader "X-Reg-Token" registrationToken)]
      payload = A.fromObject $ StrMap.fromFoldable [(Tuple "amount" (A.fromNumber amount)),
                                                    (Tuple "remarks" (A.fromString remarks)),
                                                    (Tuple "payerVpa" (A.fromString vpa))] in
  ExceptT $ attempt $ post requestUrl headers payload
                                                    
createAgent agentName mobileNumber registrationToken loginToken =
  let requestUrl = "http://hpclpp-beta.ap-south-1.elasticbeanstalk.com/api/v1/agents"
      headers = [(RequestHeader "X-Reg-Token" registrationToken)
                ,(RequestHeader "X-Login-Token" loginToken)]
      payload = A.fromObject $ StrMap.fromFoldable [(Tuple "name" (A.fromString agentName)),
                                                    (Tuple "mobileNumber" (A.fromString mobileNumber))] in
  ExceptT $ attempt $ post requestUrl headers payload

editBooth boothId fuelType nickName registrationToken loginToken =
  let requestUrl = "http://hpclpp-beta.ap-south-1.elasticbeanstalk.com/api/v1/booths/" <> boothId
      headers = [(RequestHeader "X-Reg-Token" registrationToken)
                ,(RequestHeader "X-Login-Token" loginToken)]
      payload = A.fromObject $ StrMap.fromFoldable [(Tuple "type" (A.fromString fuelType)),
                                                    (Tuple "nickName" (A.fromString nickName))] in
  ExceptT $ attempt $ post requestUrl headers payload

showUI screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> showUI' success error updatedState false)

showUISync screen state = ExceptT $ pure <$>
  let updatedState = state {screen = screen} in
  makeAff (\error success -> showUI' success error updatedState true)

extractRegistrationTokenId resp = fromJust $ do
  responseObject <- A.toObject resp.response
  statusObject <- StrMap.lookup "registrationToken" responseObject
  statusObjectJson <- A.toObject statusObject
  status <- StrMap.lookup "id" statusObjectJson
  A.toString status

extractRegistrationToken resp = fromJust $ do
  responseObject <- A.toObject resp.response
  statusObject <- StrMap.lookup "registrationToken" responseObject
  statusObjectJson <- A.toObject statusObject
  status <- StrMap.lookup "token" statusObjectJson
  A.toString status
   
extractBoothLoginId resp = fromJust $ do
  responseObject <- A.toObject resp.response
  boothLogin <- StrMap.lookup "boothLogin" responseObject
  boothLoginJson <- A.toObject boothLogin
  id <- StrMap.lookup "id" boothLoginJson
  A.toString id

extractBoothId resp = fromJust $ do
  responseObject <- A.toObject resp.response
  booth <- StrMap.lookup "booth" responseObject
  boothJson <- A.toObject booth
  id <- StrMap.lookup "id" boothJson
  A.toString id
 
extractTokenStatus resp = fromJust $ do
  responseObject <- A.toObject resp.response
  statusObject <- StrMap.lookup "registrationToken" responseObject
  statusObjectJson <- A.toObject statusObject
  status <- StrMap.lookup "verified" statusObjectJson
  A.toBoolean status

extractSmsVerificationContent regData = fromJust $ do
  responseObject <- A.toObject regData.response
  tokOb <- StrMap.lookup "registrationToken" responseObject
  tokJson <- A.toObject tokOb
  smsOb <- StrMap.lookup "smsDetails" tokJson
  smsJson <- A.toObject smsOb
  content <- StrMap.lookup "content" smsJson
  A.toString content

extractSmsVerificationContent' regData = regData.response #! "registrationToken.smsDetails.content" >>= readString
  
extractLoginToken loginResp = fromJust $ do
  responseObject <- A.toObject loginResp.response
  tokOb <- StrMap.lookup "loginToken" responseObject
  tokJson <- A.toObject tokOb
  tokString <- StrMap.lookup "token" tokJson
  A.toString tokString

sendSms registrationData mobileNumber =
  let
    smsVerificationTok = extractSmsVerificationContent registrationData
    requestUri = "/sms/inbound?mobile=" <> mobileNumber <> "&msg=" <> smsVerificationTok in
  ExceptT $ attempt $ (get requestUri [])

getExceptT value = ExceptT $ pure $ Right value
